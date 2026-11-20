import test from 'node:test';
import assert from 'node:assert/strict';
import { UpdateSimulator } from '../src/simulator.js';
import { scenarios } from '../src/scenarios.js';
import { formatTime } from '../src/view.js';

for (const [index, scenario] of scenarios.entries()) {
  test(`${scenario.id} : fausses joies, recul, réussite et nouvelle installation`, () => {
    const sim = new UpdateSimulator(() => (index + 0.1) / scenarios.length);
    assert.equal(sim.snapshot().id, scenario.id);
    let previous = 0;
    let saw99 = false;
    let sawRollback = false;
    let sawSuccess = false;
    for (let i = 0; i < 1000 && sim.round === 1; i++) {
      sim.advance(0.1);
      const state = sim.snapshot();
      assert.ok(state.progress >= 0 && state.progress <= 100);
      saw99 ||= state.progress === 99;
      sawRollback ||= saw99 && state.progress < previous && state.completed === 0;
      sawSuccess ||= state.done && state.progress === 100;
      previous = state.progress;
    }
    assert.ok(saw99 && sawRollback && sawSuccess);
    assert.equal(sim.completed, 1);
    assert.equal(sim.baits, 2);
    assert.equal(sim.round, 2);
    assert.notEqual(sim.snapshot().id, scenario.id);
  });
}

test('Un grand pas ne perd aucun événement', () => {
  const sim = new UpdateSimulator(() => 0);
  sim.advance(600);
  assert.ok(sim.completed >= 10);
  assert.ok(sim.baits >= sim.completed * 2);
  assert.equal(sim.elapsed, 600);
});

test('Le redémarrage remet les compteurs à zéro', () => {
  const sim = new UpdateSimulator(() => 0);
  sim.advance(600);
  sim.reset();
  assert.equal(sim.round, 1);
  assert.equal(sim.snapshot().progress, 0);
  assert.equal(sim.completed, 0);
  assert.equal(sim.baits, 0);
});

test('Une durée invalide est rejetée', () => {
  const sim = new UpdateSimulator();
  for (const value of [-1, Infinity, NaN]) assert.throws(() => sim.advance(value), RangeError);
});

test('Formatage du temps réellement écoulé', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(65.9), '01:05');
  assert.equal(formatTime(3600), '60:00');
});

test('Le compte à rebours descend puis reste bloqué à une seconde', () => {
  const sim = new UpdateSimulator(() => 0);
  sim.advance(17);
  assert.equal(sim.snapshot().estimate, '3 secondes restantes');
  sim.advance(2);
  assert.equal(sim.snapshot().estimate, '1 seconde restante');
  sim.advance(4);
  assert.equal(sim.snapshot().estimate, '1 seconde restante');
  assert.equal(sim.snapshot().progress, 99);
});
