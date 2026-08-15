import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const mainLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "📊" },
  ];

  const manageLinks = [
    { to: "/categories", label: "Categories", icon: "🏷️" },
  ];

  const renderLink = (link) => (
    <Link
      key={link.to}
      to={link.to}
      className={`sidebar-link ${location.pathname === link.to ? "active" : ""}`}
    >
      <span className="sidebar-icon">{link.icon}</span>
      {link.label}
    </Link>
  );

  return (
    <aside className="sidebar">
      <p className="sidebar-title">Expense tracker</p>

      <p className="sidebar-section-label">Overview</p>
      {mainLinks.map(renderLink)}

      <div className="sidebar-divider" />

      <p className="sidebar-section-label">Manage</p>
      {manageLinks.map(renderLink)}
    </aside>
  );
}