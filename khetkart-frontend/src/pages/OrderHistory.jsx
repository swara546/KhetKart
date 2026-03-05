// src/pages/OrderHistory.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { MdShoppingBag, MdArrowBack, MdAccessTime, MdCheckCircle, MdLocalShipping, MdCancel } from "react-icons/md";
import { FiPackage } from "react-icons/fi";

// ── Helpers ──────────────────────────────────────────────────────
function categoryEmoji(cat) {
  const map = { Grains: "🌾", Vegetables: "🥦", Fruits: "🍎", Pulses: "🫘" };
  return map[cat] || "🌿";
}

function statusConfig(status) {
  const map = {
    pending:   { color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: <MdAccessTime size={14} />,      label: "Pending" },
    confirmed: { color: "bg-blue-100 text-blue-700 border-blue-200",       icon: <MdCheckCircle size={14} />,     label: "Confirmed" },
    shipped:   { color: "bg-purple-100 text-purple-700 border-purple-200", icon: <MdLocalShipping size={14} />,   label: "Shipped" },
    delivered: { color: "bg-green-100 text-green-700 border-green-200",    icon: <MdCheckCircle size={14} />,     label: "Delivered" },
    cancelled: { color: "bg-red-100 text-red-700 border-red-200",          icon: <MdCancel size={14} />,          label: "Cancelled" },
  };
  return map[status] || { color: "bg-gray-100 text-gray-600 border-gray-200", icon: null, label: status };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Not Logged In ────────────────────────────────────────────────
function LoginRequired() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center px-4">
      <MdShoppingBag className="text-green-300 mb-4" size={72} />
      <h2 className="text-2xl font-extrabold text-gray-700 mb-2">Login to view orders</h2>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        You need to be logged in to see your order history.
      </p>
      <Link to="/login"
        className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition shadow-md">
        Login
      </Link>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────────
function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <FiPackage className="text-gray-300 mb-4" size={72} />
      <h3 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h3>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        You haven't placed any orders yet. Browse fresh crops from farmers!
      </p>
      <Link to="/products"
        className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition shadow-md">
        Browse Crops 🌾
      </Link>
    </div>
  );
}

// ── Order Card ───────────────────────────────────────────────────
function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig(order.status);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      {/* Header */}
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs text-gray-400 font-mono">
              Order #{order._id.slice(-8).toUpperCase()}
            </p>
            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-extrabold text-green-800">
            ₹{order.total.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-400">
            {order.delivery === 0 ? "Free delivery" : `+ ₹${order.delivery} delivery`}
          </p>
        </div>
      </div>

      {/* Items preview */}
      <div className="px-5 pb-3">
        <div className="bg-gray-50 rounded-xl p-3">
          {/* Show first 2 items always */}
          {order.items.slice(0, expanded ? order.items.length : 2).map((item, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{categoryEmoji(item.category)}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.qty} {item.unit || "kg"} × ₹{item.price}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-700">
                ₹{(item.price * item.qty).toLocaleString("en-IN")}
              </p>
            </div>
          ))}

          {/* Show more toggle */}
          {order.items.length > 2 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-green-700 hover:underline font-medium mt-2"
            >
              {expanded ? "Show less" : `+ ${order.items.length - 2} more item${order.items.length - 2 > 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·
          Subtotal ₹{order.subtotal.toLocaleString("en-IN")}
        </div>

        {/* Status timeline */}
        <div className="flex items-center gap-1">
          {["pending", "confirmed", "shipped", "delivered"].map((s, i) => {
            const statuses = ["pending", "confirmed", "shipped", "delivered"];
            const currentIdx = statuses.indexOf(order.status);
            const stepIdx = statuses.indexOf(s);
            return (
              <div key={s} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  order.status === "cancelled" ? "bg-red-300" :
                  stepIdx <= currentIdx ? "bg-green-500" : "bg-gray-200"
                }`} />
                {i < 3 && <div className={`w-4 h-0.5 ${
                  order.status === "cancelled" ? "bg-red-200" :
                  stepIdx < currentIdx ? "bg-green-400" : "bg-gray-200"
                }`} />}
              </div>
            );
          })}
          <span className="text-xs text-gray-400 ml-1 capitalize">{order.status}</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
function OrderHistory() {
  const { user }              = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filter, setFilter]   = useState("all");

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/orders/mine");
        setOrders(res.data);
      } catch {
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) return <LoginRequired />;

  const STATUS_FILTERS = [
    { value: "all",       label: "All Orders" },
    { value: "pending",   label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "shipped",   label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  // Summary stats
  const totalSpent    = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === "delivered").length;
  const pendingCount   = orders.filter(o => o.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <Link to="/products"
            className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm mb-3 transition w-fit">
            <MdArrowBack size={18} /> Back to Crops
          </Link>
          <h1 className="text-3xl font-extrabold">My Orders 📦</h1>
          <p className="text-green-200 text-sm mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Stats */}
        {orders.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-green-800">₹{totalSpent.toLocaleString("en-IN")}</p>
              <p className="text-xs text-gray-500 mt-1">Total Spent</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-green-800">{deliveredCount}</p>
              <p className="text-xs text-gray-500 mt-1">Delivered</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <p className="text-2xl font-extrabold text-yellow-600">{pendingCount}</p>
              <p className="text-xs text-gray-500 mt-1">Pending</p>
            </div>
          </div>
        )}

        {/* Filter pills */}
        {orders.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {STATUS_FILTERS.map(({ value, label }) => (
              <button key={value} onClick={() => setFilter(value)}
                className={`text-xs font-semibold px-4 py-2 rounded-lg transition border ${
                  filter === value
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
                }`}>
                {label}
                {value !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    ({orders.filter(o => o.status === value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                </div>
                <div className="h-16 bg-gray-100 rounded-xl" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyOrders />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">No {filter} orders found.</p>
            <button onClick={() => setFilter("all")}
              className="mt-3 text-sm text-green-700 hover:underline font-medium">
              Show all orders
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;