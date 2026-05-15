/* ═══════════════════════════════════════════
   TAO — Main JS
   Router (fetch), navigation, interactions
   ═══════════════════════════════════════════ */

/* ── Page cache (disabled on localhost) ── */
const _isDevMode = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const _pageCache = {};

async function fetchHTML(url) {
  if (!_isDevMode && _pageCache[url]) return _pageCache[url];
  const res = await fetch(url);
  const html = await res.text();
  if (!_isDevMode) _pageCache[url] = html;
  return html;
}

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSidebarToggle();
  initMobileToggle();
  initSidebarPolish();
  initHeaderPolish();

  // Global event delegation (works on any future DOM)
  initCheckboxes();
  initModals();
  initTodoSections();
  initTodoProjetSwitch();
  initTodoCheckboxes();
  initTodoInlineEdit();
  initTodoKanbanDragDrop();
  initTodoKeyboardShortcuts();
  initTodoFilters();
  initTodoFabDelegation();
  initTodoQuickAdd();
  initTodoAddedListener();

  // Load initial page from hash
  navigateTo(window.location.hash.slice(1) || 'aujourdhui');
});

/* ══════════════════════════════════════════════
   ROUTER — fetch + inject
   ══════════════════════════════════════════════ */

async function navigateTo(pageId) {
  const section = document.getElementById('page-' + pageId);
  if (!section) return;

  // Load page HTML (always re-fetch in dev mode)
  if (_isDevMode || !section.innerHTML.trim()) {
    const url = pageId === 'todo' ? 'pages/todo/index.html' : 'pages/' + pageId + '.html';
    section.innerHTML = await fetchHTML(url);
    await initPageContent(pageId);
  }

  // Toggle active sections
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  section.classList.add('active');

  // Update sidebar + bottom-nav highlights
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === pageId);
  });

  // Update header title
  const titles = {
    'aujourdhui': "Aujourd'hui", 'chat': 'Chat', 'todo': 'Todo',
    'semaine': 'Calendrier', 'trimestre': 'Trimestre', 'bilan': 'Bilan',
    'recompenses': 'Recompenses', 'reglages': 'Reglages',
  };
  const headerTitle = document.querySelector('.header-page-title');
  if (headerTitle) headerTitle.textContent = titles[pageId] || pageId;

  window.location.hash = pageId;
  document.querySelector('.sidebar')?.classList.remove('mobile-open');
}

/* ── Page-specific init after HTML injection ── */
async function initPageContent(pageId) {
  switch (pageId) {
    case 'aujourdhui':
      afficherMessageAccueil();
      initScoreRing();
      initRingPulse();
      initCountdown();
      initTacheDragReorder();
      initTacheSwipe();
      initDayTimelineNow();
      initBanniereObjectifs();
      initFocusButtons();
      initTacheMenus();
      initDebugMessages();
      break;
    case 'chat':
      initChatAutoScroll();
      initChatSlideIn();
      initChatReactions();
      initChatSend();
      break;
    case 'todo':
      initTodoSidebar();
      await loadTodoView('todo-aujourdhui');
      break;
    case 'semaine':
      initCalPageModeSwitch();
      break;
    case 'trimestre':
      initTrimestreProgress();
      initTrimestreMilestones();
      initTrimestreExpand();
      initTrimestreVelocity();
      initTrimestreActions();
      break;
    case 'recompenses':
      initTabs();
      initBadges();
      initCoinsCounter();
      initBoutique3D();
      initBoutiquePreview();
      initBoutiqueAcheter();
      initBadgeModals();
      initStreakCalendar();
      break;
    case 'reglages':
      initToggles();
      initDangerZone();
      initExportButton();
      initThemePreview();
      break;
    case 'bilan':
      initBilanSteps();
      initBilanAutoSave();
      initBilanSparklines();
      initBilanComparison();
      break;
  }
}

/* ══════════════════════════════════════════════
   TODO SUB-VIEWS
   ══════════════════════════════════════════════ */

const _todoViewMap = {
  'todo-aujourdhui': 'aujourdhui',
  'todo-pasurgent': 'pasurgent',
  'todo-attente': 'en-attente',
  'todo-projet': 'projet',
};

async function loadTodoView(viewId, projetId) {
  const container = document.getElementById('todo-main-content');
  if (!container) return;

  const fileName = _todoViewMap[viewId];
  if (!fileName) return;

  container.innerHTML = await fetchHTML('pages/todo/' + fileName + '.html');

  // Make the loaded view active
  const view = container.querySelector('.todo-view');
  if (view) view.classList.add('active');

  // If project view, load project data
  if (viewId === 'todo-projet' && projetId) {
    loadProjet(projetId);
  }

  // Re-init tabs if present
  initTabs();
}

/* ══════════════════════════════════════════════
   NAVIGATION (shell elements — init once)
   ══════════════════════════════════════════════ */

function initNavigation() {
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.page));
  });
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (page === 'plus') {
        document.querySelector('.plus-menu')?.classList.toggle('active');
      } else {
        navigateTo(page);
        document.querySelector('.plus-menu')?.classList.remove('active');
      }
    });
  });
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.slice(1);
    if (page) navigateTo(page);
  });
}

/* ── Sidebar toggle ── */
function initSidebarToggle() {
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.sidebar-toggle');
  const mobileToggle = document.querySelector('.header-mobile-toggle');
  if (toggle) toggle.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  if (mobileToggle) mobileToggle.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
}

/* ── Mobile toggle (from inline script) ── */
function initMobileToggle() {
  const mobileToggle = document.querySelector('.header-mobile-toggle');
  if (window.innerWidth <= 768 && mobileToggle) {
    mobileToggle.style.display = 'block';
  }
  window.addEventListener('resize', () => {
    if (mobileToggle) {
      mobileToggle.style.display = window.innerWidth <= 768 ? 'block' : 'none';
    }
  });
}

/* ══════════════════════════════════════════════
   GLOBAL EVENT DELEGATION (init once, works on future DOM)
   ══════════════════════════════════════════════ */

/* ── Checkboxes taches (page Aujourd'hui) — via state ── */
function initCheckboxes() {
  document.addEventListener('click', (e) => {
    const checkbox = e.target.closest('.tache-checkbox');
    if (!checkbox) return;
    // Taches du jour (page Aujourd'hui) : delegation au state
    const card = checkbox.closest('.tache-card[data-tache-id]');
    if (card) {
      const id = parseInt(card.dataset.tacheId);
      if (id) actions.cocherTache(id);
      return;
    }
    // Fallback : toggle CSS direct (pour todo items sans state)
    checkbox.classList.toggle('checked');
    const parentCard = checkbox.closest('.tache-card');
    if (checkbox.classList.contains('checked')) {
      parentCard?.classList.add('faite');
      checkbox.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      showToast('+10 Coins', 'coins');
      spawnConfetti(checkbox);
    } else {
      parentCard?.classList.remove('faite');
      checkbox.innerHTML = '';
    }
  });
}

/* ── Modals ── */
function initModals() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal]');
    if (!trigger) return;
    const modal = document.getElementById(trigger.dataset.modal);
    if (modal) {
      modal.classList.add('active');
      const input = modal.querySelector('input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) e.target.classList.remove('active');
    const closeBtn = e.target.closest('.modal-close');
    if (closeBtn) closeBtn.closest('.modal-overlay')?.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
  });
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('.todo-quickadd-chip');
    if (!chip) return;
    const row = chip.closest('.todo-quickadd-row');
    if (!row) return;
    row.querySelectorAll('.todo-quickadd-chip').forEach(c => c.classList.remove('selected'));
    chip.classList.add('selected');
  });
}

/* ── FAB (delegation so it works after todo shell loads) ── */
function initTodoFabDelegation() {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#todo-fab-btn')) return;
    const modal = document.getElementById('modal-add-todo');
    if (modal) {
      modal.classList.add('active');
      const input = modal.querySelector('.todo-quickadd-input');
      if (input) setTimeout(() => input.focus(), 100);
    }
  });
}

