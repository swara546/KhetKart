// src/context/AuthContext.jsx
// Global auth state — wraps the whole app so Navbar, Cart, etc.
// all instantly know when user logs in or out

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Read initial state from localStorage
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("khetkart_user") || "null")
  );

  const login = (userData, token) => {
    localStorage.setItem("khetkart_user",  JSON.stringify(userData));
    localStorage.setItem("khetkart_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("khetkart_user");
    localStorage.removeItem("khetkart_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — use this in any component instead of reading localStorage directly
// Usage: const { user, login, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}