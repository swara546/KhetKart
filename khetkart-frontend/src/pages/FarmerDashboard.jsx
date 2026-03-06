// src/pages/FarmerDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  MdAdd, MdEdit, MdDelete, MdClose, MdInventory,
  MdShoppingBag, MdCheck, MdWarning, MdArrowForward,
} from "react-icons/md";
import { FiPackage } from "react-icons/fi";

const CATEGORIES = ["Grains", "Vegetables", "Fruits", "Pulses"];
const UNITS      = ["kg", "quintal", "ton", "piece", "dozen", "litre"];
const EMPTY_FORM = { name: "", description: "", price: "", unit: "kg", category: "Grains", stock: "", minOrder: "", image: "" };

const STATUS_FLOW = {
  pending:   { next: "confirmed", label: "Confirm Order",   color: "bg-yellow-100 text-yellow-700 border-yellow-200",  btnColor: "bg-blue-600 hover:bg-blue-500" },
  confirmed: { next: "shipped",   label: "Mark as Shipped", color: "bg-blue-100 text-blue-700 border-blue-200",        btnColor: "bg-purple-600 hover:bg-purple-500" },
  shipped:   { next: "delivered", label: "Mark Delivered",  color: "bg-purple-100 text-purple-700 border-purple-200",  btnColor: "bg-green-600 hover:bg-green-500" },
  delivered: { next: null,        label: "Delivered ✓",     color: "bg-green-100 text-green-700 border-green-200",     btnColor: "" },
  cancelled: { next: null,        label: "Cancelled",       color: "bg-red-100 text-red-700 border-red-200",           btnColor: "" },
};

function categoryEmoji(cat) {
  return { Grains: "🌾", Vegetables: "🥦", Fruits: "🍎", Pulses: "🫘" }[cat] || "🌿";
}

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

