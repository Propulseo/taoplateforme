/* ═══════════════════════════════════════════
   TAO — 100 UX Enhancements
   Loaded after main.js
   ═══════════════════════════════════════════ */

/* ── 1. Greeting dynamique ── */
function uxGreeting() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Bonjour' : h < 18 ? 'Bon apres-midi' : 'Bonsoir';
  const el = document.querySelector('.section-header h3');
  if (el && el.textContent.includes('taches')) {
    el.textContent = greet + ' ' + state.user.prenom;
  }
}

/* ── 2. Date du jour live ── */
function uxLiveDate() {
  const el = document.querySelector('.section-header .text-muted');
  if (!el) return;
  const d = new Date();
  const jours = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
  const mois = ['janvier','fevrier','mars','avril','mai','juin','juillet','aout','septembre','octobre','novembre','decembre'];
  el.textContent = jours[d.getDay()] + ' ' + d.getDate() + ' ' + mois[d.getMonth()] + ' ' + d.getFullYear();
}

/* ── 3. ScoreRing hover detail ── */
function uxScoreRingHover() {
  const rings = document.querySelectorAll('.score-ring .ring-fill');
  const labels = ['Taff', 'Vie', 'Perso'];
  const values = [state.scoreJour.taff, state.scoreJour.vie, state.scoreJour.perso];
  rings.forEach((ring, i) => {
    ring.style.cursor = 'pointer';
    ring.addEventListener('mouseenter', (e) => {
      const tip = document.createElement('div');
      tip.className = 'ux-tooltip';
      tip.textContent = labels[i] + ' : ' + values[i] + '%';
      tip.style.left = e.clientX + 'px';
      tip.style.top = (e.clientY - 32) + 'px';
      document.body.appendChild(tip);
      ring._tip = tip;
    });
    ring.addEventListener('mouseleave', () => { ring._tip?.remove(); });
  });
}

/* ── 6. Now marker pulse ── */
function uxNowPulse() {
  const now = document.querySelector('.day-tl-now');
  if (now) now.classList.add('ux-pulse-now');
}

/* ── 7. Auto-highlight tache en cours ── */
function uxAutoHighlight() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  state.taches.forEach(t => {
    if (t.statut === 'fait') return;
    const [h, m] = (t.plageDebut || '').split(':').map(Number);
    const [h2, m2] = (t.plageFin || '').split(':').map(Number);
    if (isNaN(h)) return;
    const start = h * 60 + m, end = h2 * 60 + m2;
    if (mins >= start && mins <= end) {
      const card = document.querySelector('[data-tache-id="' + t.id + '"]');
      if (card && !card.classList.contains('faite')) {
        card.classList.add('en-cours');
      }
    }
  });
}

/* ── 8. Countdown prochaine tache ── */
function uxNextTaskCountdown() {
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  let next = null, nextMins = Infinity;
  state.taches.forEach(t => {
    if (t.statut === 'fait') return;
    const [h, m] = (t.plageDebut || '').split(':').map(Number);
    if (isNaN(h)) return;
    const start = h * 60 + m;
    if (start > mins && start < nextMins) { nextMins = start; next = t; }
  });
  if (!next) return;
  const delta = nextMins - mins;
  const label = delta >= 60 ? Math.floor(delta / 60) + 'h' + (delta % 60 ? String(delta % 60).padStart(2, '0') : '') : delta + ' min';
  const el = document.createElement('div');
  el.className = 'ux-next-task';
  el.textContent = 'Dans ' + label + ' : ' + next.titre;
  const sectionHeader = document.querySelector('.section-header');
  if (sectionHeader && !document.querySelector('.ux-next-task')) sectionHeader.after(el);
}

/* ── 9. All 3 done → confetti ── */
function uxAllDoneCheck() {
  on('tache-updated', () => {
    const allDone = state.taches.every(t => t.statut === 'fait');
    if (allDone && !window._allDoneFired) {
      window._allDoneFired = true;
      showToast('3/3 ! Journee parfaite !', 'coins');
      const ring = document.querySelector('.score-ring');
      if (ring) spawnConfetti(ring);
    }
  });
}

/* ── 10. Objectif banniere tooltip ── */
function uxObjectifTooltip() {
  document.querySelectorAll('.objectif-card').forEach((card, i) => {
    const obj = state.objectifs[i];
    if (!obj) return;
    card.title = obj.titre + ' — ' + obj.progression + '% (' + obj.tachesAccomplies + '/' + obj.objectifEstime + ' taches)';
  });
}

/* ── 11. Double-click tache → edit inline ── */
function uxTacheInlineEdit() {
  document.addEventListener('dblclick', (e) => {
    const titre = e.target.closest('.tache-titre');
    if (!titre) return;
    const card = titre.closest('.tache-card[data-tache-id]');
    if (!card) return;
    titre.contentEditable = 'true';
    titre.focus();
    const sel = window.getSelection();
    sel.selectAllChildren(titre);
    const done = () => {
      titre.contentEditable = 'false';
      const tache = state.taches.find(t => t.id === parseInt(card.dataset.tacheId));
      if (tache) tache.titre = titre.textContent.trim();
    };
    titre.addEventListener('blur', done, { once: true });
    titre.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); titre.blur(); } });
  });
}

/* ── 12. Skeleton loading ── */
function uxSkeleton(section) {
  if (!section || section.innerHTML.trim()) return;
  section.innerHTML = '<div class="ux-skeleton"><div class="ux-sk-line w80"></div><div class="ux-sk-line w60"></div><div class="ux-sk-block"></div><div class="ux-sk-line w40"></div></div>';
}

/* ── 13. Badge streak visible ── */
function uxStreakBadge() {
  const scoreLabel = document.querySelector('.score-ring-label');
  if (!scoreLabel || scoreLabel.querySelector('.ux-streak-inline')) return;
  const badge = document.createElement('span');
  badge.className = 'ux-streak-inline';
  badge.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> ' + state.user.streak + 'j';
  scoreLabel.appendChild(badge);
}

/* ── 14. Stagger animations ── */
function uxStaggerCards() {
  document.querySelectorAll('.tache-card[data-tache-id]').forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(8px)';
    setTimeout(() => {
      card.style.transition = 'opacity 200ms ease, transform 200ms ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 100 * i);
  });
}

