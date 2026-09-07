(function(){
  function boot(){
    const board=document.getElementById('board');
    if(!board)return;
    if(!document.getElementById('boardPolishStyle')){
      const style=document.createElement('style');
      style.id='boardPolishStyle';
      style.textContent=`
/* ===== Plateau Mahjong Pirate : table de jeu premium ===== */
.game-panel{overflow:visible!important}
.board{position:relative!important;isolation:isolate!important;overflow:visible!important;border-radius:30px!important;padding:8px!important;box-sizing:border-box!important;transform:translateZ(0)}
.board:before{content:''!important;position:absolute!important;inset:0!important;z-index:-4!important;border-radius:30px!important;background:
 radial-gradient(circle at 50% 45%,#2d9b96 0,#15777b 48%,#07505e 78%,#043744 100%)!important;
 border:4px solid #7a421e!important;box-shadow:inset 0 0 0 2px #d39a43,inset 0 0 32px #002a31,0 8px 0 #35180b,0 15px 28px #00131caa!important}
.board:after{content:'☠  ⚓  ☠'!important;position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;z-index:-3!important;font-size:5.5rem!important;letter-spacing:1.2rem!important;color:#f1c65d!important;opacity:.055!important;pointer-events:none!important;white-space:nowrap}
.board[data-shape="tortue"]{border-radius:42px!important}
.board[data-shape="pyramide"]{border-radius:28px 28px 38px 38px!important}
.board[data-shape="diamant"]{border-radius:42px!important}
.board[data-shape="navire"]{border-radius:22px 22px 38px 38px!important}
.board[data-shape="fort"]{border-radius:18px!important}
.board[data-shape="archipel"]{border-radius:34px!important}
.board:global{outline:none}
.tile{position:absolute!important;box-sizing:border-box!important;border:2px solid #7a451c!important;border-radius:8px!important;
 background:linear-gradient(145deg,#fffdf0 0,#f7e7bb 44%,#e5c982 100%)!important;
 color:#3d2112!important;text-shadow:0 1px #fff!important;
 box-shadow:inset 0 0 0 2px #fff9e8,inset 0 -5px 7px #b77b2b33,3px 5px 0 #704019,5px 8px 10px #00151c88!important;
 transition:transform .14s ease,filter .14s ease,box-shadow .14s ease!important;
 overflow:visible!important;backface-visibility:hidden}
.tile:before{content:'';position:absolute;inset:3px;border:1px solid #c79a4f88;border-radius:5px;pointer-events:none}
.tile:after{content:'';position:absolute;left:5px;right:5px;bottom:-4px;height:5px;border-radius:0 0 5px 5px;background:linear-gradient(#b27b2e,#704019);opacity:.9;pointer-events:none}
.tile.free{filter:drop-shadow(0 4px 4px #00151c66)!important}
.tile.blocked{filter:brightness(.78) saturate(.85) drop-shadow(2px 4px 3px #00151c99)!important}
.tile:hover.free{transform:translateY(-3px) scale(1.025);filter:brightness(1.08) drop-shadow(0 7px 6px #00151c77)!important}
.tile.selected{border-color:#f4c95d!important;box-shadow:inset 0 0 0 2px #fff6c9,inset 0 0 14px #ffe16a88,0 0 0 3px #eab648aa,3px 7px 0 #704019,0 0 18px #ffd95c99!important;z-index:100!important}
.tile.kind-0,.tile.kind-4,.tile.kind-8,.tile.kind-14{color:#a21e1e!important}
.tile.kind-2,.tile.kind-3,.tile.kind-18{color:#242024!important}
.tile.kind-1,.tile.kind-5,.tile.kind-7,.tile.kind-11,.tile.kind-15{color:#0d7181!important}
.tile[data-layer="2"]{box-shadow:inset 0 0 0 2px #fff9e8,inset 0 -5px 7px #b77b2b33,4px 6px 0 #704019,6px 10px 11px #00151c99!important}
.tile[data-layer="3"]{box-shadow:inset 0 0 0 2px #fff9e8,inset 0 -5px 7px #b77b2b33,5px 7px 0 #704019,7px 12px 13px #00151caa!important}
.tile[data-layer="4"]{box-shadow:inset 0 0 0 2px #fff9e8,inset 0 -5px 7px #b77b2b33,6px 8px 0 #704019,8px 14px 15px #00151cbb!important}
.tile[data-layer="5"]{box-shadow:inset 0 0 0 2px #fff9e8,inset 0 -5px 7px #b77b2b33,7px 9px 0 #704019,9px 16px 17px #00151ccc!important}
.board-corner{position:absolute;z-index:0;pointer-events:none;font-size:1.7rem;opacity:.72;filter:drop-shadow(1px 2px 2px #00151c99)}
.board-corner.tl{left:-8px;top:-9px}.board-corner.tr{right:-8px;top:-9px;transform:scaleX(-1)}.board-corner.bl{left:-8px;bottom:-9px;transform:scaleY(-1)}.board-corner.br{right:-8px;bottom:-9px;transform:scale(-1)}
.board-ribbon{position:absolute;left:50%;top:-16px;transform:translateX(-50%);z-index:105;padding:3px 14px;border:2px solid #d6a348;border-radius:12px;background:linear-gradient(#7d4720,#4a2412);color:#ffe9a7;font:800 .68rem Georgia,serif;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 3px 0 #2b1208,0 5px 10px #00131c66;pointer-events:none;white-space:nowrap}
@media(max-width:720px){.board{border-radius:24px!important}.board:after{font-size:3.5rem!important;letter-spacing:.5rem}.tile{border-radius:7px!important}.board-ribbon{top:-13px;font-size:.58rem;padding:2px 9px}}
@media(prefers-reduced-motion:reduce){.tile{transition:none!important}}
`;
      document.head.appendChild(style);
    }
    function decorate(){
      const b=document.getElementById('board');
      if(!b||b.dataset.polished)return;
      b.dataset.polished='1';
      ['tl','tr','bl','br'].forEach(pos=>{const e=document.createElement('span');e.className='board-corner '+pos;e.textContent='⚓';b.appendChild(e)});
      const ribbon=document.createElement('span');ribbon.className='board-ribbon';ribbon.textContent='⚓ Plateau pirate';b.appendChild(ribbon);
    }
    decorate();
    if(typeof window.render==='function'&&!window.render.__boardPolished){
      const base=window.render;
      const wrapped=function(){base();decorate();};
      wrapped.__boardPolished=true;
      window.render=wrapped;
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
