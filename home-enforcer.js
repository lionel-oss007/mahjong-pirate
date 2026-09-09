/* Sécurité d'affichage de l'accueil : masque l'ancienne mise en page sans toucher au jeu. */
(function(){
 function enforce(){
  const body=document.body;if(!body.classList.contains('pirate-home-v2'))return;
  document.querySelectorAll('.captain-card,#arsenalPanel,#missionsPanel').forEach(el=>{
   if(!el.closest('.ph-panel'))el.style.setProperty('display','none','important');
  });
  const old=document.querySelector('body.pirate-home-v2 .home-layout');if(old)old.style.setProperty('display','none','important');
  const scene=document.querySelector('.home-scene');if(scene){scene.style.setProperty('display','block','important');scene.style.setProperty('visibility','visible','important')}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{enforce();new MutationObserver(enforce).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})},{once:true});else{enforce();new MutationObserver(enforce).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']})}
})();