/* ══════════════════════════════════════════════
   PAGE-SPECIFIC INITS (called after page load)
   ══════════════════════════════════════════════ */

/* ── ScoreRing animation ── */
function initScoreRing() {
  const rings = document.querySelectorAll('.score-ring .ring-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ring = entry.target;
        const pct = parseFloat(ring.dataset.percent) || 0;
        const circ = parseFloat(ring.getAttribute('stroke-dasharray'));
        ring.style.strokeDashoffset = circ - (circ * pct / 100);
        observer.unobserve(ring);
      }
    });
  });
  rings.forEach(ring => {
    ring.style.strokeDashoffset = parseFloat(ring.getAttribute('stroke-dasharray'));
    observer.observe(ring);
  });
}

/* ── Tabs ── */
function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll('.tab');
    const parentSection = tabGroup.closest('.page-section') || tabGroup.parentElement;
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        if (parentSection) {
          parentSection.querySelectorAll('.tab-content').forEach(tc => {
            tc.classList.toggle('active', tc.dataset.tabContent === target);
          });
        }
      });
    });
  });
}

/* ── Badges (from inline script) ── */
function initBadges() {
  const grid = document.getElementById('badges-grid');
  if (!grid || grid.children.length > 0) return;
  state.badges.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge-card' + (b.debloque ? ' debloque' : ' verrouille');
    div.innerHTML = `
      <div class="badge-icon">${b.icon}</div>
      <div class="badge-nom">${b.nom}</div>
      <div class="badge-desc">${b.debloque ? b.description : (b.condition || b.description)}</div>
      ${!b.debloque ? '<div class="badge-lock">&#x1f512;</div>' : '<div class="badge-coins">+' + b.coins + ' Coins</div>'}
    `;
    grid.appendChild(div);
  });
}

/* ── Settings toggles (from inline script) ── */
function initToggles() {
  document.querySelectorAll('#page-reglages .toggle').forEach(t => {
    t.addEventListener('click', () => {
      t.classList.toggle('active');
      t.classList.add('bouncing');
      t.addEventListener('animationend', () => t.classList.remove('bouncing'), { once: true });
      showSettingsToast(t.classList.contains('active') ? 'Active' : 'Desactive');
    });
  });
}

/* ── Bilan step flow — +30 Coins via state ── */
function initBilanSteps() {
  const steps = [...document.querySelectorAll('.bilan-step')];
  const reponses = {};
  steps.forEach((step, i) => {
    const btn = step.querySelector('.btn-primary');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const textarea = step.querySelector('.bilan-textarea');
      if (textarea) reponses['step' + (i + 1)] = textarea.value;

      step.classList.add('slide-out');
      setTimeout(() => {
        step.style.display = 'none';
        step.classList.remove('slide-out', 'active');
        if (i + 1 < steps.length) {
          steps[i + 1].style.display = 'block';
          steps[i + 1].classList.add('active', 'slide-in-active');
        } else {
          actions.terminerBilan(reponses);
          showBilanQuote();
        }
      }, 300);
    });
  });
}

/* ══════════════════════════════════════════════
   TODO PAGE
   ══════════════════════════════════════════════ */

/* ── Todo sidebar navigation (init after todo shell loads) ── */
function initTodoSidebar() {
  const todoSection = document.getElementById('page-todo');
  if (!todoSection) return;

  todoSection.querySelectorAll('.todo-sidebar-item').forEach(item => {
    item.addEventListener('click', async () => {
      todoSection.querySelectorAll('.todo-sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const viewId = item.dataset.todoView;
      state.ui.todoVueActive = viewId;
      state.ui.todoProjetActif = item.dataset.projetId || null;
      await loadTodoView(viewId, item.dataset.projetId);
    });
  });
}

/* ── Todo section accordeons (delegation) ── */
function initTodoSections() {
  document.addEventListener('click', (e) => {
    const header = e.target.closest('.todo-section-header');
    if (!header) return;
    header.classList.toggle('collapsed');
  });
}

/* ── Projet view switch (delegation) ── */
function initTodoProjetSwitch() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.todo-view-switch-btn');
    if (!btn || btn.classList.contains('disabled')) return;
    const vue = btn.dataset.projetVue;
    if (!vue) return;

    btn.closest('.todo-view-switch').querySelectorAll('.todo-view-switch-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
    });

    const liste = document.getElementById('todo-projet-liste');
    const kanban = document.getElementById('todo-projet-kanban');
    const calendrier = document.getElementById('todo-projet-calendrier');

    if (vue === 'liste') {
      liste?.classList.remove('hidden');
      kanban?.classList.remove('active');
      calendrier?.classList.remove('active');
    } else if (vue === 'kanban') {
      liste?.classList.add('hidden');
      kanban?.classList.add('active');
      calendrier?.classList.remove('active');
    } else if (vue === 'calendrier') {
      liste?.classList.add('hidden');
      kanban?.classList.remove('active');
      calendrier?.classList.add('active');
    }
  });

  // Calendar mode switch (daily / weekly / monthly)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.todo-cal-mode-btn');
    if (!btn) return;
    const mode = btn.dataset.calMode;
    if (!mode) return;

    btn.closest('.todo-cal-mode-switch').querySelectorAll('.todo-cal-mode-btn').forEach(b => {
      b.classList.toggle('active', b === btn);
    });

    const daily = document.getElementById('cal-daily');
    const weekly = document.getElementById('cal-weekly');
    const monthly = document.getElementById('cal-monthly');

    daily?.classList.toggle('active', mode === 'daily');
    weekly?.classList.toggle('active', mode === 'weekly');
    monthly?.classList.toggle('active', mode === 'monthly');
  });
}

/* ── Checkbox animation (delegation) — coins via state ── */
function initTodoCheckboxes() {
  document.addEventListener('click', (e) => {
    const checkbox = e.target.closest('.todo-checkbox');
    if (!checkbox) return;
    if (checkbox.closest('.todo-priorities')) return;
    if (checkbox.closest('.todo-section-done')) return;
    // Skip tache-card checkboxes (handled by initCheckboxes)
    if (checkbox.closest('.tache-card')) return;

    const item = checkbox.closest('.todo-item');
    if (item && item.closest('.todo-section-done')) return;

    const wasChecked = checkbox.classList.contains('checked');
    checkbox.classList.toggle('checked');

    if (!wasChecked) {
      checkbox.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>';
      item?.classList.add('checking-out');
      // Update state coins
      state.user.coins += 10;
      emit('coins-updated', state.user.coins);
      showToast('+10 Coins', 'coins');
      setTimeout(() => {
        item?.classList.remove('checking-out');
        item?.classList.add('fait');
      }, 400);
    } else {
      item?.classList.remove('fait', 'checking-out');
      checkbox.innerHTML = '';
      state.user.coins = Math.max(0, state.user.coins - 10);
      emit('coins-updated', state.user.coins);
    }
  });
}

/* ── Inline edit (delegation) ── */
function initTodoInlineEdit() {
  document.addEventListener('dblclick', (e) => {
    const titre = e.target.closest('.todo-item-titre');
    if (!titre) return;
    if (titre.closest('.todo-priorities')) return;
    if (titre.closest('.todo-section-done')) return;
    if (titre.contentEditable === 'true') return;

    titre.contentEditable = 'true';
    titre.focus();

    const range = document.createRange();
    range.selectNodeContents(titre);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const finish = () => {
      titre.contentEditable = 'false';
      titre.removeEventListener('blur', finish);
    };

    titre.addEventListener('blur', finish);
    titre.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') { ev.preventDefault(); titre.blur(); }
      if (ev.key === 'Escape') { titre.blur(); }
    });
  });
}

