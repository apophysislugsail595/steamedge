    // ================= SAAT YÜKSELTİCİ =================
    // Eş zamanlı = tümü birlikte (belirlenen sürede durur).
    // "Sıralı bekletme modu" açıkken FarmController 'sequential' ile oyunlar sırayla döner.
    let ownedGames = [], saatLoaded = false;
    let selectedSaat = [];
    let saatDurSec = 3600;
    let maxConcurrent = 32, concurrentCustom = false;
    let boostState = { running: false, appids: [], startedAt: 0, durationMs: 0 };
    let boostTimerUI = null;
    // Davranış/Gizlilik anahtarları - ayarlara kalıcı yazılır (Ayarlar ekranıyla aynı anahtarlar)
    let boostFlags = { boostAutoRestart:false, seqIdle:false, ignoreUpdates:false, loopQueue:true, offlineMode:false, hideGameName:false };

    const BC = { brand:'#5624B3', ok:'#5FB324', teal:'#24AEB3', title:'#DCE2FA', muted:'#8B8F9E',
                 off:'#656D80', bd:'#2B3345', s1:'#0D1118', bgAlt:'#090C12', sub:'#C2AAEE' };
    const BSEG_ON  = { background:BC.brand, borderColor:BC.brand, color:BC.title };
    const BSEG_OFF = { background:'transparent', borderColor:'transparent', color:BC.muted };

    function fmtHMS(sec){ const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=Math.max(0,sec%60); return [h,m,s].map(n=>String(n).padStart(2,'0')).join(':'); }
    function monoHMS(sec){ return fmtHMS(sec).replace(/:/g, '<span style="color:#C2AAEE">:</span>'); }
    const hrsOf = (g) => ((g.playtimeForever||0)/60).toFixed(1);

    async function loadSaat(){
      await applyBoostFlags();
      if (saatLoaded){ renderSaatList(); renderActiveBox(); return; }
      const body = document.getElementById('saatListBody');
      body.innerHTML = '<div style="color:#8B8F9E;padding:14px;font-size:12px">Steam\'e bağlanılıyor...</div>';
      const con = await E.connect().catch(e=>({ ok:false, error:(e&&e.message)||'bağlantı hatası' }));
      if (!con.ok){ body.innerHTML = '<div style="color:#B32453;padding:14px;font-size:12px">'+esc(con.error)+'</div>'; return; }
      const res = await E.ownedGames().catch(e=>({ ok:false, error:(e&&e.message)||'kütüphane hatası' }));
      if (!res.ok){ body.innerHTML = '<div style="color:#B32453;padding:14px;font-size:12px">'+esc(res.error)+'</div>'; return; }
      ownedGames = res.games; saatLoaded = true;
      restoreBoostList();
      renderSaatList(); renderSaatSelected();
    }
    document.getElementById('saatSearch').addEventListener('input', renderSaatList);

    // "Oyun listesini hatırla" ayarı açıksa seçim kalıcı
    function persistBoostList(){
      if (appSettings && appSettings.rememberBoostList){
        window.imu.settings.set({ boostGameIds: selectedSaat.map(g=>g.appid) }).catch(()=>{});
      }
    }
    function restoreBoostList(){
      if (!appSettings || !appSettings.rememberBoostList || !Array.isArray(appSettings.boostGameIds)) return;
      const ids = new Set(appSettings.boostGameIds);
      selectedSaat = ownedGames.filter(g=>ids.has(g.appid));
    }

    // ---- kütüphane listesi ----
    function renderSaatList(){
      const q = document.getElementById('saatSearch').value.trim().toLowerCase();
      const body = document.getElementById('saatListBody');
      const selIds = new Set(selectedSaat.map(g=>g.appid));
      const filtered = (q ? ownedGames.filter(g=>g.name.toLowerCase().includes(q)) : ownedGames).slice(0,300);
      document.getElementById('saatFound').textContent = (q?filtered.length:ownedGames.length) + ' bulundu';
      if (!filtered.length){ body.innerHTML = '<div style="color:#8B8F9E;padding:14px;font-size:12px">Sonuç yok.</div>'; return; }
      body.innerHTML = filtered.map(g=>{
        const on = selIds.has(g.appid);
        return '<div class="h-bd" data-appid="'+g.appid+'" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:12px;border:1px solid '+(on?BC.brand:BC.bd)+';background:'+(on?'#151C28':'transparent')+';cursor:pointer;margin-bottom:5px">'
          // Kütüphane Başlığı oranı (920x430, ~2.14:1)
          + '<div style="width:59px;height:28px;flex-shrink:0;border-radius:8px;border:1px solid #2B3345;background:repeating-linear-gradient(135deg,#151C28 0 5px,#101621 5px 10px);overflow:hidden">'
            + gameThumb(g.appid) + '</div>'
          + '<div style="display:flex;flex-direction:column;gap:2px;min-width:0;flex:1">'
            + '<span style="font-size:12px;font-weight:600;color:'+(on?BC.title:BC.muted)+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(g.name)+'</span>'
            + '<span style="font-family:Geist Mono,monospace;font-size:10px;color:#8B8F9E">'+hrsOf(g)+' sa</span>'
          + '</div>'
          + '<span style="font-family:Geist Mono,monospace;font-size:13px;font-weight:700;color:'+(on?BC.ok:BC.off)+'">'+(on?'✓':'+')+'</span>'
          + '</div>';
      }).join('');
    }
    document.getElementById('saatListBody').addEventListener('click', (e)=>{
      const row = e.target.closest('[data-appid]'); if (!row) return;
      toggleSaatGame(+row.getAttribute('data-appid'));
    });

    // Tüm listeyi yeniden çizmek yerine sadece tıklanan satır güncelleniyor (kütüphane 300 satıra
    // kadar çıkabiliyor; ayrıca yeniden çizim kaydırma konumunu ve tıklanan düğümü kaybettiriyordu).
    function paintLibRow(row, on){
      row.style.borderColor = on ? BC.brand : BC.bd;
      row.style.background  = on ? '#151C28' : 'transparent';
      const nameEl = row.querySelector('span');
      if (nameEl) nameEl.style.color = on ? BC.title : BC.muted;
      const mark = row.lastElementChild;
      if (mark){ mark.textContent = on ? '✓' : '+'; mark.style.color = on ? BC.ok : BC.off; }
    }
    function toggleSaatGame(appid){
      const idx = selectedSaat.findIndex(g=>g.appid===appid);
      const on = idx < 0;
      if (!on) selectedSaat.splice(idx,1);
      else { const g = ownedGames.find(x=>x.appid===appid); if (g) selectedSaat.push(g); }
      const row = document.querySelector('#saatListBody [data-appid="'+appid+'"]');
      if (row) paintLibRow(row, on);
      persistBoostList();
      renderSaatSelected();
    }
    document.getElementById('saatClearQueue').onclick = ()=>{
      selectedSaat = []; persistBoostList();
      document.querySelectorAll('#saatListBody [data-appid]').forEach(r=>paintLibRow(r, false));
      renderSaatSelected();
    };

    function renderSaatSelected(){ renderActiveBox(); }

    // ---- kuyruk/aktif kartlar ----
    function renderActiveBox(){
      const box = document.getElementById('activeBoostBox');
      if (!box) return;
      const activeIds = boostState.running ? (boostState.activeAppids || boostState.appids || []) : [];
      const activeSet = new Set(activeIds);
      document.getElementById('statOyunSayisi').textContent = boostState.running ? activeIds.length : selectedSaat.length;

      // Süre göstergeleri
      const elapsed = boostState.running ? Math.floor((Date.now()-(boostState.startedAt||Date.now()))/1000) : 0;
      const left = boostState.running && boostState.durationMs
        ? Math.max(0, Math.floor((boostState.durationMs - (Date.now()-(boostState.startedAt||Date.now())))/1000))
        : (selectedSaat.length ? (boostFlags.seqIdle ? saatDurSec*selectedSaat.length : saatDurSec) : 0);
      document.getElementById('statToplamSure').innerHTML = monoHMS(elapsed);
      document.getElementById('saatRemain').innerHTML = monoHMS(left);

      if (!selectedSaat.length){
        box.innerHTML = '<div style="grid-column:1/-1;padding:48px 18px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center">'
          + '<span style="font-size:14px;font-weight:700;color:#B9C0D6">Kuyruk boş</span>'
          + '<span style="font-size:12px;color:#8B8F9E;max-width:280px">Soldaki kütüphaneden oyun seç - seçtiklerin burada görünür.</span></div>';
        return;
      }
      const dur = boostState.durationMs || saatDurSec*1000;
      const pct = boostState.running && dur ? Math.min(100, Math.round((Date.now()-(boostState.startedAt||Date.now()))/dur*100)) : 0;
      box.innerHTML = selectedSaat.map((g,i)=>{
        const on = activeSet.has(g.appid);
        const bd = on ? BC.brand : BC.bd;
        const p = on ? pct : 0;
        return '<div style="border:1px solid '+bd+';border-radius:12px;background:'+(on?BC.s1:BC.bgAlt)+';padding:14px;display:flex;align-items:center;gap:12px;min-height:84px">'
          // Kütüphane Başlığı oranı (920x430, ~2.14:1)
          + '<div style="width:97px;height:45px;flex-shrink:0;border-radius:10px;border:1px solid '+bd+';background:repeating-linear-gradient(135deg,#151C28 0 6px,#101621 6px 12px);overflow:hidden">'
            + gameThumb(g.appid) + '</div>'
          + '<div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:7px">'
            + '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">'
              + '<div style="display:flex;flex-direction:column;gap:3px;min-width:0">'
                + '<span style="font-size:12px;font-weight:600;color:'+(on?BC.title:BC.muted)+';white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(g.name)+'</span>'
                + '<span style="font-family:Geist Mono,monospace;font-size:10px;color:#8B8F9E">'+(on?('çalışıyor · '+fmtHMS(elapsed)):('#'+(i+1)+' · '+hrsOf(g)+' sa'))+'</span>'
              + '</div>'
              + '<span style="font-family:Geist Mono,monospace;font-size:11px;font-weight:700;color:'+(on?BC.ok:BC.off)+'">%'+p+'</span>'
            + '</div>'
            + '<div style="height:5px;border-radius:12px;background:#090C12;border:1px solid #1D2432;overflow:hidden">'
              + '<div style="height:100%;width:'+p+'%;border-radius:12px;background:'+(on?BC.ok:BC.teal)+'"></div></div>'
          + '</div></div>';
      }).join('');
    }

    // ---- eşzamanlı limit ----
    function paintConc(){
      document.querySelectorAll('#saatConc button[data-n]').forEach(b=>{
        const v = b.getAttribute('data-n');
        const on = concurrentCustom ? v==='custom' : (+v === maxConcurrent);
        Object.assign(b.style, on ? BSEG_ON : BSEG_OFF);
      });
      document.getElementById('saatConcCustom').style.display = concurrentCustom ? '' : 'none';
    }
    document.querySelectorAll('#saatConc button[data-n]').forEach(b=>b.addEventListener('click', ()=>{
      const v = b.getAttribute('data-n');
      if (v === 'custom'){ concurrentCustom = true; }
      else { concurrentCustom = false; maxConcurrent = +v; }
      paintConc(); renderActiveBox();
    }));
    document.getElementById('saatConcCustom').addEventListener('change', (e)=>{
      maxConcurrent = Math.max(1, Math.min(32, +e.target.value || 1));
      e.target.value = maxConcurrent; renderActiveBox();
    });
    paintConc();

    // ---- yükseltme süresi ----
    const bH = document.getElementById('saatH'), bM = document.getElementById('saatM'), bS = document.getElementById('saatS');
    function writeSegs(){
      const h=Math.floor(saatDurSec/3600), m=Math.floor((saatDurSec%3600)/60), s=saatDurSec%60;
      bH.value=String(h).padStart(2,'0'); bM.value=String(m).padStart(2,'0'); bS.value=String(s).padStart(2,'0');
      paintBoostPresets();
    }
    function commitDurInput(){
      const h=parseInt(bH.value,10)||0, m=Math.min(59,parseInt(bM.value,10)||0), s=Math.min(59,parseInt(bS.value,10)||0);
      boostUserTouched = true;
      saatDurSec = Math.max(60, h*3600 + m*60 + s);
      writeSegs(); renderActiveBox();
    }
    [bH,bM,bS].forEach(el=>{
      el.addEventListener('blur', commitDurInput);
      el.addEventListener('keydown', e=>{ if(e.key==='Enter'){ commitDurInput(); el.blur(); } });
      el.addEventListener('focus', ()=>el.select());
    });
    function paintBoostPresets(){
      const hours = saatDurSec/3600;
      document.querySelectorAll('#saatPresets button[data-h]').forEach(b=>{
        const h = b.getAttribute('data-h');
        const on = h==='custom' ? ![6,12,18,24].includes(hours) : (+h === hours);
        Object.assign(b.style, on ? BSEG_ON : BSEG_OFF);
      });
    }
    document.querySelectorAll('#saatPresets button[data-h]').forEach(b=>b.addEventListener('click', ()=>{
      const h = b.getAttribute('data-h');
      if (h === 'custom'){ bH.focus(); return; }
      boostUserTouched = true; saatDurSec = (+h)*3600; writeSegs(); renderActiveBox();
    }));
    writeSegs();

    // ---- Davranış / Gizlilik anahtarları ----
    // Ayarlar > Saat Yükseltici tercihlerini uygular ("Varsayılan hedef süre" dahil).
    let boostUserTouched = false;
    function applyBoostSettings(){
      if (typeof appSettings !== 'object' || !appSettings) return;
      if (!boostUserTouched && appSettings.boostTarget){
        // 'inf' = sınırsız → süre 0, "Süre dolunca otomatik durdur" kapalı gibi davranır
        const t = appSettings.boostTarget;
        const hours = t === 'inf' ? 0 : (+t || 0);
        if (hours > 0 && saatDurSec !== hours*3600){ saatDurSec = hours*3600; writeSegs(); }
      }
      if (appSettings.boostMaxGames) maxConcurrent = +appSettings.boostMaxGames;
      paintConc();
      renderActiveBox();
    }

    async function applyBoostFlags(){
      const s = await window.imu.settings.get().catch(()=>null);
      if (s){
        Object.keys(boostFlags).forEach(k=>{ if (s[k] != null) boostFlags[k] = !!s[k]; });
        if (s.boostMaxGames){ maxConcurrent = +s.boostMaxGames; }
        if (typeof appSettings === 'object') appSettings = s;
        applyBoostSettings();
      }
      document.querySelectorAll('#tab-saat .e-toggle[data-bset]').forEach(el=>{
        el.classList.toggle('on', !!boostFlags[el.getAttribute('data-bset')]);
      });
      paintConc();
    }
    document.querySelectorAll('#tab-saat .e-toggle[data-bset]').forEach(el=>{
      el.addEventListener('click', async ()=>{
        const key = el.getAttribute('data-bset');
        const val = !boostFlags[key];
        boostFlags[key] = val;
        el.classList.toggle('on', val);
        const next = await window.imu.settings.set({ [key]: val }).catch(()=>null);
        if (next) appSettings = next;
        renderActiveBox();
      });
    });

    // "Preset olarak kaydet" - mevcut yapılandırmayı (limit, süre, anahtarlar, seçili oyunlar) yazar
    document.getElementById('saatSavePreset').onclick = async ()=>{
      await window.imu.settings.set({
        boostMaxGames: maxConcurrent,
        boostDurationSec: saatDurSec,
        boostGameIds: selectedSaat.map(g=>g.appid),
        ...boostFlags,
      }).catch(()=>{});
      if (typeof toast === 'function') toast('Preset kaydedildi').done(selectedSaat.length+' oyun · '+fmtHMS(saatDurSec)+' · limit '+maxConcurrent);
    };

    // ---- başlat / durdur ----
    async function startBoost(){
      if (!selectedSaat.length) return;
      // Sıralı bekletme modunda tüm kuyruk sırayla döner; kapalıyken ilk `maxConcurrent` oyun birlikte.
      const pool = boostFlags.seqIdle ? selectedSaat : selectedSaat.slice(0, maxConcurrent);
      // playtimeMin saat eşitlemesi için gerekli (ownedGames dakika cinsinden veriyor)
      const games = pool.map(g=>({ appid:g.appid, name:g.name, playtimeMin: g.playtimeForever || 0 }));

      // Saat eşitleme açıksa ne olacağını başlatmadan ÖNCE göster - kademeler ve toplam süre
      // saatlerce sürebilir, kullanıcı onaylamadan başlatmak doğru olmaz.
      const syncOn = appSettings && appSettings.boostSync && !boostFlags.seqIdle;
      if (syncOn){
        const plan = await E.boostSyncPlan(games, appSettings.boostSyncMode || 'highest',
                                           appSettings.boostSyncTargetHours).catch(e=>({ ok:false, error:(e&&e.message) }));
        if (!plan || !plan.ok){
          edgeConfirm({ tag:'Hata', danger:true, title:'Eşitleme planı hesaplanamadı',
                        body:(plan && plan.error) || 'Bilinmeyen hata.', confirmText:'Tamam', cancelText:'Kapat' });
          return;
        }
        if (plan.steps.length){
          const lines = plan.steps.map((st,i)=>
            '  '+(i+1)+'. '+st.count+' oyun: '+fmtHours(st.fromMin)+' → '+fmtHours(st.toMin)
            +'  ('+fmtHours(st.toMin-st.fromMin)+')').join('\n');
          const ok = await edgeConfirm({
            tag:'Saat Eşitleme',
            title: plan.behind+' oyun '+fmtHours(plan.targetMin)+' hedefine çekilecek',
            body: 'Geride kalan oyunlar kademe kademe öne çıkarılır; her kademe bittiğinde o oyunlar '
                  + 'sonrakine katılır ve sonunda hepsi birlikte devam eder.\n\n' + lines
                  + '\n\nToplam süre: ' + fmtHours(Math.round(plan.totalMs/60000)),
            warn: 'Bu süre boyunca uygulama açık kalmalı. İstediğin an durdurabilirsin.',
            confirmText:'Eşitlemeyi Başlat',
          });
          if (!ok) return;
        }
      }

      if (boostFlags.seqIdle) E.boostStartSeq(games, saatDurSec*1000, boostFlags.loopQueue);
      else E.boostStart(games.map(g=>g.appid), saatDurSec*1000, games);
      notify('boost', 'Saat Yükseltme Başladı', games.length+' oyun.');
      pushFeed('saat', 'Saat Yükseltici', games.length+' oyun ile başladı.'+(syncOn?' (eşitleme açık)':''), 'Çalışıyor');
    }
    // Dakikayı "12 sa 30 dk" biçiminde yazar
    function fmtHours(min){
      const m = Math.max(0, Math.round(min||0));
      const h = Math.floor(m/60), r = m%60;
      return h ? (h+' sa'+(r?(' '+r+' dk'):'')) : (r+' dk');
    }

    // Eşitleme ilerlemesi - hangi kademede olduğumuzu üst satırda gösterir
    if (E.onBoostSync) E.onBoostSync((d)=>{
      const el = document.getElementById('saatSyncInfo');
      if (!el) return;
      if (!d.running){
        el.style.display = 'none';
        if (d.done){
          notify('boost', 'Saat Eşitleme Tamamlandı', 'Tüm oyunlar aynı süreye geldi.');
          pushFeed('saat', 'Saat Eşitleme', 'Tüm oyunlar eşitlendi, birlikte devam ediyor.', 'Başarılı');
        }
        return;
      }
      el.style.display = 'flex';
      el.innerHTML = '<span style="width:6px;height:6px;border-radius:12px;background:#24AEB3;flex-shrink:0"></span>'
        + '<span style="font-size:11px;color:#B9C0D6">Eşitleme kademesi <b style="color:#DCE2FA">'+d.step+'/'+d.steps+'</b>'
        + ' · '+d.ids.length+' oyun '+fmtHours(d.fromMin)+' → '+fmtHours(d.toMin)
        + ' · hedef '+fmtHours(d.targetMin)+'</span>';
    });
    document.getElementById('btnBoostStart').onclick = startBoost;
    document.getElementById('btnBoostStop').onclick = () => {
      if (boostState && boostState.running && boostState.startedAt) addLifeStats({ boostRuntimeMs: Math.max(0, Date.now()-boostState.startedAt) });
      autoRestartArmed = false;
      E.boostStop(); E.boostStopSeq();
      notify('boost', 'Saat Yükseltme Durdu', '');
      pushFeed('saat', 'Saat Yükseltici', 'Durduruldu.', 'Durdu');
    };

    // "Oturumu otomatik yenile": süre dolup motor durunca kuyruğu yeniden başlatır.
    let autoRestartArmed = false;
    function onSaatTick(data){
      const wasRunning = boostState.running;
      boostState = data;
      if (data.running) autoRestartArmed = true;
      if (boostTimerUI) clearInterval(boostTimerUI);
      if (data.running){
        boostTimerUI = setInterval(()=>{ if (typeof uiTickAllowed !== 'function' || uiTickAllowed()) renderActiveBox(); }, 1000);
      } else if (wasRunning && autoRestartArmed && boostFlags.boostAutoRestart && selectedSaat.length){
        autoRestartArmed = false;
        pushFeed('saat', 'Saat Yükseltici', 'Süre doldu, oturum otomatik yenilendi.', 'Çalışıyor');
        setTimeout(startBoost, 1500);
      }
      renderActiveBox();
    }
    E.onBoostTick(onSaatTick);
    E.onSaatFarmTick((data) => onSaatTick({ running: data.running, activeAppids: data.activeAppids, startedAt: Date.now()-(data.elapsedMs||0), durationMs: data.durationMs }));
