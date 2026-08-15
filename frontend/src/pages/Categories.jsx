import React, { useState, useEffect } from "react";
import expenseService from "../api/ExpenseService";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState(null);

  const loadCategories = async () => {
    try {
      const data = await expenseService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await expenseService.createCategory({
        name,
        monthly_budget: Number(budget),
      });
      setName("");
      setBudget("");
      loadCategories();
    } catch (err) {
      setError("Could not create category.");
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <header>
          <h1>Categories</h1>
        </header>

        <div className="expense-form" style={{ maxWidth: 400, marginBottom: 30 }}>
          <h3>Add Category</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
            <input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Monthly budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
            <button type="submit">Add Category</button>
          </form>
        </div>

        <div className="expense-list">
          <h3>All Categories</h3>
          <table className="expense-table">
            <thead>
              <tr><th>Name</th><th>Monthly Budget</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>${Number(c.monthly_budget).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}