/* ── Kanban drag & drop (delegation) ── */
function initTodoKanbanDragDrop() {
  document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.todo-kanban-card');
    if (!card) return;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  });

  document.addEventListener('dragend', (e) => {
    const card = e.target.closest('.todo-kanban-card');
    if (card) card.classList.remove('dragging');
    document.querySelectorAll('.todo-kanban-column.drag-over').forEach(c => c.classList.remove('drag-over'));
  });

  document.addEventListener('dragover', (e) => {
    const col = e.target.closest('.todo-kanban-column');
    if (!col) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    col.classList.add('drag-over');
  });

  document.addEventListener('dragleave', (e) => {
    const col = e.target.closest('.todo-kanban-column');
    if (col && !col.contains(e.relatedTarget)) col.classList.remove('drag-over');
  });

  document.addEventListener('drop', (e) => {
    const col = e.target.closest('.todo-kanban-column');
    if (!col) return;
    e.preventDefault();
    col.classList.remove('drag-over');

    const dragging = document.querySelector('.todo-kanban-card.dragging');
    if (!dragging) return;

    const afterEl = getDragAfterElement(col, e.clientY);
    if (afterEl) {
      col.insertBefore(dragging, afterEl);
    } else {
      col.appendChild(dragging);
    }
    dragging.classList.remove('dragging');
    updateKanbanCounts();
  });

  // Make kanban cards draggable
  const observer = new MutationObserver(() => {
    document.querySelectorAll('.todo-kanban-card').forEach(card => {
      card.draggable = true;
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.todo-kanban-card').forEach(card => card.draggable = true);
}

function getDragAfterElement(column, y) {
  const cards = [...column.querySelectorAll('.todo-kanban-card:not(.dragging)')];
  let closest = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  cards.forEach(card => {
    const box = card.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closest = card;
    }
  });

  return closest;
}

function updateKanbanCounts() {
  document.querySelectorAll('.todo-kanban-column').forEach(col => {
    const header = col.querySelector('.todo-kanban-column-header');
    const count = col.querySelectorAll('.todo-kanban-card').length;
    const span = header?.querySelector('span');
    if (span) span.textContent = '(' + count + ')';
  });
}

/* ── Keyboard shortcuts (delegation) ── */
function initTodoKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const todoPage = document.getElementById('page-todo');
    if (!todoPage || !todoPage.classList.contains('active')) return;
    if (e.target.isContentEditable || e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key.toLowerCase()) {
      case 'n':
        e.preventDefault();
        const modal = document.getElementById('modal-add-todo');
        if (modal) {
          modal.classList.add('active');
          const input = modal.querySelector('.todo-quickadd-input');
          if (input) setTimeout(() => input.focus(), 100);
        }
        break;

      case '/':
        e.preventDefault();
        const filterAll = document.querySelector('.todo-filter-btn.filter-all');
        if (filterAll) filterAll.focus();
        break;

      case 'j':
        e.preventDefault();
        navigateTodoItems(1);
        break;

      case 'k':
        e.preventDefault();
        navigateTodoItems(-1);
        break;

      case 'x':
        e.preventDefault();
        const focused = document.querySelector('.todo-item.kbd-focused');
        if (focused) {
          const cb = focused.querySelector('.todo-checkbox');
          if (cb && !focused.closest('.todo-priorities') && !focused.closest('.todo-section-done')) {
            cb.click();
          }
        }
        break;
    }
  });
}

let kbdFocusedIndex = -1;
function navigateTodoItems(dir) {
  const activeView = document.querySelector('.todo-view.active');
  if (!activeView) return;
  const items = [...activeView.querySelectorAll('.todo-item:not(.filtered-out)')];
  if (!items.length) return;

  document.querySelectorAll('.todo-item.kbd-focused').forEach(i => i.classList.remove('kbd-focused'));

  kbdFocusedIndex += dir;
  if (kbdFocusedIndex < 0) kbdFocusedIndex = 0;
  if (kbdFocusedIndex >= items.length) kbdFocusedIndex = items.length - 1;

  const target = items[kbdFocusedIndex];
  target.classList.add('kbd-focused');
  target.style.background = 'var(--surface)';
  target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/* ── Filtre par pilier (delegation) ── */
function initTodoFilters() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.todo-filter-btn');
    if (!btn) return;

    const filterBar = btn.closest('.todo-filter-bar');
    if (!filterBar) return;

    const wasActive = btn.classList.contains('active');
    filterBar.querySelectorAll('.todo-filter-btn').forEach(b => b.classList.remove('active'));

    let filterPilier = null;
    if (!wasActive) {
      btn.classList.add('active');
      filterPilier = btn.dataset.filterPilier;
    } else {
      const allBtn = filterBar.querySelector('.filter-all');
      if (allBtn) allBtn.classList.add('active');
    }

    const view = btn.closest('.todo-view');
    if (!view) return;

    view.querySelectorAll('.todo-item').forEach(item => {
      if (!filterPilier || filterPilier === 'all') {
        item.classList.remove('filtered-out');
        return;
      }
      const tag = item.querySelector('.todo-item-tag');
      if (!tag) {
        item.classList.remove('filtered-out');
        return;
      }
      const hasPilier = tag.classList.contains('tag-' + filterPilier);
      item.classList.toggle('filtered-out', !hasPilier);
    });
  });
}

/* ── Quick-add modal → state ── */
function initTodoQuickAdd() {
  const modal = document.getElementById('modal-add-todo');
  if (!modal) return;

  const input = modal.querySelector('.todo-quickadd-input');
  const addBtn = modal.querySelector('.btn-primary');
  if (!input || !addBtn) return;

  function getSelectedChip(label) {
    const rows = modal.querySelectorAll('.todo-quickadd-row');
    for (const row of rows) {
      if (row.querySelector('.todo-quickadd-row-label')?.textContent === label) {
        const sel = row.querySelector('.todo-quickadd-chip.selected');
        return sel ? sel.textContent.trim() : null;
      }
    }
    return null;
  }

  function submit() {
    const titre = input.value.trim();
    if (!titre) return;

    const quand = getSelectedChip('Quand') || "Aujourd'hui";
    const pilier = (getSelectedChip('Pilier') || 'taff').toLowerCase();

    // Map "Quand" to state list
    const listeMap = { "Aujourd'hui": 'aujourdhui', 'Demain': 'aujourdhui', 'Cette semaine': 'aujourdhui', 'Date...': 'aujourdhui' };
    const liste = listeMap[quand] || 'aujourdhui';

    actions.ajouterTodo(liste, titre, { pilier: pilier });

    input.value = '';
    modal.classList.remove('active');
  }

  addBtn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); submit(); }
  });
}

/* ── Inject new todos into active view ── */
function initTodoAddedListener() {
  on('todo-added', (data) => {
    const container = document.getElementById('todo-main-content');
    if (!container) return;

    // Find the active todo-list in the current view
    const activeView = container.querySelector('.todo-view.active, .todo-view');
    if (!activeView) return;

    // Find the first .todo-list that is not in priorities or done section
    let list = activeView.querySelector('.todo-section-body .todo-list');
    if (!list) list = activeView.querySelector('.todo-list');
    if (!list) return;

    const pilierTag = data.item.pilier
      ? '<span class="todo-item-tag tag-' + data.item.pilier + '">' + data.item.pilier.charAt(0).toUpperCase() + data.item.pilier.slice(1) + '</span>'
      : '';

    const newItem = document.createElement('div');
    newItem.className = 'todo-item todo-item-new';
    newItem.innerHTML = '<div class="todo-checkbox"></div>'
      + '<div class="todo-item-content"><span class="todo-item-titre">' + escapeHTML(data.item.titre) + '</span></div>'
      + '<div class="todo-item-right">' + pilierTag
      + '<span class="todo-item-menu"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></span></div>';

    list.prepend(newItem);

    // Update count in sidebar
    updateTodoSidebarCounts();
  });
}

