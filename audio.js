// 🎵 Système audio complet pour Mahjong Pirate
class AudioSystem {
  constructor() {
    this.audioContext = null;
    this.enabled = localStorage.getItem('mahjongAudioEnabled') !== 'false';
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioContext();
    } catch (e) {
      console.warn('AudioContext not supported');
      this.enabled = false;
    }
  }

  // Générer son synthétisé
  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  // Son de tuile sélectionnée
  tileSelect() {
    this.playTone(659, 0.1, 'sine', 0.3);
  }

  // Son de match (tuiles appairées)
  tileMatch() {
    this.playTone(880, 0.08, 'sine', 0.4);
    setTimeout(() => this.playTone(1047, 0.12, 'sine', 0.3), 100);
  }

  // Son de combo
  combo(level = 1) {
    const frequencies = [523, 659, 784, 988];
    const freq = frequencies[Math.min(level - 1, 3)];
    this.playTone(freq, 0.15, 'sine', 0.35);
  }

  // Son de victoire
  victory() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.35), i * 150);
    });
  }

  // Son de défaite
  defeat() {
    this.playTone(392, 0.15, 'sine', 0.3);
    setTimeout(() => this.playTone(329, 0.2, 'sine', 0.3), 150);
  }

  // Son de power-up
  powerUp() {
    this.playTone(1175, 0.1, 'sine', 0.3);
    setTimeout(() => this.playTone(1397, 0.15, 'sine', 0.3), 100);
  }

  // Son d'erreur
  error() {
    this.playTone(200, 0.1, 'sine', 0.2);
    setTimeout(() => this.playTone(150, 0.15, 'sine', 0.2), 100);
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('mahjongAudioEnabled', this.enabled);
    return this.enabled;
  }
}

// Initialiser le système audio global
const audioSystem = new AudioSystem();

// 🎬 Système de particules pour les animations
class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
  }

  createParticles(x, y, type = 'stars', count = 8) {
    const emojis = {
      stars: ['⭐', '✨', '💫'],
      coins: ['🪙', '💰', '✨'],
      gems: ['💎', '✨', '🌟'],
      fire: ['🔥', '💥', '⚡']
    };

    const symbols = emojis[type] || emojis.stars;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.fontSize = (1.2 + Math.random() * 0.8) + 'rem';
      particle.style.zIndex = 1000;

      const angle = (Math.PI * 2 * i) / count;
      const velocity = 3 + Math.random() * 4;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      this.container.appendChild(particle);

      const startTime = Date.now();
      const duration = 800 + Math.random() * 400;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        particle.style.transform = `translate(${vx * elapsed * 0.1}px, ${vy * elapsed * 0.1 - progress * progress * 50}px)`;
        particle.style.opacity = 1 - progress;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };

      animate();
    }
  }

  celebrate(x, y) {
    this.createParticles(x, y, 'stars', 12);
  }

  coinGain(x, y) {
    this.createParticles(x, y, 'coins', 8);
  }

  gemGain(x, y) {
    this.createParticles(x, y, 'gems', 6);
  }
}

// Améliorations intégrées au système de jeu existant
const originalPick = pick;
pick = function(id) {
  originalPick(id);
  audioSystem.tileSelect();
};

// Hook sur la victoire
const originalWin = win;
win = function() {
  audioSystem.victory();
  const board = document.getElementById('board');
  if (board) {
    const particles = new ParticleSystem(document.body);
    const rect = board.getBoundingClientRect();
    particles.celebrate(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
  originalWin();
};

// Hook sur la défaite
const originalShowDeadlock = showDeadlock;
showDeadlock = function() {
  audioSystem.error();
  originalShowDeadlock();
};

// Hook sur le match de tuiles
const originalPick2 = function(id) {
  if (!game) return;
  const t = game.tiles.find(x => x.id === id);
  if (!t || t.removed || !freeTile(t, game.tiles)) return;

  if (game.selected === null) {
    game.selected = id;
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
    
    // Animations de tuiles
    const board = document.getElementById('board');
    if (board) {
      const particles = new ParticleSystem(document.body);
      const selEl = board.querySelector(`[data-id="${game.selected}"]`);
      const curEl = board.querySelector(`[data-id="${id}"]`);
      
      if (selEl) {
        const rect = selEl.getBoundingClientRect();
        particles.coinGain(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      if (curEl) {
        const rect = curEl.getBoundingClientRect();
        particles.coinGain(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }

    // Combo
    if (game.combo > 0) {
      audioSystem.combo(Math.min(game.combo, 4));
    }
  }
};

// Intégrer le système de combo visible
function updateComboDisplay() {
  if (!game) return;
  const comboEl = document.getElementById('combo');
  if (comboEl) {
    if (game.combo > 0) {
      comboEl.textContent = `🔥 Combo x${game.combo}`;
      comboEl.style.opacity = '1';
      comboEl.classList.add('pulse');
    } else {
      comboEl.style.opacity = '0.3';
      comboEl.classList.remove('pulse');
    }
  }
}

// Support du toggle audio
document.addEventListener('DOMContentLoaded', () => {
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.onclick = () => {
      const enabled = audioSystem.toggle();
      soundToggle.textContent = enabled ? '🔊' : '🔇';
      soundToggle.style.opacity = enabled ? '1' : '0.5';
    };
  }
});
