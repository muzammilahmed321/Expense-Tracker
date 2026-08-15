import React, { useState } from "react";
import expenseService from "../api/ExpenseService";

export default function ExpenseList({
  expenses = [],
  onExpenseDeleted,
  onEditExpense,
}) {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      await expenseService.deleteExpense(id);

      if (onExpenseDeleted) {
        onExpenseDeleted();
      }
    } catch (error) {
      console.error("Delete expense error:", error);
      alert("Could not delete expense.");
    } finally {
      setDeletingId(null);
    }
  };

  if (expenses.length === 0) {
    return (
      <p className="empty-state">
        No expenses yet. Add your first one!
      </p>
    );
  }

  return (
    <div className="expense-list">
      <h3>Expenses</h3>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              {/* TITLE */}
              <td>{exp.title || "—"}</td>

              {/* CATEGORY */}
              <td>{exp.category_name || exp.category || "Unknown"}</td>

              {/* AMOUNT */}
              <td>
                {exp.formatted_amount ||
                  `$${Number(exp.amount || 0).toFixed(2)}`}
              </td>

              {/* DATE */}
              <td>{exp.date || "—"}</td>

              {/* ACTION BUTTONS */}
              <td>
                <div className="action-buttons">
                  {/* Edit Button */}
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => onEditExpense && onEditExpense(exp)}
                    title="Edit Expense"
                    disabled={deletingId === exp.id}
                  >
                    ✎
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                    title="Delete Expense"
                  >
                    {deletingId === exp.id ? "..." : "✕"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}