function CropFormModal({ initial, onSave, onClose, loading }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const isEdit = !!initial?._id;
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const inputClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-extrabold text-gray-800">{isEdit ? "✏️ Edit Listing" : "➕ List a New Crop"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><MdClose size={22} /></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(form); }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Name *</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Fresh Wheat" required className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{categoryEmoji(c)} {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit *</label>
              <select name="unit" value={form.unit} onChange={handleChange} className={inputClass}>
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="e.g. 24" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock ({form.unit}) *</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="e.g. 500" required className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Order <span className="text-gray-400 font-normal">— optional</span></label>
            <input name="minOrder" type="number" min="0" value={form.minOrder} onChange={handleChange} placeholder="e.g. 10" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">— optional</span></label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL <span className="text-gray-400 font-normal">— optional</span></label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className={inputClass} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-2.5 rounded-xl transition">
              {loading ? "Saving…" : isEdit ? "Update Listing" : "List Crop 🌾"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ crop, onConfirm, onClose, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <MdWarning className="text-red-400 mx-auto mb-3" size={48} />
        <h3 className="text-lg font-extrabold text-gray-800 mb-2">Remove Listing?</h3>
        <p className="text-sm text-gray-500 mb-6">Remove <strong>"{crop?.name}"</strong> from your listings?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-bold py-2.5 rounded-xl transition">
            {loading ? "Removing…" : "Yes, Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onStatusUpdate, updating }) {
  const cfg = STATUS_FLOW[order.status] || STATUS_FLOW.pending;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-gray-400 font-mono">Order #{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-sm font-bold text-gray-800 mt-0.5">
            {order.customer?.name || "Vendor"}
            <span className="text-gray-400 font-normal ml-1.5 text-xs">· {order.customer?.village || ""}</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">📞 {order.customer?.mobile}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border capitalize ${cfg.color}`}>{order.status}</span>
      </div>

      {/* Items */}
      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm py-0.5">
            <span className="text-gray-700">{item.name} × {item.qty} {item.unit}</span>
            <span className="font-semibold">₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>

      {/* Status history timeline */}
      {order.statusHistory?.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-1">
          {order.statusHistory.map((h, i) => (
            <span key={i} className="flex items-center gap-1 text-xs">
              {i > 0 && <MdArrowForward size={10} className="text-gray-300" />}
              <span className="capitalize font-medium text-gray-600">{h.status}</span>
              <span className="text-gray-300">
                {new Date(h.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </span>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="font-extrabold text-green-800">₹{order.total.toLocaleString("en-IN")}</span>
        <div className="flex items-center gap-2">
          {/* Cancel — only for pending */}
          {order.status === "pending" && (
            <button onClick={() => onStatusUpdate(order._id, "cancelled")}
              disabled={updating === order._id}
              className="text-xs text-red-400 hover:text-red-600 hover:underline transition">
              Cancel
            </button>
          )}
          {/* Next status button */}
          {cfg.next && (
            <button onClick={() => onStatusUpdate(order._id, cfg.next)}
              disabled={updating === order._id}
              className={`flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl transition ${cfg.btnColor} disabled:opacity-50`}>
              {updating === order._id ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : <MdArrowForward size={14} />}
              {cfg.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function FarmerDashboard() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [tab, setTab]                   = useState("listings");
  const [listings, setListings]         = useState([]);
  const [orders, setOrders]             = useState([]);
  const [loadingData, setLoadingData]   = useState(true);
  const [formLoading, setFormLoading]   = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [showForm, setShowForm]         = useState(false);
  const [editCrop, setEditCrop]         = useState(null);
  const [deleteCrop, setDeleteCrop]     = useState(null);
  const [toast, setToast]               = useState("");
  const [error, setError]               = useState("");
  const [orderFilter, setOrderFilter]   = useState("all");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "farmer") { navigate("/"); return; }
    fetchAll();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchAll = async () => {
    setLoadingData(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        axios.get("/api/farmer/products"),
        axios.get("/api/farmer/orders"),
      ]);
      setListings(prodRes.data);
      setOrders(orderRes.data);
    } catch { setError("Failed to load dashboard data."); }
    finally { setLoadingData(false); }
  };

  const handleAdd = async (form) => {
    setFormLoading(true);
    try { await axios.post("/api/products", form); await fetchAll(); setShowForm(false); showToast("✅ Crop listed!"); }
    catch (err) { setError(err.response?.data?.message || "Failed to add."); }
    finally { setFormLoading(false); }
  };

  const handleEdit = async (form) => {
    setFormLoading(true);
    try { await axios.put(`/api/products/${editCrop._id}`, form); await fetchAll(); setEditCrop(null); showToast("✅ Updated!"); }
    catch (err) { setError(err.response?.data?.message || "Failed to update."); }
    finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try { await axios.delete(`/api/products/${deleteCrop._id}`); await fetchAll(); setDeleteCrop(null); showToast("🗑️ Removed."); }
    catch (err) { setError(err.response?.data?.message || "Failed to delete."); }
    finally { setDeleteLoading(false); }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) => prev.map((o) => o._id === orderId
        ? { ...o, status: newStatus, statusHistory: [...(o.statusHistory || []), { status: newStatus, updatedAt: new Date() }] }
        : o
      ));
      const labels = { confirmed: "✅ Order confirmed!", shipped: "🚚 Marked as shipped!", delivered: "🎉 Delivered!", cancelled: "❌ Order cancelled." };
      showToast(labels[newStatus] || `Updated to ${newStatus}`);
    } catch (err) { setError(err.response?.data?.message || "Failed to update status."); }
    finally { setUpdatingOrder(null); }
  };

  const pendingOrders  = orders.filter((o) => o.status === "pending").length;
  const totalRevenue   = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + (o.total || 0), 0);
  const filteredOrders = orderFilter === "all" ? orders : orders.filter((o) => o.status === orderFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-green-300 text-sm mb-1">Farmer Dashboard</p>
          <h1 className="text-3xl font-extrabold">Welcome, {user?.name} 🌾</h1>
          <p className="text-green-200 text-sm mt-1">{user?.village}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6 flex justify-between">
            {error} <button onClick={() => setError("")}><MdClose size={18} /></button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <StatCard icon="🌾" label="Active Listings" value={listings.length} sub="crops listed" color="border-green-100" />
          <StatCard icon="📦" label="Pending Orders"  value={pendingOrders}  sub="need your action" color="border-yellow-100" />
          <StatCard icon="💰" label="Total Revenue"   value={`₹${totalRevenue.toLocaleString("en-IN")}`} sub="from all orders" color="border-blue-100" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
          {[
            { id: "listings", label: "My Listings",    icon: <MdInventory size={18} /> },
            { id: "orders",   label: "Incoming Orders", icon: <MdShoppingBag size={18} /> },
          ].map(({ id, label, icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${tab === id ? "bg-green-700 text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}>
              {icon} {label}
              {id === "orders" && pendingOrders > 0 && (
                <span className="bg-yellow-400 text-green-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{pendingOrders}</span>
              )}
            </button>
          ))}
        </div>

        {/* LISTINGS TAB */}
        {tab === "listings" && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-gray-500">{listings.length} crop{listings.length !== 1 ? "s" : ""} listed</p>
              <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition shadow-md">
                <MdAdd size={20} /> List New Crop
              </button>
            </div>
            {loadingData ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-36 bg-gray-200" />
                    <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-7xl mb-4">🌱</span>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No crops listed yet</h3>
                <button onClick={() => setShowForm(true)} className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition mt-4">List Your First Crop →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map((crop) => (
                  <div key={crop._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="h-36 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-5xl">
                      {crop.image ? <img src={crop.image} alt={crop.name} className="h-full w-full object-cover" /> : <span>{categoryEmoji(crop.category)}</span>}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-xs font-semibold text-green-600 uppercase">{crop.category}</span>
                      <h3 className="font-bold text-gray-800 mt-0.5 mb-1">{crop.name}</h3>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="font-extrabold text-green-800">₹{crop.price}/{crop.unit}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${crop.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {crop.stock > 0 ? `${crop.stock} ${crop.unit}` : "Out of stock"}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                        <button onClick={() => setEditCrop(crop)} className="flex-1 flex items-center justify-center gap-1.5 border border-green-600 text-green-700 hover:bg-green-50 text-xs font-semibold py-2 rounded-lg transition">
                          <MdEdit size={14} /> Edit
                        </button>
                        <button onClick={() => setDeleteCrop(crop)} className="flex-1 flex items-center justify-center gap-1.5 border border-red-300 text-red-500 hover:bg-red-50 text-xs font-semibold py-2 rounded-lg transition">
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

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div>
            <div className="flex gap-2 flex-wrap mb-5">
              {["all", "pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                <button key={s} onClick={() => setOrderFilter(s)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition capitalize ${orderFilter === s ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"}`}>
                  {s === "all" ? "All" : s} ({s === "all" ? orders.length : orders.filter(o => o.status === s).length})
                </button>
              ))}
            </div>

            {loadingData ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" /><div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiPackage className="text-gray-300 mb-4" size={64} />
                <h3 className="text-lg font-bold text-gray-700 mb-2">No orders yet</h3>
                <p className="text-gray-400 text-sm">Vendor orders will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order._id} order={order} onStatusUpdate={handleStatusUpdate} updating={updatingOrder} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showForm && <CropFormModal onSave={handleAdd} onClose={() => setShowForm(false)} loading={formLoading} />}
      {editCrop  && <CropFormModal initial={editCrop} onSave={handleEdit} onClose={() => setEditCrop(null)} loading={formLoading} />}
      {deleteCrop && <DeleteModal crop={deleteCrop} onConfirm={handleDelete} onClose={() => setDeleteCrop(null)} loading={deleteLoading} />}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-800 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <MdCheck size={18} /> {toast}
        </div>
      )}
    </div>
  );
}

export default FarmerDashboard;