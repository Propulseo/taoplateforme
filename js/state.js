/* ═══════════════════════════════════════════
   TAO — State Management (in-memory)
   Au refresh, tout repart de zero.
   Chaque action mute le state puis emet
   un evenement pour que l'UI se mette a jour.
   ═══════════════════════════════════════════ */

const state = JSON.parse(JSON.stringify(TAO_DATA));

// UI state (pas dans TAO_DATA)
state.ui = {
  pageActive: 'aujourdhui',
  sidebarCollapsed: false,
  focusModeActive: false,
  focusTacheId: null,
  focusMode: 'demo', // 'demo' (45s) ou 'real' (45min)
  todoVueActive: 'todo-aujourdhui',
  todoProjetActif: null,
};

/* ── Helper : trouver un todo par ID dans toutes les listes ── */
function findTodoById(id) {
  const flatLists = ['priorites', 'aujourdhui', 'ceSoir', 'enRetard', 'boite', 'enAttente', 'longTerme'];
  for (const name of flatLists) {
    const list = state.todos[name];
    if (!Array.isArray(list)) continue;
    const item = list.find(t => t.id === id);
    if (item) return { liste: name, item };
  }
  for (const group of state.todos.aVenir || []) {
    const item = group.items.find(t => t.id === id);
    if (item) return { liste: 'aVenir', item };
  }
  for (const projet of state.projets) {
    for (const section of ['enCours', 'aVenir', 'terminees', 'annulees']) {
      const item = projet.taches[section].find(t => t.id === id);
      if (item) return { liste: 'projet-' + section, item, projetId: projet.id };
    }
  }
  return null;
}

/* ═══════════════════════════════════════════
   ACTIONS (mutations centralisees)
   ═══════════════════════════════════════════ */

const actions = {

  cocherTache(tacheId) {
    const tache = state.taches.find(t => t.id === tacheId);
    if (!tache) return;
    const wasFait = tache.statut === 'fait';
    tache.statut = wasFait ? 'a-faire' : 'fait';
    if (!wasFait) {
      state.user.coins += 10;
      showToast('+10 Coins', 'coins');
    } else {
      state.user.coins = Math.max(0, state.user.coins - 10);
    }
    emit('tache-updated', tache);
    emit('coins-updated', state.user.coins);
  },

  cocherTodo(todoId) {
    const found = findTodoById(todoId);
    if (!found) return;
    found.item.fait = !found.item.fait;
    if (found.item.fait) {
      state.user.coins += 10;
      showToast('+10 Coins', 'coins');
    } else {
      state.user.coins = Math.max(0, state.user.coins - 10);
    }
    emit('todo-updated', found);
    emit('coins-updated', state.user.coins);
  },

  ajouterTodo(liste, titre, options) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const silent = options && options._silent;
    const item = Object.assign({ id: id, titre: titre, fait: false }, options || {});
    delete item._silent;
    if (state.todos[liste] && Array.isArray(state.todos[liste])) {
      state.todos[liste].push(item);
    }
    emit('todo-added', { liste: liste, item: item });
    if (!silent) showToast('Tache ajoutee', 'success');
    return item;
  },

  acheterItem(itemId) {
    const item = state.boutique.find(i => i.id === itemId);
    if (!item) return false;
    if (state.user.coins < item.prix) {
      showToast('Pas assez de Coins', 'error');
      return false;
    }
    state.user.coins -= item.prix;
    emit('coins-updated', state.user.coins);
    showToast(item.titre + ' debloque !', 'success');
    emit('achat', item);
    return true;
  },

  demarrerFocus(tacheId) {
    state.ui.focusModeActive = true;
    state.ui.focusTacheId = tacheId;
    emit('focus-started', tacheId);
  },

  terminerFocus() {
    const tacheId = state.ui.focusTacheId;
    state.ui.focusModeActive = false;
    state.ui.focusTacheId = null;
    if (tacheId) actions.cocherTache(tacheId);
    emit('focus-ended', tacheId);
  },

  abandonnerFocus() {
    state.ui.focusModeActive = false;
    state.ui.focusTacheId = null;
    emit('focus-ended', null);
  },

  envoyerMessage(texte) {
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const msg = { id: Date.now(), role: 'user', content: texte, timestamp: time };
    state.messages.push(msg);
    emit('message-sent', msg);
    return msg;
  },

  repondreTao(texte, capture) {
    const now = new Date();
    const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const msg = { id: Date.now() + 1, role: 'tao', content: texte, timestamp: time, capture: capture || null };
    state.messages.push(msg);
    emit('tao-replied', msg);
    return msg;
  },

  terminerBilan(reponses) {
    state.user.coins += 30;
    showToast('+30 Coins', 'coins');
    emit('coins-updated', state.user.coins);
    emit('bilan-termine', reponses);
  },
};

/* ═══════════════════════════════════════════
   LISTENERS GLOBAUX (sync UI persistante)
   ═══════════════════════════════════════════ */

on('coins-updated', function(coins) {
  var formatted = coins.toLocaleString();
  document.querySelectorAll('.header-coins-value').forEach(function(el) { el.textContent = formatted; });
  document.querySelectorAll('.coins-value').forEach(function(el) { el.textContent = formatted; });
  document.querySelectorAll('.recompenses-coins-value').forEach(function(el) { el.textContent = formatted; });
});

on('tache-updated', function(tache) {
  var card = document.querySelector('[data-tache-id="' + tache.id + '"]');
  if (!card) return;
  var checkbox = card.querySelector('.tache-checkbox');
  if (!checkbox) return;
  if (tache.statut === 'fait') {
    card.classList.add('faite');
    checkbox.classList.add('checked');
    checkbox.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    spawnConfetti(checkbox);
  } else {
    card.classList.remove('faite');
    checkbox.classList.remove('checked');
    checkbox.innerHTML = '';
  }
});
