import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import PrivateRoute from "./components/PrivateRoute";
import expenseService from "./api/ExpenseService";

function Home() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);

  // ✅ 1. NEW STATE: Track which expense is currently being edited
  const [editingExpense, setEditingExpense] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [cats, exps, sum] = await Promise.all([
        expenseService.getCategories(),
        expenseService.getExpenses(),
        expenseService.getSummary(),
      ]);

      setCategories(cats);
      setExpenses(exps);
      setSummary(sum);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ✅ 2. NEW HANDLER: Called when user clicks ✎ in ExpenseList
  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll up to the form
  };

  // ✅ 3. NEW HANDLER: Called after form successfully updates or cancels
  const handleEditComplete = () => {
    setEditingExpense(null);
    loadData(); // Reload updated data from Django
  };

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <header>
          <h1>💰 Smart Expense Tracker</h1>
          <p>Track spending, stay under budget, know where your money goes.</p>
        </header>

        <main>
          <section className="left-panel">
            {/* ✅ PASS editingExpense AND COMPLETE HANDLER TO FORM */}
            <ExpenseForm
              categories={categories}
              onExpenseAdded={loadData}
              editingExpense={editingExpense}
              onExpenseUpdated={handleEditComplete}
              onCancelEdit={() => setEditingExpense(null)}
            />

            {/* ✅ PASS onEditExpense PROP TO LIST */}
            <ExpenseList
              expenses={expenses}
              onExpenseDeleted={loadData}
              onEditExpense={handleEditExpense}
            />
          </section>

          <section className="right-panel">
            <Dashboard summary={summary} expenses={expenses} />
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Protected Categories */}
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}