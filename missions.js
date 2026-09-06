(function(){
  const KEY='mahjongPirateMissions';
  const MISSION_SET=[
    {id:'no-shuffle',icon:'⚓',title:'Sans mélange',desc:'Termine une île sans utiliser Mélanger.',reward:{coins:80,xp:35},goal:1},
    {id:'combo-5',icon:'🔥',title:'Combo x5',desc:'Atteins un combo de 5 paires dans une partie.',reward:{coins:100,xp:45},goal:1},
    {id:'speed-90',icon:'⏱️',title:'Course contre la montre',desc:'Termine une île en 90 secondes ou moins.',reward:{coins:120,xp:55,gem:1},goal:1}
  ];

  let runUsedShuffle=false;
  let missionData=load();

  function dayKey(){
    const d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }

  function fresh(){ return {date:dayKey(),completed:{},claimed:{}}; }

  function load(){
    try{
      const raw=JSON.parse(localStorage.getItem(KEY)||'null');
      if(!raw || raw.date!==dayKey()) return fresh();
      return Object.assign(fresh(),raw,{completed:raw.completed||{},claimed:raw.claimed||{}});
    }catch(e){ return fresh(); }
  }

  function saveMissions(){ localStorage.setItem(KEY,JSON.stringify(missionData)); }

  function ensureDay(){
    if(missionData.date!==dayKey()){
      missionData=fresh();
      saveMissions();
    }
  }

  function inject(){
    if(document.getElementById('missionsPanel')) return;
    const style=document.createElement('style');
    style.textContent=`
      #missionsPanel{margin-top:14px;border:1px solid #b98232;border-radius:18px;background:linear-gradient(145deg,#f8e7bd,#ead09a);box-shadow:0 10px 24px #2a170a26;overflow:hidden}
      #missionsPanel .missions-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:13px 15px 9px;color:#4b2815}
      #missionsPanel .missions-head h2{margin:0;font-size:1.05rem}
      #missionsPanel .missions-head small{font-size:.72rem;opacity:.75}
      #missionsPanel .mission-list{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:0 10px 11px}
      #missionsPanel .mission{position:relative;border:1px solid #9b6a2e99;border-radius:13px;background:#fff8e8;padding:10px 10px 9px;min-height:104px;color:#3d2417}
      #missionsPanel .mission.done{background:linear-gradient(145deg,#fff4c8,#dff1df);border-color:#6d9c69}
      #missionsPanel .mission-icon{font-size:1.25rem;display:block;margin-bottom:3px}
      #missionsPanel .mission-title{font-weight:800;font-size:.86rem;display:block}
      #missionsPanel .mission-desc{font-size:.68rem;line-height:1.25;display:block;margin:4px 0 7px;opacity:.78}
      #missionsPanel .mission-reward{font-size:.68rem;font-weight:800;color:#7a4a17}
      #missionsPanel .mission-check{position:absolute;right:8px;top:7px;font-size:.9rem}
      #missionsPanel .mission-foot{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-top:6px;font-size:.63rem;color:#6c4a2b}
      #missionsPanel .mission-bar{height:5px;border-radius:8px;background:#d8c6a2;overflow:hidden;flex:1}
      #missionsPanel .mission-fill{height:100%;width:0;background:#267b79;transition:width .25s ease}
      @media(max-width:720px){#missionsPanel .mission-list{grid-template-columns:1fr}.mission{min-height:0}}
    `;
    document.head.appendChild(style);
    const panel=document.createElement('section');
    panel.id='missionsPanel';
    panel.innerHTML='<div class="missions-head"><div><h2>📜 Contrats du capitaine</h2><small>Les missions se renouvellent chaque jour</small></div><span>☠️</span></div><div id="missionList" class="mission-list"></div>';
    const captain=document.querySelector('.captain-card');
    (captain||document.querySelector('.shell')).insertAdjacentElement('afterend',panel);
    refresh();
  }

  function rewardText(r){ return '🪙 +'+r.coins+' · ⭐ +'+r.xp+' XP'+(r.gem?' · 💎 +'+r.gem:''); }

  function refresh(){
    ensureDay();
    const list=document.getElementById('missionList');
    if(!list) return;
    list.innerHTML=MISSION_SET.map(m=>{
      const done=!!missionData.completed[m.id];
      return `<article class="mission ${done?'done':''}">
        <span class="mission-icon">${m.icon}</span><span class="mission-title">${m.title}</span>
        <span class="mission-desc">${m.desc}</span><span class="mission-reward">${rewardText(m.reward)}</span>
        <span class="mission-check">${done?'✅':'⚓'}</span>
        <div class="mission-foot"><div class="mission-bar"><div class="mission-fill" style="width:${done?100:0}%"></div></div><span>${done?'Terminée':'0/1'}</span></div>
      </article>`;
    }).join('');
  }

  function award(m){
    if(missionData.claimed[m.id]) return false;
    state.coins=(Number(state.coins)||0)+m.reward.coins;
    state.xp=(Number(state.xp)||0)+m.reward.xp;
    if(m.reward.gem) state.gems=(Number(state.gems)||0)+m.reward.gem;
    missionData.claimed[m.id]=true;
    return true;
  }

  function checkWin(){
    ensureDay();
    if(!game) return [];
    const elapsed=(Date.now()-startedAt)/1000;
    const results=[];
    if(!missionData.completed['no-shuffle'] && !runUsedShuffle) results.push(MISSION_SET[0]);
    if(!missionData.completed['combo-5'] && (Number(game.bestCombo)||0)>=5) results.push(MISSION_SET[1]);
    if(!missionData.completed['speed-90'] && elapsed<=90) results.push(MISSION_SET[2]);
    results.forEach(m=>missionData.completed[m.id]=true);
    let changed=false;
    results.forEach(m=>{ if(award(m)) changed=true; });
    if(changed){ saveMissions(); if(typeof save==='function') save(); }
    return results;
  }

  const originalNewGame=window.newGame;
  if(typeof originalNewGame==='function') window.newGame=function(){ runUsedShuffle=false; return originalNewGame.apply(this,arguments); };

  const originalShuffle=window.shuffle;
  if(typeof originalShuffle==='function') window.shuffle=function(){ runUsedShuffle=true; return originalShuffle.apply(this,arguments); };

  const originalWin=window.win;
  if(typeof originalWin==='function'){
    window.win=function(){
      const completed=checkWin();
      const result=originalWin.apply(this,arguments);
      if(completed.length){
        const text=document.getElementById('winText');
        if(text){
          const names=completed.map(m=>m.icon+' '+m.title).join(' · ');
          text.innerHTML += '<br><strong style="color:#f4ce61">📜 Mission'+(completed.length>1?'s':'')+' accomplie'+(completed.length>1?'s':'')+' : '+names+'</strong>';
        }
      }
      refresh();
      return result;
    };
  }

  const originalReset=window.resetProgress;
  if(typeof originalReset==='function'){
    window.resetProgress=function(){
      const result=originalReset.apply(this,arguments);
      missionData=fresh();
      runUsedShuffle=false;
      saveMissions();
      refresh();
      return result;
    };
  }

  function init(){
    ensureDay();
    inject();
    const reset=document.getElementById('resetProgress');
    if(reset && originalReset){
      reset.onclick=null;
      reset.addEventListener('click',()=>window.resetProgress());
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
