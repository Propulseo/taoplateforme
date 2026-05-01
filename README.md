# Tao — Preview Plateforme

Preview statique HTML / CSS / JS de la plateforme **Tao** (Think · Act · Organize).

## Lancer en local

Double-clic sur `index.html`, ou via un serveur statique :

```bash
npx serve .
# ou
python -m http.server 8000
```

Puis ouvrir [http://localhost:8000](http://localhost:8000).

## Structure

```
oneadmin/
├── index.html              # Shell principal de l'app
├── styles/                 # Variables, layout, composants, pages
├── js/                     # Logique JS (router, state, interactions)
├── pages/                  # Markup HTML par page
├── components/             # Composants UI réutilisables
├── assets/                 # Logos & visuels
├── images/ · fonts/        # Médias & typos
└── stylesheets/ · javascript/
```

## Pages

- Aujourd'hui · Chat · Semaine · Trimestre · Bilan · Récompenses · Réglages

---

© Propulseo — Preview interne.
