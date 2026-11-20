/** @module simulator */
import { scenarios, interlude } from './scenarios.js';

/** Gère le déroulement des installations, indépendamment de l'interface. */
export class UpdateSimulator {
  /** @param {function(): number} [random=Math.random] Source aléatoire injectable pour les tests. */
  constructor(random = Math.random) {
    this.random = random;
    this.reset();
  }

  /** Rétablit l'état initial et choisit la première installation. */
  reset() {
    this.round = 0;
    this.completed = 0;
    this.baits = 0;
    this.elapsed = 0;
    this.progress = 0;
    this.scenario = null;
    this.nextRound();
  }

  nextRound() {
    const candidates = scenarios.filter(scenario => scenario !== this.scenario);
    this.scenario = candidates[Math.floor(this.random() * candidates.length)];
    this.round += 1;
    this.progress = 0;
    this.phases = [...this.scenario.phases, ...interlude(this.round)];
    this.phaseIndex = 0;
    this.startPhase();
  }

  startPhase() {
    this.phase = this.phases[this.phaseIndex];
    this.phaseElapsed = 0;
    this.startProgress = this.progress;
    if (this.phase.event === 'complete') this.completed += 1;
  }

  finishPhase() {
    if (this.phase.event === 'bait') this.baits += 1;
    this.phaseIndex += 1;
    if (this.phaseIndex === this.phases.length) this.nextRound();
    else this.startPhase();
  }

  /**
   * Avance l'installation en consommant les secondes, même si plusieurs phases sont traversées.
   * @param {number} seconds Durée simulée positive ou nulle.
   */
  advance(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) throw new RangeError('Durée invalide');
    this.elapsed += seconds;
    while (seconds > 0) {
      const step = Math.min(seconds, this.phase.seconds - this.phaseElapsed);
      this.phaseElapsed += step;
      seconds -= step;
      const ratio = Math.min(1, this.phaseElapsed / this.phase.seconds);
      // L'accélération initiale rend chaque dernière ligne droite plus crédible.
      const eased = 1 - (1 - ratio) ** 2;
      this.progress = this.startProgress + (this.phase.target - this.startProgress) * eased;
      if (this.phaseElapsed >= this.phase.seconds) {
        this.progress = this.phase.target;
        this.finishPhase();
      }
    }
  }

  displayedEstimate() {
    const countdown = /^(\d+) secondes? restantes?$/.exec(this.phase.estimate);
    if (!countdown) return this.phase.estimate;
    const remaining = Math.max(1, Number(countdown[1]) - Math.floor(this.phaseElapsed));
    return remaining === 1 ? '1 seconde restante' : `${remaining} secondes restantes`;
  }

  /** @returns {object} État courant, prêt à être affiché sans exposer les phases internes. */
  snapshot() {
    const rising = this.phase.target >= this.startProgress;
    const progress = rising ? Math.floor(this.progress) : Math.ceil(this.progress);
    return {
      round: this.round, id: this.scenario.id, name: this.scenario.name,
      title: this.phase.title, progress, estimate: this.displayedEstimate(),
      message: this.phase.message, done: this.phase.title === 'Mise à jour terminée !',
      completed: this.completed, baits: this.baits
    };
  }
}