/* ── Update sidebar counts ── */
function updateTodoSidebarCounts() {
  const counts = {
    'todo-aujourdhui': (state.todos.priorites?.length || 0) + (state.todos.aujourdhui?.length || 0) + (state.todos.ceSoir?.length || 0) + (state.todos.enRetard?.length || 0),
    'todo-pasurgent': (state.todos.boite?.length || 0) + (state.todos.longTerme?.length || 0),
    'todo-attente': state.todos.enAttente?.length || 0,
  };
  for (const [viewId, count] of Object.entries(counts)) {
    const item = document.querySelector('[data-todo-view="' + viewId + '"] .todo-sidebar-count');
    if (item) item.textContent = count;
  }
}

/* ── Load project ── */
function loadProjet(projetId) {
  const projet = state.projets.find(p => p.id === projetId);
  if (!projet) return;

  const titreEl = document.getElementById('todo-projet-titre');
  const metaEl = document.getElementById('todo-projet-meta');
  const pilierLabel = { taff: 'Taff', vie: 'Vie', perso: 'Perso' };

  if (titreEl) titreEl.textContent = projet.nom;
  if (metaEl) {
    metaEl.textContent = (pilierLabel[projet.pilier] || projet.pilier) +
      ' - ' + projet.tachesFaites + '/' + projet.tachesTotal + ' taches' +
      ' - Echeance : J-' + projet.joursRestants;
  }

  const tagClass = 'tag-' + projet.pilier;
  const label = pilierLabel[projet.pilier];

  buildProjetList('projet-encours-list', 'projet-encours-count', projet.taches.enCours, tagClass, label);
  buildProjetList('projet-avenir-list', 'projet-avenir-count', projet.taches.aVenir, tagClass, label);
  buildProjetDoneList('projet-done-list', 'projet-done-count', projet.taches.terminees);
  buildProjetKanban(projet, tagClass, label);

  document.getElementById('todo-projet-liste')?.classList.remove('hidden');
  document.getElementById('todo-projet-kanban')?.classList.remove('active');
  document.querySelectorAll('.todo-view-switch-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.projetVue === 'liste');
  });
}

function buildProjetList(listId, countId, items, tagClass, pilierLabel) {
  const list = document.getElementById(listId);
  const countEl = document.getElementById(countId);
  if (!list) return;
  if (countEl) countEl.textContent = '(' + items.length + ')';
  list.innerHTML = items.map(t => `
    <div class="todo-item">
      <div class="todo-checkbox"></div>
      <div class="todo-item-content"><span class="todo-item-titre">${t.titre}</span></div>
      <div class="todo-item-right">
        ${t.date ? '<span class="todo-item-time">' + t.date + '</span>' : ''}
        <span class="todo-item-tag ${tagClass}">${pilierLabel}</span>
        <span class="todo-item-menu"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></span>
      </div>
    </div>`).join('');
}

function buildProjetDoneList(listId, countId, items) {
  const list = document.getElementById(listId);
  const countEl = document.getElementById(countId);
  if (!list) return;
  if (countEl) countEl.textContent = '(' + items.length + ')';
  list.innerHTML = items.map(t => `
    <div class="todo-item fait">
      <div class="todo-checkbox checked"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
      <div class="todo-item-content"><span class="todo-item-titre">${t.titre}</span></div>
    </div>`).join('');
}

