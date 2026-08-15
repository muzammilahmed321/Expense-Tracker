import API_URL, { getHeaders } from "./api";

class ExpenseService {
  async _request(path, options = {}) {
    const response = await fetch(
      `${API_URL}${path}`,
      {
        headers: getHeaders(),
        ...options,
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    // No content response
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // =====================
  // Categories
  // =====================

  getCategories() {
    return this._request(
      "/categories/"
    ).then(data => data.results ?? data);
  }

  createCategory(category) {
    return this._request(
      "/categories/",
      {
        method: "POST",
        body: JSON.stringify(category),
      }
    );
  }

  // =====================
  // Expenses
  // =====================

  getExpenses(categoryId = null) {
    const query = categoryId
      ? `?category=${categoryId}`
      : "";

    return this._request(
      `/expenses/${query}`
    ).then(data => data.results ?? data);
  }

  createExpense(expense) {
    return this._request(
      "/expenses/",
      {
        method: "POST",
        body: JSON.stringify(expense),
      }
    );
  }

  // ---> NEW: Added updateExpense for your edit option <---
  updateExpense(id, expense) {
    return this._request(
      `/expenses/${id}/`,
      {
        method: "PATCH",
        body: JSON.stringify(expense),
      }
    );
  }

  deleteExpense(id) {
    return this._request(
      `/expenses/${id}/`,
      {
        method: "DELETE",
      }
    );
  }

  // =====================
  // Dashboard
  // =====================

  getSummary() {
    return this._request(
      "/summary/"
    );
  }
}

const expenseService = new ExpenseService();

export default expenseService;