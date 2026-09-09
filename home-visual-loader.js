(function(){
  var href='home-visual.css?v=20260909-1';
  if(!document.querySelector('link[data-home-visual]')){
    var link=document.createElement('link');
    link.rel='stylesheet';
    link.href=href;
    link.dataset.homeVisual='1';
    document.head.appendChild(link);
  }
})();
