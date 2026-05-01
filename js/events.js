/* ═══════════════════════════════════════════
   TAO — Event Bus (pub/sub)
   Systeme d'evenements pour connecter
   state mutations → UI updates
   ═══════════════════════════════════════════ */

const _bus = {};

function on(evt, fn) {
  (_bus[evt] ||= []).push(fn);
}

function off(evt, fn) {
  if (_bus[evt]) _bus[evt] = _bus[evt].filter(f => f !== fn);
}

function emit(evt, data) {
  (_bus[evt] || []).forEach(fn => fn(data));
}
