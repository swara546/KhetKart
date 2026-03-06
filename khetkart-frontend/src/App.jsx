// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import KhetBot from "./components/KhetBot";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import OrderHistory from "./pages/OrderHistory";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Public routes — anyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Vendor only — logged in + role=vendor */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute role="vendor">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute role="vendor">
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* Farmer only — logged in + role=farmer */}
          <Route
            path="/seller-dashboard"
            element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
        <KhetBot />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
