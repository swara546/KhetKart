// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MdShoppingCart, MdDashboard, MdHistory, MdPerson } from "react-icons/md";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = JSON.parse(localStorage.getItem("khetkart_cart") || "[]")
    .reduce((sum, i) => sum + (i.qty || 1), 0);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  // Shared class for ALL desktop nav links — border-b-2 always reserved
  const linkClass = ({ isActive }) =>
    `inline-flex items-center gap-1.5 pb-1 border-b-2 text-sm font-medium transition
     hover:text-yellow-400 hover:border-yellow-400 ${
      isActive
        ? "border-yellow-400 text-yellow-400"
        : "text-white border-transparent"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block text-sm font-medium px-3 py-2 rounded-lg transition ${
      isActive ? "bg-white/10 text-yellow-400" : "text-white hover:bg-white/10"
    }`;

  return (
    <nav className="bg-green-800 text-white px-6 py-4 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="text-xl font-extrabold tracking-tight hover:opacity-90 transition">
          KhetKart 🌱
        </NavLink>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center space-x-7">

          <li><NavLink to="/" className={linkClass}>Home</NavLink></li>

          <li>
            <NavLink to="/products" className={linkClass}>
              {user?.role === "farmer" ? "Browse Market" : "Products"}
            </NavLink>
          </li>

          {/* Farmer only */}
          {user?.role === "farmer" && (
            <li>
              <NavLink to="/seller-dashboard" className={linkClass}>
                <MdDashboard size={16} /> Dashboard
              </NavLink>
            </li>
          )}

          {/* Vendor only */}
          {(!user || user?.role === "vendor") && (
            <>
              <li>
                <NavLink to="/cart" className={linkClass}>
                  <MdShoppingCart size={18} /> Cart
                  {cartCount > 0 && (
                    <span className="bg-yellow-400 text-green-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </li>
              {user && (
                <li>
                  <NavLink to="/orders" className={linkClass}>
                    <MdHistory size={16} /> My Orders
                  </NavLink>
                </li>
              )}
            </>
          )}

          {/* Auth */}
          {user ? (
            <li className="flex items-center gap-3 ml-2">
              {/* ✅ Profile link */}
              <NavLink to="/profile" className={linkClass}>
                <MdPerson size={16} /> Profile
              </NavLink>
              <span className="text-sm text-green-200">
                {user.role === "farmer" ? "🧑‍🌾" : "🏪"} {user.name?.split(" ")[0]}
                <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  user.role === "farmer" ? "bg-green-600 text-white" : "bg-yellow-400 text-green-900"
                }`}>
                  {user.role === "farmer" ? "Farmer" : "Vendor"}
                </span>
              </span>
              <button onClick={handleLogout}
                className="bg-white text-green-800 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/login"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 text-sm font-bold px-4 py-1.5 rounded-lg transition">
                Login
              </NavLink>
            </li>
          )}
        </ul>

        {/* Mobile icons */}
        <div className="flex items-center gap-4 md:hidden">
          {(!user || user?.role === "vendor") && (
            <NavLink to="/cart" className="relative">
              <MdShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-yellow-400 text-green-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </NavLink>
          )}
          {user?.role === "farmer" && (
            <NavLink to="/seller-dashboard"><MdDashboard size={24} /></NavLink>
          )}
          {/* ✅ Profile icon in mobile top bar */}
          {user && (
            <NavLink to="/profile"><MdPerson size={24} /></NavLink>
          )}
          <button onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col gap-1.5 p-1 focus:outline-none" aria-label="Toggle menu">
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-green-700 space-y-2 pt-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
            {user?.role === "farmer" ? "Browse Market" : "Products"}
          </NavLink>
          {user?.role === "farmer" && (
            <NavLink to="/seller-dashboard" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
              📋 My Dashboard
            </NavLink>
          )}
          {(!user || user?.role === "vendor") && (
            <>
              <NavLink to="/cart" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                🛒 Cart {cartCount > 0 && `(${cartCount})`}
              </NavLink>
              {user && (
                <NavLink to="/orders" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
                  📦 My Orders
                </NavLink>
              )}
            </>
          )}
          {/* ✅ Profile link in mobile dropdown */}
          {user && (
            <NavLink to="/profile" onClick={() => setMenuOpen(false)} className={mobileLinkClass}>
              👤 My Profile
            </NavLink>
          )}
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-green-200">
                {user.role === "farmer" ? "🧑‍🌾" : "🏪"} {user.name}
                <span className="ml-1 text-xs text-yellow-400 capitalize">({user.role})</span>
              </div>
              <button onClick={handleLogout}
                className="w-full text-left text-sm font-medium px-3 py-2 rounded-lg text-red-300 hover:bg-white/10 transition">
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold px-4 py-2 bg-yellow-400 text-green-900 rounded-lg text-center hover:bg-yellow-300 transition">
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;