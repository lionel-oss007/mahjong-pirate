// 🎮 Système d'améliorations du gameplay et notifications

// Système de notifications Toast
class NotificationSystem {
  constructor() {
    this.container = document.body;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('closing');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  }

  success(message) {
    return this.show(`✅ ${message}`, 'success');
  }

  error(message) {
    return this.show(`❌ ${message}`, 'error');
  }

  warning(message) {
    return this.show(`⚠️ ${message}`, 'warning');
  }

  info(message) {
    return this.show(`ℹ️ ${message}`, 'info');
  }

  combo(level) {
    return this.show(`🔥 Combo x${level}!`, 'combo', 1500);
  }

  milestone(text) {
    return this.show(`🏆 ${text}`, 'milestone', 2000);
  }
}

const notificationSystem = new NotificationSystem();

// Système de combo amélioré
class ComboSystem {
  constructor() {
    this.combo = 0;
    this.maxCombo = 0;
    this.displayElement = null;
  }

  increment() {
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    
    if (this.combo > 1 && this.combo % 3 === 0) {
      notificationSystem.combo(this.combo);
      audioSystem.combo(Math.min(this.combo / 3, 4));
    }

    this.updateDisplay();
  }

  reset() {
    this.combo = 0;
    this.updateDisplay();
  }

  updateDisplay() {
    const comboEl = document.getElementById('combo');
    if (comboEl) {
      if (this.combo > 0) {
        comboEl.textContent = `🔥 Combo x${this.combo}`;
        comboEl.style.opacity = '1';
        comboEl.classList.add('pulse');
      } else {
        comboEl.style.opacity = '0';
        comboEl.classList.remove('pulse');
      }
    }
  }

  getDisplay() {
    return `${this.combo > 0 ? `🔥 Combo x${this.combo}` : ''}`;
  }
}

const comboSystem = new ComboSystem();

// Système de statistiques de partie
class GameStats {
  constructor() {
    this.startTime = 0;
    this.pairs = 0;
    this.moves = 0;
    this.score = 0;
    this.bestScore = 0;
  }

  start() {
    this.startTime = Date.now();
    this.pairs = 0;
    this.moves = 0;
    this.score = 0;
  }

  recordPair() {
    this.pairs++;
    this.moves++;
  }

  recordMove() {
    this.moves++;
  }

  getElapsedSeconds() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  getAccuracy() {
    if (this.moves === 0) return 0;
    return Math.round((this.pairs * 2 / this.moves) * 100);
  }

  getStats() {
    return {
      time: this.getElapsedSeconds(),
      pairs: this.pairs,
      moves: this.moves,
      accuracy: this.getAccuracy(),
      score: this.score
    };
  }
}

const gameStats = new GameStats();

// Système de milestones et achievements
class MilestoneSystem {
  constructor() {
    this.milestones = {
      firstPair: { text: 'Première paire!', achieved: false },
      speedDemon: { text: '10 paires en 60s!', achieved: false },
      accuracyMaster: { text: 'Précision 95%!', achieved: false },
      comboKing: { text: 'Combo x10!', achieved: false },
      perfectRound: { text: 'Partie parfaite!', achieved: false }
    };
  }

  checkMilestones(gameState) {
    // Première paire
    if (gameState.pairs === 1 && !this.milestones.firstPair.achieved) {
      this.unlock('firstPair');
    }

    // Speed demon
    if (gameState.pairs >= 10 && gameState.getElapsedSeconds() <= 60 && !this.milestones.speedDemon.achieved) {
      this.unlock('speedDemon');
    }

    // Accuracy master
    if (gameState.pairs > 5 && gameState.getAccuracy() >= 95 && !this.milestones.accuracyMaster.achieved) {
      this.unlock('accuracyMaster');
    }

    // Combo king
    if (comboSystem.maxCombo >= 10 && !this.milestones.comboKing.achieved) {
      this.unlock('comboKing');
    }

    // Perfect round
    if (gameState.getAccuracy() === 100 && gameState.pairs > 10 && !this.milestones.perfectRound.achieved) {
      this.unlock('perfectRound');
    }
  }

  unlock(milestone) {
    if (this.milestones[milestone]) {
      this.milestones[milestone].achieved = true;
      const text = this.milestones[milestone].text;
      notificationSystem.milestone(text);
      audioSystem.powerUp();
    }
  }

  reset() {
    Object.keys(this.milestones).forEach(key => {
      this.milestones[key].achieved = false;
    });
  }
}