/* ── 15. Empty state si 0 tache ── */
function uxEmptyState() {
  const cards = document.querySelectorAll('.tache-card[data-tache-id]');
  if (cards.length > 0) return;
  const main = document.querySelector('.aujourdhui-main');
  if (!main) return;
  const empty = document.createElement('div');
  empty.className = 'ux-empty-state';
  empty.innerHTML = '<div style="font-size:48px;margin-bottom:12px">&#x1f4ad;</div><p>Aucune tache aujourd\'hui.</p><button class="btn-primary" onclick="navigateTo(\'todo\')">Choisir mes 3 taches</button>';
  main.appendChild(empty);
}

/* ── 16. Typing indicator (already exists in HTML) ── */
/* Already handled by initChatSend — chat-typing shown/hidden */

/* ── 17. Reactions sur messages ── */
function uxChatReactions() {
  document.addEventListener('dblclick', (e) => {
    const bubble = e.target.closest('.chat-bubble-content');
    if (!bubble) return;
    if (bubble.querySelector('.ux-reactions')) return;
    const bar = document.createElement('div');
    bar.className = 'ux-reactions';
    ['&#x1f44d;', '&#x2764;', '&#x1f60a;', '&#x1f525;'].forEach(emoji => {
      const btn = document.createElement('span');
      btn.className = 'ux-reaction-btn';
      btn.innerHTML = emoji;
      btn.addEventListener('click', () => {
        btn.classList.toggle('ux-reaction-active');
      });
      bar.appendChild(btn);
    });
    bubble.appendChild(bar);
  });
}

/* ── 18. Copy message ── */
function uxChatCopy() {
  document.addEventListener('mouseenter', (e) => {
    const content = e.target.closest?.('.chat-bubble-content');
    if (!content || content.querySelector('.ux-copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'ux-copy-btn';
    btn.textContent = 'Copier';
    btn.addEventListener('click', () => {
      const text = content.querySelector('p')?.textContent || '';
      navigator.clipboard?.writeText(text);
      btn.textContent = 'Copie !';
      setTimeout(() => btn.textContent = 'Copier', 1500);
    });
    content.appendChild(btn);
  }, true);
}

/* ── 19. Heure relative ── */
function uxRelativeTime() {
  document.querySelectorAll('.chat-bubble-time').forEach(el => {
    const text = el.textContent.trim();
    const [h, m] = text.split(':').map(Number);
    if (isNaN(h)) return;
    const now = new Date();
    const msgTime = new Date(now);
    msgTime.setHours(h, m, 0);
    const diff = Math.floor((now - msgTime) / 60000);
    if (diff < 1) el.textContent = "A l'instant";
    else if (diff < 60) el.textContent = 'il y a ' + diff + ' min';
    else el.textContent = text;
  });
}

/* ── 21. Message accueil contextuel ── */
function uxChatContextGreeting() {
  const remaining = state.taches.filter(t => t.statut !== 'fait').length;
  if (remaining > 0) {
    const first = document.querySelector('.chat-bubble-tao .chat-bubble-content p');
    if (first) first.textContent = 'Tu as ' + remaining + ' tache' + (remaining > 1 ? 's' : '') + ' aujourd\'hui. On attaque ?';
  }
}

/* ── 22. Suggestions rapides ── */
function uxChatSuggestions() {
  const inputBar = document.querySelector('.chat-input-bar');
  if (!inputBar || inputBar.querySelector('.ux-suggestions')) return;
  const wrap = document.createElement('div');
  wrap.className = 'ux-suggestions';
  ['Mon score', 'Mes objectifs', 'Prochain focus', 'Aide'].forEach(text => {
    const chip = document.createElement('button');
    chip.className = 'ux-suggestion-chip';
    chip.textContent = text;
    chip.addEventListener('click', () => {
      const input = document.querySelector('.chat-input');
      if (input) { input.value = text; input.dispatchEvent(new Event('input')); }
      const sendBtn = document.querySelector('.chat-send-btn');
      if (sendBtn) sendBtn.click();
    });
    wrap.appendChild(chip);
  });
  inputBar.before(wrap);
}

/* ── 23. Markdown light ── */
function uxMarkdownLight(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:var(--surface);padding:1px 4px;border-radius:3px">$1</code>');
}

/* ── 24. Auto-complete commandes ── */
function uxSlashCommands() {
  const input = document.querySelector('.chat-input');
  if (!input) return;
  let dropdown = null;
  const cmds = ['/score', '/focus', '/objectifs', '/aide', '/bilan', '/streak'];
  input.addEventListener('input', () => {
    dropdown?.remove();
    dropdown = null;
    if (!input.value.startsWith('/')) return;
    const q = input.value.toLowerCase();
    const matches = cmds.filter(c => c.startsWith(q));
    if (!matches.length) return;
    dropdown = document.createElement('div');
    dropdown.className = 'ux-cmd-dropdown';
    matches.forEach(cmd => {
      const item = document.createElement('div');
      item.className = 'ux-cmd-item';
      item.textContent = cmd;
      item.addEventListener('click', () => { input.value = cmd.slice(1); dropdown.remove(); dropdown = null; });
      dropdown.appendChild(item);
    });
    input.parentElement.before(dropdown);
  });
}

/* ── 25. Historique search ── */
function uxChatSearch() {
  const header = document.querySelector('.chat-header');
  if (!header || header.querySelector('.ux-chat-search')) return;
  const search = document.createElement('input');
  search.className = 'ux-chat-search';
  search.placeholder = 'Rechercher...';
  search.type = 'text';
  header.appendChild(search);
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    document.querySelectorAll('.chat-bubble').forEach(b => {
      const text = b.textContent.toLowerCase();
      b.style.display = !q || text.includes(q) ? '' : 'none';
    });
  });
}

/* ── 26. Message grouping ── */
function uxMessageGrouping() {
  const bubbles = document.querySelectorAll('.chat-bubble');
  bubbles.forEach((b, i) => {
    if (i === 0) return;
    const prev = bubbles[i - 1];
    const sameAuthor = (b.classList.contains('chat-bubble-tao') && prev.classList.contains('chat-bubble-tao')) ||
                       (b.classList.contains('chat-bubble-user') && prev.classList.contains('chat-bubble-user'));
    if (sameAuthor) {
      b.classList.add('ux-grouped');
      const avatar = b.querySelector('.chat-bubble-avatar');
      if (avatar) avatar.style.visibility = 'hidden';
    }
  });
}

