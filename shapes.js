/*
 * Gestion des formes de plateaux.
 *
 * Le moteur principal (app.js) possède désormais la géométrie officielle
 * des plateaux et sa fonction layout(). Ce fichier conserve uniquement les
 * métadonnées visuelles afin de ne jamais remplacer le layout du moteur.
 */
(function(){
  window.__mahjongPirateShapes = {version:'6.0',source:'app.js',note:'La géométrie jouable est pilotée exclusivement par app.js.'};
  function css(href,attr){if(document.querySelector('link['+attr+']'))return;var link=document.createElement('link');link.rel='stylesheet';link.href=href;link.setAttribute(attr,'1');document.head.appendChild(link)}
  function js(src,attr){if(document.querySelector('script['+attr+']'))return;var s=document.createElement('script');s.src=src;s.setAttribute(attr,'1');document.head.appendChild(s)}
  css('home-visual.css?v=20260909-6','data-home-visual');
  css('mobile-game-ui.css?v=20260909-4','data-mobile-game-ui');
  css('mobile-home-ui.css?v=20260909-2','data-mobile-home-ui');
  js('mobile-home-ui.js?v=20260909-4','data-mobile-home-ui');
  js('home-enforcer.js?v=20260909-1','data-home-enforcer');
})();
