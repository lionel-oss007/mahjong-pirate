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
    if(!document.getElementById('pirateBoardPolish')){
      const boardStyle=document.createElement('style');
      boardStyle.id='pirateBoardPolish';
      boardStyle.textContent=`
      .game-panel{position:relative;overflow:hidden}
      .game-panel:before{content:'⚓';position:absolute;right:18px;top:8px;font-size:5rem;opacity:.035;pointer-events:none;transform:rotate(12deg)}
      .game-head,.level-targets,.hud,.actions,.message,.board,.boosters{position:relative;z-index:2}
      .board{border-width:5px!important;border-color:#a96b2c!important;border-radius:26px!important;background:radial-gradient(circle at 50% 48%,#2a9493 0,#11737e 43%,#075363 72%,#043746 100%),repeating-linear-gradient(168deg,transparent 0 24px,#ffffff08 25px 26px)!important;box-shadow:inset 0 0 0 2px #e0b75a55,inset 0 0 28px #001f2b,inset 0 -18px 28px #00192388,0 7px 0 #4a2513,0 14px 26px #00131dcc!important}
      .board .tile{border-width:2px!important;border-radius:9px!important;background:linear-gradient(145deg,#fffdf0 0,#f7e7bb 45%,#e5c982 100%)!important;letter-spacing:0;line-height:1;text-shadow:0 1px 0 #ffffff99;box-shadow:inset 2px 2px 0 #fffdf2,inset -2px -3px 0 #8c6b3f,2px 3px 0 #51351d,0 5px 9px #00151aaa!important;transition:transform .14s ease,filter .14s ease,box-shadow .14s ease,border-color .14s ease!important}
      .board .tile:before{content:'';position:absolute;inset:3px;border:1px solid #c79a4f88;border-radius:5px;pointer-events:none}
      .board .tile:after{content:'';position:absolute;left:5px;right:5px;bottom:-4px;height:5px;border-radius:0 0 5px 5px;background:#9b6a2d;pointer-events:none}
      .board .tile.free{cursor:pointer}
      .board .tile.free:hover{transform:translate(-2px,-5px) scale(1.035)!important;filter:brightness(1.08) saturate(1.05);box-shadow:inset 2px 2px 0 #fff,inset -2px -3px 0 #8c6b3f,4px 7px 0 #51351d,0 12px 18px #00151acc!important}
      .board .tile.blocked{filter:brightness(.58) saturate(.72)!important}
      .board .tile.selected{outline:3px solid #ffe07a;outline-offset:2px;box-shadow:inset 2px 2px 0 #fff,inset -2px -3px 0 #8c6b3f,4px 7px 0 #51351d,0 0 20px #ffd95d!important;z-index:99!important;animation:pirateBoardSelect .55s ease-in-out infinite alternate!important}
      .board .tile[data-layer="2"]{box-shadow:inset 2px 2px 0 #fffdf2,inset -2px -3px 0 #82633b,3px 4px 0 #4d311b,0 7px 11px #00151acc!important}
      .board .tile[data-layer="3"]{box-shadow:inset 2px 2px 0 #fffdf2,inset -2px -3px 0 #765832,4px 5px 0 #472c18,0 9px 13px #00151add!important}
      .board .tile[data-layer="4"],.board .tile[data-layer="5"]{box-shadow:inset 2px 2px 0 #fffdf2,inset -2px -3px 0 #6b4f2e,5px 6px 0 #402716,0 11px 15px #00151dee!important}
      @keyframes pirateBoardSelect{from{transform:translateY(-5px) scale(1.035)}to{transform:translateY(-8px) scale(1.07)}}
      .board-corner{position:absolute;z-index:101;pointer-events:none;font-size:1.6rem;opacity:.75;filter:drop-shadow(1px 2px 2px #00151c99)}
      .board-corner.tl{left:-7px;top:-9px}.board-corner.tr{right:-7px;top:-9px;transform:scaleX(-1)}.board-corner.bl{left:-7px;bottom:-9px;transform:scaleY(-1)}.board-corner.br{right:-7px;bottom:-9px;transform:scale(-1)}
      .board-ribbon{position:absolute;left:50%;top:-15px;transform:translateX(-50%);z-index:105;padding:3px 12px;border:2px solid #d6a348;border-radius:12px;background:linear-gradient(#7d4720,#4a2412);color:#ffe9a7;font:800 .62rem Georgia,serif;letter-spacing:.1em;text-transform:uppercase;box-shadow:0 3px 0 #2b1208,0 5px 10px #00131c66;pointer-events:none;white-space:nowrap}
      .boosters{margin-top:12px;padding-top:10px;position:relative}.boosters:before{content:'☠  OUTILS DU CAPITAINE  ☠';position:absolute;top:-3px;left:50%;transform:translateX(-50%);font-size:.55rem;letter-spacing:.13em;color:#d7b15c;white-space:nowrap;opacity:.78}
      @media(max-width:600px){.board{width:342px!important;height:588px!important;border-radius:22px!important}.board .tile{width:52px!important;height:62px!important;font-size:1.55rem!important}.boosters:before{font-size:.48rem}}
      @media(prefers-reduced-motion:reduce){.board .tile.selected{animation:none!important}}
      `;
      document.head.appendChild(boardStyle);
    }
    const board=document.getElementById('board');
    if(board&&!board.querySelector('.board-ribbon')){
      ['tl','tr','bl','br'].forEach(pos=>{const e=document.createElement('span');e.className='board-corner '+pos;e.textContent='⚓';board.appendChild(e)});
      const ribbon=document.createElement('span');ribbon.className='board-ribbon';ribbon.textContent='⚓ Plateau pirate';board.appendChild(ribbon);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();