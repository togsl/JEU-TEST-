/** @module main */
import { UpdateSimulator } from './simulator.js';
import { UpdateView } from './view.js';

const simulator = new UpdateSimulator();
const view = new UpdateView();
const { speed, pause, reset } = view.elements;
let paused = false;
let elapsed = 0;
let lastTick = performance.now();

function render() {
  view.render(simulator.snapshot(), elapsed, paused);
}

function tick() {
  const now = performance.now();
  // Après un onglet inactif, ne pas sauter les rebondissements du scénario.
  const delta = Math.min((now - lastTick) / 1000, 0.25);
  lastTick = now;
  if (paused || document.hidden) return;
  elapsed += delta;
  simulator.advance(delta * Number(speed.value));
  render();
}

pause.addEventListener('click', () => {
  paused = !paused;
  lastTick = performance.now();
  render();
});

reset.addEventListener('click', () => {
  simulator.reset();
  paused = false;
  elapsed = 0;
  lastTick = performance.now();
  render();
});

render();
setInterval(tick, 100);
