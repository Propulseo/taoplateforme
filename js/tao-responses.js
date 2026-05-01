/* ═══════════════════════════════════════════
   TAO — Reponses mock par mots-cles
   + effet typing caractere par caractere
   ═══════════════════════════════════════════ */

/* ── Labels des listes todo ── */
var _listeLabels = {
  longTerme: 'Long terme',
  enAttente: 'En attente',
  boite: 'Boite de reception',
  aujourdhui: "Aujourd'hui",
};

/* ── Extraire le titre d'un message ── */
function extractTitre(msg) {
  var patterns = [
    /rappelle[- ]?moi\s+(?:de\s+|que\s+|qu['\u2019])?(.+)/i,
    /garde\s+(?:en\s+t[eê]te|[aà]\s+l['\u2019]esprit)\s+(?:que\s+|qu['\u2019])?(.+)/i,
    /note\s+(?:que\s+|qu['\u2019])?(.+)/i,
    /j['\u2019]?attends\s+(.+)/i,
    /en\s+attente\s+de\s+(.+)/i,
  ];
  for (var i = 0; i < patterns.length; i++) {
    var m = msg.match(patterns[i]);
    if (m) {
      var t = m[1].trim();
      // Capitalise first letter
      return t.charAt(0).toUpperCase() + t.slice(1);
    }
  }
  // Fallback: use whole message, trimmed
  return msg.length > 60 ? msg.substring(0, 57) + '...' : msg;
}

/* ── Reponses par mots-cles ── */
var taoResponses = [
  {
    keywords: ['rappelle', 'rappeler', 'rappelle-moi'],
    response: function(msg) {
      var titre = extractTitre(msg);
      actions.ajouterTodo('longTerme', titre, { source: 'chat', depuis: 'maintenant', _silent: true });
      return {
        text: "J'ai note.",
        capture: { liste: 'longTerme', titre: titre }
      };
    }
  },
  {
    keywords: ['garde en tete', "garde a l'esprit", 'garde \u00e0 l\'esprit', 'note que', 'note '],
    response: function(msg) {
      var titre = extractTitre(msg);
      actions.ajouterTodo('longTerme', titre, { source: 'chat', depuis: 'maintenant', _silent: true });
      return {
        text: "Note dans Long terme.",
        capture: { liste: 'longTerme', titre: titre }
      };
    }
  },
  {
    keywords: ["j'attends", 'en attente de', 'en attente'],
    response: function(msg) {
      var titre = extractTitre(msg);
      actions.ajouterTodo('enAttente', titre, { source: 'chat', enAttenteDe: '', jours: 0, _silent: true });
      return {
        text: "Ajoute en attente.",
        capture: { liste: 'enAttente', titre: titre }
      };
    }
  },
  {
    keywords: ['merci', 'thanks', 'thx', 'parfait', 'genial', 'top', 'cool'],
    response: function() {
      return { text: "De rien." };
    }
  },
  {
    keywords: ['comment ca va', 'comment vas-tu', 'ca va', '\u00e7a va'],
    response: function() {
      return { text: "Concentre. Toi ?" };
    }
  },
  {
    keywords: ['objectif', 'objectifs', 'priorite', 'priorit\u00e9'],
    response: function() {
      return { text: "Tes 3 objectifs sont sur la page Trimestre. Tu veux y aller ?" };
    }
  },
  {
    keywords: ['score', 'progression', 'avancement'],
    response: function() {
      return {
        text: 'Score du jour : ' + state.scoreJour.global + '/100. Streak ' + state.user.streak + ' jours.'
      };
    }
  },
  {
    keywords: ['focus', 'concentration', 'plage', 'deep work'],
    response: function() {
      return { text: "Ta prochaine plage de focus : 14h00. Bloque ton calendrier." };
    }
  },
  {
    keywords: ['bilan', 'vendredi', 'semaine'],
    response: function() {
      return { text: "Bilan vendredi soir 18h. Je t'enverrai une notif." };
    }
  },
  {
    keywords: ['bonjour', 'salut', 'hello', 'hey', 'coucou'],
    response: function() {
      return { text: "Salut. Pret a avancer ?" };
    }
  },
  {
    keywords: ['aide', 'help', 'comment', 'quoi faire'],
    response: function() {
      return { text: "Dis-moi ce que tu veux noter, je le classe. Ou demande-moi ton score, tes objectifs, ton prochain focus." };
    }
  },
  // Default fallback (keywords vide = toujours match en dernier)
  {
    keywords: [],
    response: function() {
      return { text: "J'ai bien note. On en parle dans l'app pour aller plus loin." };
    }
  }
];

/* ── Trouver la reponse ── */
function getMockResponse(message) {
  var lower = message.toLowerCase();
  for (var i = 0; i < taoResponses.length; i++) {
    var rule = taoResponses[i];
    if (rule.keywords.length === 0) return rule.response(message);
    for (var j = 0; j < rule.keywords.length; j++) {
      if (lower.indexOf(rule.keywords[j]) !== -1) {
        return rule.response(message);
      }
    }
  }
  return taoResponses[taoResponses.length - 1].response(message);
}

/* ═══════════════════════════════════════════
   EFFET TYPING
   ═══════════════════════════════════════════ */

function sleep(ms) {
  return new Promise(function(r) { setTimeout(r, ms); });
}

async function typeResponse(text, container, speed) {
  speed = speed || 30;
  for (var i = 0; i < text.length; i++) {
    container.textContent += text[i];
    // Scroll parent chat
    var chat = document.querySelector('.chat-messages');
    if (chat) chat.scrollTop = chat.scrollHeight;
    await sleep(speed);
  }
}