function buildProjetKanban(projet, tagClass, pilierLabel) {
  const kanban = document.getElementById('todo-projet-kanban');
  if (!kanban) return;

  const makeCard = (t) => `
    <div class="todo-kanban-card" draggable="true">
      <div class="todo-kanban-card-title">${t.titre}</div>
      <div class="todo-kanban-card-footer">
        <span class="todo-item-tag ${tagClass}">${pilierLabel}</span>
        ${t.date ? '<span class="todo-kanban-card-date">' + t.date + '</span>' : ''}
      </div>
    </div>`;

  const cols = [
    { title: 'A faire', items: projet.taches.aVenir },
    { title: 'En cours', items: projet.taches.enCours },
    { title: 'Fait', items: projet.taches.terminees },
    { title: 'Annule', items: projet.taches.annulees },
  ];

  kanban.innerHTML = cols.map(col => `
    <div class="todo-kanban-column">
      <div class="todo-kanban-column-header">${col.title} <span>(${col.items.length})</span></div>
      ${col.items.map(makeCard).join('')}
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   UTILITIES
   ══════════════════════════════════════════════ */

function showCoinToast(text) {
  showToast(text, 'coins');
}

function getPilierIcon(pilier) {
  const icons = {
    taff: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    vie: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    perso: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
  };
  return icons[pilier] || '';
}

/* ══════════════════════════════════════════════
   UX IMPROVEMENTS — 35 features across 7 pages
   ══════════════════════════════════════════════ */

/* ── Confetti particles ── */
function spawnConfetti(origin) {
  const rect = origin.getBoundingClientRect();
  const colors = ['#3DFF70', '#FFB800', '#FF4444', '#4488FF', '#FF44FF'];
  for (let i = 0; i < 12; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = (rect.left + rect.width / 2 + (Math.random() - 0.5) * 60) + 'px';
    piece.style.top = rect.top + 'px';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
    piece.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

/* ── Aujourd'hui: Ring pulse glow on load ── */
function initRingPulse() {
  const ring = document.querySelector('.score-ring');
  if (ring) {
    setTimeout(() => ring.classList.add('pulse-active'), 500);
    setTimeout(() => ring.classList.remove('pulse-active'), 2500);
  }
}

/* ── Aujourd'hui: Countdown timer on en-cours task ── */
function initCountdown() {
  const enCours = document.querySelector('.tache-card.en-cours');
  if (!enCours) return;
  const meta = enCours.querySelector('.tache-meta span');
  if (!meta) return;
  const match = meta.textContent.match(/(\d{1,2}):(\d{2})\s*(?:→|->)\s*(\d{1,2}):(\d{2})/);
  if (!match) return;

  const endH = parseInt(match[3]), endM = parseInt(match[4]);
  const countdown = document.createElement('span');
  countdown.className = 'tache-countdown';
  enCours.querySelector('.tache-card-header').appendChild(countdown);

  function tick() {
    const now = new Date();
    const end = new Date();
    end.setHours(endH, endM, 0);
    const diff = end - now;
    if (diff <= 0) { countdown.textContent = 'Termine'; return; }
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    countdown.textContent = mins + ':' + String(secs).padStart(2, '0');
    requestAnimationFrame(tick);
  }
  tick();
}

/* ── Aujourd'hui: Drag to reorder task cards ── */
function initTacheDragReorder() {
  const main = document.querySelector('.aujourdhui-main');
  if (!main) return;
  main.querySelectorAll('.tache-card').forEach(card => {
    card.draggable = true;
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = main.querySelector('.tache-card.dragging');
      if (dragging && dragging !== card) {
        const rect = card.getBoundingClientRect();
        if (e.clientY < rect.top + rect.height / 2) main.insertBefore(dragging, card);
        else main.insertBefore(dragging, card.nextSibling);
      }
    });
  });
}

/* ── Aujourd'hui: Swipe left to complete (mobile) ── */
function initTacheSwipe() {
  document.querySelectorAll('.tache-card').forEach(card => {
    let startX = 0, currentX = 0;
    card.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; currentX = startX; });
    card.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (diff < 0 && diff > -100) card.style.transform = 'translateX(' + diff + 'px)';
    });
    card.addEventListener('touchend', () => {
      if (currentX - startX < -60) {
        const cb = card.querySelector('.tache-checkbox');
        if (cb && !cb.classList.contains('checked')) cb.click();
      }
      card.style.transform = '';
    });
  });
}

/* ── Aujourd'hui: Now-line on day timeline ── */
function initDayTimelineNow() {
  const lanes = document.querySelector('.day-tl-lanes');
  if (!lanes) return;
  const now = new Date();
  const hour = now.getHours(), min = now.getMinutes();
  if (hour < 8 || hour >= 19) return;
  const pct = ((hour - 8) * 60 + min) / (11 * 60) * 100;
  const line = document.createElement('div');
  line.className = 'day-tl-now';
  line.style.top = pct + '%';
  lanes.appendChild(line);
}

/* ── Chat: Auto-scroll to bottom ── */
function initChatAutoScroll() {
  const messages = document.querySelector('.chat-messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}

/* ── Chat: Slide-in animation on bubbles ── */
function initChatSlideIn() {
  document.querySelectorAll('.chat-bubble, .chat-capture-card').forEach((el, i) => {
    el.style.opacity = '0';
    setTimeout(() => { el.style.opacity = ''; el.classList.add('slide-in'); }, i * 80);
  });
}

/* ── Chat: Double-click to react ── */
function initChatReactions() {
  document.querySelectorAll('.chat-bubble').forEach(bubble => {
    bubble.addEventListener('dblclick', () => {
      let reactions = bubble.nextElementSibling;
      if (!reactions || !reactions.classList.contains('chat-reactions')) {
        reactions = document.createElement('div');
        reactions.className = 'chat-reactions';
        bubble.after(reactions);
      }
      const existing = reactions.querySelector('[data-emoji="thumbsup"]');
      if (existing) {
        existing.remove();
        if (!reactions.children.length) reactions.remove();
      } else {
        const btn = document.createElement('span');
        btn.className = 'chat-reaction';
        btn.dataset.emoji = 'thumbsup';
        btn.innerHTML = '\uD83D\uDC4D <span class="chat-reaction-count">1</span>';
        reactions.appendChild(btn);
      }
    });
  });
}

/* ── Chat: Send messages — state + tao-responses + typing ── */
function initChatSend() {
  const input = document.querySelector('.chat-input');
  const sendBtn = document.querySelector('.chat-send-btn');
  const messages = document.querySelector('.chat-messages');
  const typing = document.getElementById('chat-typing');
  if (!input || !sendBtn || !messages) return;

  let isSending = false;

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isSending) return;
    isSending = true;
    input.value = '';

    // 1. Add user message to state
    const msg = actions.envoyerMessage(text);

    // 2. Render user bubble
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-bubble-user slide-in';
    userBubble.innerHTML = '<div class="chat-bubble-content"><p>' + escapeHTML(text) + '</p><span class="chat-bubble-time">' + msg.timestamp + '</span></div>';
    if (typing) messages.insertBefore(userBubble, typing);
    else messages.appendChild(userBubble);
    messages.scrollTop = messages.scrollHeight;

    // 3. Show typing indicator
    if (typing) {
      typing.classList.remove('hidden');
      messages.scrollTop = messages.scrollHeight;
    }
    await sleep(1000);

    // 4. Get mock response
    const response = getMockResponse(text);

    // 5. Hide typing, create tao bubble with empty text
    if (typing) typing.classList.add('hidden');

    const taoBubble = document.createElement('div');
    taoBubble.className = 'chat-bubble chat-bubble-tao slide-in';
    taoBubble.innerHTML = '<img src="assets/fox/fox-confident.svg" alt="" class="chat-bubble-avatar">'
      + '<div class="chat-bubble-content"><p class="chat-bubble-typed"></p>'
      + '<span class="chat-bubble-time">' + msg.timestamp + '</span></div>';
    if (typing) messages.insertBefore(taoBubble, typing);
    else messages.appendChild(taoBubble);

    // 6. Type response character by character
    const typedEl = taoBubble.querySelector('.chat-bubble-typed');
    await typeResponse(response.text, typedEl, 30);

    // 7. If capture, render mini-card + save in state
    if (response.capture) {
      const label = _listeLabels[response.capture.liste] || response.capture.liste;
      const card = document.createElement('div');
      card.className = 'chat-capture-card slide-in';
      card.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--neon)"><polyline points="20 6 9 17 4 12"/></svg>'
        + '<span>Ajoute dans ' + label + ' : "' + escapeHTML(response.capture.titre) + '"</span>'
        + '<a href="#" class="chat-capture-link" onclick="navigateTo(\'todo\');return false">Voir \u2192</a>';
      if (typing) messages.insertBefore(card, typing);
      else messages.appendChild(card);
    }

    // 8. Save tao reply in state
    actions.repondreTao(response.text, response.capture || null);
    messages.scrollTop = messages.scrollHeight;

    isSending = false;
    input.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });
}

/* ── HTML escape helper ── */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ── Semaine: Red now-line at current time (only on today's column) ── */
function initNowLine() {
  const body = document.querySelector('.semaine-body');
  if (!body) return;
  const now = new Date();
  const hour = now.getHours(), min = now.getMinutes();
  if (hour < 8 || hour > 19) return;

  const headers = document.querySelectorAll('.semaine-day-header');
  let todayCol = 0;
  headers.forEach((h, i) => {
    if (h.classList.contains('aujourdhui-marker')) todayCol = i + 1;
  });
  if (!todayCol) return;

  const offset = ((hour - 8) + min / 60) * 50;
  const line = document.createElement('div');
  line.className = 'semaine-now-line';
  line.style.top = offset + 'px';
  line.style.gridColumn = todayCol;
  line.style.gridRow = '1 / -1';
  body.appendChild(line);
}

/* ── Semaine: Hover tooltip on plages ── */
function initPlageTooltips() {
  document.querySelectorAll('.semaine-plage').forEach(plage => {
    plage.addEventListener('mouseenter', (e) => {
      const label = plage.querySelector('.plage-label')?.textContent || '';
      const tooltip = document.createElement('div');
      tooltip.className = 'plage-tooltip';
      tooltip.textContent = label;
      tooltip.style.left = (e.clientX + 10) + 'px';
      tooltip.style.top = (e.clientY - 30) + 'px';
      document.body.appendChild(tooltip);
      plage._tooltip = tooltip;
    });
    plage.addEventListener('mouseleave', () => { plage._tooltip?.remove(); });
  });
}

/* ── Semaine: Drag-and-drop to move plages across days/hours ── */
function initPlageDragMove() {
  const grid = document.querySelector('.semaine-body');
  if (!grid) return;
  const COLS = 7, ROWS = 12;
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Ghost preview element inside the grid
  const ghost = document.createElement('div');
  ghost.className = 'plage-drag-ghost';
  grid.appendChild(ghost);

  let _dragSpan = 1;
  let _dragPlage = null;

  function getSpan(plage) {
    const m = (plage.style.gridRow || '').match(/span\s+(\d+)/);
    return m ? parseInt(m[1]) : 1;
  }

  function getCell(x, y) {
    const r = grid.getBoundingClientRect();
    return {
      col: Math.max(1, Math.min(COLS, Math.floor((x - r.left) / (r.width / COLS)) + 1)),
      row: Math.max(1, Math.min(ROWS, Math.floor((y - r.top) / (r.height / ROWS)) + 1))
    };
  }

  // Make each plage draggable via HTML5 DnD
  grid.querySelectorAll('.semaine-plage').forEach(plage => {
    plage.setAttribute('draggable', 'true');
    plage.style.cursor = 'grab';

    plage.addEventListener('dragstart', (e) => {
      _dragPlage = plage;
      _dragSpan = getSpan(plage);
      plage.classList.add('plage-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'plage');
      // Use a tiny transparent image as drag image so the ghost is our custom one
      const img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
      e.dataTransfer.setDragImage(img, 0, 0);
    });

    plage.addEventListener('dragend', () => {
      plage.classList.remove('plage-dragging');
      ghost.classList.remove('active');
      _dragPlage = null;
    });
  });

  // Dragover on the grid body — show ghost + allow drop
  grid.addEventListener('dragover', (e) => {
    if (!_dragPlage) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const cell = getCell(e.clientX, e.clientY);
    ghost.style.gridColumn = String(cell.col);
    ghost.style.gridRow = cell.row + '/span ' + _dragSpan;
    ghost.classList.add('active');
  });

  grid.addEventListener('dragleave', (e) => {
    if (!grid.contains(e.relatedTarget)) ghost.classList.remove('active');
  });

  // Drop — move plage to new position
  grid.addEventListener('drop', (e) => {
    e.preventDefault();
    if (!_dragPlage) return;
    const cell = getCell(e.clientX, e.clientY);
    _dragPlage.style.gridColumn = String(cell.col);
    _dragPlage.style.gridRow = cell.row + '/span ' + _dragSpan;
    _dragPlage.classList.remove('plage-dragging');
    _dragPlage.classList.add('plage-dropped');
    ghost.classList.remove('active');
    setTimeout(() => _dragPlage.classList.remove('plage-dropped'), 500);
    showSettingsToast('Deplace \u2192 ' + dayNames[cell.col - 1] + ' ' + (cell.row - 1 + 8) + 'h');
    _dragPlage = null;
  });
}

/* ── Semaine: Heatmap colors on bar chart ── */
function initHeatmap() {
  document.querySelectorAll('.mini-graph-bar').forEach(bar => {
    if (bar.classList.contains('active')) return;
    const h = parseInt(bar.style.height);
    if (h >= 80) bar.classList.add('heat-max');
    else if (h >= 65) bar.classList.add('heat-high');
    else if (h >= 50) bar.classList.add('heat-mid');
    else bar.classList.add('heat-low');
  });
}

/* ── Trimestre: Animated progress bars ── */
function initTrimestreProgress() {
  const fills = document.querySelectorAll('#page-trimestre .objectif-progress-fill');
  fills.forEach(fill => {
    const width = fill.style.width;
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = width; }, 100);
  });
}

/* ── Trimestre: Milestone dots on progress bars ── */
function initTrimestreMilestones() {
  document.querySelectorAll('#page-trimestre .objectif-progress').forEach(bar => {
    const fill = bar.querySelector('.objectif-progress-fill');
    const pct = parseInt(fill?.style.width) || 0;
    const milestones = document.createElement('div');
    milestones.className = 'progress-milestones';
    [25, 50, 75, 100].forEach(m => {
      const dot = document.createElement('div');
      dot.className = 'milestone-dot' + (pct >= m ? ' reached' : '');
      dot.style.left = m + '%';
      milestones.appendChild(dot);
    });
    bar.after(milestones);
  });
}

/* ── Trimestre: Expand card to show details ── */
function initTrimestreExpand() {
  document.querySelectorAll('.trimestre-card').forEach(card => {
    const details = document.createElement('div');
    details.className = 'trimestre-details';
    details.innerHTML = '<div class="trimestre-details-inner"><div style="font-family:var(--font-mono);font-size:12px;color:var(--text-muted)">Dernieres taches accomplies :</div><ul style="margin-top:8px;padding-left:16px;font-size:13px;color:var(--text-muted);list-style:disc"><li>Finaliser le design dashboard</li><li>Envoyer les invitations beta</li><li>Revue de sprint produit</li></ul></div>';
    card.appendChild(details);
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      details.classList.toggle('expanded');
    });
  });
}

/* ── Trimestre: Velocity indicator + celebration ── */
function initTrimestreVelocity() {
  document.querySelectorAll('.trimestre-card').forEach(card => {
    const progressText = card.querySelector('.objectif-progress-text');
    if (!progressText) return;
    const match = progressText.textContent.match(/(\d+)%/);
    if (!match) return;
    const pct = parseInt(match[1]);
    let status, label;
    if (pct >= 50) { status = 'on-track'; label = 'En avance'; }
    else if (pct >= 35) { status = 'on-track'; label = 'On track'; }
    else if (pct >= 25) { status = 'behind'; label = 'En retard'; }
    else { status = 'at-risk'; label = 'A risque'; }

    const badge = document.createElement('span');
    badge.className = 'velocity-badge ' + status;
    badge.textContent = label;
    progressText.appendChild(badge);

    if (pct >= 60) {
      const fill = card.querySelector('.objectif-progress-fill');
      if (fill) setTimeout(() => spawnConfetti(fill), 1200);
    }
  });
}

/* ── Bilan: Auto-save textareas in-memory ── */
const _bilanDrafts = {};
function initBilanAutoSave() {
  document.querySelectorAll('.bilan-textarea').forEach((textarea, i) => {
    const key = 'step' + (i + 1);
    if (_bilanDrafts[key]) textarea.value = _bilanDrafts[key];
    textarea.addEventListener('input', () => { _bilanDrafts[key] = textarea.value; });
  });
}

/* ── Bilan: Sparklines in historical cards ── */
function initBilanSparklines() {
  const scores = [
    [65, 70, 68, 72, 75, 71, 72],
    [58, 62, 65, 68, 66, 70, 68],
    [55, 52, 58, 63, 60, 62, 61],
  ];
  document.querySelectorAll('.bilan-card-header').forEach((header, i) => {
    if (i >= scores.length) return;
    const data = scores[i];
    const w = 60, h = 20;
    const step = w / (data.length - 1);
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, j) => (j * step) + ',' + (h - ((v - min) / range) * h)).join(' ');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sparkline');
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    svg.appendChild(polyline);
    header.appendChild(svg);
  });
}

/* ── Bilan: Score comparison badges ── */
function initBilanComparison() {
  const deltas = [4, 3, 3];
  document.querySelectorAll('.bilan-card-header').forEach((header, i) => {
    if (i >= deltas.length) return;
    const delta = deltas[i];
    const badge = document.createElement('span');
    badge.className = 'score-delta ' + (delta > 0 ? 'positive' : 'negative');
    badge.textContent = (delta > 0 ? '+' : '') + delta;
    const scoreSpan = header.querySelector('.text-muted');
    if (scoreSpan) scoreSpan.appendChild(badge);
  });
}

/* ── Bilan: Motivational quote after completing bilan ── */
function showBilanQuote() {
  const flow = document.querySelector('.bilan-flow');
  if (!flow) return;
  const quotes = [
    { text: "Ce n'est pas le temps qui te manque, c'est la clarte.", author: "Tao" },
    { text: "Fais moins. Fais mieux. Fais ce qui compte.", author: "Tao" },
    { text: "Le progres n'est pas lineaire. Continue.", author: "Tao" },
  ];
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const quote = document.createElement('div');
  quote.className = 'bilan-quote';
  quote.innerHTML = '\u201C' + q.text + '\u201D<span class="quote-author">\u2014 ' + q.author + '</span>';
  flow.appendChild(quote);
}

/* ── Recompenses: Animated coin counter ── */
function initCoinsCounter() {
  const el = document.querySelector('.recompenses-coins-value');
  if (!el) return;
  const target = parseInt(el.textContent.replace(/,/g, ''));
  const duration = 1200, start = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ── Recompenses: 3D tilt hover on boutique items ── */
function initBoutique3D() {
  document.querySelectorAll('.boutique-item').forEach(item => {
    item.classList.add('tilt-3d');
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = 'perspective(600px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) scale(1.02)';
    });
    item.addEventListener('mouseleave', () => { item.style.transform = ''; });
  });
}

/* ── Recompenses: Preview modal on boutique click ── */
function initBoutiquePreview() {
  document.querySelectorAll('.boutique-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      const title = item.querySelector('h4')?.textContent || '';
      const desc = item.querySelector('p')?.textContent || '';
      const tag = item.querySelector('.tag')?.textContent || '';
      const price = item.querySelector('.text-neon')?.textContent || '0';
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay active';
      overlay.innerHTML = '<div class="modal"><div class="modal-header"><h3>Apercu</h3><button class="modal-close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div><div class="preview-modal-content"><div class="tag">' + tag + '</div><h3>' + title + '</h3><p>' + desc + '</p><div class="preview-modal-price">' + price + ' Coins</div><button class="btn-primary modal-close">Acheter</button></div></div>';
      document.body.appendChild(overlay);
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay || ev.target.closest('.modal-close')) overlay.remove();
      });
    });
  });
}

/* ── Recompenses: Streak calendar grid ── */
function initStreakCalendar() {
  const streakTab = document.querySelector('[data-tab-content="streak"]');
  if (!streakTab || streakTab.querySelector('.streak-calendar')) return;
  const cal = document.createElement('div');
  cal.className = 'streak-calendar';
  ['L', 'M', 'M', 'J', 'V', 'S', 'D'].forEach(d => {
    const label = document.createElement('div');
    label.className = 'streak-day-label';
    label.textContent = d;
    cal.appendChild(label);
  });
  const today = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const cell = document.createElement('div');
    cell.className = 'streak-day';
    cell.textContent = d.getDate();
    if (i === 0) cell.classList.add('today', 'active');
    else if (i < 12) cell.classList.add('active');
    else if (i < 16 && Math.random() > 0.3) cell.classList.add('active');
    else if (i >= 12 && i < 20) cell.classList.add('missed');
    cal.appendChild(cell);
  }
  const hero = streakTab.querySelector('.streak-hero');
  if (hero) hero.appendChild(cal);
}

/* ── Reglages: Settings toast notification ── */
function showSettingsToast(text) {
  showToast(text, 'success');
}

/* ── Reglages: Danger zone on delete section ── */
function initDangerZone() {
  const buttons = document.querySelectorAll('#page-reglages .btn-ghost');
  const deleteBtn = [...buttons].find(b => b.textContent.includes('Supprimer'));
  if (!deleteBtn) return;
  const section = deleteBtn.closest('.reglage-section');
  if (section) section.classList.add('danger-zone');
  deleteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!confirm('Es-tu sur de vouloir supprimer ton compte ? Cette action est irreversible.')) return;
    showSettingsToast('Compte supprime (demo)');
  });
}

/* ── Reglages: Export button with progress animation ── */
function initExportButton() {
  const buttons = document.querySelectorAll('#page-reglages .btn-secondary');
  const exportBtn = [...buttons].find(b => b.textContent.includes('Exporter'));
  if (!exportBtn) return;
  exportBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (exportBtn.dataset.exporting) return;
    exportBtn.dataset.exporting = 'true';
    const originalText = exportBtn.textContent;
    exportBtn.textContent = 'Export en cours...';
    const progress = document.createElement('div');
    progress.className = 'export-progress';
    progress.innerHTML = '<div class="export-progress-fill"></div>';
    exportBtn.after(progress);
    setTimeout(() => { progress.querySelector('.export-progress-fill').style.width = '100%'; }, 50);
    setTimeout(() => {
      progress.remove();
      exportBtn.textContent = 'Exporte !';
      delete exportBtn.dataset.exporting;
      showSettingsToast('Donnees exportees');
      setTimeout(() => { exportBtn.textContent = originalText; }, 2000);
    }, 1800);
  });
}

/* ── Reglages: Theme color preview swatches ── */
function initThemePreview() {
  const sections = document.querySelectorAll('#page-reglages .reglage-section');
  const profilSection = sections[0];
  if (!profilSection || profilSection.querySelector('.theme-preview')) return;
  const row = document.createElement('div');
  row.className = 'reglage-row';
  row.innerHTML = '<label class="reglage-label">Theme</label><div class="theme-preview"><div class="theme-swatch active-swatch" style="background:#0A0C0E" title="Sombre"></div><div class="theme-swatch" style="background:#1a1a2e" title="Nuit"></div><div class="theme-swatch" style="background:#f5f5f5;opacity:0.3" title="Clair (bientot)"></div></div>';
  profilSection.appendChild(row);
  row.querySelectorAll('.theme-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      row.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active-swatch'));
      swatch.classList.add('active-swatch');
      showSettingsToast('Theme selectionne');
    });
  });
}

/* ══════════════════════════════════════════════
   AUJOURD'HUI — Banniere + Focus + Menus
   ══════════════════════════════════════════════ */

/* ── Click banniere objectifs → page Trimestre ── */
function initBanniereObjectifs() {
  document.querySelectorAll('.objectif-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => navigateTo('trimestre'));
  });
}

/* ── Boutons "Demarrer le focus" ── */
function initFocusButtons() {
  document.querySelectorAll('.tache-btn-focus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.tache-card[data-tache-id]');
      if (!card) return;
      const id = parseInt(card.dataset.tacheId);
      if (id) actions.demarrerFocus(id);
    });
  });
}

/* ── Menu contextuel ⋮ sur tache ── */
function initTacheMenus() {
  document.addEventListener('click', (e) => {
    // Fermer tous les menus ouverts si on clique ailleurs
    if (!e.target.closest('.tache-menu')) {
      document.querySelectorAll('.tache-dropdown').forEach(d => d.remove());
      return;
    }
    const btn = e.target.closest('.tache-menu');
    const card = btn.closest('.tache-card[data-tache-id]');
    if (!card) return;
    const tacheId = parseInt(card.dataset.tacheId);

    // Fermer un dropdown deja ouvert
    const existing = card.querySelector('.tache-dropdown');
    if (existing) { existing.remove(); return; }

    // Fermer les autres
    document.querySelectorAll('.tache-dropdown').forEach(d => d.remove());

    const dropdown = document.createElement('div');
    dropdown.className = 'tache-dropdown';
    dropdown.innerHTML = '<div class="tache-dropdown-item" data-action="focus">Demarrer le focus</div>'
      + '<div class="tache-dropdown-item" data-action="reporter">Reporter a demain</div>'
      + '<div class="tache-dropdown-item" data-action="supprimer" style="color:#FF4444">Supprimer</div>';
    card.appendChild(dropdown);

    dropdown.addEventListener('click', (ev) => {
      const item = ev.target.closest('.tache-dropdown-item');
      if (!item) return;
      const action = item.dataset.action;
      dropdown.remove();
      if (action === 'focus') actions.demarrerFocus(tacheId);
      else if (action === 'reporter') showToast('Reporte a demain', 'success');
      else if (action === 'supprimer') showToast('Tache supprimee', 'success');
    });
  });
}

/* ══════════════════════════════════════════════
   RECOMPENSES — Acheter + Badges modals
   ══════════════════════════════════════════════ */

/* ── Wire "Acheter" buttons to state ── */
function initBoutiqueAcheter() {
  document.querySelectorAll('.boutique-item').forEach(card => {
    const btn = card.querySelector('.btn-primary');
    if (!btn) return;
    const title = card.querySelector('h4')?.textContent || '';
    const item = state.boutique.find(b => title.indexOf(b.titre.substring(0, 20)) !== -1);
    if (!item) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (btn.dataset.bought) return;
      const ok = actions.acheterItem(item.id);
      if (ok) {
        btn.textContent = 'Achete';
        btn.dataset.bought = 'true';
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-ghost');
        btn.style.opacity = '0.5';
        spawnConfetti(btn);
      }
    });
  });
}

/* ── Click locked badge → condition modal ── */
function initBadgeModals() {
  document.addEventListener('click', (e) => {
    const badge = e.target.closest('.badge-card.verrouille');
    if (!badge) return;
    const nom = badge.querySelector('.badge-nom')?.textContent || '';
    const desc = badge.querySelector('.badge-desc')?.textContent || '';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay active';
    overlay.innerHTML = '<div class="modal"><div class="modal-header"><h3>' + escapeHTML(nom) + '</h3><button class="modal-close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div><div style="padding:20px;text-align:center"><div style="font-size:48px;margin-bottom:16px">&#x1f512;</div><p style="color:var(--text-muted);font-size:14px">' + escapeHTML(desc) + '</p></div></div>';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay || ev.target.closest('.modal-close')) overlay.remove();
    });
  });
}

/* ══════════════════════════════════════════════
   TRIMESTRE — Atteint + Modifier
   ══════════════════════════════════════════════ */

function initTrimestreActions() {
  const cards = document.querySelectorAll('.trimestre-card');
  cards.forEach((card, i) => {
    const obj = state.objectifs[i];
    if (!obj) return;

    // "Atteint" button
    const atteintBtn = card.querySelector('.btn-primary');
    if (atteintBtn && obj.progression >= 100) {
      atteintBtn.disabled = false;
      atteintBtn.style.opacity = '1';
    }
    if (atteintBtn) {
      atteintBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (obj.progression < 100) {
          showToast('Pas encore a 100%', 'error');
          return;
        }
        obj.atteint = true;
        atteintBtn.textContent = 'Atteint !';
        atteintBtn.disabled = true;
        atteintBtn.style.opacity = '0.5';
        state.user.coins += 50;
        emit('coins-updated', state.user.coins);
        showToast('+50 Coins · Objectif atteint !', 'coins');
        spawnConfetti(atteintBtn);
      });
    }

    // "Modifier" button
    const modifierBtn = card.querySelector('.btn-ghost');
    if (!modifierBtn || modifierBtn.textContent.trim() !== 'Modifier') return;
    modifierBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay active';
      overlay.innerHTML = '<div class="modal"><div class="modal-header"><h3>Modifier l\'objectif</h3><button class="modal-close"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div><div style="padding:20px"><label style="font-size:12px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em">Titre de l\'objectif</label><input type="text" class="modal-input" value="' + escapeHTML(obj.titre) + '" style="width:100%;padding:10px 12px;margin-top:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:14px"><button class="btn-primary" style="width:100%;margin-top:16px;justify-content:center">Enregistrer</button></div></div>';
      document.body.appendChild(overlay);
      const input = overlay.querySelector('.modal-input');
      const saveBtn = overlay.querySelector('.btn-primary');
      saveBtn.addEventListener('click', () => {
        const newTitle = input.value.trim();
        if (!newTitle) return;
        obj.titre = newTitle;
        const h2 = card.querySelector('h2');
        if (h2) h2.textContent = newTitle;
        overlay.remove();
        showToast('Objectif modifie', 'success');
      });
      overlay.addEventListener('click', (ev) => {
        if (ev.target === overlay || ev.target.closest('.modal-close')) overlay.remove();
      });
    });
  });
}

/* ══════════════════════════════════════════════
   SEMAINE — Click plage → detail panel
   ══════════════════════════════════════════════ */

function initSemainePlageClick() {
  document.querySelectorAll('.semaine-plage').forEach(plage => {
    plage.style.cursor = 'pointer';
    plage.addEventListener('click', (e) => {
      e.stopPropagation();
      // Remove any existing detail panel
      document.querySelector('.plage-detail-panel')?.remove();

      const label = plage.querySelector('.plage-label')?.textContent || '';
      const isTao = plage.classList.contains('plage-tao');
      const col = parseInt(plage.style.gridColumn) || 1;
      const row = plage.style.gridRow || '';
      const rowStart = parseInt(row) || 1;
      const hours = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h'];
      const heure = hours[rowStart - 1] || '';
      const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const jour = jours[col - 1] || '';

      const panel = document.createElement('div');
      panel.className = 'plage-detail-panel';
      panel.innerHTML = '<div class="plage-detail-header"><h4>' + escapeHTML(label) + '</h4><button class="plage-detail-close">&times;</button></div>'
        + '<div class="plage-detail-body"><div class="plage-detail-row"><span class="text-muted">Jour</span><span>' + jour + '</span></div>'
        + '<div class="plage-detail-row"><span class="text-muted">Heure</span><span>' + heure + '</span></div>'
        + '<div class="plage-detail-row"><span class="text-muted">Type</span><span>' + (isTao ? 'Tao' : 'Externe') + '</span></div></div>';
      document.querySelector('#page-semaine')?.appendChild(panel);

      requestAnimationFrame(() => panel.classList.add('open'));
      panel.querySelector('.plage-detail-close').addEventListener('click', () => {
        panel.classList.remove('open');
        setTimeout(() => panel.remove(), 200);
      });
    });
  });
  // Close panel when clicking outside
  document.querySelector('#page-semaine')?.addEventListener('click', (e) => {
    if (!e.target.closest('.semaine-plage') && !e.target.closest('.plage-detail-panel')) {
      const p = document.querySelector('.plage-detail-panel');
      if (p) { p.classList.remove('open'); setTimeout(() => p.remove(), 200); }
    }
  });
}

/* ── Calendrier page: mode switch (daily/weekly/monthly) ── */
function initCalPageModeSwitch() {
  const container = document.getElementById('page-semaine');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.todo-cal-mode-btn');
    if (!btn) return;
    const mode = btn.dataset.calPageMode;
    if (!mode) return;

    const switchEl = btn.closest('.todo-cal-mode-switch');
    if (switchEl) {
      switchEl.querySelectorAll('.todo-cal-mode-btn').forEach(b => {
        b.classList.toggle('active', b === btn);
      });
    }

    const daily = container.querySelector('#cal-page-daily');
    const weekly = container.querySelector('#cal-page-weekly');
    const monthly = container.querySelector('#cal-page-monthly');

    daily?.classList.toggle('active', mode === 'daily');
    weekly?.classList.toggle('active', mode === 'weekly');
    monthly?.classList.toggle('active', mode === 'monthly');
  });
}

/* ══════════════════════════════════════════════
   SIDEBAR / HEADER — Polish
   ══════════════════════════════════════════════ */

/* ── Sidebar: active indicator slide + hover glow ── */
function initSidebarPolish() {
  const nav = document.querySelector('.sidebar-nav');
  if (!nav) return;

  // Active indicator bar
  const indicator = document.createElement('div');
  indicator.className = 'sidebar-indicator';
  nav.style.position = 'relative';
  nav.appendChild(indicator);

  function moveIndicator() {
    const active = nav.querySelector('.sidebar-nav-item.active');
    if (!active) return;
    indicator.style.top = active.offsetTop + 'px';
    indicator.style.height = active.offsetHeight + 'px';
  }
  moveIndicator();

  // Observe page changes
  on('page-changed', moveIndicator);

  // Emit page-changed from navigateTo wrapper
  const origNavigateTo = window.navigateTo;
  window.navigateTo = async function(pageId) {
    await origNavigateTo(pageId);
    emit('page-changed', pageId);
  };

  // Hover glow
  nav.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('mouseenter', () => item.classList.add('glow'));
    item.addEventListener('mouseleave', () => item.classList.remove('glow'));
  });

  // Bottom nav tap feedback
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.add('tap');
      item.addEventListener('animationend', () => item.classList.remove('tap'), { once: true });
    });
  });
}

/* ── Header: coins pulse + avatar dropdown ── */
function initHeaderPolish() {
  // Coins pulse on update
  on('coins-updated', () => {
    const el = document.querySelector('.header-coins');
    if (!el) return;
    el.classList.add('pulse');
    el.addEventListener('animationend', () => el.classList.remove('pulse'), { once: true });
  });

  // Avatar dropdown
  const avatar = document.querySelector('.header-avatar');
  if (!avatar) return;
  avatar.style.cursor = 'pointer';
  avatar.addEventListener('click', () => {
    let dd = document.querySelector('.avatar-dropdown');
    if (dd) { dd.remove(); return; }
    dd = document.createElement('div');
    dd.className = 'avatar-dropdown';
    dd.innerHTML = '<div class="avatar-dd-item" data-page="reglages">Reglages</div>'
      + '<div class="avatar-dd-item avatar-dd-logout">Deconnexion</div>';
    avatar.parentElement.appendChild(dd);
    requestAnimationFrame(() => dd.classList.add('open'));
    dd.querySelector('[data-page="reglages"]').addEventListener('click', () => { dd.remove(); navigateTo('reglages'); });
    dd.querySelector('.avatar-dd-logout').addEventListener('click', () => { dd.remove(); showToast('Deconnecte (demo)', 'success'); });
    setTimeout(() => {
      document.addEventListener('click', function handler(ev) {
        if (!ev.target.closest('.avatar-dropdown') && !ev.target.closest('.header-avatar')) {
          dd?.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 0);
  });
}
