/* Mahjong Pirate — finition des îles de la carte, sans toucher au moteur. */
(function(){
  'use strict';
  function boot(){
    const map=document.querySelector('#pirateGameHome .pgh-map');
    if(!map || map.dataset.islandPolish==='1') return;
    map.dataset.islandPolish='1';
    const style=document.createElement('style');
    style.id='pgh-island-polish-css';
    style.textContent=`
      .pgh-map .pgh-island{overflow:visible!important;isolation:isolate;background:radial-gradient(circle at 50% 18%,#fff0bd 0 12%,transparent 13%),radial-gradient(ellipse at 50% 72%,#79a946 0 22%,#4f8b42 23% 31%,transparent 32%),radial-gradient(ellipse at 35% 67%,#6e9e43 0 12%,transparent 13%),radial-gradient(ellipse at 65% 63%,#84ad4b 0 10%,transparent 11%),linear-gradient(#e7c06f,#b87830 78%,#87501f)!important;}
      .pgh-map .pgh-island:before{content:'';position:absolute;inset:10% 12% 18%;z-index:-1;border-radius:50%;background:radial-gradient(circle at 28% 32%,#b8c96a 0 5%,transparent 6%),radial-gradient(circle at 72% 48%,#3d7a3c 0 5%,transparent 6%),radial-gradient(circle at 52% 75%,#d2d58a 0 4%,transparent 5%);opacity:.75;pointer-events:none;}
      .pgh-map .pgh-island:after{content:'🌴';position:absolute;right:7%;top:4%;font-size:1.65rem;filter:drop-shadow(2px 4px 2px #25452699);transform:rotate(-7deg);pointer-events:none;}
      .pgh-map .pgh-classic:after{content:'🌴  🚩';right:5%;top:2%;font-size:1.7rem;}
      .pgh-map .pgh-adventure:after{content:'🌴';font-size:1.35rem;right:4%;top:3%;}
      .pgh-map .pgh-challenge:after{content:'🌴';font-size:1.35rem;left:5%;right:auto;top:4%;transform:scaleX(-1);}
      .pgh-map .pgh-classic{border-radius:48% 52% 45% 55%!important;}
      .pgh-map .pgh-adventure{border-radius:52% 48% 55% 45%!important;}
      .pgh-map .pgh-challenge{border-radius:46% 54% 50% 50%!important;}
      .pgh-map .pgh-classic .icon{filter:drop-shadow(2px 3px 1px #4b2815);}
      .pgh-map .pgh-adventure .icon,.pgh-map .pgh-challenge .icon{filter:drop-shadow(2px 3px 1px #4b2815);}
      .pgh-map .pgh-classic b,.pgh-map .pgh-classic small,.pgh-map .pgh-adventure b,.pgh-map .pgh-adventure small,.pgh-map .pgh-challenge b,.pgh-map .pgh-challenge small{position:relative;z-index:3;text-shadow:0 1px #fff8;}
      .pgh-map .pgh-classic .icon{position:relative;z-index:3;}
      .pgh-map .pgh-play{animation:pgh-pulse 2.6s ease-in-out infinite;}
      @keyframes pgh-pulse{0%,100%{filter:brightness(1);box-shadow:inset 0 1px #fff7,0 5px 0 #52200d,0 9px 15px #00192388}50%{filter:brightness(1.08);box-shadow:inset 0 1px #fff7,0 5px 0 #52200d,0 0 22px #47e77a66}}
      .pgh-map .pgh-route{border-top-color:#f4d98a99!important;}
      .pgh-map .pgh-ship{animation:pgh-ship 5s ease-in-out infinite;}
      @keyframes pgh-ship{0%,100%{margin-top:0}50%{margin-top:5px}}
      .pgh-map .pgh-treasure{animation:pgh-treasure 2.8s ease-in-out infinite;}
      @keyframes pgh-treasure{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-4px) rotate(3deg)}}
      @media(prefers-reduced-motion:reduce){.pgh-map .pgh-play,.pgh-map .pgh-ship,.pgh-map .pgh-treasure{animation:none!important}}
      @media(max-width:700px){.pgh-map .pgh-island:after{font-size:1.05rem}.pgh-map .pgh-classic:after{font-size:1.15rem}.pgh-map .pgh-play{animation:none}}
    `;
    document.head.appendChild(style);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,250),{once:true});
  else setTimeout(boot,250);
})();
