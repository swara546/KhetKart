// src/pages/FarmerDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdInventory,
  MdShoppingBag, MdCheck, MdWarning,
} from "react-icons/md";
import { FiPackage } from "react-icons/fi";

const CATEGORIES = ["Grains", "Vegetables", "Fruits", "Pulses"];
const UNITS      = ["kg", "quintal", "ton", "piece", "dozen", "litre"];

const EMPTY_FORM = {
  name: "", description: "", price: "", unit: "kg",
  category: "Grains", stock: "", minOrder: "", image: "",
};

// ── Helpers ──────────────────────────────────────────────────────
function categoryEmoji(cat) {
  const map = { Grains: "🌾", Vegetables: "🥦", Fruits: "🍎", Pulses: "🫘" };
  return map[cat] || "🌿";
}

function statusColor(status) {
  const map = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped:   "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return map[status] || "bg-gray-100 text-gray-600";
}

// ── Stat Card ────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${color}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Add / Edit Crop Form Modal ───────────────────────────────────
function CropFormModal({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const isEdit = !!initial?._id;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-800">
            {isEdit ? "✏️ Edit Crop Listing" : "➕ List a New Crop"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <MdClose size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Crop name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
            <input name="name" value={form.name} onChange={handleChange}
              placeholder="e.g. Fresh Wheat, Alphonso Mango" required className={inputClass} />
          </div>

          {/* Category + Unit row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{categoryEmoji(c)} {c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select name="unit" value={form.unit} onChange={handleChange} className={inputClass}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Price + Stock row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per {form.unit} (₹) *</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange}
                placeholder="e.g. 24" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Available Stock ({form.unit}) *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange}
                placeholder="e.g. 500" required className={inputClass} />
            </div>
          </div>

          {/* Min order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Order ({form.unit})
              <span className="text-gray-400 font-normal ml-1">— optional</span>
            </label>
            <input name="minOrder" type="number" min="0" value={form.minOrder} onChange={handleChange}
              placeholder="e.g. 10" className={inputClass} />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
              <span className="text-gray-400 font-normal ml-1">— optional</span>
            </label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe your crop — variety, harvest date, quality grade…"
              rows={3} className={`${inputClass} resize-none`} />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
              <span className="text-gray-400 font-normal ml-1">— optional</span>
            </label>
            <input name="image" value={form.image} onChange={handleChange}
              placeholder="https://..." className={inputClass} />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-2.5 rounded-xl transition">
              {loading ? "Saving…" : isEdit ? "Update Listing" : "List Crop 🌾"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ─────────────────────────────────────────
function DeleteModal({ crop, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <MdWarning className="text-red-400 mx-auto mb-3" size={48} />
        <h3 className="text-lg font-extrabold text-gray-800 mb-2">Remove Listing?</h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to remove <strong>"{crop?.name}"</strong> from your listings?
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-2.5 rounded-xl transition">
            {loading ? "Removing…" : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────
function FarmerDashboard() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [tab, setTab]           = useState("listings");
  const [listings, setListings] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [loadingData, setLoadingData]   = useState(true);
  const [formLoading, setFormLoading]   = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [editCrop, setEditCrop]   = useState(null);
  const [deleteCrop, setDeleteCrop] = useState(null);
  const [toast, setToast]         = useState("");
  const [error, setError]         = useState("");

  // ── Guard: only farmers ──────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "farmer") { navigate("/"); return; }
    fetchAll();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Fetch listings + orders ──────────────────────────────────
  const fetchAll = async () => {
    setLoadingData(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        axios.get("/api/farmer/products"),
        axios.get("/api/farmer/orders"),
      ]);
      setListings(prodRes.data);
      setOrders(orderRes.data);
    } catch {
      setError("Failed to load dashboard data. Please refresh.");
    } finally {
      setLoadingData(false);
    }
  };

  // ── Add crop ────────────────────────────────────────────────
  const handleAdd = async (form) => {
    setFormLoading(true);
    try {
      await axios.post("/api/products", form);
      await fetchAll();
      setShowForm(false);
      showToast("✅ Crop listed successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add crop.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Edit crop ────────────────────────────────────────────────
  const handleEdit = async (form) => {
    setFormLoading(true);
    try {
      await axios.put(`/api/products/${editCrop._id}`, form);
      await fetchAll();
      setEditCrop(null);
      showToast("✅ Listing updated!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update crop.");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete crop ──────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axios.delete(`/api/products/${deleteCrop._id}`);
      await fetchAll();
      setDeleteCrop(null);
      showToast("🗑️ Listing removed.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete crop.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Stats ────────────────────────────────────────────────────
  const totalStock    = listings.reduce((s, p) => s + (p.stock || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenue  = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + (o.total || 0), 0);

  const tabs = [
    { id: "listings", label: "My Listings",     icon: <MdInventory size={18} /> },
    { id: "orders",   label: "Incoming Orders",  icon: <MdShoppingBag size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-300 text-sm mb-1">Farmer Dashboard</p>
          <h1 className="text-3xl font-extrabold">Welcome, {user?.name} 🌾</h1>
          <p className="text-green-200 text-sm mt-1">{user?.village}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex justify-between">
            {error}
            <button onClick={() => setError("")}><MdClose size={18} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon="🌾" label="Active Listings"  value={listings.length}  sub="crops listed"          color="border-green-100" />
          <StatCard icon="📦" label="Pending Orders"   value={pendingOrders}    sub="waiting for action"    color="border-yellow-100" />
          <StatCard icon="💰" label="Total Revenue"    value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="from all orders" color="border-blue-100" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
          {tabs.map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                tab === id ? "bg-green-700 text-white shadow" : "text-gray-500 hover:bg-gray-50"
              }`}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* ── MY LISTINGS TAB ── */}
        {tab === "listings" && (
          <div>
            {/* Add button */}
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-gray-500">{listings.length} crop{listings.length !== 1 ? "s" : ""} listed</p>
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md">
                <MdAdd size={20} /> List New Crop
              </button>
            </div>

            {loadingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                    <div className="h-36 bg-gray-200" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-7xl mb-4">🌱</span>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No crops listed yet</h3>
                <p className="text-gray-400 text-sm mb-6">Start by listing your first crop to connect with vendors.</p>
                <button onClick={() => setShowForm(true)}
                  className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition">
                  List Your First Crop →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((crop) => (
                  <div key={crop._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {/* Image */}
                    <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
                      {crop.image
                        ? <img src={crop.image} alt={crop.name} className="h-full w-full object-cover" />
                        : <span>{categoryEmoji(crop.category)}</span>
                      }
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">{crop.category}</span>
                      <h3 className="font-bold text-gray-800 mt-0.5 mb-1">{crop.name}</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-extrabold text-green-800">₹{crop.price}/{crop.unit}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${crop.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {crop.stock > 0 ? `${crop.stock} ${crop.unit} left` : "Out of stock"}
                        </span>
                      </div>
                      {crop.minOrder && (
                        <p className="text-xs text-gray-400 mb-3">Min order: {crop.minOrder} {crop.unit}</p>
                      )}
                      {/* Actions */}
                      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setEditCrop(crop)}
                          className="flex-1 flex items-center justify-center gap-1.5 border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold py-2 rounded-lg transition">
                          <MdEdit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteCrop(crop)}
                          className="flex-1 flex items-center justify-center gap-1.5 border border-red-300 text-red-500 hover:bg-red-50 text-xs font-semibold py-2 rounded-lg transition">
                          <MdDelete size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── INCOMING ORDERS TAB ── */}
        {tab === "orders" && (
          <div>
            <p className="text-sm text-gray-500 mb-5">
              {orders.length} order{orders.length !== 1 ? "s" : ""} received
            </p>

            {loadingData ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiPackage className="text-gray-300 mb-4" size={64} />
                <h3 className="text-lg font-bold text-gray-700 mb-2">No orders yet</h3>
                <p className="text-gray-400 text-sm">Once vendors place orders for your crops, they'll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400 font-mono">Order #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-sm font-bold text-gray-800 mt-0.5">
                          {order.customer?.name || "Vendor"}
                          <span className="text-gray-400 font-normal ml-1.5 text-xs">
                            · {order.customer?.village || ""}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400">📞 {order.customer?.mobile}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name} × {item.qty} {item.unit}</span>
                          <span className="font-semibold text-gray-800">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </div>
                      <span className="font-extrabold text-green-800">
                        Total: ₹{order.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add form modal */}
      {showForm && (
        <CropFormModal
          onSave={handleAdd}
          onClose={() => setShowForm(false)}
          loading={formLoading}
        />
      )}

      {/* Edit form modal */}
      {editCrop && (
        <CropFormModal
          initial={editCrop}
          onSave={handleEdit}
          onClose={() => setEditCrop(null)}
          loading={formLoading}
        />
      )}

      {/* Delete confirm modal */}
      {deleteCrop && (
        <DeleteModal
          crop={deleteCrop}
          onConfirm={handleDelete}
          onClose={() => setDeleteCrop(null)}
          loading={deleteLoading}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-800 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <MdCheck size={18} /> {toast}
        </div>
      )}
    </div>
  );
}

export default FarmerDashboard;