/* ═══════════════════════════════════════════
   TAO — Messages contextuels
   Message d'accueil matinal + Celebration 3/3
   Ton : Direct, Malin, Allie, Discret.
   Jamais d'affirmation generique.
   ═══════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   1. MESSAGE D'ACCUEIL DU MATIN
   ══════════════════════════════════════════════ */

/**
 * Retourne le message d'accueil contextualise.
 * Priorite descendante : le premier match gagne.
 * @param {object} ctx - { premierJour, streak, hierScore, hier3sur3, hier2sur3, joursAbsence, jourSemaine }
 * @returns {string}
 */
function getMessageAccueil(ctx) {
  if (ctx.premierJour) return 'Premiere journee. Tao demarre avec toi.';
  if (ctx.streak >= 30) return ctx.streak + ' jours d\'affilee. Tu construis quelque chose.';
  if (ctx.streak >= 7) return ctx.streak + ' jours. Bon rythme.';
  if (ctx.hierScore >= 85) return 'Hier excellent. Aujourd\'hui ?';
  if (ctx.hier3sur3) return 'Hier 3/3. On continue.';
  if (ctx.hier2sur3) return 'Hier 2/3. Aujourd\'hui mieux.';
  if (ctx.joursAbsence >= 3) return 'De retour. On reprend ou on s\'etait arrete.';
  if (ctx.jourSemaine === 5) return 'Vendredi. Bilan ce soir.';
  if (ctx.jourSemaine === 1) return 'Nouvelle semaine. Quelles 3 taches ?';
  return 'Nouvelle journee. 3 taches.';
}

/**
 * Construit le contexte d'accueil a partir du state.
 * @returns {object} ctx
 */
function buildContexteAccueil() {
  var user = state.user;
  var hier = state.hier || {};
  var now = new Date();
  return {
    premierJour: user.joursActifs === 1,
    streak: user.streak || 0,
    hierScore: hier.score || 0,
    hier3sur3: hier.tachesFaites === 3,
    hier2sur3: hier.tachesFaites === 2,
    joursAbsence: hier.joursAbsence || 0,
    jourSemaine: now.getDay() === 0 ? 7 : now.getDay(), // 1=lundi ... 7=dimanche
  };
}

/**
 * Verifie si on est dans la fenetre d'affichage (5h-12h)
 */
function estMatinAccueil() {
  var h = new Date().getHours();
  return h >= 5 && h < 12;
}

/**
 * Affiche le message d'accueil dans la page Aujourd'hui.
 * Insere l'encart en haut, juste apres l'injection dans la section.
 */
function afficherMessageAccueil() {
  // Toujours afficher en prototype (bypass horaire si debug)
  if (!estMatinAccueil() && !state._debugForceAccueil) return;
  // Ne pas afficher si deja ferme cette session
  if (state._accueilFerme) return;

  var ctx = state._debugContexte || buildContexteAccueil();
  var message = getMessageAccueil(ctx);

  var encart = document.createElement('div');
  encart.className = 'message-accueil';
  encart.innerHTML = '<span class="message-accueil-text">' + message + '</span>' +
    '<button class="message-accueil-close" title="Fermer">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
    '</button>';

  // Insert en haut de page-aujourdhui
  var section = document.getElementById('page-aujourdhui');
  if (!section) return;
  var firstChild = section.firstChild;
  section.insertBefore(encart, firstChild);

  // Fermer au clic
  encart.querySelector('.message-accueil-close').addEventListener('click', function() {
    encart.classList.add('message-accueil-out');
    state._accueilFerme = true;
    setTimeout(function() { encart.remove(); }, 200);
  });
}

/* ══════════════════════════════════════════════
   2. CELEBRATION 3/3
   ══════════════════════════════════════════════ */

/**
 * Retourne le message de celebration 3/3.
 * Priorite descendante.
 * @param {object} ctx - { premier3sur3, streak, joursActifs }
 * @returns {string}
 */
