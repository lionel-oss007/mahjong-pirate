/* Mahjong Pirate — couche d'interface type jeu mobile.
   Ne touche ni aux règles, ni au moteur, ni aux données de partie. */
(function(){
  function boot(){
    document.body.classList.add('mobile-game-shell');
    const scene=document.querySelector('.home-scene');
    if(!scene || scene.querySelector('.game-home-hud')) return;

    const hud=document.createElement('div');
    hud.className='game-home-hud';
    hud.innerHTML=`
      <button class="gh-profile" type="button" aria-label="Profil du capitaine">
        <span class="gh-avatar">🏴‍☠️</span><span class="gh-profile-text"><b>Capitaine</b><small>Voir le profil</small></span>
      </button>
      <div class="gh-resources"><span>🪙 <b class="gh-coins">0</b></span><span>💎 <b class="gh-gems">0</b></span></div>
      <button class="gh-settings" type="button" aria-label="Paramètres">⚙️</button>`;
    scene.prepend(hud);

    const title=document.createElement('div');
    title.className='game-home-kicker';
    title.innerHTML='<span>☠️</span> CARTE DES CARAÏBES <span>☠️</span>';
    const logo=scene.querySelector('.logo');
    if(logo) logo.before(title);

    const profile=document.createElement('button');
    profile.className='game-home-profile-fallback';
    profile.type='button';
    profile.textContent='🏴‍☠️ Profil';
    scene.appendChild(profile);

    function refresh(){
      let s={};
      try{s=JSON.parse(localStorage.getItem('mahjongPirateState')||'{}')||{}}catch(e){}
      const c=hud.querySelector('.gh-coins'),g=hud.querySelector('.gh-gems');
      if(c)c.textContent=Number(s.coins)||0;
      if(g)g.textContent=Number(s.gems)||0;
    }
    refresh();
    window.addEventListener('storage',refresh);
    const oldSave=window.save;
    if(typeof oldSave==='function' && !window.__mobileHomeSaveWrapped){
      window.__mobileHomeSaveWrapped=true;
      window.save=function(){const r=oldSave.apply(this,arguments);refresh();return r};
    }

    const captain=document.querySelector('.captain-card');
    hud.querySelector('.gh-profile').onclick=()=>{
      if(captain){captain.classList.toggle('mobile-profile-open');captain.scrollIntoView({behavior:'smooth',block:'nearest'});}
    };
    hud.querySelector('.gh-settings').onclick=()=>document.querySelector('#piratePanel')?.classList.remove('hidden');
    profile.onclick=()=>hud.querySelector('.gh-profile').click();

    document.querySelectorAll('.mode-card').forEach((card,i)=>{
      card.classList.add('game-mode-'+(i+1));
      const art=card.querySelector('.mode-art');
      if(art && !art.querySelector('.mode-badge')){
        const badge=document.createElement('span');badge.className='mode-badge';badge.textContent=i===0?'▶ JOUER':i===1?'🗺️ CARTE':'⚔️ DÉFIS';art.appendChild(badge);
      }
    });
    scene.classList.add('game-home-ready');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
