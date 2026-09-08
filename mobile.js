// Améliorations tactiles et haptiques pour mobile

// Support du retour haptique
function hapticFeedback(type = 'light') {
  if (!navigator.vibrate) return;
  
  const patterns = {
    light: [10],
    medium: [20],
    strong: [40],
    success: [30, 50, 30],
    error: [50, 100, 50],
    selection: [15, 10, 15]
  };
  
  navigator.vibrate(patterns[type] || patterns.light);
}

// Interception des clics pour haptique
document.addEventListener('click', function(e) {
  const target = e.target.closest('.tile.free, .play, .side-btn, .bottom-btn, button');
  if (target) {
    hapticFeedback('light');
  }
}, true);

// Haptique plus forte pour les actions importantes
document.addEventListener('click', function(e) {
  if (e.target.id === 'deadlockShuffle' || 
      e.target.id === 'loseRestart' || 
      e.target.id === 'winNext' ||
      e.target.classList.contains('play')) {
    hapticFeedback('medium');
  }
}, true);

// Prévenir le zoom tactile sur les boutons
document.addEventListener('touchmove', function(e) {
  if (e.target.closest('.tile, .play, .side-btn, button')) {
    e.preventDefault();
  }
}, { passive: false });

// Optimisation du layout pour petits écrans
function optimizeForMobile() {
  const width = window.innerWidth;
  const board = document.getElementById('board');
  
  if (width < 480) {
    document.documentElement.style.setProperty('--tile-size', '52px');
  } else if (width < 768) {
    document.documentElement.style.setProperty('--tile-size', '56px');
  } else {
    document.documentElement.style.setProperty('--tile-size', '58px');
  }
}

// Appeler au chargement et redimensionnement
window.addEventListener('load', optimizeForMobile);
window.addEventListener('resize', optimizeForMobile);

// Support du mode PWA
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// Désactiver le zoom sur les éléments de jeu
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });

// Détecter la qualité de l'écran pour optimiser
const dpr = window.devicePixelRatio || 1;
if (dpr > 2) {
  document.documentElement.classList.add('retina');
}

// Support du dark mode
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark-mode');
}

window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
  if (e.matches) {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
});