function getMessage3sur3(ctx) {
  if (ctx.premier3sur3) return 'Premier 3/3. Bien.';
  if (ctx.streak >= 7) return '3/3. ' + ctx.streak + ' jours d\'affilee.';
  if (ctx.joursActifs < 7) return '3/3. Tu prends le rythme.';
  return '3/3. C\'est ca.';
}

/**
 * Construit le contexte celebration.
 */
function buildContexte3sur3() {
  return {
    premier3sur3: !state.user.aDejaFait3sur3,
    streak: state.user.streak || 0,
    joursActifs: state.user.joursActifs || 30,
  };
}

/**
 * Affiche la modal celebration 3/3.
 */
function afficherCelebration3sur3() {
  var ctx = buildContexte3sur3();
  var message = getMessage3sur3(ctx);

  // Marquer que l'utilisateur a deja fait un 3/3
  state.user.aDejaFait3sur3 = true;

  var modal = document.createElement('div');
  modal.className = 'celebration-3sur3';
  modal.innerHTML =
    '<div class="celebration-3sur3-content">' +
      '<img src="assets/fox/fox-action.svg" alt="Tao" class="celebration-fox">' +
      '<div class="celebration-message">' + message + '</div>' +
      '<div class="celebration-coins">+50 COINS</div>' +
    '</div>';

  document.body.appendChild(modal);

  // Animer le count-up coins
  requestAnimationFrame(function() {
    modal.classList.add('celebration-visible');
  });

  // Ajouter les coins
  state.user.coins += 50;
  emit('coins-updated', state.user.coins);

  // Auto-disparition apres 2.5s
  setTimeout(function() {
    modal.classList.remove('celebration-visible');
    modal.classList.add('celebration-out');
    setTimeout(function() { modal.remove(); }, 300);
  }, 2500);
}

/**
 * Verifie si les 3 taches du jour sont faites.
 * @returns {boolean}
 */
function toutesLesTachesFaites() {
  return state.taches.every(function(t) { return t.statut === 'fait'; });
}

/**
 * Compte le nombre de taches faites.
 * @returns {number}
 */
function nbTachesFaites() {
  return state.taches.filter(function(t) { return t.statut === 'fait'; }).length;
}

/* ══════════════════════════════════════════════
   3. LISTENER — Trigger celebration au 3/3
   ══════════════════════════════════════════════ */

var _celebration3sur3Done = false;

on('tache-updated', function() {
  if (_celebration3sur3Done) return;
  if (nbTachesFaites() === 3 && toutesLesTachesFaites()) {
    _celebration3sur3Done = true;
    // Petit delai pour laisser le confetti de la checkbox jouer
    setTimeout(afficherCelebration3sur3, 600);
  }
});

/* ══════════════════════════════════════════════
   4. DEBUG — Simulateurs pour le prototype
   ══════════════════════════════════════════════ */

/**
 * Injecte les boutons debug en haut de page.
 */
