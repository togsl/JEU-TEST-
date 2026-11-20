/** @module scenarios */

/**
 * @typedef {object} Phase
 * @property {string} title Titre affiché.
 * @property {number} target Pourcentage à atteindre.
 * @property {number} seconds Durée en secondes simulées.
 * @property {string} estimate Estimation volontairement mensongère.
 * @property {string} message Message de la phase.
 * @property {('bait'|'complete')} [event] Événement à la fin de la phase.
 */

function phase(title, target, seconds, estimate, message, event) {
  return { title, target, seconds, estimate, message, event };
}

const installing = 'Installation des mises à jour';
const finishing = 'Dernières vérifications';
const rollback = 'Annulation des modifications';
const almost = 'Moins d’une minute restante';

/** @type {Array<{id: string, name: string, phases: Phase[]}>} */
export const scenarios = [
  {
    id: 'KB000404', name: 'Correctif de stabilité',
    phases: [
      phase(installing, 76, 8, 'Environ 2 minutes restantes', 'Installation d’un correctif pour le correctif précédent.'),
      phase(installing, 97, 5, almost, 'Ça y est, le plus dur est derrière nous.'),
      phase(finishing, 99, 4, 'Encore quelques secondes…', 'Vous pouvez presque reprendre votre vie.'),
      phase(finishing, 99, 8, '3 secondes restantes', 'Vérification du bon fonctionnement de la vérification.', 'bait'),
      phase(rollback, 23, 4, 'Temps restant recalculé', 'Une virgule a été trouvée au mauvais endroit. Nous préférons recommencer.'),
      phase(installing, 94, 7, almost, 'Cette fois, promis, c’est la bonne.'),
      phase(finishing, 99, 4, '1 seconde restante', 'Demande de confirmation à un autre processus de confirmation.'),
      phase(finishing, 99, 5, 'Moins de 1 seconde restante', 'Cette seconde est actuellement en cours de négociation.', 'bait'),
      phase(finishing, 100, 3, 'Installation terminée', 'Contre toute attente, quelque chose a fonctionné.')
    ]
  },
  {
    id: 'KB271828', name: 'Optimisation des performances',
    phases: [
      phase(installing, 84, 7, 'Environ 1 minute restante', 'Téléchargement de davantage de lenteur pour améliorer les performances.'),
      phase(finishing, 99, 5, '5 secondes restantes', 'Nettoyage des fichiers temporaires qui seront recréés demain.'),
      phase(finishing, 99, 7, '1 seconde restante', 'La barre est prête. Le reste du système ne l’est pas.', 'bait'),
      phase('Préparation de la dernière étape', 62, 4, 'Une dernière étape', 'Le pourcentage précédent concernait seulement la préparation de la préparation.'),
      phase(installing, 98, 6, almost, 'Désactivation des optimisations installées par la mise à jour précédente.'),
      phase(finishing, 99, 3, '2 secondes restantes', 'Tout semble normal. Ce qui est inquiétant.'),
      phase(finishing, 99, 7, '2 secondes restantes', 'Nous recherchons une raison valable de vous faire attendre.', 'bait'),
      phase(finishing, 100, 2, 'Installation terminée', 'Votre ordinateur est désormais 0,03 % plus optimisé.')
    ]
  },
  {
    id: 'KB999999', name: 'Amélioration de l’expérience utilisateur',
    phases: [
      phase(installing, 91, 9, almost, 'Déplacement du bouton que vous aviez enfin appris à trouver.'),
      phase(finishing, 99, 5, '4 secondes restantes', 'Suppression d’options avancées pour simplifier votre expérience.'),
      phase(finishing, 99, 6, '4 secondes restantes', 'Les quatre dernières secondes sont particulièrement lourdes.', 'bait'),
      phase('Installation d’un composant requis', 12, 3, 'Encore un petit instant', 'Installation de la dépendance nécessaire pour installer la dépendance.'),
      phase(installing, 97, 8, almost, 'Nous avons ajouté un assistant pour désactiver l’assistant.'),
      phase(finishing, 99, 4, '1 seconde restante', 'Félicitations ! Vous êtes plus proche de la fin qu’au début.'),
      phase(finishing, 99, 8, '1 seconde restante (estimée)', 'Nous attendons l’autorisation du service chargé des autorisations.', 'bait'),
      phase(finishing, 100, 2, 'Installation terminée', 'Le bouton a finalement été remis à sa place initiale.')
    ]
  },
  {
    id: 'KB123456', name: 'Mise à jour de sécurité essentielle',
    phases: [
      phase(installing, 95, 8, almost, 'Correction d’une vulnérabilité permettant de terminer une mise à jour rapidement.'),
      phase(finishing, 99, 5, '3 secondes restantes', 'Toutes les conditions de réussite sont réunies.'),
      phase(finishing, 99, 6, '2 secondes restantes', 'Sauf une. Nous ne savons pas encore laquelle.', 'bait'),
      phase(rollback, 87, 3, 'Nouvelle tentative automatique', 'Notre système de sécurité a bloqué notre propre mise à jour.'),
      phase(installing, 99, 7, '1 seconde restante', 'Ajout de nous-mêmes à notre liste d’exceptions.'),
      phase(finishing, 99, 7, 'Toute dernière seconde', 'Contrôle de sécurité du contrôle de sécurité.', 'bait'),
      phase(finishing, 100, 2, 'Installation terminée', 'Vous êtes protégé contre les mises à jour trop rapides.')
    ]
  }
];

const nextMessages = [
  'Bonne nouvelle : cette mise à jour a installé la possibilité d’en installer une autre.',
  'Une mise à jour cumulative vient d’apparaître. Quelle coïncidence.',
  'Le gestionnaire de mises à jour doit maintenant se mettre à jour.',
  'Vous pensiez pouvoir partir ? Une mise à jour facultative obligatoire vous attend.'
];

/**
 * Ajoute une vraie fin, suivie d’une relance automatique.
 * @param {number} round Numéro de l’installation, à partir de 1.
 * @returns {Phase[]}
 */
export function interlude(round) {
  return [
    phase('Mise à jour terminée !', 100, 5, 'Tout est à jour', 'Merci pour votre patience. Vous pouvez enfin reprendre votre activité.', 'complete'),
    phase('Une nouvelle mise à jour est disponible', 100, 4, 'Installation automatique imminente', nextMessages[(round - 1) % nextMessages.length]),
    phase('Préparation de la prochaine installation', 0, 2, 'C’est reparti…', 'Nous avons bien reçu votre silence comme un accord.')
  ];
}