/* ── 27. Scroll-to-bottom button ── */
function uxScrollToBottom() {
  const chat = document.querySelector('.chat-messages');
  if (!chat || chat.querySelector('.ux-scroll-bottom')) return;
  const btn = document.createElement('button');
  btn.className = 'ux-scroll-bottom';
  btn.innerHTML = '&#x2193;';
  btn.style.display = 'none';
  chat.parentElement.style.position = 'relative';
  chat.parentElement.appendChild(btn);
  chat.addEventListener('scroll', () => {
    btn.style.display = (chat.scrollHeight - chat.scrollTop - chat.clientHeight > 100) ? 'flex' : 'none';
  });
  btn.addEventListener('click', () => { chat.scrollTop = chat.scrollHeight; });
}

/* ── 28. Link detection ── */
function uxLinkDetection() {
  document.querySelectorAll('.chat-bubble-content p').forEach(p => {
    if (p.querySelector('a')) return;
    p.innerHTML = p.innerHTML.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" style="color:var(--neon)">$1</a>');
  });
}

/* ── 29-30. Todo bulk select ── */
function uxTodoBulkSelect() {
  let selecting = false;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && selecting) {
      selecting = false;
      document.querySelectorAll('.todo-item.ux-selected').forEach(i => i.classList.remove('ux-selected'));
      document.querySelector('.ux-bulk-bar')?.remove();
    }
  });
  document.addEventListener('click', (e) => {
    if (!e.shiftKey) return;
    const item = e.target.closest('.todo-item');
    if (!item) return;
    e.preventDefault();
    selecting = true;
    item.classList.toggle('ux-selected');
    let bar = document.querySelector('.ux-bulk-bar');
    const count = document.querySelectorAll('.todo-item.ux-selected').length;
    if (!bar && count > 0) {
      bar = document.createElement('div');
      bar.className = 'ux-bulk-bar';
      bar.innerHTML = '<span class="ux-bulk-count"></span><button class="btn-primary ux-bulk-done">Cocher</button><button class="btn-ghost ux-bulk-del" style="color:var(--error)">Supprimer</button>';
      document.querySelector('#page-todo')?.appendChild(bar);
      bar.querySelector('.ux-bulk-done').addEventListener('click', () => {
        document.querySelectorAll('.todo-item.ux-selected .todo-checkbox:not(.checked)').forEach(cb => cb.click());
        bar.remove();
      });
      bar.querySelector('.ux-bulk-del').addEventListener('click', () => {
        document.querySelectorAll('.todo-item.ux-selected').forEach(i => { i.style.display = 'none'; });
        showToast('Taches supprimees', 'success');
        bar.remove();
      });
    }
    if (bar) bar.querySelector('.ux-bulk-count').textContent = count + ' selectionne' + (count > 1 ? 's' : '');
    if (count === 0) bar?.remove();
  });
}

/* ── 31. Sous-taches (mock expander) ── */
function uxSubtasks() {
  document.addEventListener('click', (e) => {
    const expander = e.target.closest('.ux-subtask-toggle');
    if (!expander) return;
    const list = expander.nextElementSibling;
    if (list) list.classList.toggle('hidden');
    expander.textContent = list?.classList.contains('hidden') ? '+ Sous-taches' : '- Sous-taches';
  });
}

/* ── 32. Tags (visual only) ── */
/* Tags already exist as .tag elements in todo items */

/* ── 34. Priorite visuelle ── */
function uxPriorityDots() {
  document.querySelectorAll('.todo-item').forEach(item => {
    if (item.querySelector('.ux-priority-dot')) return;
    const retard = item.querySelector('.todo-item-retard');
    if (retard) {
      const dot = document.createElement('span');
      dot.className = 'ux-priority-dot urgent';
      item.querySelector('.todo-item-titre')?.before(dot);
    }
  });
}

/* ── 35. Tab title counter ── */
function uxTabTitle() {
  const remaining = state.taches.filter(t => t.statut !== 'fait').length;
  document.title = remaining > 0 ? '(' + remaining + ') Tao' : 'Tao';
  on('tache-updated', () => {
    const r = state.taches.filter(t => t.statut !== 'fait').length;
    document.title = r > 0 ? '(' + r + ') Tao' : 'Tao — Journee complete !';
  });
}

/* ── 36. Recherche todo ── */
function uxTodoSearch() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
      const todoPage = document.getElementById('page-todo');
      if (!todoPage?.classList.contains('active')) return;
      e.preventDefault();
      let search = todoPage.querySelector('.ux-todo-search');
      if (search) { search.focus(); return; }
      search = document.createElement('input');
      search.className = 'ux-todo-search';
      search.placeholder = 'Chercher une tache...';
      search.type = 'text';
      const content = document.getElementById('todo-main-content');
      if (content) content.before(search);
      search.focus();
      search.addEventListener('input', () => {
        const q = search.value.toLowerCase();
        document.querySelectorAll('.todo-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = !q || text.includes(q) ? '' : 'none';
        });
      });
      search.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { search.remove(); document.querySelectorAll('.todo-item').forEach(i => i.style.display = ''); } });
    }
  });
}

/* ── 39. Undo delete ── */
function uxUndoDelete() {
  on('todo-deleted', (data) => {
    const toast = document.createElement('div');
    toast.className = 'toast-item toast-success';
    toast.innerHTML = 'Tache supprimee <button class="ux-undo-btn">Annuler</button>';
    document.querySelector('.toast-container')?.appendChild(toast);
    const timer = setTimeout(() => toast.remove(), 5000);
    toast.querySelector('.ux-undo-btn')?.addEventListener('click', () => {
      clearTimeout(timer);
      toast.remove();
      showToast('Tache restauree', 'success');
    });
  });
}

/* ── 42. Ctrl+N global quick-add ── */
function uxGlobalQuickAdd() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      const modal = document.getElementById('modal-add-todo');
      if (modal) {
        modal.classList.add('active');
        const input = modal.querySelector('.todo-quickadd-input');
        if (input) setTimeout(() => input.focus(), 100);
      }
    }
  });
}

/* ── 43. Projet progress bar ── */
function uxProjetProgress() {
  document.querySelectorAll('.todo-sidebar-projet').forEach(item => {
    const projId = item.dataset?.projetId;
    if (!projId) return;
    const proj = state.projets.find(p => p.id === projId);
    if (!proj || item.querySelector('.ux-proj-bar')) return;
    const pct = Math.round((proj.tachesFaites / proj.tachesTotal) * 100);
    const bar = document.createElement('div');
    bar.className = 'ux-proj-bar';
    bar.innerHTML = '<div class="ux-proj-fill" style="width:' + pct + '%"></div>';
    item.appendChild(bar);
  });
}

