import React, { useState, useEffect } from "react";
import expenseService from "../api/ExpenseService";

export default function ExpenseForm({
  categories = [],
  onExpenseAdded,
  editingExpense = null,     // 1. NEW: Receive editingExpense from App.js
  onExpenseUpdated,          // 2. NEW: Callback when update completes
  onCancelEdit,              // 3. NEW: Callback when edit is canceled
}) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const [error, setError] = useState(null);

  // =========================================================
  // 1. POPULATE INPUT BOXES WHEN AN EXPENSE IS CLICKED
  // =========================================================
  useEffect(() => {
    if (editingExpense) {
      // We are in Edit Mode -> Fill form with clicked row's data
      setForm({
        title: editingExpense.title || "",
        amount: editingExpense.amount || "",
        category:
          editingExpense.category_id ||
          editingExpense.category ||
          (categories[0]?.id || ""),
        date:
          editingExpense.date || new Date().toISOString().slice(0, 10),
        notes: editingExpense.notes || "",
      });
    } else if (categories.length > 0 && !form.category) {
      // Default behavior: Set first category for new expense
      setForm((prev) => ({
        ...prev,
        category: categories[0].id,
      }));
    }
  }, [editingExpense, categories]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // 2. HANDLE SUBMIT (UPDATE vs CREATE)
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const payload = {
      ...form,
      amount: Number(form.amount),
      category: Number(form.category),
    };

    try {
      if (editingExpense) {
        // ✅ UPDATE EXISTING EXPENSE IN DJANGO (PATCH)
        await expenseService.updateExpense(editingExpense.id, payload);
        if (onExpenseUpdated) {
          onExpenseUpdated();
        }
      } else {
        // ✅ CREATE NEW EXPENSE IN DJANGO (POST)
        await expenseService.createExpense(payload);
        if (onExpenseAdded) {
          onExpenseAdded();
        }
      }

      // Clear the form after saving
      setForm({
        title: "",
        amount: "",
        category: categories[0]?.id || "",
        date: new Date().toISOString().slice(0, 10),
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setError("Could not save expense. Check your inputs.");
    }
  };

  // Handle clicking the Cancel button
  const handleCancel = () => {
    setError(null);
    setForm({
      title: "",
      amount: "",
      category: categories[0]?.id || "",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {/* Dynamic Heading */}
      <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>

      {error && <p className="error">{error}</p>}

      <input
        name="title"
        placeholder="What did you spend on?"
        value={form.title}
        onChange={handleChange}
        required
      />

      <input
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        required
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
      >
        <option value="">Select Category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        required
      />

      <input
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      />

      {/* Buttons Container */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <button
          type="submit"
          style={{
            flex: 1,
            backgroundColor: editingExpense ? "#1976d2" : undefined,
          }}
        >
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: "#757575",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}