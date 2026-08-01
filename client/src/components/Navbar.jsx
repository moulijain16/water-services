import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors block ${
      location.pathname === path ? "bg-teal-700" : "hover:bg-teal-700/60"
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 bg-teal-600 text-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg tracking-tight flex items-center gap-1.5" onClick={closeMenu}>
          <span className="bg-white text-teal-600 rounded px-1.5 py-0.5 text-sm font-bold">RO</span>
          <span className="font-normal text-teal-50">Water Services</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link to="/" className={linkClass("/")}>Dashboard</Link>
          <Link to="/customers" className={linkClass("/customers")}>Customers</Link>
          <Link to="/customers/add" className={linkClass("/customers/add")}>Add Customer</Link>
          <button onClick={handleLogout} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-700/60">
            Log out
          </button>
        </nav>

        {/* Mobile hamburger button */}
        <button
          className="sm:hidden p-2 rounded-lg hover:bg-teal-700/60"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="sm:hidden bg-teal-600 border-t border-teal-500/40 px-4 pb-3 flex flex-col gap-1">
          <Link to="/" className={linkClass("/")} onClick={closeMenu}>Dashboard</Link>
          <Link to="/customers" className={linkClass("/customers")} onClick={closeMenu}>Customers</Link>
          <Link to="/customers/add" className={linkClass("/customers/add")} onClick={closeMenu}>Add Customer</Link>
          <button
            onClick={() => { closeMenu(); handleLogout(); }}
            className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-teal-700/60 text-left"
          >
            Log out
          </button>
        </nav>
      )}
    </header>
  );
}