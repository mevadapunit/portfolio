# Punit Mevada — Portfolio

Built with **Vite** (vanilla JS) + **Alpine.js**

## Structure
```
portfolio/
├── index.html      # HTML markup
├── style.css       # All styles
├── main.js         # Alpine.js init + JS logic
├── vite.config.js  # Vite config
└── package.json
```

## Local Development
```bash
npm install
npm run dev
```

## Build for Production
```bash
npm run build
npm run preview
```

## Deploy on Vercel
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import repo
3. Framework: **Vite**
4. Build Command: `npm run build`
5. Output Dir: `dist`
6. Click **Deploy**
