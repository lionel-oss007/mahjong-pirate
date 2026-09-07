/* Adaptation mobile : le plateau s'ajuste à la largeur et à la hauteur disponibles. */
(function(){
 const MOBILE=()=>window.matchMedia('(max-width:600px)').matches;
 function fit(){
  const board=document.getElementById('board');
  if(!board||!MOBILE()||!game)return;
  const tiles=[...board.querySelectorAll('.tile')];
  if(!tiles.length)return;
  const rawW=Math.max(320,...tiles.map(t=>(parseFloat(t.style.left)||0)+58))+10;
  const rawH=Math.max(420,...tiles.map(t=>(parseFloat(t.style.top)||0)+70))+10;
  const vw=Math.max(300,window.innerWidth-24);
  const vh=Math.max(420,Math.floor(window.innerHeight*.62));
  const scale=Math.min(vw/rawW,vh/rawH,1);
  tiles.forEach(t=>{
   const x=parseFloat(t.style.left)||0,y=parseFloat(t.style.top)||0;
   t.style.left=(x*scale)+'px';
   t.style.top=(y*scale)+'px';
   t.style.width=(58*scale)+'px';
   t.style.height=(70*scale)+'px';
   t.style.fontSize=(27*scale)+'px';
   t.style.borderRadius=Math.max(5,10*scale)+'px';
   t.style.boxShadow=`inset ${2*scale}px ${2*scale}px 0 #fffdf0,inset ${-3*scale}px ${-4*scale}px 0 #9b7947,${4*scale}px ${5*scale}px 0 #5d3d21,0 ${8*scale}px ${13*scale}px #0008`;
  });
  board.style.width=Math.max(1,rawW*scale)+'px';
  board.style.height=Math.min(vh,rawH*scale)+'px';
  board.style.maxWidth='calc(100vw - 24px)';
  board.style.overflow='hidden';
  board.dataset.mobileScale=scale.toFixed(3);
 }
 const oldRender=render;
 render=function(){oldRender();requestAnimationFrame(fit)};
 const oldNewGame=newGame;
 newGame=function(level){const r=oldNewGame.apply(this,arguments);requestAnimationFrame(fit);return r};
 window.addEventListener('resize',()=>requestAnimationFrame(fit));
 window.addEventListener('orientationchange',()=>setTimeout(fit,180));
 const style=document.createElement('style');
 style.textContent=`
 @media(max-width:600px){
  html,body{width:100%;max-width:100%;overflow-x:hidden}
  .topbar{height:54px;padding:0 10px;position:sticky;top:0;z-index:50}
  .brand{font-size:1rem}.wallet{gap:9px;font-size:.82rem}
  .shell{padding:8px 6px 22px;width:100%;max-width:100%}
  .captain-card{padding:11px 12px;margin-bottom:10px;border-radius:14px;display:block}
  .captain-card h1{font-size:1.05rem}.statsline{gap:8px;font-size:.74rem}
  .captain-card .ghost{margin-top:8px;padding:6px 9px;font-size:.75rem}
  .map-panel,.game-panel{border-radius:14px;padding:9px 6px;margin-top:8px}
  .game-head h2{font-size:1.15rem}.eyebrow{font-size:.62rem}.badge{font-size:.65rem;padding:3px 7px}
  .hud{grid-template-columns:repeat(5,1fr);gap:4px;margin:8px 0}
  .hud div{padding:5px 2px;border-radius:7px}.hud small{font-size:.58rem}.hud b{font-size:.78rem}
  .actions{gap:5px;margin-bottom:7px}.actions button{flex:1;min-width:0;padding:7px 4px;font-size:.72rem;border-radius:8px}
  .level-targets{margin:5px auto 8px;gap:4px}.level-targets>div:not(.target-line){padding:4px 2px;border-radius:7px}.level-targets b{font-size:.7rem}.level-targets small{font-size:.68rem}
  .boosters{gap:9px;margin:8px auto 2px}.boosters button{width:58px;height:58px;border-width:2px}.boosters span{font-size:1.25rem}.boosters small{font-size:.52rem}.boosters b{min-width:18px;height:18px;font-size:.6rem}
  .message{font-size:.72rem;min-height:18px;margin:4px 0}
  .board{margin:0 auto!important;border-width:2px;border-radius:11px;touch-action:manipulation}
  .win-modal,.deadlock-modal{max-width:calc(100vw - 24px);padding:20px 14px}
  .modal-actions button{padding:9px 11px}
  .bonus-strip{justify-content:center;margin-bottom:7px}.bonus-chip{font-size:.65rem;padding:5px 7px}
  #arsenalPanel .arsenal-grid{grid-template-columns:1fr 1fr}
 }
 @media(max-width:380px){.hud small{font-size:.52rem}.hud b{font-size:.7rem}.actions button{font-size:.66rem}.bonus-chip{font-size:.58rem}.boosters button{width:54px;height:54px}}
 `;
 document.head.appendChild(style);
})();
