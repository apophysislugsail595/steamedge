const { LoginSession, EAuthTokenPlatformType, EAuthSessionGuardType } = require('steam-session');
const SteamUser = require('steam-user');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// All Steam authentication for the app. Runs in the MAIN process (renderer can't use node
// modules). Talks back to the renderer through `emit(event, data)` (main.js forwards over IPC).
//
// Key point: we authenticate as EAuthTokenPlatformType.SteamClient so the refresh token is
// valid for the Steam client / CM logon (headless idle). The old embedded web login produced a
// web-audience token that the CM rejects (InvalidPassword) - that path is intentionally gone.
class SteamAuth {
  constructor(configDir, emit) {
    this.configDir = configDir;
    this.emit = emit;
    this.session = null;
    this.result = null;          // { refreshToken, accountName, steamID, cookies }
    this._pendingMa = null;      // { user, response } while awaiting maFile SMS code
    // Ayarlanırsa (main.js "Add Account" akışını başlatırken), yeni hesap kaydedilen listeye
    // eklenir ama aktif oturum (session.json) değiştirilmez - kullanıcı halihazırda kullandığı
    // hesapta kalmaya devam eder, yeni hesabı istediğinde hesap değiştiriciden seçer.
    this.addingAccount = false;
  }

  // ---- login: QR ----
  async startQR() {
    try {
      this._newSession();
      const r = await this.session.startWithQR();
      const image = await QRCode.toDataURL(r.qrChallengeUrl, { margin: 2, width: 220 });
      this.emit('qr', { image });
    } catch (e) { this.emit('error', { message: e.message }); }
  }

  // ---- login: username + password ----
  async startCredentials(accountName, password) {
    try {
      this._newSession();
      const r = await this.session.startWithCredentials({ accountName, password });
      if (r.actionRequired) {
        const acts = r.validActions || [];
        const codeAct = acts.find(a =>
          a.type === EAuthSessionGuardType.DeviceCode || a.type === EAuthSessionGuardType.EmailCode);
        if (codeAct) {
          this.emit('guard', { needCode: true, email: codeAct.type === EAuthSessionGuardType.EmailCode });
        } else {
          this.emit('status', { message: 'Steam mobil uygulamasından girişi onaylayın...' });
        }
      }
      // otherwise the 'authenticated' event fires on its own
    } catch (e) { this.emit('error', { message: e.message }); }
  }

  async submitGuard(code) {
    try { await this.session.submitSteamGuardCode(code); }
    catch (e) { this.emit('error', { message: 'Kod reddedildi: ' + e.message }); }
  }

  cancel() { if (this.session) { try { this.session.cancelLoginAttempt(); } catch (_) {} this.session = null; } }

  _newSession() {
    this.cancel();
    this.session = new LoginSession(EAuthTokenPlatformType.SteamClient);
    this.session.on('authenticated', () => this._onAuth());
    this.session.on('timeout', () => this.emit('error', { message: 'Oturum zaman aşımına uğradı, tekrar deneyin.' }));
    this.session.on('error', (e) => this.emit('error', { message: e.message }));
    this.session.on('remoteInteraction', () => this.emit('status', { message: 'QR tarandı - telefonda onay bekleniyor...' }));
  }

  async _onAuth() {
    const steamID = this.session.steamID ? this.session.steamID.getSteamID64() : null;
    let cookies = [];
    try { cookies = await this.session.getWebCookies(); } catch (_) {}
    this.result = {
      refreshToken: this.session.refreshToken,
      accountName: this.session.accountName,
      steamID,
      cookies,
    };
    this._saveSession();
    const hasMa = this._maFilePath() && fs.existsSync(this._maFilePath());
    this.emit('authenticated', {
      accountName: this.result.accountName, steamID, hasCookies: cookies.length > 0, hasMaFile: hasMa,
    });
  }

  // ---- cookie login (web-only fallback: no headless idle, no maFile) ----
  loginCookie(sessionid, steamLoginSecure, steamparental) {
    try {
      fs.mkdirSync(this.configDir, { recursive: true });
      fs.writeFileSync(path.join(this.configDir, 'web-session.json'),
        JSON.stringify({ sessionid, steamLoginSecure, steamparental: steamparental || '' }, null, 2));
      this.emit('authenticated', { webOnly: true });
    } catch (e) { this.emit('error', { message: e.message }); }
  }

