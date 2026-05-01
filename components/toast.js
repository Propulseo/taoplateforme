/* ═══════════════════════════════════════════
   TAO — Toast / Notifications
   3 types : coins (vert neon), success (vert), error (rouge)
   Position : bottom-right desktop, bottom-center mobile
   Animation : slide-in 200ms
   ═══════════════════════════════════════════ */

(function() {
  // Inject styles once
  var style = document.createElement('style');
  style.textContent = [
    '.tao-toast-container { position:fixed; bottom:24px; right:24px; z-index:9999; display:flex; flex-direction:column-reverse; gap:8px; pointer-events:none; }',
    '@media (max-width:768px) { .tao-toast-container { right:50%; transform:translateX(50%); bottom:80px; } }',
    '.tao-toast { padding:10px 20px; border-radius:8px; font-family:var(--font-mono,monospace); font-size:13px; font-weight:600; color:#fff; pointer-events:auto; opacity:0; transform:translateY(12px); animation:tao-toast-in 200ms ease forwards; }',
    '.tao-toast-out { animation:tao-toast-out 200ms ease forwards; }',
    '.tao-toast-coins { background:linear-gradient(135deg,#0a2a12,#0d3518); border:1px solid var(--neon,#3DFF70); color:var(--neon,#3DFF70); text-shadow:0 0 8px rgba(61,255,112,0.4); }',
    '.tao-toast-success { background:linear-gradient(135deg,#0a2a12,#0d3518); border:1px solid var(--neon,#3DFF70); color:var(--neon,#3DFF70); }',
    '.tao-toast-error { background:linear-gradient(135deg,#2a0a0a,#351018); border:1px solid #FF4444; color:#FF4444; }',
    '@keyframes tao-toast-in { to { opacity:1; transform:translateY(0); } }',
    '@keyframes tao-toast-out { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(-8px); } }',
  ].join('\n');
  document.head.appendChild(style);

  // Create container
  var container = document.createElement('div');
  container.className = 'tao-toast-container';
  document.body.appendChild(container);

  // Public API
  window.showToast = function(text, type, duration) {
    type = type || 'success';
    duration = duration || 1500;
    var toast = document.createElement('div');
    toast.className = 'tao-toast tao-toast-' + type;
    toast.textContent = text;
    container.appendChild(toast);
    setTimeout(function() {
      toast.classList.add('tao-toast-out');
      toast.addEventListener('animationend', function() { toast.remove(); });
    }, duration);
  };
})();