/* ── 44. Section collapse ── */
/* Already handled by initTodoSections with .todo-section-header.collapsed */

/* ── 45. Empty state par liste ── */
function uxTodoEmptyStates() {
  const messages = {
    'todo-aujourdhui': 'Rien pour aujourd\'hui. Profite !',
    'todo-boite': 'Boite vide. Tu es a jour.',
    'todo-attente': 'Aucune tache en attente.',
    'todo-longterme': 'Pas de reves ? Note-les ici.',
    'todo-avenir': 'Pas de taches planifiees.',
  };
  on('todo-view-loaded', (viewId) => {
    const content = document.getElementById('todo-main-content');
    if (!content) return;
    const items = content.querySelectorAll('.todo-item');
    if (items.length > 0) return;
    const msg = messages[viewId] || 'Rien ici pour le moment.';
    const empty = document.createElement('div');
    empty.className = 'ux-empty-state';
    empty.innerHTML = '<p style="color:var(--text-muted)">' + msg + '</p>';
    content.appendChild(empty);
  });
}

/* ── 46. Navigation semaine ← → ── */
function uxSemaineNav() {
  const btns = document.querySelectorAll('.semaine-header-bar .btn-ghost');
  if (btns.length < 2) return;
  btns[0].addEventListener('click', () => showToast('Semaine precedente (demo)', 'success'));
  btns[1].addEventListener('click', () => showToast('Semaine suivante (demo)', 'success'));
}

/* ── 47. Click créneau vide → modal ── */
function uxSemaineAddPlage() {
  const body = document.querySelector('.semaine-body');
  if (!body) return;
  body.addEventListener('click', (e) => {
    if (e.target.closest('.semaine-plage')) return;
    showToast('Ajouter une plage ici (demo)', 'success');
  });
}

/* ── 49. Plage color par pilier ── */
function uxPlageColors() {
  document.querySelectorAll('.semaine-plage.plage-tao').forEach(plage => {
    const label = plage.querySelector('.plage-label')?.textContent || '';
    if (label.toLowerCase().includes('lea') || label.toLowerCase().includes('soiree')) {
      plage.style.borderLeftColor = '#FF6B9D';
    } else if (label.toLowerCase().includes('hiit') || label.toLowerCase().includes('course') || label.toLowerCase().includes('sport')) {
      plage.style.borderLeftColor = '#FFD700';
    }
  });
}

/* ── 50. Today column highlight ── */
function uxTodayColHighlight() {
  const headers = document.querySelectorAll('.semaine-day-header');
  headers.forEach((h, i) => {
    if (h.classList.contains('aujourdhui-marker')) {
      const body = document.querySelector('.semaine-body');
      if (!body) return;
      const highlight = document.createElement('div');
      highlight.className = 'ux-today-col';
      highlight.style.gridColumn = (i + 1);
      highlight.style.gridRow = '1 / -1';
      body.prepend(highlight);
    }
  });
}

/* ── 51. Tooltip riche sur plages ── */
/* Enhanced by existing initPlageTooltips */

/* ── 52. Mini-graph hover tooltip ── */
function uxGraphTooltips() {
  document.querySelectorAll('.mini-graph-bar').forEach((bar, i) => {
    const day = state.scoresHebdo[i];
    if (!day) return;
    bar.title = day.jour + ' — Taff: ' + day.taff + ' · Vie: ' + day.vie + ' · Perso: ' + day.perso;
  });
}

