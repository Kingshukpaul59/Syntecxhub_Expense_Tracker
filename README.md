# 💸 ExpenseTrack

A responsive, production-grade **Expense Tracker** built with React, showcasing all core React hooks with a sleek dark UI.

---

## ✨ Features

- **Add & delete** transactions (income or expense)
- **Live summary stats** — net balance, total income, total expenses
- **Search & filter** transactions in real time
- **Mock API** integration via JSONPlaceholder on first load
- **Persistent storage** via localStorage
- **Toast notifications** for user feedback
- Fully **responsive** (mobile-first)

---

## 🪝 React Hooks Used

| Hook | Purpose |
|------|---------|
| `useState` | Form inputs, expense list, loading, search, filter, toast |
| `useEffect` | Fetch mock data from API on mount; persist to localStorage |
| `useRef` | Abort controller for fetch; auto-focus form field after submit |
| `useMemo` | Derived stats (balance, income, expenses); filtered list |
| `useCallback` | Stable event handlers to prevent unnecessary re-renders |

---

## 📁 Folder Structure

```
expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ExpenseForm.js   ← useRef, useCallback
│   │   ├── ExpenseList.js   ← Pure list renderer
│   │   └── ExpenseItem.js   ← React.memo + useCallback
│   ├── App.js               ← All hooks orchestrated here
│   ├── index.js
│   └── styles.css
├── vercel.json
├── package.json
└── .gitignore
```

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm start

# 3. Open in browser
http://localhost:3000
```

---

## ▲ Deploy to Vercel

### Option A — Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts → your app is live!
```

### Option B — Vercel Dashboard (recommended for beginners)

1. Push this project to a **GitHub / GitLab / Bitbucket** repository
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your repository
4. Vercel auto-detects **Create React App** — no config needed
5. Click **Deploy** → done ✅

The `vercel.json` included handles client-side routing so all routes resolve correctly.

---

## 🛠️ Tech Stack

- **React 18** — UI library
- **Create React App** — build tooling
- **JSONPlaceholder** — mock REST API
- **Google Fonts** — Syne + DM Mono
- **Vercel** — deployment platform

---

## 📸 Design

Dark editorial aesthetic with:
- Indigo/violet accent system
- Monospace data typography
- Smooth slide-in animations
- Color-coded categories
- Responsive 2-column → 1-column layout