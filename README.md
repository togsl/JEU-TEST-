# Windows Update Simulator

Une parodie interactive de Windows Update. Des installations presque terminées, des secondes interminables, des retours en arrière et de nouvelles mises à jour au moment où tout semblait fini.

Aucune mise à jour réelle, aucun service externe, aucun accès aux fichiers personnels. La simulation est identifiable comme telle, et peut être interrompue à tout moment.

## Démarrer

Prérequis : Node.js 20 ou supérieur. Aucune dépendance à installer pour l'exécution.

```bash
npm start
```

Ouvrir http://127.0.0.1:8080. Pour arrêter le serveur : `Ctrl+C`. Le port peut être changé avec `PORT=8090 npm start`.

La page démarre automatiquement dans un écran inspiré de Windows 10 : fond bleu uni, cinq points animés et pourcentage en texte. Le menu « Simulation parodique · Options », en bas à droite, contient les compteurs et les commandes. Utiliser ×3 ou ×10 pour accélérer les plaisanteries, Pause pour interrompre l'installation, Recommencer pour remettre tous les compteurs à zéro. La progression s'interrompt si l'onglet n'est pas visible. Le temps écoulé mesure le temps réel de simulation active ; les estimations de fin sont fictives.

Pour créer une version HTML autonome, exécuter `npm run build` puis ouvrir `dist/windows-update.html` directement dans le navigateur, sans serveur.

## Organisation

```text
index.html                  Structure de la page
styles.css                  Apparence et animations
server.js                   Serveur local sans dépendance
scripts/build.js            Génération de la page HTML autonome
src/
  main.js                   Démarrage et commandes utilisateur
  scenarios.js              Scénarios, durées et plaisanteries
  simulator.js              Moteur indépendant de l'affichage
  view.js                   Actualisation du DOM
tests/                     Tests du moteur et des utilitaires
jsdoc.json                  Configuration de la documentation
.github/workflows/ci.yml    Intégration continue
```

Pour ajouter une plaisanterie ou une mise à jour, modifier `src/scenarios.js`. Chaque phase définit son titre, son pourcentage cible, sa durée et son message. Le moteur consomme ces phases dans l'ordre, puis sélectionne un autre scénario. Une installation ne peut pas être choisie deux fois de suite.

## Tests et documentation

```bash
npm test
npm run docs
```

La seconde commande télécharge JSDoc 4.0.4 via npm si nécessaire. La documentation HTML se trouve dans `docs/index.html`. Les commentaires JSDoc documentent les modules et les interfaces utiles ; ils ne répètent pas chaque ligne de code.

Sur chaque push ou pull request, GitHub Actions vérifie la syntaxe JavaScript, exécute les tests puis génère la documentation. Dans l'onglet Actions du dépôt, ouvrir une exécution réussie et télécharger l'artefact `documentation-jsdoc`. La publication GitHub Pages n'est pas activée automatiquement. La partie web peut être hébergée sur n'importe quel hébergeur statique en conservant l'arborescence de `src/`.

Projet parodique indépendant, sans affiliation avec Microsoft.
