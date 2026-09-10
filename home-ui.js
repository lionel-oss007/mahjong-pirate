/* Mahjong Pirate — point d'entrée de l'interface d'accueil. */
(function(){
  'use strict';
  function forceStart(){
    try{
      if(typeof window.newGame==='function'){
        window.newGame(1);
        return true;
      }
    }catch(err){console.error('Mahjong Pirates: impossible de lancer le niveau',err);}
    return false;
  }
  function loadHome(){
    if(!document.querySelector('link[data-pirate-final-css]')){
      const css=document.createElement('link');
      css.rel='stylesheet';
      css.href='game-home-redesign.css?v=20260909-4';
      css.dataset.pirateFinalCss='1';
      document.head.appendChild(css);
    }
    if(!document.querySelector('script[data-pirate-final-home]')){
      const script=document.createElement('script');
      script.src='home-final.js?v=20260909-3';
      script.dataset.pirateFinalHome='1';
      document.body.appendChild(script);
    }
    if(!document.querySelector('script[data-pirate-map-enhancer]')){
      const script=document.createElement('script');
      script.src='map-enhancer.js?v=20260909-1';
      script.dataset.pirateMapEnhancer='1';
      document.body.appendChild(script);
    }
    if(!document.querySelector('script[data-pirate-island-polish]')){
      const script=document.createElement('script');
      script.src='island-polish.js?v=20260909-1';
      script.dataset.pirateIslandPolish='1';
      document.body.appendChild(script);
    }
    if(!document.querySelector('link[data-pirate-click-fix]')){
      const css=document.createElement('link');
      css.rel='stylesheet';
      css.href='home-click-fix.css?v=20260909-2';
      css.dataset.pirateClickFix='1';
      document.head.appendChild(css);
    }
  }
  function boot(){
    loadHome();
    const home=document.getElementById('home');
    const map=document.getElementById('map');
    const game=document.getElementById('game');
    document.getElementById('homeBtn')?.addEventListener('click',()=>{
      if(typeof window.home==='function')window.home();
      map?.classList.add('hidden');
      game?.classList.add('hidden');
      home?.classList.remove('hidden');
      home?.scrollIntoView({behavior:'smooth',block:'start'});
    });
    document.addEventListener('click',e=>{
      const target=e.target.closest?.('.pgh-play,.pgh-classic');
      if(!target)return;
      e.preventDefault();
      e.stopPropagation();
      forceStart();
    },true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