function initDebugMessages() {
  if (document.querySelector('.debug-messages-bar')) return;
  var bar = document.createElement('div');
  bar.className = 'debug-messages-bar';

  var scenarios = [
    { label: 'J1', ctx: { premierJour: true, streak: 0, hierScore: 0, hier3sur3: false, hier2sur3: false, joursAbsence: 0, jourSemaine: 3 } },
    { label: 'Streak 7', ctx: { premierJour: false, streak: 7, hierScore: 70, hier3sur3: false, hier2sur3: false, joursAbsence: 0, jourSemaine: 3 } },
    { label: 'Streak 30', ctx: { premierJour: false, streak: 34, hierScore: 80, hier3sur3: true, hier2sur3: false, joursAbsence: 0, jourSemaine: 3 } },
    { label: 'Hier 85+', ctx: { premierJour: false, streak: 5, hierScore: 91, hier3sur3: true, hier2sur3: false, joursAbsence: 0, jourSemaine: 3 } },
    { label: 'Hier 3/3', ctx: { premierJour: false, streak: 5, hierScore: 75, hier3sur3: true, hier2sur3: false, joursAbsence: 0, jourSemaine: 3 } },
    { label: 'Hier 2/3', ctx: { premierJour: false, streak: 5, hierScore: 60, hier3sur3: false, hier2sur3: true, joursAbsence: 0, jourSemaine: 3 } },
    { label: 'Reprise', ctx: { premierJour: false, streak: 0, hierScore: 0, hier3sur3: false, hier2sur3: false, joursAbsence: 5, jourSemaine: 3 } },
    { label: 'Vendredi', ctx: { premierJour: false, streak: 5, hierScore: 70, hier3sur3: false, hier2sur3: false, joursAbsence: 0, jourSemaine: 5 } },
    { label: 'Lundi', ctx: { premierJour: false, streak: 5, hierScore: 70, hier3sur3: false, hier2sur3: false, joursAbsence: 0, jourSemaine: 1 } },
    { label: 'Default', ctx: { premierJour: false, streak: 5, hierScore: 70, hier3sur3: false, hier2sur3: false, joursAbsence: 0, jourSemaine: 3 } },
  ];

  // Label
  var lbl = document.createElement('span');
  lbl.className = 'debug-label';
  lbl.textContent = 'Simuler matin:';
  bar.appendChild(lbl);

  scenarios.forEach(function(s) {
    var btn = document.createElement('button');
    btn.className = 'debug-btn';
    btn.textContent = s.label;
    btn.addEventListener('click', function() {
      // Remove existing accueil
      var existing = document.querySelector('.message-accueil');
      if (existing) existing.remove();
      state._accueilFerme = false;
      state._debugForceAccueil = true;
      state._debugContexte = s.ctx;
      afficherMessageAccueil();
    });
    bar.appendChild(btn);
  });

  // Separator
  var sep = document.createElement('span');
  sep.className = 'debug-sep';
  sep.textContent = '|';
  bar.appendChild(sep);

  // Reset taches button
  var resetBtn = document.createElement('button');
  resetBtn.className = 'debug-btn debug-btn-reset';
  resetBtn.textContent = 'Reset taches';
  resetBtn.addEventListener('click', function() {
    state.taches.forEach(function(t) { t.statut = 'a-faire'; });
    _celebration3sur3Done = false;
    // Re-render les checkboxes
    document.querySelectorAll('.tache-banniere-card').forEach(function(card) {
      card.classList.remove('faite', 'en-cours');
      var cb = card.querySelector('.tache-checkbox');
      if (cb) { cb.classList.remove('checked'); cb.innerHTML = ''; }
      var chrono = card.querySelector('.tache-banniere-chrono');
      if (chrono) { chrono.disabled = false; chrono.querySelector('span').textContent = '45 min'; }
    });
    emit('coins-updated', state.user.coins);
    showToast('Taches reinitialises', 'success');
  });
  bar.appendChild(resetBtn);

  // Celebration 3/3 test buttons
  var sep2 = document.createElement('span');
  sep2.className = 'debug-sep';
  sep2.textContent = '|';
  bar.appendChild(sep2);

  var lbl2 = document.createElement('span');
  lbl2.className = 'debug-label';
  lbl2.textContent = '3/3:';
  bar.appendChild(lbl2);

  var ctx3sur3 = [
    { label: '1er 3/3', setup: function() { state.user.aDejaFait3sur3 = false; state.user.joursActifs = 1; } },
    { label: 'Streak 7+', setup: function() { state.user.aDejaFait3sur3 = true; state.user.streak = 12; state.user.joursActifs = 30; } },
    { label: '<7 jours', setup: function() { state.user.aDejaFait3sur3 = true; state.user.streak = 3; state.user.joursActifs = 5; } },
    { label: 'Default', setup: function() { state.user.aDejaFait3sur3 = true; state.user.streak = 3; state.user.joursActifs = 30; } },
  ];

  ctx3sur3.forEach(function(c) {
    var btn = document.createElement('button');
    btn.className = 'debug-btn';
    btn.textContent = c.label;
    btn.addEventListener('click', function() {
      c.setup();
      afficherCelebration3sur3();
    });
    bar.appendChild(btn);
  });

  document.body.appendChild(bar);
}