/* ── 53. Export semaine ── */
function uxExportSemaine() {
  const header = document.querySelector('.semaine-header-bar');
  if (!header || header.querySelector('.ux-export-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'btn-ghost ux-export-btn';
  btn.textContent = 'Exporter';
  btn.addEventListener('click', () => {
    let text = 'Planning semaine:\n';
    document.querySelectorAll('.semaine-plage').forEach(p => {
      text += '- ' + (p.querySelector('.plage-label')?.textContent || '') + '\n';
    });
    navigator.clipboard?.writeText(text);
    showToast('Planning copie', 'success');
  });
  header.appendChild(btn);
}

/* ── 55. Weekend dimmed ── */
function uxWeekendDim() {
  document.querySelectorAll('.semaine-day-header').forEach((h, i) => {
    if (i >= 5) h.classList.add('ux-weekend');
  });
}

/* ── 56. Edit progression manuelle ── */
function uxTrimestreSlider() {
  document.querySelectorAll('.trimestre-card').forEach((card, i) => {
    const obj = state.objectifs[i];
    if (!obj || card.querySelector('.ux-slider')) return;
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = obj.progression;
    slider.className = 'ux-slider';
    slider.addEventListener('input', () => {
      obj.progression = parseInt(slider.value);
      const fill = card.querySelector('.objectif-progress-fill');
      if (fill) fill.style.width = obj.progression + '%';
      const text = card.querySelector('.objectif-progress-text');
      if (text) {
        const oldText = text.childNodes[0];
        if (oldText) oldText.textContent = obj.progression + '% · ' + obj.tachesAccomplies + ' taches accomplies · objectif estime ' + obj.objectifEstime;
      }
      // Enable "Atteint" if 100%
      const btn = card.querySelector('.btn-primary');
      if (btn && obj.progression >= 100) {
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    });
    const bar = card.querySelector('.objectif-progress');
    if (bar) bar.after(slider);
  });
}

/* ── 59. Countdown dynamique ── */
function uxTrimestreCountdown() {
  const el = document.querySelector('.trimestre-countdown');
  if (!el) return;
  const now = new Date();
  const endQ = new Date(now.getFullYear(), Math.ceil((now.getMonth() + 1) / 3) * 3, 0);
  const days = Math.ceil((endQ - now) / 86400000);
  const q = 'Q' + Math.ceil((now.getMonth() + 1) / 3);
  el.textContent = q + ' ' + now.getFullYear() + ' · J-' + days + ' avant la fin du trimestre';
}

/* ── 60. Milestone celebration ── */
function uxMilestoneCelebration() {
  const milestones = [25, 50, 75];
  document.querySelectorAll('.milestone-dot.reached').forEach(dot => {
    const pct = parseInt(dot.style.left);
    if (milestones.includes(pct)) {
      dot.style.background = 'var(--neon)';
      dot.style.boxShadow = '0 0 8px var(--neon)';
    }
  });
}

/* ── 63. Couleur par pilier ── */
function uxTrimestrePilierColor() {
  const colors = { taff: 'var(--neon)', vie: '#FF6B9D', perso: '#FFD700' };
  document.querySelectorAll('.trimestre-card').forEach((card, i) => {
    const obj = state.objectifs[i];
    if (!obj) return;
    card.style.borderLeftWidth = '4px';
    card.style.borderLeftStyle = 'solid';
    card.style.borderLeftColor = colors[obj.pilier] || 'var(--neon)';
  });
}

/* ── 64. Partager objectif ── */
function uxShareObjectif() {
  document.querySelectorAll('.trimestre-card').forEach((card, i) => {
    const obj = state.objectifs[i];
    if (!obj || card.querySelector('.ux-share-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'btn-ghost ux-share-btn';
    btn.textContent = 'Partager';
    btn.style.fontSize = '11px';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = 'Mon objectif Tao : ' + obj.titre + ' — ' + obj.progression + '% accompli !';
      navigator.clipboard?.writeText(text);
      showToast('Copie dans le presse-papier', 'success');
    });
    card.querySelector('.trimestre-card-header')?.appendChild(btn);
  });
}

/* ── 65. Objectif atteint strikethrough ── */
function uxAtteintStrikethrough() {
  document.querySelectorAll('.trimestre-card').forEach((card, i) => {
    const obj = state.objectifs[i];
    if (!obj || !obj.atteint) return;
    const h2 = card.querySelector('h2');
    if (h2) {
      h2.style.textDecoration = 'line-through';
      h2.style.opacity = '0.6';
    }
  });
}

/* ── 66. Timer de reflexion bilan ── */
function uxBilanTimer() {
  const step = document.querySelector('.bilan-step.active');
  if (!step || step.querySelector('.ux-bilan-timer')) return;
  const timer = document.createElement('div');
  timer.className = 'ux-bilan-timer';
  let seconds = 120;
  const update = () => {
    const m = Math.floor(seconds / 60), s = seconds % 60;
    timer.textContent = 'Prends ton temps · ' + m + ':' + String(s).padStart(2, '0');
    if (seconds > 0) { seconds--; setTimeout(update, 1000); }
    else timer.textContent = 'Temps ecoule — continue quand tu veux';
  };
  update();
  step.querySelector('h3')?.after(timer);
}

/* ── 67. Mood selector ── */
function uxMoodSelector() {
  const flow = document.querySelector('.bilan-flow');
  if (!flow || flow.querySelector('.ux-mood-bar')) return;
  const bar = document.createElement('div');
  bar.className = 'ux-mood-bar';
  bar.innerHTML = '<span class="text-muted" style="font-size:12px;margin-right:8px">Humeur :</span>';
  ['&#x1f60a;', '&#x1f642;', '&#x1f610;', '&#x1f614;', '&#x1f629;'].forEach(emoji => {
    const btn = document.createElement('span');
    btn.className = 'ux-mood-btn';
    btn.innerHTML = emoji;
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.ux-mood-btn').forEach(b => b.classList.remove('ux-mood-active'));
      btn.classList.add('ux-mood-active');
    });
    bar.appendChild(btn);
  });
  flow.querySelector('.fox-mascot')?.after(bar);
}

/* ── 69. Citations rotatives ── */
const _bilanQuotes = [
  '"Le progres, pas la perfection." — Proverbe Tao',
  '"Celui qui deplace une montagne commence par les petites pierres." — Confucius',
  '"La productivite n\'est pas faire plus, c\'est faire mieux." — Cal Newport',
  '"Un pas a la fois." — Proverbe chinois',
  '"L\'action est la cle fondamentale du succes." — Pablo Picasso',
  '"Commence la ou tu es, utilise ce que tu as, fais ce que tu peux." — Arthur Ashe',
  '"La discipline, c\'est choisir entre ce que tu veux maintenant et ce que tu veux le plus." — Abraham Lincoln',
];

/* ── 72. Progress indicator bilan ── */
function uxBilanProgress() {
  const steps = document.querySelectorAll('.bilan-step');
  if (!steps.length) return;
  const indicator = document.createElement('div');
  indicator.className = 'ux-bilan-progress';
  const flow = document.querySelector('.bilan-flow');
  if (flow) flow.prepend(indicator);

  function updateProgress() {
    const active = document.querySelector('.bilan-step.active');
    const idx = active ? parseInt(active.dataset.step) : 1;
    indicator.textContent = 'Etape ' + idx + '/' + steps.length;
  }
  updateProgress();
  const observer = new MutationObserver(updateProgress);
  steps.forEach(s => observer.observe(s, { attributes: true, attributeFilter: ['class'] }));
}

/* ── 73. Textarea auto-grow ── */
function uxTextareaAutoGrow() {
  document.addEventListener('input', (e) => {
    if (!e.target.matches('.bilan-textarea')) return;
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  });
}

/* ── 74. Save brouillon toast ── */
function uxBilanSaveToast() {
  document.addEventListener('blur', (e) => {
    if (!e.target.matches('.bilan-textarea')) return;
    if (e.target.value.trim()) showToast('Brouillon sauvegarde', 'success');
  }, true);
}

/* ── 76. Filtre boutique ── */
function uxBoutiqueFilter() {
  const grid = document.querySelector('.boutique-grid');
  if (!grid || grid.previousElementSibling?.classList.contains('ux-boutique-filters')) return;
  const bar = document.createElement('div');
  bar.className = 'ux-boutique-filters';
  ['Tous', 'RESSOURCES', 'COACHING'].forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'ux-filter-chip' + (cat === 'Tous' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      bar.querySelectorAll('.ux-filter-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      grid.querySelectorAll('.boutique-item').forEach(item => {
        const tag = item.querySelector('.tag')?.textContent || '';
        item.style.display = (cat === 'Tous' || tag === cat) ? '' : 'none';
      });
    });
    bar.appendChild(btn);
  });
  grid.before(bar);
}