const milestoneSystem = new MilestoneSystem();

// Système de feedback visuel amélioré
class VisualFeedback {
  static showScorePopup(x, y, points) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${points}`;
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 800);
  }

  static highlightTile(tileElement) {
    tileElement.classList.add('highlight');
    setTimeout(() => tileElement.classList.remove('highlight'), 300);
  }

  static shakeTile(tileElement) {
    tileElement.style.animation = 'shake 0.3s';
    setTimeout(() => tileElement.style.animation = '', 300);
  }

  static showParticles(x, y, type = 'coins') {
    const particles = new ParticleSystem(document.body);
    particles.createParticles(x, y, type, 8);
  }
}

// Intégration des améliorations au système de jeu existant

// Hook sur le pick original
const originalGamePick = pick;
pick = function(id) {
  if (!game) return;

  const t = game.tiles.find(x => x.id === id);
  if (!t || t.removed || !freeTile(t, game.tiles)) {
    audioSystem.error();
    notificationSystem.warning('Tuile non disponible!');
    return;
  }

  if (game.selected === null) {
    game.selected = id;
    gameStats.recordMove();
    render();
    audioSystem.tileSelect();
    return;
  }

  if (game.selected === id) {
    game.selected = null;
    render();
    return;
  }

  const selected = game.tiles.find(x => x.id === game.selected);
  if (selected && selected.symbol === t.symbol) {
    // Match trouvé !
    audioSystem.tileMatch();
    game.selected = null;
    t.removed = selected.removed = true;
    game.pairs++;
    gameStats.recordPair();
    comboSystem.increment();

    // Particules et feedback
    const board = document.getElementById('board');
    if (board) {
      const particles = new ParticleSystem(document.body);
      const selEl = board.querySelector(`[data-id="${game.selected}"]`);
      const curEl = board.querySelector(`[data-id="${id}"]`);

      if (selEl) {
        const rect = selEl.getBoundingClientRect();
        particles.coinGain(rect.left + rect.width / 2, rect.top + rect.height / 2);
        VisualFeedback.showScorePopup(rect.left, rect.top, game.score);
      }
      if (curEl) {
        const rect = curEl.getBoundingClientRect();
        particles.coinGain(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }

    render();
  } else {
    // Pas de match
    audioSystem.error();
    comboSystem.reset();
    game.selected = null;
    render();
  }
};

// Hook sur la victoire
const originalGameWin = win;
win = function() {
  audioSystem.victory();
  comboSystem.reset();
  
  const stats = gameStats.getStats();
  notificationSystem.success(`Partie gagnée en ${stats.time}s!`);
  
  // Vérifier les milestones
  milestoneSystem.checkMilestones(gameStats);

  const board = document.getElementById('board');
  if (board) {
    const particles = new ParticleSystem(document.body);
    const rect = board.getBoundingClientRect();
    particles.celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  originalGameWin();
};

// Hook sur le nouveau jeu
const originalNewGame = newGame;
newGame = function(level) {
  gameStats.start();
  comboSystem.reset();
  milestoneSystem.checkMilestones(gameStats);
  originalNewGame(level);
};

// Afficher les stats de fin de partie
function displayGameStats() {
  const stats = gameStats.getStats();
  const statsText = `
    ⏱️ Temps: ${stats.time}s
    🎯 Paires: ${stats.pairs}
    🎪 Coups: ${stats.moves}
    📊 Précision: ${stats.accuracy}%
  `;
  
  notificationSystem.info(statsText);
}

// Initialiser le système au chargement
document.addEventListener('DOMContentLoaded', () => {
  // Créer l'élément de combo s'il n'existe pas
  if (!document.getElementById('combo')) {
    const comboEl = document.createElement('div');
    comboEl.id = 'combo';
    document.body.appendChild(comboEl);
  }

  // Support du bouton son
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.textContent = audioSystem.enabled ? '🔊' : '🔇';
    soundToggle.style.cursor = 'pointer';
    soundToggle.style.position = 'fixed';
    soundToggle.style.top = '20px';
    soundToggle.style.right = '20px';
    soundToggle.style.fontSize = '1.5rem';
    soundToggle.style.zIndex = '999';
    
    soundToggle.onclick = () => {
      const enabled = audioSystem.toggle();
      soundToggle.textContent = enabled ? '🔊' : '🔇';
      soundToggle.style.opacity = enabled ? '1' : '0.5';
    };
  }
});
