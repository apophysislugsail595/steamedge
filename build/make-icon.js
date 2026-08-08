/**
 * icon.png -> icon.ico donusturur (Windows exe ikonu icin).
 *
 * Neden elle: sadece bunun icin bir goruntu kutuphanesi eklemek istemedik. Electron'un
 * kendi nativeImage'i yeniden olceklendirmeyi yapiyor, ICO kabugu ise basit bir kapsayici:
 *   ICONDIR (6 bayt) + her boyut icin ICONDIRENTRY (16 bayt) + ham PNG verileri.
 * Vista ve sonrasi ICO icinde PNG kabul ediyor, ayrica BMP'ye cevirmeye gerek yok.
 *
 * Calistirma:  npx electron build/make-icon.js
 */
const { app, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');

const KAYNAK = path.join(__dirname, '..', 'src', 'assets', 'icon.png');
const HEDEF = path.join(__dirname, '..', 'src', 'assets', 'icon.ico');
const BOYUTLAR = [16, 24, 32, 48, 64, 128, 256];

app.whenReady().then(() => {
  const kaynak = nativeImage.createFromPath(KAYNAK);
  if (kaynak.isEmpty()) { console.error('icon.png okunamadi:', KAYNAK); app.exit(1); return; }

  const pngler = BOYUTLAR.map((n) => ({
    n,
    veri: kaynak.resize({ width: n, height: n, quality: 'best' }).toPNG(),
  }));

  const baslik = Buffer.alloc(6);
  baslik.writeUInt16LE(0, 0);              // ayrilmis
  baslik.writeUInt16LE(1, 2);              // tur: 1 = ikon
  baslik.writeUInt16LE(pngler.length, 4);  // goruntu sayisi

  const girdiler = Buffer.alloc(16 * pngler.length);
  let offset = baslik.length + girdiler.length;
  pngler.forEach((p, i) => {
    const o = i * 16;
    girdiler.writeUInt8(p.n >= 256 ? 0 : p.n, o + 0);   // 0 = 256 piksel demek
    girdiler.writeUInt8(p.n >= 256 ? 0 : p.n, o + 1);
    girdiler.writeUInt8(0, o + 2);                      // palet yok
    girdiler.writeUInt8(0, o + 3);                      // ayrilmis
    girdiler.writeUInt16LE(1, o + 4);                   // duzlem
    girdiler.writeUInt16LE(32, o + 6);                  // bit derinligi
    girdiler.writeUInt32LE(p.veri.length, o + 8);
    girdiler.writeUInt32LE(offset, o + 12);
    offset += p.veri.length;
  });

  fs.writeFileSync(HEDEF, Buffer.concat([baslik, girdiler, ...pngler.map((p) => p.veri)]));
  console.log('yazildi:', HEDEF, '(' + BOYUTLAR.join(', ') + ' px, ' +
              (fs.statSync(HEDEF).size / 1024).toFixed(1) + ' KB)');
  app.exit(0);
});
