/* ═══════════════════════════════════════════
   TAO — Mock Data
   Donnees realistes pour le prototype V1
   ═══════════════════════════════════════════ */

const TAO_DATA = {

  // ── Utilisateur ──
  user: {
    prenom: 'Etienne',
    email: 'etienne@tao.app',
    plan: 'Pro',
    coins: 1247,
    xp: 4200,
    niveau: 4,
    xpNextLevel: 7500,
    streak: 12,
    bestStreak: 23,
    createdAt: '2026-03-15',
    heureDebut: '08:00',
    heureFin: '19:00',
    notifMatin: '07:15',
    notifSoir: '21:30',
  },

  // ── 3 Objectifs trimestriels ──
  objectifs: [
    {
      id: 1,
      pilier: 'taff',
      label: 'TAFF',
      icon: 'briefcase',
      titre: 'Lancer Tao avec 200 utilisateurs',
      progression: 62,
      tachesAccomplies: 31,
      objectifEstime: 50,
      atteint: false,
    },
    {
      id: 2,
      pilier: 'vie',
      label: 'VIE',
      icon: 'heart',
      titre: '2 weekends/mois sans ecran avec Lea',
      progression: 45,
      tachesAccomplies: 9,
      objectifEstime: 20,
      atteint: false,
    },
    {
      id: 3,
      pilier: 'perso',
      label: 'PERSO',
      icon: 'sparkles',
      titre: 'Reprendre le sport 3x/semaine',
      progression: 38,
      tachesAccomplies: 15,
      objectifEstime: 39,
      atteint: false,
    },
  ],

  // ── 3 Taches du jour ──
  taches: [
    {
      id: 1,
      titre: 'Finaliser le design du dashboard Tao',
      pilier: 'taff',
      plageDebut: '09:00',
      plageFin: '09:45',
      statut: 'fait',
      objectifId: 1,
    },
    {
      id: 2,
      titre: 'Appeler Lea pour organiser le weekend',
      pilier: 'vie',
      plageDebut: '12:30',
      plageFin: '13:15',
      statut: 'en-cours',
      objectifId: 2,
    },
    {
      id: 3,
      titre: 'Session HIIT 30 min',
      pilier: 'perso',
      plageDebut: '18:00',
      plageFin: '18:45',
      statut: 'a-faire',
      objectifId: 3,
    },
  ],

  // ── Todos (nouveau format Things 3) ──
  todos: {
    priorites: [
      { id: 101, titre: 'Finir le PRD Tao', pilier: 'taff', plageDebut: '10:00', plageFin: '10:45', statut: 'en-cours' },
      { id: 102, titre: 'Appeler ma mere', pilier: 'vie', plageDebut: '14:00', plageFin: '14:45', statut: 'a-faire' },
      { id: 103, titre: 'Sport 30min', pilier: 'perso', plageDebut: '18:00', plageFin: '18:45', statut: 'a-faire' },
    ],
    aujourdhui: [
      { id: 104, titre: 'Relire le contrat client', pilier: 'taff', fait: false },
      { id: 105, titre: 'Repondre aux 5 emails', pilier: 'taff', fait: false },
      { id: 106, titre: 'Preparer la reunion de demain', pilier: 'taff', fait: false },
    ],
    ceSoir: [
      { id: 107, titre: 'Acheter les courses', pilier: 'vie', fait: false },
      { id: 108, titre: 'Lire 30 min', pilier: 'perso', fait: false },
    ],
    enRetard: [
      { id: 109, titre: 'Envoyer la facture a Clement', pilier: 'taff', fait: false, retardJours: 2 },
    ],
    aVenir: [
      { date: '2026-05-02', label: 'DEMAIN - Vendredi 2 mai', items: [
        { id: 110, titre: 'Setup Stripe', pilier: 'taff', fait: false },
        { id: 111, titre: 'Call avec partenaire coach', pilier: 'taff', fait: false },
      ]},
      { date: '2026-05-03', label: 'SAMEDI 3 MAI', items: [
        { id: 112, titre: 'Bilan de la semaine', pilier: 'taff', fait: false },
        { id: 113, titre: 'Soiree avec Lea', pilier: 'vie', fait: false },
      ]},
      { date: '2026-05-05', label: 'LUNDI 5 MAI', items: [
        { id: 114, titre: 'Lancer la beta privee', pilier: 'taff', fait: false },
        { id: 115, titre: 'Email aux 200 premiers', pilier: 'taff', fait: false },
        { id: 116, titre: 'Preparer le deck investisseurs', pilier: 'taff', fait: false },
      ]},
      { date: '2026-05-06', label: 'MARDI 6 MAI', items: [
        { id: 117, titre: 'Dentiste 15h', pilier: 'vie', fait: false },
        { id: 118, titre: 'Revoir les analytics', pilier: 'taff', fait: false },
      ]},
      { date: '2026-05-07', label: 'MERCREDI 7 MAI', items: [
        { id: 119, titre: 'Session sport avec Alex', pilier: 'perso', fait: false },
        { id: 120, titre: 'Soiree Lea', pilier: 'vie', fait: false },
      ]},
    ],
    boite: [
      { id: 121, titre: 'Idee article blog SEO', source: 'chat', depuis: 'il y a 2h', fait: false },
      { id: 122, titre: 'Voir le doc partage de Marie', source: 'manuel', depuis: 'hier', fait: false },
      { id: 123, titre: 'Trouver un cadeau pour anniversaire', source: 'chat', depuis: 'il y a 3j', fait: false },
      { id: 124, titre: 'Tester nouveau plugin VSCode', source: 'manuel', depuis: 'il y a 5j', fait: false },
      { id: 125, titre: 'Benchmark concurrents Notion', source: 'chat', depuis: 'il y a 1 semaine', fait: false },
      { id: 126, titre: 'Acheter un nouveau clavier', source: 'manuel', depuis: 'il y a 2 semaines', fait: false },
      { id: 127, titre: 'Regarder la conf WWDC recap', source: 'chat', depuis: 'il y a 3j', fait: false },
      { id: 128, titre: 'Refaire les icones de l\'app', source: 'manuel', depuis: 'il y a 4j', fait: false },
    ],
    enAttente: [
      { id: 129, titre: 'Validation contrat', enAttenteDe: 'Marc', jours: 5, fait: false },
      { id: 130, titre: 'Retour sur le design', enAttenteDe: 'Lyes', jours: 2, fait: false },
      { id: 131, titre: 'Devis fournisseur', enAttenteDe: 'Pierre', jours: 7, fait: false },
    ],
    longTerme: [
      { id: 132, titre: 'Lancer Tao en anglais', depuis: 'il y a 2 mois', fait: false },
      { id: 133, titre: 'Refaire mon site personnel', depuis: 'il y a 1 mois', fait: false },
      { id: 134, titre: 'Apprendre le mandarin', depuis: 'il y a 3 semaines', fait: false },
      { id: 135, titre: 'Course de trail a Lisbonne', depuis: 'il y a 1 semaine', fait: false },
      { id: 136, titre: 'Creer une chaine YouTube productivite', depuis: 'il y a 2 mois', fait: false },
      { id: 137, titre: 'Apprendre le piano', depuis: 'il y a 6 semaines', fait: false },
      { id: 138, titre: 'Lire Deep Work de Cal Newport', depuis: 'il y a 3 semaines', fait: false },
      { id: 139, titre: 'Planifier le voyage au Japon', depuis: 'il y a 1 mois', fait: false },
    ],
  },

  // ── Projets ──
  projets: [
    {
      id: 'lancement-tao',
      nom: 'Lancement Tao',
      pilier: 'taff',
      deadline: '2026-06-15',
      joursRestants: 45,
      tachesTotal: 40,
      tachesFaites: 23,
      taches: {
        enCours: [
          { id: 201, titre: 'Finir le PRD', date: "Aujourd'hui", fait: false },
          { id: 202, titre: 'Setup Stripe', date: 'Demain', fait: false },
          { id: 203, titre: 'Tester onboarding', date: null, fait: false },
          { id: 204, titre: 'Video de lancement Insta', date: null, fait: false },
        ],
        aVenir: [
          { id: 205, titre: 'Lancer beta privee', date: 'Lun 5 mai', fait: false },
          { id: 206, titre: 'Email aux 200 premiers', date: 'Mar 6 mai', fait: false },
          { id: 207, titre: 'Preparer le deck investisseurs', date: 'Mer 7 mai', fait: false },
          { id: 208, titre: 'Landing page V2', date: 'Jeu 8 mai', fait: false },
          { id: 209, titre: 'Setup analytics', date: null, fait: false },
          { id: 210, titre: 'Documentation API', date: null, fait: false },
          { id: 211, titre: 'Onboarding email sequence', date: null, fait: false },
          { id: 212, titre: 'Page pricing', date: null, fait: false },
        ],
        terminees: [
          { id: 213, titre: 'Choisir le pricing', fait: true },
          { id: 214, titre: 'Designer le brand book', fait: true },
          { id: 215, titre: 'Setup Supabase', fait: true },
          { id: 216, titre: 'Creer le repo GitHub', fait: true },
          { id: 217, titre: 'Wireframes V1', fait: true },
          { id: 218, titre: 'Logo + mascotte', fait: true },
          { id: 219, titre: 'Nom de domaine', fait: true },
          { id: 220, titre: 'Architecture technique', fait: true },
          { id: 221, titre: 'PRD V1 brouillon', fait: true },
          { id: 222, titre: 'Benchmark concurrents', fait: true },
          { id: 223, titre: 'User interviews (5)', fait: true },
        ],
        annulees: [
          { id: 224, titre: 'Integration Slack (reporte V2)', fait: false },
        ],
      },
    },
    {
      id: 'voyage-lisbonne',
      nom: 'Voyage Lisbonne',
      pilier: 'vie',
      deadline: '2026-07-20',
      joursRestants: 80,
      tachesTotal: 12,
      tachesFaites: 3,
      taches: {
        enCours: [
          { id: 301, titre: 'Reserver les vols', date: 'Cette semaine', fait: false },
          { id: 302, titre: 'Choisir l\'hotel', date: null, fait: false },
        ],
        aVenir: [
          { id: 303, titre: 'Liste des restos', date: null, fait: false },
          { id: 304, titre: 'Itineraire jour par jour', date: null, fait: false },
          { id: 305, titre: 'Assurance voyage', date: null, fait: false },
          { id: 306, titre: 'Reserver le trail', date: null, fait: false },
          { id: 307, titre: 'Change euros', date: null, fait: false },
        ],
        terminees: [
          { id: 308, titre: 'Valider les dates avec Lea', fait: true },
          { id: 309, titre: 'Budget previsionnel', fait: true },
          { id: 310, titre: 'Passeport a jour', fait: true },
        ],
        annulees: [],
      },
    },
    {
      id: 'coaching-sport',
      nom: 'Coaching sport',
      pilier: 'perso',
      deadline: '2026-06-30',
      joursRestants: 60,
      tachesTotal: 15,
      tachesFaites: 5,
      taches: {
        enCours: [
          { id: 401, titre: 'Programme semaine 5', date: "Aujourd'hui", fait: false },
          { id: 402, titre: 'Tracker les macros', date: null, fait: false },
        ],
        aVenir: [
          { id: 403, titre: 'Mesures corporelles', date: 'Lun 5 mai', fait: false },
          { id: 404, titre: 'Acheter proteines', date: null, fait: false },
          { id: 405, titre: 'Renouveler abo salle', date: 'Jeu 15 mai', fait: false },
          { id: 406, titre: 'Point coach Alex', date: null, fait: false },
          { id: 407, titre: 'Objectif 5km en 25min', date: null, fait: false },
          { id: 408, titre: 'Planning mois prochain', date: null, fait: false },
        ],
        terminees: [
          { id: 409, titre: 'Bilan initial avec coach', fait: true },
          { id: 410, titre: 'Acheter des baskets', fait: true },
          { id: 411, titre: 'Programme semaine 1-4', fait: true },
          { id: 412, titre: 'Premiere session HIIT', fait: true },
          { id: 413, titre: 'Photo avant', fait: true },
        ],
        annulees: [],
      },
    },
  ],

  // ── Messages chat ──
  messages: [
    {
      id: 1,
      role: 'tao',
      content: 'Quelles sont tes 3 taches aujourd\'hui ?',
      timestamp: '07:15',
      pose: 'confident',
    },
    {
      id: 2,
      role: 'user',
      content: 'Dashboard Tao ce matin, appeler Lea a midi, et sport ce soir.',
      timestamp: '07:16',
    },
    {
      id: 3,
      role: 'tao',
      content: 'Note. J\'ai cale tes 3 plages : 9h, 12h30, 18h. Tes blocs sont dans ton calendrier.',
      timestamp: '07:16',
      pose: 'confident',
    },
    {
      id: 4,
      role: 'user',
      content: 'Ah et faut que je rappelle Marc pour le devis, il m\'a toujours pas repondu.',
      timestamp: '10:32',
    },
    {
      id: 5,
      role: 'tao',
      content: 'Marc, le devis. Ca fait 5 jours qu\'il n\'a pas repondu. Je mets ca dans ta liste "En attente".',
      timestamp: '10:32',
      pose: 'thinking',
      capture: { liste: 'en_attente', titre: 'Retour de Marc sur le devis', enAttenteDe: 'Marc' },
    },
    {
      id: 6,
      role: 'user',
      content: 'Et garde en tete que je voudrais creer une chaine YouTube sur la productivite un jour.',
      timestamp: '10:45',
    },
    {
      id: 7,
      role: 'tao',
      content: 'Note dans Long terme. Ca ne sert aucun de tes 3 objectifs ce trimestre, mais c\'est bien de le garder.',
      timestamp: '10:45',
      pose: 'confident',
      capture: { liste: 'long_terme', titre: 'Creer une chaine YouTube productivite' },
    },
    {
      id: 8,
      role: 'tao',
      content: 'Ta plage "Finaliser le design du dashboard Tao" commence dans 5 min.',
      timestamp: '08:55',
      pose: 'action',
    },
  ],

  // ── Bilans hebdomadaires ──
  bilans: [
    {
      semaine: 17,
      date: '25 avril 2026',
      victoires: 'J\'ai boucle l\'onboarding Tao en 3 jours au lieu de 5. Et Lea m\'a dit qu\'elle appreciait les weekends deconnectes.',
      fuites: 'J\'ai passe 3h sur Twitter mardi sans m\'en rendre compte. Et j\'ai accepte un call qui ne servait a rien.',
      decision: 'Bloquer Twitter entre 9h et 18h. Et appliquer le filtre des 3 questions avant d\'accepter un call.',
      scoreMoyen: 72,
      tachesAccomplies: 18,
    },
    {
      semaine: 16,
      date: '18 avril 2026',
      victoires: 'Premier utilisateur beta qui m\'a dit "c\'est exactement ce qu\'il me fallait".',
      fuites: 'Le mardi, encore. J\'ai perdu ma matinee sur un bug CSS qui aurait pris 10 min avec Claude.',
      decision: 'Toujours demander a Claude avant de debugger seul plus de 15 min.',
      scoreMoyen: 68,
      tachesAccomplies: 15,
    },
    {
      semaine: 15,
      date: '11 avril 2026',
      victoires: 'J\'ai fait du sport 4 fois cette semaine. Record depuis janvier.',
      fuites: 'Pas assez de temps avec Lea. 0 taches Vie faites.',
      decision: 'Bloquer le mercredi soir pour Lea, non negociable.',
      scoreMoyen: 61,
      tachesAccomplies: 13,
    },
  ],

  // ── Badges ──
  badges: [
    { id: 1, nom: 'Premier matin', description: '1er check-in matin', icon: '🌅', debloque: true, coins: 50 },
    { id: 2, nom: 'Le streak', description: '7 jours consecutifs', icon: '🔥', debloque: true, coins: 100 },
    { id: 3, nom: 'Marathon', description: '30 jours consecutifs', icon: '💪', debloque: false, coins: 200, condition: 'Streak de 30 jours' },
    { id: 4, nom: 'Indomptable', description: '90 jours consecutifs', icon: '🏔', debloque: false, coins: 500, condition: 'Streak de 90 jours' },
    { id: 5, nom: 'First Goal', description: '1er objectif trimestriel atteint', icon: '🎯', debloque: false, coins: 200, condition: 'Atteins un objectif trimestriel' },
    { id: 6, nom: 'Equilibre', description: 'Taches dans les 3 piliers en 1 semaine', icon: '💚', debloque: true, coins: 100 },
    { id: 7, nom: 'Disciple de Tao', description: '1er bilan vendredi', icon: '🦊', debloque: true, coins: 50 },
    { id: 8, nom: 'Lecteur', description: '10 bilans vendredi consecutifs', icon: '📚', debloque: false, coins: 200, condition: '10 bilans consecutifs' },
    { id: 9, nom: 'Le Flux', description: 'Tao Coins depense pour la 1ere fois', icon: '🌊', debloque: true, coins: 50 },
    { id: 10, nom: 'Wu Wei', description: '3/3 taches en moins de 4h', icon: '⚡', debloque: true, coins: 100 },
    { id: 11, nom: 'Architecte', description: '100 taches accomplies', icon: '🏛', debloque: true, coins: 150 },
    { id: 12, nom: 'Memoire vive', description: '50 messages envoyes a Tao', icon: '🧠', debloque: true, coins: 50 },
    { id: 13, nom: 'Routinier', description: 'Check-in matin 5 jours de suite', icon: '☀', debloque: true, coins: 75 },
    { id: 14, nom: 'Nocturne', description: '10 check-ins soir', icon: '🌙', debloque: true, coins: 50 },
    { id: 15, nom: 'Collectionneur', description: '10 badges debloques', icon: '🏆', debloque: true, coins: 100 },
    { id: 16, nom: 'Centurion', description: 'Niveau 5 atteint', icon: '🛡', debloque: false, coins: 300, condition: 'Atteins le niveau 5' },
    { id: 17, nom: 'Focus Master', description: '20 plages de focus completees', icon: '🔬', debloque: true, coins: 100 },
    { id: 18, nom: 'Capture rapide', description: '10 taches capturees via le chat', icon: '📸', debloque: false, coins: 75, condition: 'Capture 10 taches via le chat' },
    { id: 19, nom: 'Perfectionniste', description: 'Score de 100 sur une journee', icon: '💎', debloque: false, coins: 150, condition: 'Score parfait de 100/100' },
    { id: 20, nom: 'Semaine parfaite', description: '7 jours a 3/3 taches', icon: '⭐', debloque: false, coins: 500, condition: '7 jours consecutifs 3/3' },
  ],

  // ── Boutique ──
  boutique: [
    { id: 1, titre: 'Template Notion "Solopreneur OS"', description: 'Systeme complet Notion pour gerer ton activite solo.', prix: 200, categorie: 'RESSOURCES', image: null },
    { id: 2, titre: 'Guide PDF "3 taches, pas plus"', description: 'La methode Tao en 12 pages actionnables.', prix: 100, categorie: 'RESSOURCES', image: null },
    { id: 3, titre: 'Mini-formation "Focus profond"', description: 'Video 15 min sur les plages de deep work.', prix: 500, categorie: 'RESSOURCES', image: null },
    { id: 4, titre: 'Template Notion "CRM Freelance"', description: 'Pipeline clients + relances automatiques.', prix: 200, categorie: 'RESSOURCES', image: null },
    { id: 5, titre: 'Session Q&A live avec Etienne', description: 'Prochaine session : 15 juin 2026 a 18h.', prix: 1000, categorie: 'COACHING', image: null },
    { id: 6, titre: 'Plan coaching sport 4 semaines', description: 'Programme HIIT + musculation par Coach Alex.', prix: 2000, categorie: 'COACHING', image: null },
    { id: 7, titre: 'Guide "Filtre des 3 questions"', description: 'Comment dire non aux reunions inutiles.', prix: 100, categorie: 'RESSOURCES', image: null },
    { id: 8, titre: 'Template "Bilan trimestriel"', description: 'Retroplanning + analyse de tes 3 piliers.', prix: 150, categorie: 'RESSOURCES', image: null },
  ],

  // ── Evenements calendrier (aujourd'hui) ──
  events: [
    { id: 1, titre: 'Tao - Finaliser le design', heure: '09:00', fin: '09:45', type: 'tao', pilier: 'taff' },
    { id: 2, titre: 'Call client Acme Corp', heure: '10:30', fin: '11:00', type: 'externe', source: 'google' },
    { id: 3, titre: 'Tao - Appeler Lea', heure: '12:30', fin: '13:15', type: 'tao', pilier: 'vie' },
    { id: 4, titre: 'Reunion equipe design', heure: '14:00', fin: '15:00', type: 'externe', source: 'google' },
    { id: 5, titre: 'Tao - Session HIIT', heure: '18:00', fin: '18:45', type: 'tao', pilier: 'perso' },
  ],

  // ── Scores de la semaine ──
  scoresHebdo: [
    { jour: 'Lun', score: 85, taff: 90, vie: 75, perso: 90 },
    { jour: 'Mar', score: 62, taff: 80, vie: 30, perso: 75 },
    { jour: 'Mer', score: 78, taff: 70, vie: 85, perso: 80 },
    { jour: 'Jeu', score: 91, taff: 95, vie: 85, perso: 90 },
    { jour: 'Ven', score: 68, taff: 75, vie: 60, perso: 70 },
    { jour: 'Sam', score: 45, taff: 0, vie: 90, perso: 45 },
    { jour: 'Dim', score: 55, taff: 0, vie: 80, perso: 85 },
  ],

  // ── Score du jour ──
  scoreJour: {
    global: 68,
    taff: 100,
    vie: 50,
    perso: 0,
  },
};
