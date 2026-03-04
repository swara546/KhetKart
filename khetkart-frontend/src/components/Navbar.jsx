// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MdShoppingCart } from "react-icons/md";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();  // ← live auth state, updates instantly
  const [menuOpen, setMenuOpen] = useState(false);

  // Cart count
  const cartCount = JSON.parse(localStorage.getItem("khetkart_cart") || "[]")
    .reduce((sum, i) => sum + (i.qty || 1), 0);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const navItems = [
    { path: "/",         label: "Home" },
    { path: "/products", label: "Products" },
  ];

  const linkClass = ({ isActive }) =>
    `pb-1 transition hover:text-yellow-400 text-sm font-medium ${
      isActive ? "border-b-2 border-yellow-400 text-yellow-400" : "text-white"
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
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <NavLink to={path} className={linkClass}>{label}</NavLink>
            </li>
          ))}

          {/* Cart */}
          <li>
            <NavLink to="/cart" className={({ isActive }) =>
              `relative pb-1 transition hover:text-yellow-400 text-sm font-medium ${
                isActive ? "border-b-2 border-yellow-400 text-yellow-400" : "text-white"
              }`
            }>
              <span className="flex items-center gap-1.5">
                <MdShoppingCart size={18} /> Cart
                {cartCount > 0 && (
                  <span className="bg-yellow-400 text-green-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </span>
            </NavLink>
          </li>

          {/* Auth — Login OR name + Logout */}
          {user ? (
            <li className="flex items-center gap-3 ml-2">
              <span className="text-sm text-green-200">
                👤 {user.name?.split(" ")[0] || "Farmer"}
                {user.role === "seller" && (
                  <span className="ml-1.5 text-xs bg-yellow-400 text-green-900 font-bold px-1.5 py-0.5 rounded-md">
                    Seller
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="bg-white text-green-800 text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink
                to="/login"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 text-sm font-bold px-4 py-1.5 rounded-lg transition"
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>

        {/* Mobile: cart + hamburger */}
        <div className="flex items-center gap-4 md:hidden">
          <NavLink to="/cart" className="relative">
            <MdShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-yellow-400 text-green-900 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </NavLink>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col gap-1.5 p-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-green-700 space-y-2 pt-4">
          {navItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block text-sm font-medium px-3 py-2 rounded-lg transition ${
                  isActive ? "bg-white/10 text-yellow-400" : "text-white hover:bg-white/10"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className="block text-sm font-medium px-3 py-2 rounded-lg text-white hover:bg-white/10 transition"
          >
            🛒 Cart {cartCount > 0 && `(${cartCount})`}
          </NavLink>
          {user ? (
            <>
              <div className="px-3 py-2 text-sm text-green-200">
                👤 {user.name}
                {user.role === "seller" && <span className="ml-1 text-yellow-400">(Seller)</span>}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-medium px-3 py-2 rounded-lg text-red-300 hover:bg-white/10 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold px-4 py-2 bg-yellow-400 text-green-900 rounded-lg text-center hover:bg-yellow-300 transition"
            >
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;