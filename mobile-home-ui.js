/* Mahjong Pirate — orchestration de l'accueil façon vrai jeu mobile.
   Aucun changement au moteur, aux règles ou aux données de partie. */
(function(){
  function readState(){try{return JSON.parse(localStorage.getItem('mahjongPirateState')||'{}')||{}}catch(e){return{}}}
  function boot(){
    const top=document.querySelector('.topbar'), wallet=document.querySelector('.wallet');
    const scene=document.querySelector('.home-scene');
    if(!top||!wallet||!scene)return;
    document.body.classList.add('mobile-game-shell');

    /* HUD haut : profil + ressources + actions. */
    if(!top.querySelector('.mobile-captain')){
      const c=document.createElement('button');c.type='button';c.className='mobile-captain';
      c.setAttribute('aria-label','Profil du capitaine');
      c.innerHTML='<span class="mc-avatar">🏴‍☠️</span><span class="mc-info"><small>CAPITAINE</small><b id="mcLevel">Niv. 1</b><span class="mc-xp"><i id="mcXp"></i></span></span>';
      top.insertBefore(c,top.firstChild);
      c.onclick=()=>document.querySelector('#resetProgress')?.click();
    }
    if(!top.querySelector('.mobile-hud-actions')){
      const a=document.createElement('div');a.className='mobile-hud-actions';
      a.innerHTML='<button class="mobile-hud-btn" id="mobileMissions" type="button" aria-label="Défis">🎯</button><button class="mobile-hud-btn" id="mobileSettings" type="button" aria-label="Options">⚙️</button>';
      top.appendChild(a);
      a.querySelector('#mobileMissions').onclick=()=>{const b=[...document.querySelectorAll('.side-btn')].find(x=>/défi|defi/i.test(x.textContent));b?.click()};
      a.querySelector('#mobileSettings').onclick=()=>document.querySelector('#resetProgress')?.click();
    }

    if(!scene.querySelector('.game-home-kicker')){
      const kicker=document.createElement('div');kicker.className='game-home-kicker';kicker.innerHTML='<span>☠️</span> CARTE DES CARAÏBES <span>☠️</span>';
      scene.querySelector('.logo')?.before(kicker);
    }

    document.querySelectorAll('.mode-card').forEach((card,i)=>{
      card.classList.add('game-mode-'+(i+1));
      const art=card.querySelector('.mode-art');
      if(art&&!art.querySelector('.mode-badge')){
        const badge=document.createElement('span');badge.className='mode-badge';badge.textContent=i===0?'▶ JOUER':i===1?'🗺️ CARTE':'⚔️ DÉFIS';art.appendChild(badge);
      }
    });

    function refresh(){
      const s=readState();
      const level=Number(s.level)||1,xp=Number(s.xp)||0;
      const coins=Number(s.coins)||0,gems=Number(s.gems)||0;
      const l=document.getElementById('mcLevel'),bar=document.getElementById('mcXp');
      if(l)l.textContent='Niv. '+level;
      if(bar)bar.style.width=Math.max(8,Math.min(100,xp%100))+'%';
      scene.querySelector('.gh-coins')?.replaceChildren(document.createTextNode(coins));
      scene.querySelector('.gh-gems')?.replaceChildren(document.createTextNode(gems));
    }
    refresh();
    window.addEventListener('storage',refresh);
    setInterval(refresh,1200);
    scene.classList.add('game-home-ready');

    /* Le moteur masque/affiche home/map/game : on adapte seulement le shell visuel. */
    const sync=()=>{
      const home=document.getElementById('home'),map=document.getElementById('map'),game=document.getElementById('game');
      document.body.classList.toggle('home-game-mode',!!home&&!home.classList.contains('hidden'));
      document.body.classList.toggle('map-game-mode',!!map&&!map.classList.contains('hidden'));
      document.body.classList.toggle('play-game-mode',!!game&&!game.classList.contains('hidden'));
    };
    sync();
    new MutationObserver(sync).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