  // ---- maFile: generate (adds a mobile authenticator; needs phone + no existing authenticator) ----
  generateMaFile() {
    if (!this.result || !this.result.refreshToken) { this.emit('mafile', { ok: false, message: 'Önce Steam ile giriş yapın (cookie yolu maFile üretemez).' }); return; }
    const user = new SteamUser();
    user.logOn({ refreshToken: this.result.refreshToken });
    user.once('loggedOn', () => {
      user.enableTwoFactor((err, response) => {
        if (err) {
          this.emit('mafile', { ok: false, message: 'maFile üretilemedi: ' + err.message + ' - hesapta zaten authenticator olabilir ya da telefon numarası yok. Mevcut maFile\'ı içe aktarın.' });
          try { user.logOff(); } catch (_) {}
          return;
        }
        this._pendingMa = { user, response };
        this.emit('mafileGuard', { revocationCode: response.revocation_code });
      });
    });
    user.once('error', (e) => this.emit('mafile', { ok: false, message: 'Bağlanılamadı: ' + e.message }));
  }

  finalizeMaFile(activationCode) {
    const pend = this._pendingMa;
    if (!pend) { this.emit('mafile', { ok: false, message: 'Bekleyen maFile işlemi yok.' }); return; }
    pend.user.finalizeTwoFactor(pend.response.shared_secret, activationCode, (err) => {
      if (err) { this.emit('mafile', { ok: false, message: 'Aktivasyon kodu reddedildi: ' + err.message }); return; }
      const ma = Object.assign({ account_name: this.result.accountName, steamid: this.result.steamID }, pend.response);
      this._writeMaFile(ma);
      this._pendingMa = null;
      try { pend.user.logOff(); } catch (_) {}
      this.emit('mafile', { ok: true, file: this._maFilePath() });
    });
  }

  importMaFile(jsonText) {
    try {
      const ma = JSON.parse(jsonText);
      if (!ma.shared_secret || !ma.identity_secret) throw new Error('shared_secret / identity_secret eksik');
      this._writeMaFile(ma);
      this.emit('mafile', { ok: true, file: this._maFilePath(ma.steamid), imported: true });
    } catch (e) { this.emit('mafile', { ok: false, message: 'Geçersiz maFile: ' + e.message }); }
  }

  // ---- config helpers ----
  // Hesabı accounts.json listesine ekler/günceller (steamID ile eşleşir - yeniden giriş yenilenmiş
  // refreshToken'ı üzerine yazar). addingAccount açıkken aktif oturuma (session.json) dokunmaz;
  // kapalıyken (normal giriş) bu hesabı aynı zamanda aktif hesap yapar.
  _saveSession() {
    fs.mkdirSync(this.configDir, { recursive: true });
    const entry = { accountName: this.result.accountName, steamID: this.result.steamID, refreshToken: this.result.refreshToken };
    const accountsPath = path.join(this.configDir, 'accounts.json');
    let list = [];
    try { list = JSON.parse(fs.readFileSync(accountsPath, 'utf8')); if (!Array.isArray(list)) list = []; } catch (_) { list = []; }
    const idx = list.findIndex((a) => a.steamID === entry.steamID);
    if (idx >= 0) list[idx] = { ...list[idx], ...entry };
    else list.push({ ...entry, addedAt: Date.now() });
    fs.writeFileSync(accountsPath, JSON.stringify(list, null, 2));
    if (!this.addingAccount) {
      fs.writeFileSync(path.join(this.configDir, 'session.json'), JSON.stringify(entry, null, 2));
    }
  }

  _maFilePath(steamID) {
    const id = steamID || (this.result && (this.result.steamID || this.result.accountName));
    return id ? path.join(this.configDir, id + '.maFile') : null;
  }

  _writeMaFile(ma) {
    fs.mkdirSync(this.configDir, { recursive: true });
    fs.writeFileSync(this._maFilePath(ma.steamid) || path.join(this.configDir, 'account.maFile'), JSON.stringify(ma, null, 2));
  }
}

module.exports = SteamAuth;
