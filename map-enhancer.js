/* Mahjong Pirate — enrichissement visuel de la carte, sans toucher au moteur de jeu. */
(function(){
  'use strict';
  function state(){try{return JSON.parse(localStorage.getItem('mahjongPirateState')||'{}')||{};}catch(e){return{};}}
  function addDecor(map){
    if(map.querySelector('.pgh-world'))return;
    const world=document.createElement('div');
    world.className='pgh-world';
    world.setAttribute('aria-hidden','true');
    world.innerHTML=`
      <div class="pgh-route r1"></div><div class="pgh-route r2"></div><div class="pgh-route r3"></div>
      <div class="pgh-reef reef1">〰︎〰︎</div><div class="pgh-reef reef2">〰︎〰︎〰︎</div>
      <div class="pgh-palm palm1">🌴</div><div class="pgh-palm palm2">🌴</div>
      <div class="pgh-ship"><span class="ship-flag">☠</span><span class="ship-sail sail1"></span><span class="ship-sail sail2"></span><span class="ship-mast"></span><span class="ship-hull"></span></div>
      <div class="pgh-treasure">💰</div>
      <div class="pgh-levels"><div class="pgh-level-title">ÎLE PRINCIPALE · PROGRESSION</div><div class="pgh-level-list"></div></div>`;
    map.prepend(world);
    const list=world.querySelector('.pgh-level-list');
    const s=state();
    const unlocked=Math.max(1,Math.min(6,Number(s.level)||1));
    for(let i=1;i<=6;i++){
      const b=document.createElement('button');
      b.className='pgh-level '+(i<=unlocked?'unlocked':'locked');
      b.innerHTML=i<=unlocked?`<b>${i}</b><span>⭐</span>`:`<b>🔒</b>`;
      b.title=i<=unlocked?`Niveau ${i}`:`Niveau ${i} verrouillé`;
      if(i<=unlocked)b.addEventListener('click',()=>{if(typeof window.newGame==='function')window.newGame(i);});
      list.appendChild(b);
    }
  }
  function style(){
    if(document.getElementById('pgh-map-enhancer-css'))return;
    const css=document.createElement('style');css.id='pgh-map-enhancer-css';
    css.textContent=`
      .pgh-world{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}
      .pgh-route{position:absolute;height:5px;border-top:3px dashed #e8d28b66;filter:drop-shadow(0 1px 1px #00343b);transform-origin:left center}
      .pgh-route.r1{width:230px;left:31%;top:49%;transform:rotate(24deg)}
      .pgh-route.r2{width:220px;left:55%;top:52%;transform:rotate(28deg)}
      .pgh-route.r3{width:190px;left:24%;top:67%;transform:rotate(-8deg)}
      .pgh-reef{position:absolute;color:#80e1dd55;font-size:1.8rem;letter-spacing:.35rem}
      .reef1{left:4%;top:31%}.reef2{right:4%;bottom:29%}
      .pgh-palm{position:absolute;font-size:4.1rem;filter:drop-shadow(4px 8px 3px #00343a88);opacity:.9}
      .palm1{left:1.5%;bottom:17%}.palm2{right:1%;top:31%;transform:scaleX(-1)}
      .pgh-treasure{position:absolute;left:17%;bottom:18%;font-size:2rem;filter:drop-shadow(2px 4px 2px #00343a88);opacity:.9}
      .pgh-ship{position:absolute;right:1.5%;top:7%;width:210px;height:145px;filter:drop-shadow(0 12px 8px #002a3499);transform:rotate(-4deg);z-index:2}
      .ship-hull{position:absolute;left:20px;bottom:18px;width:168px;height:48px;background:linear-gradient(#66351b,#241007);border:4px solid #c18737;border-radius:10px 10px 42px 42px;transform:skewX(-10deg);box-shadow:inset 0 5px #b9782e,0 5px #180a05}
      .ship-mast{position:absolute;left:104px;top:20px;width:8px;height:105px;background:linear-gradient(90deg,#4b260f,#b4752b,#3a1b0b);z-index:3}
      .ship-sail{position:absolute;z-index:2;border-style:solid;filter:drop-shadow(2px 3px 1px #1c0b05aa)}
      .sail1{left:43px;top:31px;border-width:5px 0 58px 58px;border-color:transparent transparent #f0d8a0 transparent;transform:rotate(1deg)}
      .sail2{left:112px;top:43px;border-width:4px 0 47px 43px;border-color:transparent transparent #d8b56f transparent}
      .ship-flag{position:absolute;left:109px;top:8px;z-index:4;color:#20100a;font-size:1.25rem;background:#f0d49b;padding:1px 5px;border-radius:2px 6px 6px 2px;box-shadow:2px 2px #0005}
      .pgh-levels{position:absolute;left:50%;bottom:4%;transform:translateX(-50%);z-index:6;width:min(470px,72%);padding:5px 8px;border:2px solid #bd8032;border-radius:12px;background:#2a130bdd;box-shadow:0 5px 0 #1a0a05,0 8px 18px #00192388;pointer-events:auto}
      .pgh-level-title{text-align:center;color:#f7d98d;font:900 .48rem Arial;letter-spacing:.12em;margin-bottom:4px}
      .pgh-level-list{display:flex;justify-content:center;gap:7px}
      .pgh-level{width:38px;height:38px;border-radius:50%;border:2px solid #b77a30;background:linear-gradient(#e4b75e,#895321);color:#40200e;box-shadow:inset 0 2px #fff7,0 3px #3a1709;cursor:pointer;font-weight:900}
      .pgh-level b{display:block;font-size:.85rem}.pgh-level span{display:block;font-size:.48rem;margin-top:-2px}
      .pgh-level.locked{filter:grayscale(.8);opacity:.55;cursor:not-allowed;background:#6d655d}
      .pgh-level.unlocked:hover{transform:translateY(-2px);filter:brightness(1.1)}
      .pgh-map .pgh-island,.pgh-map .pgh-play,.pgh-map .pgh-chip,.pgh-map .pgh-star{z-index:10}
      @media(max-width:700px){.pgh-ship{right:-34px;top:5%;transform:scale(.65) rotate(-4deg);transform-origin:top right}.pgh-palm{font-size:2.7rem}.pgh-treasure{font-size:1.35rem;left:12%;bottom:19%}.pgh-route.r1{width:150px}.pgh-route.r2{width:130px}.pgh-levels{width:76%;bottom:3%;padding:4px 5px}.pgh-level-title{font-size:.4rem}.pgh-level{width:31px;height:31px}.pgh-level b{font-size:.7rem}.pgh-level-list{gap:4px}}
      @media(max-width:390px){.pgh-levels{width:82%}.pgh-level{width:28px;height:28px}.pgh-level span{display:none}.pgh-ship{right:-52px}}
    `;document.head.appendChild(css);
  }
  function boot(){
    style();
    const map=document.querySelector('#pirateGameHome .pgh-map');
    if(map)addDecor(map);
    else setTimeout(boot,120);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
