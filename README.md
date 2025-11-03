# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
## 📂 Folder Structure

Yeh hamare full stack project ka main structure hai.

project-root/
├── backend/
│   ├── modals/
│   │   └── user.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
│
├── public/
│   └── vite.svg
│
├── src/
│   ├── Authentication/
│   │   └── OAuth.jsx
│   │
│   ├── assets/
│   │   └── react.svg
│   │
│   └── componant/
│       ├── ImageResults/
│       │   └── ImageResults.jsx
│       │
│       ├── header/
│       │   └── header.jsx
│       │
│       └── user-dashboard/
│           └── dashboard.jsx
│
├── .gitignore
├── README.md
├── App.jsx
├── eslint.config.js
├── index.css
├── index.html
├── main.jsx
├── package-lock.json
├── package.json
└── vite.config.js
