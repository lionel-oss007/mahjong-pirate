/*
 * Gestion des formes de plateaux.
 *
 * Le moteur principal (app.js) possède désormais la géométrie officielle
 * des plateaux et sa fonction layout(). Ce fichier conserve uniquement les
 * métadonnées visuelles afin de ne jamais remplacer le layout du moteur.
 */
(function(){
  window.__mahjongPirateShapes = {
    version: '6.0',
    source: 'app.js',
    note: 'La géométrie jouable est pilotée exclusivement par app.js.'
  };
  if (!document.querySelector('link[data-home-visual]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'home-visual.css?v=20260909-4';
    link.dataset.homeVisual = '1';
    document.head.appendChild(link);
  }
  if (!document.querySelector('link[data-mobile-game-ui]')) {
    var mobile = document.createElement('link');
    mobile.rel = 'stylesheet';
    mobile.href = 'mobile-game-ui.css?v=20260909-1';
    mobile.dataset.mobileGameUi = '1';
    document.head.appendChild(mobile);
  }
})();
