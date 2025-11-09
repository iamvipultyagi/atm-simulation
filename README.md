# ATM Simulation Website (React Version)

A **React-based ATM Simulation Website** that replicates the essential functions of a real ATM. This project demonstrates PIN authentication, balance inquiry, cash withdrawal, deposits, and real-time transaction validation. It is structured using standard React files: `App.js`, `index.js`, component styles, and test utilities.

---

## 🚀 Features
- **PIN Authentication** using component state.
- **Balance Check** with instant UI updates.
- **Cash Withdrawal** with validation:
  - Prevents negative balance.
  - Ensures valid numeric input.
- **Deposit Functionality** with immediate state updates.
- **Transaction Safety Checks** for consistent logic.
- **Component-Based UI** built with reusable React components.

---

## 🛠️ Tech Stack
- **React (JavaScript)** – App logic and UI
- **CSS Modules / App.css** – Styling
- **Jest + React Testing Library** – Basic testing (App.test.js)

---

## 📘 How It Works
1. User enters the **4-digit PIN** in the authentication screen.
2. After successful login, user navigates to the main dashboard.
3. Available actions:
   - View current balance
   - Withdraw amount
   - Deposit amount
4. All amounts update using React **state hooks**.
5. Validation ensures:
   - No withdrawal above balance
   - No empty or invalid input

---

## 🎯 Learning Outcomes
- Using **React Hooks (`useState`)** for state management.
- Handling **form inputs** and events.
- Basic **component structuring** in React.
- Understanding conditional rendering.
- Writing simple tests using **App.test.js**.

---

## 📸 Screenshots
<img width="619" height="858" alt="image" src="https://github.com/user-attachments/assets/1f93f530-8465-44ba-9ab1-372f9da9e61e" />

---

## ✅ Future Improvements
- Add transaction history with timestamps.
- Integrate localStorage to persist data.
- Add routing for multiple screens.
- Improve UI with modern component libraries.


