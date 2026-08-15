import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const STATUS_LABELS = {
  ok: { color: "#2e7d32" },          // Green
  warning: { color: "#ed6c02" },     // Orange
  over_budget: { color: "#d32f2f" }, // Red
  no_budget_set: { color: "#757575" },// Grey
};

function groupByDay(expenses) {
  const buckets = {};
  expenses.forEach(({ date, amount }) => {
    if (!date) return;
    buckets[date] = (buckets[date] || 0) + Number(amount || 0);
  });
  return Object.entries(buckets)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, amount]) => ({ date, amount }));
}

function groupByWeek(expenses) {
  const buckets = {};
  expenses.forEach(({ date, amount }) => {
    if (!date) return;
    const d = new Date(date);
    const day = d.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() + diffToMonday);
    const key = weekStart.toISOString().slice(0, 10);
    buckets[key] = (buckets[key] || 0) + Number(amount || 0);
  });
  return Object.entries(buckets)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, amount]) => ({ date, amount }));
}

// Helper to safely compute remaining budget amount
function getRemainingBalance(health) {
  // If backend explicitly provides 'remaining' or 'balance'
  if (health.remaining !== undefined) return Number(health.remaining);
  if (health.balance !== undefined) return Number(health.balance);

  // If backend provides limit/budget and spent
  const limit = health.limit || health.budget || health.total;
  const spent = health.spent || health.amount || 0;
  if (limit !== undefined) {
    return Number(limit) - Number(spent);
  }

  // Fallback calculation if only percentage and spent amount are available
  if (health.percentage > 0 && spent > 0) {
    const estimatedLimit = (Number(spent) / Number(health.percentage)) * 100;
    return estimatedLimit - Number(spent);
  }

  return null;
}

export default function Dashboard({ summary, expenses = [] }) {
  const [view, setView] = useState("daily");

  const chartData = useMemo(() => {
    return view === "weekly" ? groupByWeek(expenses) : groupByDay(expenses);
  }, [view, expenses]);

  if (!summary) {
    return (
      <div className="dashboard-empty">
        <h3>No dashboard data available</h3>
      </div>
    );
  }

  const { total_spent = 0, top_category, category_health = {} } = summary;

  const overBudgetCount = Object.values(category_health).filter(
    (h) => h.status === "over_budget"
  ).length;
  const recent = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="dash-grid">
      {/* STAT CARDS */}
      <div className="stat-row">
        <div className="stat-card">
          <span className="stat-label">Total spent</span>
          <span className="stat-value">${Number(total_spent).toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Top category</span>
          <span className="stat-value">{top_category || "—"}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Over budget</span>
          <span className="stat-value">
            {overBudgetCount} categor{overBudgetCount === 1 ? "y" : "ies"}
          </span>
        </div>
      </div>

      {/* AREA CHART PANEL */}
      <div className="panel">
        <div className="trend-header">
          <h4>Expense trend</h4>
          <div className="view-toggle">
            <button
              type="button"
              className={view === "daily" ? "active" : ""}
              onClick={() => setView("daily")}
            >
              Daily
            </button>
            <button
              type="button"
              className={view === "weekly" ? "active" : ""}
              onClick={() => setView("weekly")}
            >
              Weekly
            </button>
          </div>
        </div>

        <div style={{ width: "100%", height: 260, marginTop: 10 }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1976d2" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1976d2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "#666" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#666" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spent"]}
                  labelStyle={{ fontWeight: "bold", color: "#333" }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#1976d2"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: "#1565c0" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="empty-chart-text">No {view} expense data available</p>
          )}
        </div>
      </div>

      {/* BOTTOM PANELS */}
      <div className="panel-row">
        {/* BUDGETS CARD: Displays Name + Remaining Balance + Percentage */}
        <div className="panel">
          <h4>Budgets</h4>
          <ul className="budget-health-list">
            {Object.entries(category_health).length === 0 ? (
              <li>No budgets set</li>
            ) : (
              Object.entries(category_health).map(([name, health]) => {
                const status =
                  STATUS_LABELS[health.status] || STATUS_LABELS.no_budget_set;
                const remaining = getRemainingBalance(health);

                return (
                  <li
                    key={name}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 0",
                      fontWeight: 500,
                    }}
                  >
                    <span>{name}</span>

                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      {/* Remaining Amount Badge */}
                      {remaining !== null && (
                        <span
                          style={{
                            fontSize: "0.85rem",
                            color: remaining >= 0 ? "#555" : "#d32f2f",
                            fontWeight: remaining < 0 ? 600 : 400,
                          }}
                        >
                          {remaining >= 0
                            ? `$${remaining.toFixed(2)} left`
                            : `-$${Math.abs(remaining).toFixed(2)} over`}
                        </span>
                      )}

                      {/* Percentage Badge */}
                      {health.percentage !== undefined ? (
                        <span
                          style={{
                            color: status.color,
                            fontWeight: 600,
                            minWidth: "45px",
                            textAlign: "right",
                          }}
                        >
                          {health.percentage}%
                        </span>
                      ) : (
                        <span style={{ color: "#999" }}>—</span>
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        {/* RECENT EXPENSES */}
        <div className="panel">
          <h4>Recent expenses</h4>
          <ul className="by-category-list">
            {recent.length === 0 ? (
              <li>No expenses found</li>
            ) : (
              recent.map((exp) => (
                <li key={exp.id}>
                  <span>{exp.title}</span>
                  <span style={{ fontWeight: 600 }}>
                    ${Number(exp.amount).toFixed(2)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}