# 🔎 Search Portal – React Application

This project is a **React-based search interface** that includes:

* Keyword search
* Auto-suggestion dropdown
* Result list rendering with highlights
* Jest + React Testing Library automated tests

---

## 🚀 1. Setup Instructions

### Prerequisites

Make sure you have:

* **Node.js** ≥ 16
* **npm** ≥ 8

Check versions:

```bash
node -v
npm -v
```

---

## 📦 2. Install Dependencies

Inside the project directory, run:

```bash
npm install
```

This will install all required packages, including React, TypeScript (if used), and Jest.

---

## 🏃 3. Run the Application Locally

Start the development server:

```bash
npm start
```

The app will be available at:

👉 [http://localhost:3000/](http://localhost:3000/)

The server automatically reloads when you edit source files.

---

## 🧪 4. Run Automated Tests

This project uses **Jest + React Testing Library**.

* Run tests in watch mode:

```bash
npm test
```

* Run tests a single time (CI style):

```bash
npm test -- --watchAll=false
```

You should see the test report displayed in the terminal.

---

## 📦 5. Build for Production

To bundle the app for deployment:

```bash
npm run build
```

The output will be in the `/build` folder, minified and optimized.