/* ── 77. Recherche boutique ── */
function uxBoutiqueSearch() {
  const grid = document.querySelector('.boutique-grid');
  if (!grid || document.querySelector('.ux-boutique-search')) return;
  const search = document.createElement('input');
  search.className = 'ux-boutique-search';
  search.placeholder = 'Rechercher un item...';
  search.type = 'text';
  const filters = document.querySelector('.ux-boutique-filters');
  (filters || grid).before(search);
  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    grid.querySelectorAll('.boutique-item').forEach(item => {
      item.style.display = !q || item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}

/* ── 79. Badge progress bar ── */
function uxBadgeProgress() {
  document.querySelectorAll('.badge-card.verrouille').forEach(card => {
    if (card.querySelector('.ux-badge-prog')) return;
    const bar = document.createElement('div');
    bar.className = 'ux-badge-prog';
    const pct = Math.floor(Math.random() * 80) + 10;
    bar.innerHTML = '<div class="ux-badge-prog-fill" style="width:' + pct + '%"></div>';
    card.appendChild(bar);
  });
}

/* ── 80. Coins history ── */
function uxCoinsHistory() {
  const streakTab = document.querySelector('[data-tab-content="streak"]');
  if (!streakTab || streakTab.querySelector('.ux-coins-history')) return;
  const history = document.createElement('div');
  history.className = 'ux-coins-history card';
  history.innerHTML = '<div style="font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px">Historique Coins</div>';
  const entries = [
    { text: 'Tache completee', amount: '+10', time: 'il y a 2h' },
    { text: 'Bilan termine', amount: '+30', time: 'il y a 3j' },
    { text: 'Template Notion', amount: '-200', time: 'il y a 5j' },
    { text: 'Streak 7 jours', amount: '+50', time: 'il y a 1 sem' },
    { text: 'Tache completee', amount: '+10', time: 'il y a 1 sem' },
  ];
  entries.forEach(e => {
    const row = document.createElement('div');
    row.className = 'ux-history-row';
    row.innerHTML = '<span>' + e.text + '</span><span class="' + (e.amount.startsWith('+') ? 'text-neon' : '') + '">' + e.amount + '</span><span class="text-muted" style="font-size:11px">' + e.time + '</span>';
    history.appendChild(row);
  });
  streakTab.appendChild(history);
}

/* ── 81. Missing coins text ── */
function uxMissingCoins() {
  document.querySelectorAll('.boutique-item').forEach(item => {
    const btn = item.querySelector('.btn-ghost');
    if (!btn || !btn.textContent.includes('Pas assez')) return;
    const priceText = item.querySelector('.text-neon')?.textContent || '0';
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));
    const missing = price - state.user.coins;
    if (missing > 0) btn.textContent = 'Il te manque ' + missing.toLocaleString() + ' Coins';
  });
}

/* ── 82. Wishlist heart ── */
function uxWishlist() {
  document.querySelectorAll('.boutique-item').forEach(item => {
    if (item.querySelector('.ux-wishlist')) return;
    const heart = document.createElement('button');
    heart.className = 'ux-wishlist';
    heart.innerHTML = '&#x2661;';
    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      heart.classList.toggle('ux-wishlisted');
      heart.innerHTML = heart.classList.contains('ux-wishlisted') ? '&#x2764;' : '&#x2661;';
    });
    item.prepend(heart);
  });
}

/* ── 83. Niveau XP detail tooltip ── */
function uxXPTooltip() {
  const niveau = document.querySelector('.recompenses-niveau');
  if (!niveau) return;
  niveau.title = 'XP: ' + state.user.xp + ' / ' + state.user.xpNextLevel + ' · Niveau ' + state.user.niveau;
}

/* ── 85. Leaderboard mock ── */
function uxLeaderboard() {
  const streakTab = document.querySelector('[data-tab-content="streak"]');
  if (!streakTab || streakTab.querySelector('.ux-leaderboard')) return;
  const board = document.createElement('div');
  board.className = 'ux-leaderboard card';
  board.innerHTML = '<div style="font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px">Classement</div>';
  const players = [
    { name: 'Lea M.', score: 89, streak: 34 },
    { name: state.user.prenom, score: state.scoreJour.global, streak: state.user.streak },
    { name: 'Marc D.', score: 62, streak: 8 },
    { name: 'Julie K.', score: 55, streak: 5 },
  ].sort((a, b) => b.score - a.score);
  players.forEach((p, i) => {
    const row = document.createElement('div');
    row.className = 'ux-lb-row' + (p.name === state.user.prenom ? ' ux-lb-me' : '');
    row.innerHTML = '<span class="ux-lb-rank">#' + (i + 1) + '</span><span>' + p.name + '</span><span class="text-neon">' + p.score + '</span>';
    board.appendChild(row);
  });
  streakTab.appendChild(board);
}

/* ── 86. Preview theme live ── */
function uxThemeLive() {
  document.querySelectorAll('.theme-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      const bg = swatch.style.background;
      if (bg === '#1a1a2e') {
        document.documentElement.style.setProperty('--bg', '#1a1a2e');
        document.documentElement.style.setProperty('--bg-elevated', '#232350');
        document.documentElement.style.setProperty('--surface', '#2d2d60');
      } else if (bg === '#f5f5f5') {
        showToast('Theme clair bientot disponible', 'success');
      } else {
        document.documentElement.style.removeProperty('--bg');
        document.documentElement.style.removeProperty('--bg-elevated');
        document.documentElement.style.removeProperty('--surface');
      }
    });
  });
}

/* ── 88. Raccourcis clavier page ── */
function uxKeyboardHelp() {
  const sections = document.querySelectorAll('#page-reglages .reglage-section');
  const last = sections[sections.length - 1];
  if (!last || document.querySelector('.ux-shortcuts')) return;
  const card = document.createElement('div');
  card.className = 'card reglage-section ux-shortcuts';
  card.innerHTML = '<h3 style="margin-bottom:16px">Raccourcis clavier</h3>'
    + '<div class="reglage-row"><span class="reglage-label">Ctrl+K</span><span class="text-muted">Palette de commandes</span></div>'
    + '<div class="reglage-row"><span class="reglage-label">Ctrl+N</span><span class="text-muted">Ajouter une tache</span></div>'
    + '<div class="reglage-row"><span class="reglage-label">Ctrl+F</span><span class="text-muted">Rechercher dans todo</span></div>'
    + '<div class="reglage-row"><span class="reglage-label">J / K</span><span class="text-muted">Naviguer dans les todos</span></div>'
    + '<div class="reglage-row"><span class="reglage-label">X</span><span class="text-muted">Cocher la tache selectionnee</span></div>'
    + '<div class="reglage-row"><span class="reglage-label">Escape</span><span class="text-muted">Fermer modale / focus</span></div>';
  last.after(card);
}

