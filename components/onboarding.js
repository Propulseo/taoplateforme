/* ═══════════════════════════════════════════
   TAO — Onboarding overlay (3 steps)
   Self-contained IIFE · injects CSS
   ═══════════════════════════════════════════ */

(function() {
  // CSS
  var style = document.createElement('style');
  style.textContent = [
    '.onb-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 250ms ease}',
    '.onb-overlay.active{opacity:1}',
    '.onb-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:40px;max-width:420px;width:90%;text-align:center;transform:scale(0.95);transition:transform 250ms ease}',
    '.onb-overlay.active .onb-card{transform:scale(1)}',
    '.onb-icon{margin-bottom:20px}',
    '.onb-title{font-family:var(--font-display);font-size:1.5rem;font-weight:800;margin-bottom:12px;letter-spacing:-0.02em}',
    '.onb-desc{color:var(--text-muted);font-size:14px;line-height:1.6;margin-bottom:24px}',
    '.onb-dots{display:flex;gap:8px;justify-content:center;margin-bottom:24px}',
    '.onb-dot{width:8px;height:8px;border-radius:50%;background:var(--border);transition:background 200ms}',
    '.onb-dot.active{background:var(--neon)}',
    '.onb-skip{position:absolute;top:20px;right:24px;background:none;border:none;color:var(--text-muted);font-size:12px;cursor:pointer;font-family:var(--font-mono);letter-spacing:0.05em}',
    '.onb-skip:hover{color:var(--text-primary)}',
    '.onb-piliers{display:flex;gap:16px;justify-content:center;margin-bottom:20px}',
    '.onb-pilier{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;font-family:var(--font-mono);color:var(--text-muted)}',
    '.onb-pilier-dot{width:32px;height:32px;border-radius:50%;background:var(--neon-deep);border:2px solid var(--neon);display:flex;align-items:center;justify-content:center}',
  ].join('\n');
  document.head.appendChild(style);

  var steps = [
    {
      icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
      title: 'Salut ' + (typeof state !== 'undefined' ? state.user.prenom : 'toi'),
      desc: 'Bienvenue sur <strong>Tao</strong>. Chaque jour, tu choisis 3 taches. Pas plus. Le reste, c\'est du bruit.',
      btn: 'Continuer'
    },
    {
      icon: '',
      title: '3 piliers, 3 objectifs',
      desc: 'Taff, Vie, Perso. Chaque tache appartient a un pilier. Chaque pilier a un objectif trimestriel.',
      btn: 'Compris',
      piliers: true
    },
    {
      icon: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" stroke-width="1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
      title: 'Pret a avancer ?',
      desc: 'Tu as <strong>3 taches</strong> qui t\'attendent. Complete-les pour gagner des Coins et garder ton streak.',
      btn: 'C\'est parti'
    }
  ];

  var current = 0;
  var overlay, card;

  function render() {
    var s = steps[current];
    var dots = '';
    for (var i = 0; i < steps.length; i++) {
      dots += '<div class="onb-dot' + (i === current ? ' active' : '') + '"></div>';
    }
    var piliers = '';
    if (s.piliers) {
      piliers = '<div class="onb-piliers">'
        + '<div class="onb-pilier"><div class="onb-pilier-dot"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div>Taff</div>'
        + '<div class="onb-pilier"><div class="onb-pilier-dot"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></div>Vie</div>'
        + '<div class="onb-pilier"><div class="onb-pilier-dot"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--neon)" stroke-width="1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg></div>Perso</div>'
        + '</div>';
    }
    card.innerHTML = '<div class="onb-icon">' + (s.icon || '') + '</div>'
      + '<div class="onb-title">' + s.title + '</div>'
      + piliers
      + '<div class="onb-desc">' + s.desc + '</div>'
      + '<div class="onb-dots">' + dots + '</div>'
      + '<button class="btn-primary" style="width:100%;justify-content:center">' + s.btn + '</button>';
    card.querySelector('.btn-primary').addEventListener('click', next);
  }

  function next() {
    current++;
    if (current >= steps.length) {
      close();
      return;
    }
    render();
  }

  function close() {
    if (state && state.ui) state.ui.onboardingDone = true;
    overlay.classList.remove('active');
    setTimeout(function() { overlay.remove(); }, 250);
  }

  function show() {
    overlay = document.createElement('div');
    overlay.className = 'onb-overlay';
    overlay.innerHTML = '<button class="onb-skip">PASSER</button><div class="onb-card"></div>';
    card = overlay.querySelector('.onb-card');
    overlay.querySelector('.onb-skip').addEventListener('click', close);
    document.body.appendChild(overlay);
    render();
    requestAnimationFrame(function() { overlay.classList.add('active'); });
  }

  // Auto-show on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(show, 400);
  });
})();
