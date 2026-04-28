# 💸 Expense Tracker

A simple and responsive expense tracker built using React.  
This project helps track daily expenses and income while practicing core React concepts.

---

## Features

- Add and delete transactions  
- Track income and expenses separately  
- View total balance, income, and expenses  
- Search and filter transactions  
- Data persists using localStorage  
- Initial data loaded from a mock API  
- Responsive design for mobile and desktop  

---

## React Hooks Used

- **useState** – manage form inputs and expense list  
- **useEffect** – load data and store it in localStorage  
- **useRef** – handle input focus  
- **useMemo** – calculate totals efficiently  
- **useCallback** – optimize performance  

---

## Project Structure

```
expense-tracker/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ExpenseForm.js
│   │   ├── ExpenseList.js
│   │   └── ExpenseItem.js
│   ├── App.js
│   ├── index.js
│   └── styles.css
├── package.json
├── vercel.json
└── .gitignore
```

---

## Run Locally

Install dependencies:
```
npm install
```

Start the project:
```
npm start
```

Open in browser:
```
http://localhost:3000
```

---

## Deployment

You can deploy this project using Vercel.

Push your project to GitHub, then import it in Vercel and deploy.

Or use CLI:
```
npm install -g vercel
vercel
```

---

## Tech Stack

- React  
- JavaScript  
- CSS  
- JSONPlaceholder (mock API)  
- Vercel  

---

## About

This project was built for learning React hooks and understanding how to manage state, side effects, and component structure in a real-world style application.
