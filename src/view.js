/** @module view */

/** Interface DOM du simulateur. */
export class UpdateView {
  constructor() {
    const ids = ['activity', 'package', 'title', 'percent', 'progress', 'estimate', 'message', 'completed', 'baits', 'elapsed', 'speed', 'pause', 'reset'];
    this.elements = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
    this.percentNumber = this.elements.percent.firstChild;
  }

  setText(id, value) {
    const element = this.elements[id];
    const text = String(value);
    if (element.textContent !== text) element.textContent = text;
  }

  /**
   * Actualise uniquement les informations qui ont changé.
   * @param {object} state État renvoyé par le simulateur.
   * @param {number} elapsed Durée réellement passée devant la simulation.
   * @param {boolean} paused Indique si la simulation est en pause.
   */
  render(state, elapsed, paused) {
    const { elements } = this;
    this.setText('package', `Mise à jour ${String(state.round).padStart(2, '0')} · ${state.id} · ${state.name}`);
    this.setText('title', state.title);
    this.setText('estimate', paused ? 'Simulation en pause' : state.estimate);
    this.setText('message', state.message);
    this.setText('completed', state.completed);
    this.setText('baits', state.baits);
    this.setText('elapsed', formatTime(elapsed));
    this.setText('pause', paused ? 'Reprendre' : 'Pause');
    elements.pause.setAttribute('aria-pressed', String(paused));
    if (this.percentNumber.nodeValue !== String(state.progress)) {
      this.percentNumber.nodeValue = String(state.progress);
      elements.progress.setAttribute('aria-valuenow', String(state.progress));
    }
    elements.activity.classList.toggle('done', state.done);
    elements.activity.classList.toggle('paused', paused);
  }
}

/** @param {number} seconds @returns {string} Durée au format minutes:secondes. */
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
}
