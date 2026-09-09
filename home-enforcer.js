/* Sécurité d'affichage de l'accueil : masque l'ancienne mise en page sans toucher au jeu. */
(function(){
 function loadCss(){if(document.querySelector('link[data-game-home-redesign]'))return;var l=document.createElement('link');l.rel='stylesheet';l.href='game-home-redesign.css?v=20260909-1';l.setAttribute('data-game-home-redesign','1');document.head.appendChild(l)}
 function enforce(){
  const body=document.body;loadCss();if(!body.classList.contains('pirate-home-v2'))return;
  document.querySelectorAll('.captain-card,#arsenalPanel,#missionsPanel').forEach(el=>{if(!el.closest('.ph-panel'))el.style.setProperty('display','none','important')});
  const old=document.querySelector('body.pirate-home-v2 .home-layout');if(old)old.style.setProperty('display','none','important');
  const scene=document.querySelector('.home-scene');if(scene){scene.style.setProperty('display','block','important');scene.style.setProperty('visibility','visible','important')}
 }
 const start=()=>{enforce();new MutationObserver(enforce).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