/* ── 89. Feedback inline ── */
function uxFeedback() {
  document.querySelectorAll('#page-reglages .reglage-section').forEach(section => {
    if (section.querySelector('.ux-feedback')) return;
    const fb = document.createElement('div');
    fb.className = 'ux-feedback';
    fb.innerHTML = '<span class="text-muted" style="font-size:11px">Cette section est utile ?</span> <button class="ux-fb-btn">&#x1f44d;</button><button class="ux-fb-btn">&#x1f44e;</button>';
    fb.querySelectorAll('.ux-fb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        fb.innerHTML = '<span class="text-muted" style="font-size:11px">Merci pour le retour !</span>';
      });
    });
    section.appendChild(fb);
  });
}

/* ── 90. Connexion status ── */
function uxConnexionStatus() {
  document.querySelectorAll('#page-reglages .btn-secondary').forEach(btn => {
    if (btn.textContent.includes('Connecter') && !btn.querySelector('.ux-status-dot')) {
      const dot = document.createElement('span');
      dot.className = 'ux-status-dot offline';
      btn.prepend(dot);
    }
  });
}

/* ── 91. Reset demo ── */
function uxResetDemo() {
  const sections = document.querySelectorAll('#page-reglages .reglage-section');
  const last = sections[sections.length - 1];
  if (!last || document.querySelector('.ux-reset-btn')) return;
  const btn = document.createElement('button');
  btn.className = 'btn-ghost ux-reset-btn';
  btn.style.marginTop = '12px';
  btn.textContent = 'Reinitialiser la demo';
  btn.addEventListener('click', () => {
    if (confirm('Reinitialiser toutes les donnees ?')) {
      window.location.reload();
    }
  });
  last.appendChild(btn);
}

/* ── 94. Dark/light indicator ── */
/* Already handled by theme preview in reglages */

/* ── 95. Notifications center ── */
function uxNotifications() {
  const headerRight = document.querySelector('.header-right');
  if (!headerRight || headerRight.querySelector('.ux-notif-bell')) return;
  const bell = document.createElement('div');
  bell.className = 'ux-notif-bell';
  bell.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg><span class="ux-notif-badge">3</span>';
  bell.style.cursor = 'pointer';
  headerRight.querySelector('.header-coins')?.after(bell);

  const notifs = [
    { text: 'Rappel : Session HIIT dans 2h', time: 'il y a 5 min' },
    { text: 'Streak 12 jours ! Continue.', time: 'il y a 1h' },
    { text: 'Bilan vendredi a 18h', time: 'hier' },
  ];

  bell.addEventListener('click', () => {
    let dd = document.querySelector('.ux-notif-dropdown');
    if (dd) { dd.remove(); return; }
    dd = document.createElement('div');
    dd.className = 'ux-notif-dropdown';
    dd.innerHTML = '<div style="padding:12px 16px;font-family:var(--font-mono);font-size:11px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid var(--border)">Notifications</div>';
    notifs.forEach(n => {
      const item = document.createElement('div');
      item.className = 'ux-notif-item';
      item.innerHTML = '<span>' + n.text + '</span><span class="text-muted" style="font-size:11px">' + n.time + '</span>';
      dd.appendChild(item);
    });
    headerRight.appendChild(dd);
    requestAnimationFrame(() => dd.classList.add('open'));
    setTimeout(() => {
      document.addEventListener('click', function handler(ev) {
        if (!ev.target.closest('.ux-notif-dropdown') && !ev.target.closest('.ux-notif-bell')) {
          dd?.remove();
          document.removeEventListener('click', handler);
        }
      });
    }, 0);
  });
}

/* ── 96. Breadcrumbs ── */
function uxBreadcrumbs() {
  const titles = {
    'aujourdhui': "Aujourd'hui", 'chat': 'Chat', 'todo': 'Todo',
    'semaine': 'Semaine', 'trimestre': 'Trimestre', 'bilan': 'Bilan',
    'recompenses': 'Recompenses', 'reglages': 'Reglages',
  };
  on('page-changed', (pageId) => {
    let bc = document.querySelector('.ux-breadcrumbs');
    if (!bc) {
      bc = document.createElement('div');
      bc.className = 'ux-breadcrumbs';
      const header = document.querySelector('.header');
      if (header) header.after(bc);
    }
    bc.innerHTML = '<span class="ux-bc-item" onclick="navigateTo(\'aujourdhui\')">Tao</span> <span class="ux-bc-sep">/</span> <span class="ux-bc-current">' + (titles[pageId] || pageId) + '</span>';
  });
}

/* ── 97. Keyboard navigation ── */
function uxKeyboardNav() {
  document.querySelectorAll('.sidebar-nav-item').forEach((item, i) => {
    item.setAttribute('tabindex', '0');
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') item.click();
    });
  });
}

/* ── 98. Page transition ── */
function uxPageTransition() {
  on('page-changed', () => {
    const active = document.querySelector('.page-section.active');
    if (!active) return;
    active.style.opacity = '0';
    active.style.transform = 'translateY(6px)';
    requestAnimationFrame(() => {
      active.style.transition = 'opacity 200ms ease, transform 200ms ease';
      active.style.opacity = '1';
      active.style.transform = 'translateY(0)';
    });
  });
}

/* ── 99. Favicon badge ── */
function uxFaviconBadge() {
  const remaining = state.taches.filter(t => t.statut !== 'fait').length;
  if (remaining === 0) return;
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#3DFF70';
  ctx.beginPath();
  ctx.arc(16, 16, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#060809';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(remaining), 16, 17);
  const link = document.querySelector('link[rel="icon"]');
  if (link) link.href = canvas.toDataURL();
  on('tache-updated', () => {
    const r = state.taches.filter(t => t.statut !== 'fait').length;
    ctx.clearRect(0, 0, 32, 32);
    ctx.fillStyle = r > 0 ? '#3DFF70' : '#2A2A2E';
    ctx.beginPath(); ctx.arc(16, 16, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#060809';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(r > 0 ? String(r) : '✓', 16, 17);
    if (link) link.href = canvas.toDataURL();
  });
}

/* ── 100. Idle detection ── */
function uxIdleDetection() {
  let timer;
  const reset = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (state.ui.focusModeActive) return;
      const overlay = document.createElement('div');
      overlay.className = 'ux-idle-overlay';
      overlay.innerHTML = '<div class="ux-idle-card"><div style="font-size:48px;margin-bottom:16px">&#x1f634;</div><h3>Tu es encore la ?</h3><p class="text-muted" style="margin:8px 0 20px;font-size:14px">5 minutes d\'inactivite. Reviens au focus !</p><button class="btn-primary" style="width:100%;justify-content:center">Je suis la</button></div>';
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('active'));
      overlay.querySelector('.btn-primary').addEventListener('click', () => {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 250);
        reset();
      });
    }, 300000); // 5 min
  };
  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(evt => document.addEventListener(evt, reset, { passive: true }));
  reset();
}


