    // ================= GENEL BAKIŞ =================
    // Panellerdeki tüm sayılar gerçek Steam verisinden ve motorun kendi
    // ölçümlerinden geliyor; örnek/sabit veri yok.
    const sessionStartTs = Date.now();
    let genelLoaded = false;

    // Palet kısayolları
    const GC = { ok:'#5FB324', warn:'#B37E24', bad:'#B32453', sub:'#C2AAEE', bdActive:'#5624B3', muted:'#8B8F9E' };
    // "Durum" sütununun sözlüğü: Başarılı / Çalışıyor / Uyarı / Durdu
    const FEED_STATUS = {
      'Başarılı':  { color: GC.ok,  bd: GC.ok },
      'Çalışıyor': { color: GC.sub, bd: GC.bdActive },
      'Uyarı':     { color: GC.warn, bd: GC.warn },
      'Durdu':     { color: GC.bad, bd: GC.bad },
      'Hata':      { color: GC.bad, bd: GC.bad },
      'Mesaj':     { color: GC.blue || '#24AEB3', bd: GC.blue || '#24AEB3' },
    };
    const DEFAULT_STATUS_BY_KIND = { hata:'Hata', uyari:'Uyarı' };

    const activityFeed = [];   // {kind, title, text, status, ts} - gerçek uygulama olayları
    function pushFeed(kind, title, text, status){
      const st = status || DEFAULT_STATUS_BY_KIND[kind] || 'Başarılı';
      activityFeed.unshift({ kind: kind||'saat', title, text, status: st, ts: Date.now() });
      if (activityFeed.length > 30) activityFeed.length = 30;
      renderFeed();
    }
    // Aktivite satırı (grid 3 sütun, 60px, nokta kutusu + durum rozeti)
    function renderFeed(){
      const el = document.getElementById('gFeed');
      if (!el) return;
      if (typeof updateNotifBadge === 'function') updateNotifBadge(activityFeed.length);
      if (!activityFeed.length){
        el.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:48px 18px;text-align:center">'
          + '<span style="font-size:13px;color:#656D80">Henüz bir işlem yapılmadı.</span>'
          + '<span style="font-size:11px;color:#656D80">Kart düşürme, satış ve başarım işlemleri burada listelenir.</span></div>';
        return;
      }
      el.innerHTML = activityFeed.map(f=>{
        const s = FEED_STATUS[f.status] || FEED_STATUS['Başarılı'];
        const t = new Date(f.ts).toLocaleTimeString('tr-TR');
        return '<div class="h-row" style="display:grid;grid-template-columns:minmax(240px,1fr) 130px 100px;gap:0;padding:0 18px;height:60px;align-items:center;border-bottom:1px solid #101621">'
          + '<div style="display:flex;align-items:center;gap:12px;min-width:0">'
            + '<div style="width:30px;height:30px;flex-shrink:0;border-radius:12px;border:1px solid '+s.bd+';background:#101621;display:flex;align-items:center;justify-content:center">'
              + '<span style="width:8px;height:8px;border-radius:12px;background:'+s.color+'"></span>'
            + '</div>'
            + '<div style="display:flex;flex-direction:column;gap:3px;min-width:0">'
              + '<span style="font-size:13px;font-weight:600;color:#DCE2FA;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(f.title)+'</span>'
              + '<span style="font-size:11px;color:#8B8F9E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(f.text)+'</span>'
            + '</div>'
          + '</div>'
          + '<div><span style="display:inline-flex;align-items:center;height:22px;padding:0 10px;border-radius:12px;border:1px solid '+s.bd+';color:'+s.color+';font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase">'+esc(f.status)+'</span></div>'
          + '<span style="font-family:Geist Mono,monospace;font-size:12px;color:#8B8F9E;text-align:right">'+t+'</span>'
          + '</div>';
      }).join('');
    }
    document.getElementById('gClearFeed').onclick = ()=>{ activityFeed.length=0; renderFeed(); };

    function fmtSessionDur(ms){
      const s = Math.floor(ms/1000);
      const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60;
      return h>0 ? (String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0')) : (String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0'));
    }
    // Sayaçlarda iki nokta üst üste vurgu rengiyle yazılır: 04<span #C2AAEE>:</span>12
    function monoTime(str){ return String(str).replace(/:/g, '<span style="color:#C2AAEE">:</span>'); }

    document.getElementById('gStatSessionSub').textContent = 'Başlangıç: ' + new Date(sessionStartTs).toLocaleTimeString('tr-TR');
    setInterval(()=>{
      if (typeof uiTickAllowed === 'function' && !uiTickAllowed()) return;
      const el=document.getElementById('gStatSession');
      if(el) el.innerHTML = monoTime(fmtSessionDur(Date.now()-sessionStartTs));
    }, 1000);

    function renderGenelStats(){
      const c = document.getElementById('gStatCards'); if (!c) return;
      const set = (id, v, html) => { const e=document.getElementById(id); if(e){ if(html) e.innerHTML=v; else e.textContent=v; } };

      // Toplam Kart
      const totalCards = dropGames.reduce((s,g)=>s+g.remaining,0);
      c.textContent = kartLoaded ? totalCards.toLocaleString('tr-TR') : '-';
      set('gStatCardsSub', kartLoaded ? (dropGames.length+' oyunda kart var') : 'Kart Düşür sekmesinde yenile');

      // Kütüphane
      set('gStatGames', (saatLoaded && ownedGames.length) ? ownedGames.length.toLocaleString('tr-TR') : '-');
      set('gStatGamesSub', kartLoaded ? (dropGames.length+' oyun toplamaya hazır') : '-');

      // Envanter & Pazar - değer + Steam kesintisi sonrası net
      if (invMerged){
        let value=0, units=0;
        invMerged.forEach(i=>{ units+=i.count; if(i.marketable && i.marketHashName){ const v=priceVal(i); if(v!=null) value += v*i.count; } });
        set('gStatValue', fmtTL(value));
        set('gStatValueSub', units.toLocaleString('tr-TR')+' öğe · net '+fmtTL(value*0.87));
      }

      // Saat Yükseltici
      const bOn = boostState && boostState.running;
      const bIds = bOn ? (boostState.activeAppids || boostState.appids || []) : [];
      set('gStatBoost', bIds.length + ' aktif');
      if (bOn && boostState.durationMs){
        const left = Math.max(0, boostState.durationMs - (Date.now()-(boostState.startedAt||Date.now())));
        set('gStatBoostSub', 'Kalan ' + fmtSessionDur(left));
      } else set('gStatBoostSub', bOn ? 'Süresiz çalışıyor' : 'Çalışmıyor');

      // Başarımlar - sadece Başarımlar sekmesinde bir oyun seçiliyse gerçek veri var
      if (typeof acData !== 'undefined' && acData && acData.total){
        const pct = Math.round(acData.unlocked/acData.total*100);
        set('gStatAch', acData.unlocked+' / '+acData.total);
        set('gStatAchSub', '%'+pct+' tamamlandı · '+(acData.gameName||''));
      }
    }

    async function loadGenel(){
      if (!genelLoaded){
        genelLoaded = true;
        // Veri çekme başarısız olsa da (Steam'e bağlanılamadı, IPC hatası) panel yine de
        // çizilmeli - aksi halde await burada patlayıp aşağıdaki render'lar hiç çalışmıyor
        // ve Genel Bakış bomboş kalıyordu.
        try {
          const con = await E.connect();
          if (con && con.ok){
            if (window.imu.settings){
              const s = await window.imu.settings.get();
              if (s) appSettings = { ...appSettings, ...s };
            }
            loadProfile();
            if (!kartLoaded){ const r = await E.dropGames(); if (r.ok){ dropGames = r.games; kartLoaded = true; } }
            if (!saatLoaded){ const r2 = await E.ownedGames(); if (r2.ok){ ownedGames = r2.games; saatLoaded = true; } }
          } else if (con && con.error){
            pushFeed('hata', 'Bağlantı', con.error, 'Hata');
          }
        } catch (e) {
          pushFeed('hata', 'Bağlantı', (e && e.message) || 'Steam bağlantısı kurulamadı.', 'Hata');
        }
      }
      renderGenelStats();
      renderGenelActive();
      renderFeed();
      renderLifeStats();
    }

    // Steam bize tek tek "kart düştü" olayı vermiyor; oturum boyunca kalan-kart toplamını periyodik
    // ölçüp baştaki değerle farkını alarak dürüst bir "düşen kart" sayısı hesaplıyoruz (uydurma değil).
    let farmBaselineCards = null, farmDroppedCount = 0, farmSessionStart = null, farmPollTimer = null, farmLifeDropped = 0;
    let prevRemain = new Map();   // appid -> kalan kart (oyun bazında düşüş farkı için)
    function farmSessionBegin(){
      farmBaselineCards = dropGames.reduce((s,g)=>s+g.remaining,0);
      farmDroppedCount = 0; farmSessionStart = Date.now(); farmLifeDropped = 0;
      prevRemain = new Map(dropGames.map(g=>[g.appid, g.remaining]));
      window.imu.stats.add({ sessions: 1 });
      if (farmPollTimer) clearInterval(farmPollTimer);
      farmPollTimer = setInterval(async ()=>{
        if (!lastTick || !lastTick.running) return;
        const r = await E.dropGames().catch(()=>null);
        let cardDelta = 0;
        if (r && r.ok){
          // Hangi oyunda kaç kart düştüğünü kalan-kart farkından çıkar (Steam tek tek olay vermiyor).
          r.games.forEach(g=>{
            const before = prevRemain.get(g.appid);
            if (before != null && g.remaining < before){
              const n = before - g.remaining;
              if (typeof pushDrop === 'function') pushDrop(g.appid, g.name, n);
              if (appSettings && appSettings.notifyCardDrop) notify('farm', n+' kart düştü', g.name);
            }
          });
          dropGames = r.games;
          prevRemain = new Map(dropGames.map(g=>[g.appid, g.remaining]));
          const now = dropGames.reduce((s,g)=>s+g.remaining,0);
          farmDroppedCount = Math.max(0, farmBaselineCards - now);
          cardDelta = Math.max(0, farmDroppedCount - farmLifeDropped);
          farmLifeDropped = farmDroppedCount;
          if (cardDelta > 0) pushFeed('kart', cardDelta+' kart düştü', 'Toplam '+farmDroppedCount+' kart · bu oturum', 'Başarılı');
          if (kartLoaded && typeof renderKart === 'function') renderKart();
          renderGenelStats(); renderGenelActive();
          // "Otomatik Pazarda Satış": kart düştüyse o oyunun yeni kartlarını listele
          if (cardDelta > 0 && appSettings && appSettings.farmAutoSell && typeof autoSellDropped === 'function'){
            const cur = dropGames.find(g=>g.appid === lastTick.currentAppid);
            autoSellDropped(cur && cur.name);
          }
        }
        // "Başarım Kilitlerini Aç": farm sürerken oynanan oyunun kilitli başarımlarını
        // aralıklı olarak açar (Ayarlar > Başarımlar'daki güvenli mod aralığına uyar).
        if (appSettings && appSettings.farmAchUnlock) await farmUnlockOne();
        // kalıcı: her poll'de geçen 60sn + o aralıkta düşen kart farkı
        addLifeStats({ totalRuntimeMs: 60000, cardsDropped: cardDelta });
      }, 60000);
    }
    function farmSessionEnd(){ if (farmPollTimer){ clearInterval(farmPollTimer); farmPollTimer = null; } }

    // "Başarım Kilitlerini Aç" - oynanan oyunun kilitli başarımlarından BİRİNİ açar.
    // Aralık, Ayarlar > Başarımlar > "Açılış aralığı"ndan gelir; güvenli mod kapalıysa bile
    // burada tek tek ve aralıklı gidilir (toplu açmak profilde şüpheli görünür).
    let lastAchUnlockTs = 0;
    async function farmUnlockOne(){
      const appid = lastTick && lastTick.currentAppid;
      if (!appid) return;
      const gapMs = Math.max(5, +((appSettings||{}).achDelay) || 5) * 1000;
      if (Date.now() - lastAchUnlockTs < gapMs) return;
      const res = await E.achievements(appid).catch(()=>null);
      if (!res || !res.ok || !res.data) return;
      const locked = res.data.achievements.filter(a=>!a.achieved);
      if (!locked.length) return;
      // "Açılışları zamana yay" açıksa rastgele biri, değilse ilki
      const pick = (appSettings && appSettings.achSpread)
        ? locked[Math.floor(Math.random()*locked.length)] : locked[0];
      const r = await E.setAchievements(appid, [{ apiName: pick.apiName, unlock: true }]).catch(()=>null);
      if (r && r.ok){
        lastAchUnlockTs = Date.now();
        if (typeof acCache !== 'undefined') acCache.delete(appid);
        notify('ach', 'Başarım açıldı', pick.name);
        pushFeed('kart', 'Başarım açıldı', pick.name, 'Başarılı');
      }
    }

    // "Aktif Görev" paneli.
    // Oyun kapsülünün yanında iki tür etiketi ("Aksiyon", "Çok Oyunculu") gösterilir; Steam'in
    // GetOwnedGames yanıtı tür bilgisi vermediği için oraya uydurma tür değil, gerçek çalışma
    // bilgisi (mod + eşzamanlı oyun sayısı) yazılıyor.
    function chip(text){
      return '<span style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#8B8F9E;border:1px solid #1D2432;border-radius:12px;padding:3px 8px">'+esc(text)+'</span>';
    }
    function statCol(label, value, color){
      return '<div style="display:flex;flex-direction:column;gap:5px">'
        + '<span style="font-size:9px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8B8F9E;white-space:nowrap">'+esc(label)+'</span>'
        + '<span style="font-family:Geist Mono,monospace;font-size:13px;font-weight:700;line-height:1;color:'+(color||'#DCE2FA')+'">'+value+'</span>'
        + '</div>';
    }

    function setRunPill(running){
      const pill = document.getElementById('gRunPill');
      if (!pill) return;
      const c = running ? GC.ok : GC.warn;
      pill.style.background = '#101621';
      pill.style.borderColor = c;
      pill.innerHTML = '<span style="width:6px;height:6px;border-radius:12px;background:'+c+';animation:e-dotPulse 1.6s ease-in-out infinite"></span>'
        + '<span style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+c+'">'+(running?'Çalışıyor':'Hazır')+'</span>';
      if (typeof setSysStatus === 'function') setSysStatus(running);
    }

    function renderGenelActive(){
      const box = document.getElementById('gActiveBody');
      const qbox = document.getElementById('gQueue');
      if (!box || !qbox) return;
      const farmOn = lastTick && lastTick.running;
      const boostOn = boostState && boostState.running;
      setRunPill(farmOn || boostOn);

      if (!farmOn && !boostOn){
        box.innerHTML = '<div style="display:flex;flex-direction:column;gap:4px;padding:6px 0">'
          + '<span style="font-size:13px;font-weight:600;color:#DCE2FA">Şu anda çalışan bir işlem yok</span>'
          + '<span style="font-size:11px;color:#8B8F9E">Aşağıdaki Başlat ile kart düşürmeyi başlatabilirsin.</span></div>';
        renderQueue(null);
        return;
      }

      if (farmOn){
        const activeIds = lastTick.activeAppids || [];
        const heroId = lastTick.currentAppid || activeIds[0] || 0;
        const cur = dropGames.find(g=>g.appid===heroId);
        const turnPct = lastTick.durationMs ? Math.min(100, Math.round((lastTick.elapsedMs/lastTick.durationMs)*100)) : 100;
        const nextDrop = lastTick.durationMs ? fmtSessionDur(Math.max(0, lastTick.durationMs - (lastTick.elapsedMs||0))) : '-';
        const sessionDur = fmtSessionDur(Date.now() - (farmSessionStart||Date.now()));
        box.innerHTML = '<div style="display:flex;align-items:flex-start;gap:12px">'
          + '<div style="width:85px;height:40px;flex-shrink:0;border-radius:10px;border:1px solid #2B3345;background:#101621;overflow:hidden;display:flex;align-items:center;justify-content:center">'
            + (heroId?gameThumb(heroId):'')
          + '</div>'
          + '<div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex:1">'
            + '<span style="font-size:14px;font-weight:700;color:#DCE2FA;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(cur?esc(cur.name):'Kart Düşürme')+'</span>'
            + '<span style="font-family:Geist Mono,monospace;font-size:10px;color:#8B8F9E">APP_ID: '+(heroId||'-')+'</span>'
            + '<div style="display:flex;gap:6px;margin-top:2px">'+chip(modeLabels[selectedMode]||selectedMode)+chip(activeIds.length+' oyun eşzamanlı')+'</div>'
          + '</div>'
          + '<div style="display:flex;align-items:center;gap:18px;flex-shrink:0">'
            + statCol('Kalan Kart', (cur?cur.remaining:0), GC.sub)
            + statCol('Oturum Süresi', monoTime(sessionDur))
            + statCol('Sonraki Düşüş', monoTime(nextDrop))
          + '</div></div>'
          + '<div style="height:6px;border-radius:12px;background:#090C12;border:1px solid #1D2432;overflow:hidden;flex-shrink:0">'
            + '<div style="height:100%;width:'+turnPct+'%;border-radius:12px;background:#24AEB3"></div></div>';
        renderQueue(heroId);
        return;
      }

      // sadece boost çalışıyorsa
      const ids = boostState.activeAppids || boostState.appids || [];
      const heroId = ids[0] || 0;
      const g = ownedGames.find(x=>x.appid===heroId);
      const elapsed = fmtSessionDur(Date.now()-(boostState.startedAt||Date.now()));
      const left = boostState.durationMs ? fmtSessionDur(Math.max(0, boostState.durationMs-(Date.now()-(boostState.startedAt||Date.now())))) : '-';
      const bPct = boostState.durationMs ? Math.min(100, Math.round((Date.now()-(boostState.startedAt||Date.now()))/boostState.durationMs*100)) : 100;
      box.innerHTML = '<div style="display:flex;align-items:flex-start;gap:12px">'
        + '<div style="width:85px;height:40px;flex-shrink:0;border-radius:10px;border:1px solid #2B3345;background:#101621;overflow:hidden;display:flex;align-items:center;justify-content:center">'
          + (heroId?gameThumb(heroId):'')
        + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex:1">'
          + '<span style="font-size:14px;font-weight:700;color:#DCE2FA;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+(g?esc(g.name):'Saat Yükseltici')+'</span>'
          + '<span style="font-family:Geist Mono,monospace;font-size:10px;color:#8B8F9E">APP_ID: '+(heroId||'-')+'</span>'
          + '<div style="display:flex;gap:6px;margin-top:2px">'+chip('Saat Yükseltici')+chip(ids.length+' oyun eşzamanlı')+'</div>'
        + '</div>'
        + '<div style="display:flex;align-items:center;gap:18px;flex-shrink:0">'
          + statCol('Aktif Oyun', ids.length, GC.sub)
          + statCol('Oturum Süresi', monoTime(elapsed))
          + statCol('Kalan', monoTime(left))
        + '</div></div>'
        + '<div style="height:6px;border-radius:12px;background:#090C12;border:1px solid #1D2432;overflow:hidden;flex-shrink:0">'
          + '<div style="height:100%;width:'+bPct+'%;border-radius:12px;background:#24AEB3"></div></div>';
      renderQueue(null);
    }

    // Kuyruk listesi (#sıra · ad · kalan · yüzde)
    function renderQueue(currentId){
      const qbox = document.getElementById('gQueue');
      if (!qbox) return;
      if (!dropGames.length){
        qbox.innerHTML = '<div style="padding:12px 0;font-size:11px;color:#656D80">Kuyruk boş - Kart Düşür sekmesinde listeyi yenile.</div>';
        return;
      }
      const list = (typeof orderedForMode === 'function' ? orderedForMode() : dropGames).slice(0, 12);
      const maxRem = list.reduce((m,g)=>Math.max(m,g.remaining),0) || 1;
      qbox.innerHTML = list.map((g,i)=>{
        const on = g.appid === currentId;
        const pct = Math.round((1 - g.remaining/maxRem) * 100);
        return '<div style="display:flex;align-items:center;gap:11px;padding:9px 0;border-bottom:1px solid #101621">'
          + '<span style="font-family:Geist Mono,monospace;font-size:11px;font-weight:700;color:'+(on?GC.sub:GC.muted)+';width:22px;flex-shrink:0">#'+(i+1)+'</span>'
          + '<span style="font-size:12px;font-weight:600;color:#DCE2FA;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1">'+esc(g.name)+'</span>'
          + '<span style="font-family:Geist Mono,monospace;font-size:11px;color:#8B8F9E;flex-shrink:0">'+g.remaining+' kart</span>'
          + '<span style="font-family:Geist Mono,monospace;font-size:11px;font-weight:700;color:'+(on?GC.ok:GC.muted)+';width:38px;text-align:right;flex-shrink:0">'+(on?'%'+pct:'-')+'</span>'
          + '</div>';
      }).join('');
    }

    E.onTick((data)=>{ if (data.running && farmBaselineCards===null) farmSessionBegin(); if (!data.running) farmSessionEnd(); renderGenelActive(); renderGenelStats(); });
    E.onBoostTick(()=>{ renderGenelActive(); renderGenelStats(); });
    E.onSaatFarmTick(()=>{ renderGenelActive(); renderGenelStats(); });

    // Hızlı işlem toast'ı - tıklandığı an geri bildirim versin, sonucu bekletmesin.
    function toast(text){
      const box = document.getElementById('toastBox');
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML = '<span class="tspin"></span><span class="tt">'+esc(text)+'</span>';
      box.appendChild(el);
      requestAnimationFrame(()=>el.classList.add('show'));
      return {
        done(text2){
          el.innerHTML = '<span class="tick">✓</span><span class="tt">'+esc(text2)+'</span>';
          el.classList.remove('err'); el.classList.add('ok');
          setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),200); }, 2200);
        },
        fail(text2){
          el.innerHTML = '<span class="terr">✕</span><span class="tt">'+esc(text2)+'</span>';
          el.classList.add('err');
          setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),200); }, 2800);
        },
      };
    }

    async function refreshGamesQuick(){
      const t = toast('Oyun listesi yenileniyor…');
      kartLoaded = false; saatLoaded = false;
      const con = await E.connect();
      if (con.ok){
        const r = await E.dropGames(); if (r.ok){ dropGames = r.games; kartLoaded = true; }
        const r2 = await E.ownedGames(); if (r2.ok){ ownedGames = r2.games; saatLoaded = true; }
      }
      renderGenelStats(); renderGenelActive();
      if (con.ok){ pushFeed('kart', 'Oyun Listesi', 'Kütüphane ve kart listesi yenilendi.', 'Başarılı'); t.done('Oyun listesi yenilendi.'); }
      else { pushFeed('hata', 'Oyun Listesi', 'Bağlantı hatası: '+con.error, 'Hata'); t.fail('Bağlantı hatası: '+con.error); }
    }

    const goTab = (tab) => document.querySelector('.nav a[data-tab='+tab+']').click();

    document.getElementById('gRefresh').onclick = refreshGamesQuick;
    document.getElementById('gOpenQueue').onclick = ()=> goTab('kart');
    document.getElementById('gDetail').onclick = ()=> goTab('kart');
    document.getElementById('gNavHub').onclick = ()=> goTab('env');
    document.getElementById('gNavBoost').onclick = ()=> goTab('saat');
    document.getElementById('gNavAch').onclick = ()=> goTab('basarim');

    // Başlat/Durdur - Kart Düşür'ün gerçek motoruna, oradaki seçili mod ve süreyle bağlanır.
    document.getElementById('gStart').onclick = ()=>{
      if (!dropGames.length){ toast('Önce oyun listesini yenile.').fail('Düşürülecek kart bulunamadı.'); return; }
      const games = orderedForMode().map(g=>({appid:g.appid,name:g.name,remaining:g.remaining}));
      E.startFarm(selectedMode, games, durationSec*1000);
      if (typeof setKartPill === 'function') setKartPill(true, 'Çalışıyor');
      notify('farm', 'Kart Düşürme Başladı', games.length+' oyun sırada.');
      pushFeed('kart', 'Kart Düşürme', games.length+' oyun ile başladı.', 'Çalışıyor');
    };
    document.getElementById('gStop').onclick = ()=>{
      E.stopFarm();
      if (typeof setKartPill === 'function') setKartPill(false, 'Durduruldu');
      notify('farm', 'Kart Düşürme Durdu', '');
      pushFeed('kart', 'Kart Düşürme', 'Durduruldu.', 'Durdu');
    };

    document.getElementById('qaGames').onclick = refreshGamesQuick;
    document.getElementById('qaInv').onclick = async ()=>{
      const t = toast('Envanter yenileniyor…');
      envLoaded=false;
      await loadEnv();
      renderGenelStats();
      pushFeed('envanter', 'Envanter', 'Envanter Steam\'den yeniden çekildi.', 'Başarılı');
      t.done('Envanter yenilendi.');
    };
    // "Pazarı Yenile" - envanteri değil, market FİYATLARINI tazeler (fiyat önbelleğini atlar).
    document.getElementById('qaPazar').onclick = async ()=>{
      if (!invMerged){ toast('Önce envanteri yükle.').fail('Envanter henüz yüklenmedi.'); return; }
      const t = toast('Pazar fiyatları yenileniyor…');
      await window.imu.settings.clearPriceCache();
      priceMap.clear();
      await requestPrices();
      renderGenelStats();
      pushFeed('pazar', 'Pazar', 'Market fiyatları yeniden çekiliyor.', 'Çalışıyor');
      t.done('Pazar fiyatları yenileniyor.');
    };
    document.getElementById('qaSettings').onclick = ()=> openAyarlar();

    // Genel Bakış açılışta zaten görünür sekme - tıklama olmadan ilk verileri yükle.
    loadGenel();
