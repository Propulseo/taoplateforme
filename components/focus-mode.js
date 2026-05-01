/* ═══════════════════════════════════════════
   TAO — Mode Focus (plein ecran + timer)
   Demo : 45s | Reel : 45min
   ═══════════════════════════════════════════ */

(function() {

  /* ── CSS ── */
  var css = document.createElement('style');
  css.textContent = [
    '.focus-overlay { position:fixed; inset:0; background:var(--bg,#0A0C0E); z-index:500; display:none; flex-direction:column; align-items:center; justify-content:center; gap:32px; }',
    '.focus-overlay.active { display:flex; animation:fadeIn 250ms ease-out; }',
    '.focus-mode-toggle { display:flex; gap:0; border:1px solid var(--border,#1a1d21); border-radius:8px; overflow:hidden; position:absolute; top:24px; right:24px; }',
    '.focus-mode-btn { padding:8px 16px; font-family:var(--font-mono,monospace); font-size:12px; color:var(--text-muted,#555); background:transparent; border:none; cursor:pointer; transition:all 200ms; }',
    '.focus-mode-btn.active { background:var(--surface,#12151a); color:var(--neon,#3DFF70); }',
    '.focus-timer { position:relative; width:220px; height:220px; }',
    '.focus-timer svg { width:100%; height:100%; transform:rotate(-90deg); }',
    '.focus-timer-bg { fill:none; stroke:var(--border,#1a1d21); stroke-width:6; }',
    '.focus-timer-fill { fill:none; stroke:var(--neon,#3DFF70); stroke-width:6; stroke-linecap:round; transition:stroke-dashoffset 1s linear; }',
    '.focus-timer-text { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }',
    '.focus-timer-value { font-family:var(--font-display,monospace); font-weight:800; font-size:48px; color:var(--text,#fff); letter-spacing:2px; }',
    '.focus-timer-label { font-family:var(--font-mono,monospace); font-size:12px; color:var(--text-muted,#555); margin-top:4px; }',
    '.focus-task-info { text-align:center; max-width:400px; }',
    '.focus-task-titre { font-family:var(--font-display,monospace); font-size:20px; font-weight:700; color:var(--text,#fff); margin-bottom:8px; }',
    '.focus-task-meta { font-family:var(--font-mono,monospace); font-size:13px; color:var(--text-muted,#555); }',
    '.focus-actions { display:flex; gap:16px; margin-top:8px; }',
    '.focus-btn-done { padding:12px 32px; background:var(--neon,#3DFF70); color:#0A0C0E; border:none; border-radius:8px; font-family:var(--font-mono,monospace); font-weight:700; font-size:14px; cursor:pointer; transition:all 200ms; }',
    '.focus-btn-done:hover { box-shadow:0 0 20px rgba(61,255,112,0.4); transform:translateY(-1px); }',
    '.focus-btn-quit { padding:12px 24px; background:transparent; color:var(--text-muted,#555); border:1px solid var(--border,#1a1d21); border-radius:8px; font-family:var(--font-mono,monospace); font-size:13px; cursor:pointer; transition:all 200ms; }',
    '.focus-btn-quit:hover { border-color:var(--text-muted,#555); color:var(--text,#fff); }',
    '.focus-close { position:absolute; top:24px; left:24px; color:var(--text-muted,#555); cursor:pointer; padding:8px; transition:color 200ms; }',
    '.focus-close:hover { color:var(--text,#fff); }',
    '.focus-pulse { animation:focus-ring-pulse 2s ease-in-out infinite; }',
    '@keyframes focus-ring-pulse { 0%,100% { filter:drop-shadow(0 0 0 rgba(61,255,112,0)); } 50% { filter:drop-shadow(0 0 12px rgba(61,255,112,0.3)); } }',
  ].join('\n');
  document.head.appendChild(css);

  /* ── HTML ── */
  var overlay = document.createElement('div');
  overlay.className = 'focus-overlay';
  overlay.innerHTML = ''
    + '<button class="focus-close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'
    + '<div class="focus-mode-toggle">'
    +   '<button class="focus-mode-btn active" data-mode="demo">Demo (45s)</button>'
    +   '<button class="focus-mode-btn" data-mode="real">Reel (45min)</button>'
    + '</div>'
    + '<div class="focus-timer">'
    +   '<svg viewBox="0 0 220 220">'
    +     '<circle class="focus-timer-bg" cx="110" cy="110" r="100"/>'
    +     '<circle class="focus-timer-fill" cx="110" cy="110" r="100" stroke-dasharray="628.32" stroke-dashoffset="0"/>'
    +   '</svg>'
    +   '<div class="focus-timer-text">'
    +     '<div class="focus-timer-value">00:45</div>'
    +     '<div class="focus-timer-label">restant</div>'
    +   '</div>'
    + '</div>'
    + '<div class="focus-task-info">'
    +   '<div class="focus-task-titre"></div>'
    +   '<div class="focus-task-meta"></div>'
    + '</div>'
    + '<div class="focus-actions">'
    +   '<button class="focus-btn-done">Terminer</button>'
    +   '<button class="focus-btn-quit">Abandonner</button>'
    + '</div>';
  document.body.appendChild(overlay);

  /* ── Refs ── */
  var timerFill = overlay.querySelector('.focus-timer-fill');
  var timerValue = overlay.querySelector('.focus-timer-value');
  var taskTitre = overlay.querySelector('.focus-task-titre');
  var taskMeta = overlay.querySelector('.focus-task-meta');
  var CIRC = 628.32; // 2 * PI * 100

  var intervalId = null;
  var totalSec = 45;
  var remaining = 0;

  var pilierLabels = { taff: 'Taff', vie: 'Vie', perso: 'Perso' };

  /* ── Open ── */
  function openFocus(tacheId) {
    var tache = state.taches.find(function(t) { return t.id === tacheId; });
    if (!tache) return;

    totalSec = state.ui.focusMode === 'real' ? 2700 : 45;
    remaining = totalSec;

    taskTitre.textContent = tache.titre;
    taskMeta.textContent = (pilierLabels[tache.pilier] || '') + ' · ' + tache.plageDebut + ' \u2192 ' + tache.plageFin;

    timerFill.style.transition = 'none';
    timerFill.style.strokeDashoffset = '0';
    overlay.classList.add('active');
    updateDisplay();

    // Force reflow then enable transition
    timerFill.getBoundingClientRect();
    timerFill.style.transition = 'stroke-dashoffset 1s linear';

    clearInterval(intervalId);
    intervalId = setInterval(tick, 1000);
  }

  /* ── Close ── */
  function closeFocus() {
    overlay.classList.remove('active');
    clearInterval(intervalId);
    intervalId = null;
  }

  /* ── Tick ── */
  function tick() {
    remaining--;
    if (remaining <= 0) {
      remaining = 0;
      updateDisplay();
      clearInterval(intervalId);
      showToast('Focus termine !', 'success');
      setTimeout(function() { actions.terminerFocus(); }, 500);
      return;
    }
    updateDisplay();
  }

  /* ── Display ── */
  function updateDisplay() {
    var min = Math.floor(remaining / 60);
    var sec = remaining % 60;
    timerValue.textContent = String(min).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
    var progress = 1 - (remaining / totalSec);
    timerFill.style.strokeDashoffset = String(CIRC * progress);
    // Pulse when < 10s
    if (remaining <= 10 && remaining > 0) {
      timerFill.parentElement.classList.add('focus-pulse');
    } else {
      timerFill.parentElement.classList.remove('focus-pulse');
    }
  }

  /* ── Events ── */
  on('focus-started', openFocus);
  on('focus-ended', closeFocus);

  /* ── Buttons ── */
  overlay.querySelector('.focus-btn-done').addEventListener('click', function() {
    actions.terminerFocus();
  });

  overlay.querySelector('.focus-btn-quit').addEventListener('click', function() {
    actions.abandonnerFocus();
  });

  overlay.querySelector('.focus-close').addEventListener('click', function() {
    actions.abandonnerFocus();
  });

  /* ── Mode toggle ── */
  overlay.querySelectorAll('.focus-mode-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      overlay.querySelectorAll('.focus-mode-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      state.ui.focusMode = btn.dataset.mode;
      // Reset timer with new duration
      totalSec = btn.dataset.mode === 'real' ? 2700 : 45;
      remaining = totalSec;
      updateDisplay();
      clearInterval(intervalId);
      intervalId = setInterval(tick, 1000);
    });
  });

  /* ── Keyboard: Escape to abandon ── */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      actions.abandonnerFocus();
    }
  });

})();
