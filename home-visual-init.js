/* Visual enhancement bootstrap. This file is intentionally standalone. */
(function(){
  function load(){
    if(document.querySelector('link[data-home-visual]')) return;
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href='home-visual.css?v=20260909-1';
    link.dataset.homeVisual='1';
    document.head.appendChild(link);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',load,{once:true}); else load();
})();
