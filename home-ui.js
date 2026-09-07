(function(){
  function boot(){
    const home=document.getElementById('home');
    if(!home)return;
    const map=()=>document.getElementById('map');
    const game=()=>document.getElementById('game');
    const currentLevel=()=>{const c=document.querySelector('.island.current');return c?Number(c.dataset.level)||1:1};
    const startLevel=(level)=>{
      home.classList.add('hidden');
      if(map())map().classList.add('hidden');
      if(game())game().classList.remove('hidden');
      if(typeof window.newGame==='function')window.newGame(level);
    };
    const showHome=()=>{
      if(typeof window.home==='function')window.home();
      if(map())map().classList.add('hidden');
      if(game())game().classList.add('hidden');
      home.classList.remove('hidden');
      home.scrollIntoView({behavior:'smooth',block:'start'});
    };
    const showMap=()=>{
      home.classList.add('hidden');
      if(game())game().classList.add('hidden');
      if(map())map().classList.remove('hidden');
      map()?.scrollIntoView({behavior:'smooth',block:'start'});
    };
    document.querySelectorAll('[data-start-level]').forEach(btn=>{
      if(btn.id==='dailyPlay2')return;
      btn.addEventListener('click',()=>startLevel(Number(btn.dataset.startLevel)||1));
    });
    document.querySelectorAll('[data-open-map]').forEach(btn=>btn.addEventListener('click',showMap));
    document.querySelectorAll('[data-home]').forEach(btn=>btn.addEventListener('click',showHome));
    const homeBtn=document.getElementById('homeBtn');
    if(homeBtn)homeBtn.addEventListener('click',showHome);
    const daily=document.getElementById('dailyPlay');
    if(daily)daily.addEventListener('click',()=>startLevel(currentLevel()));
    const daily2=document.getElementById('dailyPlay2');
    if(daily2)daily2.addEventListener('click',()=>startLevel(currentLevel()));
    const h2=document.getElementById('hint2');
    if(h2)h2.addEventListener('click',()=>{if(typeof window.hint==='function')window.hint()});
    const s2=document.getElementById('shuffle2');
    if(s2)s2.addEventListener('click',()=>{if(typeof window.shuffle==='function')window.shuffle()});
    const reset=document.getElementById('resetProgress');
    if(reset)reset.addEventListener('click',()=>{
      if(confirm('Réinitialiser toute la progression ?')){
        localStorage.removeItem('mahjongPirateState');
        localStorage.removeItem('mahjongPirateProgression');
        localStorage.removeItem('mahjongPirateMissions');
        location.reload();
      }
    });
    /* Navigation latérale : on donne immédiatement un comportement cohérent aux onglets déjà visibles. */
    document.querySelectorAll('.side-btn').forEach(btn=>{
      const label=btn.textContent.trim().toLowerCase();
      btn.addEventListener('click',()=>{
        document.querySelectorAll('.side-btn').forEach(x=>x.classList.remove('active'));
        btn.classList.add('active');
        if(label.includes('accueil'))showHome();
        else if(label.includes('mode'))showHome();
        else if(label.includes('défi')){
          showHome();
          document.getElementById('dailyPlay')?.focus();
        }else if(label.includes('collection')){
          const c=document.querySelector('.captain-card');
          c?.scrollIntoView({behavior:'smooth',block:'center'});
        }else if(label.includes('boutique')){
          const chest=document.querySelector('[data-chest],#chestButton,.chest-btn');
          if(chest)chest.click();
          else document.getElementById('captainCard')?.scrollIntoView({behavior:'smooth',block:'center'});
        }
      });
    });
    /* Micro-interactions inspirées des jeux mobiles : pression, lueur et décor pirate léger. */
    const scene=document.querySelector('.home-scene');
    if(scene&&!scene.querySelector('.pirate-decor')){
      const decor=document.createElement('div');
      decor.className='pirate-decor';
      decor.innerHTML='<span class="sun">☀️</span><span class="bird">🕊️　🕊️</span><span class="ship">🚢</span><span class="island-palm">🌴</span><span class="wave">〰️〰️〰️〰️</span>';
      scene.prepend(decor);
      const style=document.createElement('style');
      style.textContent='.pirate-decor{position:absolute;inset:0;pointer-events:none;z-index:1;overflow:hidden}.pirate-decor span{position:absolute;filter:drop-shadow(0 3px 3px #002d3c66)}.pirate-decor .sun{top:28px;right:8%;font-size:3.2rem;opacity:.72}.pirate-decor .bird{top:105px;left:10%;font-size:1.35rem;opacity:.5}.pirate-decor .ship{right:2%;bottom:78px;font-size:6rem;transform:scaleX(-1);opacity:.82;animation:sail 7s ease-in-out infinite}.pirate-decor .island-palm{left:2%;bottom:66px;font-size:5rem;opacity:.8}.pirate-decor .wave{left:-10%;right:-10%;bottom:42px;font-size:2rem;letter-spacing:12px;opacity:.35;animation:wave 4s linear infinite}@keyframes sail{0%,100%{transform:translateY(0) scaleX(-1)}50%{transform:translateY(-8px) scaleX(-1)}}@keyframes wave{from{transform:translateX(0)}to{transform:translateX(70px)}}.mode-card,.promo,.side-btn,.bottom-btn{transition:transform .16s ease,filter .16s ease,box-shadow .16s ease}.mode-card:hover{transform:translateY(-5px);filter:brightness(1.03)}.mode-card:active,.promo:active,.side-btn:active,.bottom-btn:active{transform:translateY(2px)}@media(prefers-reduced-motion:reduce){.pirate-decor .ship,.pirate-decor .wave{animation:none}.mode-card,.promo,.side-btn,.bottom-btn{transition:none}}';
      document.head.appendChild(style);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();