/* ═══════════════════════════════════════════
   COMMAND PALETTE (93)
   ═══════════════════════════════════════════ */

function uxCommandPalette() {
  const cmds = [
    { label: "Aujourd'hui", action: () => navigateTo('aujourdhui'), icon: '☀' },
    { label: 'Chat', action: () => navigateTo('chat'), icon: '💬' },
    { label: 'Todo', action: () => navigateTo('todo'), icon: '✓' },
    { label: 'Semaine', action: () => navigateTo('semaine'), icon: '📅' },
    { label: 'Trimestre', action: () => navigateTo('trimestre'), icon: '🎯' },
    { label: 'Bilan', action: () => navigateTo('bilan'), icon: '📖' },
    { label: 'Recompenses', action: () => navigateTo('recompenses'), icon: '🪙' },
    { label: 'Reglages', action: () => navigateTo('reglages'), icon: '⚙' },
    { label: 'Ajouter une tache', action: () => { const m = document.getElementById('modal-add-todo'); if (m) m.classList.add('active'); }, icon: '+' },
    { label: 'Mode focus', action: () => { const t = state.taches.find(t => t.statut !== 'fait'); if (t) actions.demarrerFocus(t.id); }, icon: '🔥' },
    { label: 'Mon score', action: () => showToast('Score: ' + state.scoreJour.global + '/100', 'success'), icon: '📊' },
    { label: 'Mon streak', action: () => showToast('Streak: ' + state.user.streak + ' jours', 'success'), icon: '🔥' },
  ];

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      let existing = document.querySelector('.ux-cmd-palette');
      if (existing) { existing.remove(); return; }

      const overlay = document.createElement('div');
      overlay.className = 'ux-cmd-palette';
      overlay.innerHTML = '<div class="ux-cmd-modal"><input class="ux-cmd-input" placeholder="Que veux-tu faire ?" autofocus><div class="ux-cmd-list"></div></div>';
      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add('active'));

      const input = overlay.querySelector('.ux-cmd-input');
      const list = overlay.querySelector('.ux-cmd-list');

      function render(filter) {
        list.innerHTML = '';
        const q = (filter || '').toLowerCase();
        cmds.filter(c => !q || c.label.toLowerCase().includes(q)).forEach((cmd, i) => {
          const item = document.createElement('div');
          item.className = 'ux-cmd-result' + (i === 0 ? ' ux-cmd-active' : '');
          item.innerHTML = '<span class="ux-cmd-icon">' + cmd.icon + '</span><span>' + cmd.label + '</span>';
          item.addEventListener('click', () => { close(); cmd.action(); });
          list.appendChild(item);
        });
      }
      render('');

      input.addEventListener('input', () => render(input.value));
      input.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') close();
        if (ev.key === 'Enter') {
          const active = list.querySelector('.ux-cmd-active');
          if (active) active.click();
        }
        if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
          ev.preventDefault();
          const items = [...list.querySelectorAll('.ux-cmd-result')];
          const idx = items.findIndex(i => i.classList.contains('ux-cmd-active'));
          items.forEach(i => i.classList.remove('ux-cmd-active'));
          const next = ev.key === 'ArrowDown' ? Math.min(idx + 1, items.length - 1) : Math.max(idx - 1, 0);
          items[next]?.classList.add('ux-cmd-active');
          items[next]?.scrollIntoView({ block: 'nearest' });
        }
      });

      overlay.addEventListener('click', (ev) => { if (ev.target === overlay) close(); });

      function close() {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 200);
      }
    }
  });
}


/* ═══════════════════════════════════════════
   INIT — Wire all enhancements
   ═══════════════════════════════════════════ */

// Global inits (run once at boot)
document.addEventListener('DOMContentLoaded', () => {
  uxTabTitle();
  uxAllDoneCheck();
  uxGlobalQuickAdd();
  uxTodoSearch();
  uxTodoBulkSelect();
  uxSubtasks();
  uxUndoDelete();
  uxTodoEmptyStates();
  uxTextareaAutoGrow();
  uxTacheInlineEdit();
  uxChatReactions();
  uxChatCopy();
  uxCommandPalette();
  uxNotifications();
  uxBreadcrumbs();
  uxKeyboardNav();
  uxPageTransition();
  uxFaviconBadge();
  uxIdleDetection();
});

// Page-specific inits (called by enhanced initPageContent)
const _origInitPageContent = window.initPageContent;
window.initPageContent = async function(pageId) {
  if (_origInitPageContent) await _origInitPageContent(pageId);

  switch (pageId) {
    case 'aujourdhui':
      uxGreeting();
      uxLiveDate();
      uxScoreRingHover();
      uxNowPulse();
      uxAutoHighlight();
      uxNextTaskCountdown();
      uxObjectifTooltip();
      uxStreakBadge();
      uxStaggerCards();
      uxEmptyState();
      break;
    case 'chat':
      uxChatContextGreeting();
      uxChatSuggestions();
      uxSlashCommands();
      uxChatSearch();
      uxMessageGrouping();
      uxScrollToBottom();
      uxLinkDetection();
      uxRelativeTime();
      break;
    case 'todo':
      uxPriorityDots();
      uxProjetProgress();
      break;
    case 'semaine':
      uxSemaineNav();
      uxSemaineAddPlage();
      uxPlageColors();
      uxTodayColHighlight();
      uxGraphTooltips();
      uxExportSemaine();
      uxWeekendDim();
      break;
    case 'trimestre':
      uxTrimestreCountdown();
      uxTrimestreSlider();
      uxMilestoneCelebration();
      uxTrimestrePilierColor();
      uxShareObjectif();
      uxAtteintStrikethrough();
      break;
    case 'bilan':
      uxBilanTimer();
      uxMoodSelector();
      uxBilanProgress();
      uxBilanSaveToast();
      break;
    case 'recompenses':
      uxBoutiqueFilter();
      uxBoutiqueSearch();
      uxBadgeProgress();
      uxCoinsHistory();
      uxMissingCoins();
      uxWishlist();
      uxXPTooltip();
      uxLeaderboard();
      break;
    case 'reglages':
      uxThemeLive();
      uxKeyboardHelp();
      uxFeedback();
      uxConnexionStatus();
      uxResetDemo();
      break;
  }
};
