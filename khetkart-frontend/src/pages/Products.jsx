// src/pages/Products.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axios";
import { MdSearch, MdClose, MdShoppingCart, MdFilterList, MdStar, MdLocationOn } from "react-icons/md";
import { FaSort } from "react-icons/fa";

const CATEGORIES = ["All", "Grains", "Vegetables", "Fruits", "Pulses"];

const SORT_OPTIONS = [
  { value: "default",    label: "Default" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc",   label: "Name: A → Z" },
];

// ── Helpers ──────────────────────────────────────────────────────
function applyFilters(products, { search, category, sort }) {
  let result = [...products];
  if (search.trim())
    result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    );
  if (category !== "All") result = result.filter((p) => p.category === category);
  if (sort === "price-asc")  result.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  if (sort === "name-asc")   result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

function categoryEmoji(cat) {
  const map = { Grains: "🌾", Vegetables: "🥦", Fruits: "🍎", Pulses: "🫘" };
  return map[cat] || "🌿";
}

function saveToCart(product) {
  const cart = JSON.parse(localStorage.getItem("khetkart_cart") || "[]");
  const existing = cart.find((i) => i._id === product._id);
  if (existing) existing.qty = (existing.qty || 1) + 1;
  else cart.push({ ...product, qty: 1 });
  localStorage.setItem("khetkart_cart", JSON.stringify(cart));
}

// ── Skeleton ─────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="flex justify-between pt-2">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// ── Crop Card ─────────────────────────────────────────────────────
function ProductCard({ product, onView, onAddToCart }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
      <div
        className="h-44 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-6xl cursor-pointer"
        onClick={() => onView(product)}
      >
        {product.image
          ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          : <span>{categoryEmoji(product.category)}</span>
        }
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
          {product.category}
        </span>
        <h3
          className="font-bold text-gray-800 text-sm leading-snug mb-1 cursor-pointer hover:text-green-700 transition line-clamp-2"
          onClick={() => onView(product)}
        >
          {product.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-2 flex-1">{product.description}</p>

        {/* Farmer location */}
        {product.sellerName && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <MdLocationOn size={12} className="text-green-500" />
            <span>{product.sellerName}</span>
          </div>
        )}

        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <MdStar className="text-yellow-400" size={14} />
            <span className="text-xs text-gray-500">{product.rating} / 5</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-extrabold text-green-800">₹{product.price}</span>
            <span className="text-xs font-normal text-gray-400"> /{product.unit || "kg"}</span>
            {product.minOrder && (
              <p className="text-xs text-orange-500">Min: {product.minOrder} {product.unit || "kg"}</p>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-1.5 bg-green-700 hover:bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition"
          >
            <MdShoppingCart size={14} /> Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Crop Detail Modal ────────────────────────────────────────────
function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="h-52 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-8xl relative">
          {product.image
            ? <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            : <span>{categoryEmoji(product.category)}</span>
          }
          <button onClick={onClose} className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-6">
          <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">{product.category}</span>
          <h2 className="text-xl font-extrabold text-gray-800 mt-1 mb-2">{product.name}</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
            {product.sellerName && (
              <div className="bg-green-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">🧑‍🌾 Farmer</p>
                <p className="font-semibold text-gray-700">{product.sellerName}</p>
              </div>
            )}
            {product.stock !== undefined && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Available Stock</p>
                <p className={`font-semibold ${product.stock > 0 ? "text-green-700" : "text-red-500"}`}>
                  {product.stock > 0 ? `${product.stock} ${product.unit || "kg"}` : "Out of stock"}
                </p>
              </div>
            )}
            {product.minOrder && (
              <div className="bg-orange-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Minimum Order</p>
                <p className="font-semibold text-orange-600">{product.minOrder} {product.unit || "kg"}</p>
              </div>
            )}
            {product.rating > 0 && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">Rating</p>
                <p className="font-semibold text-yellow-500 flex items-center gap-1"><MdStar />{product.rating} / 5</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-extrabold text-green-800">₹{product.price}</span>
              <span className="text-sm font-normal text-gray-400"> /{product.unit || "kg"}</span>
              <p className="text-xs text-gray-400 mt-0.5">Direct from farmer — no middleman</p>
            </div>
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              disabled={product.stock === 0}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold px-5 py-2.5 rounded-xl transition"
            >
              <MdShoppingCart size={18} /> Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort]         = useState("default");
  const [selected, setSelected] = useState(null);
  const [toast, setToast]       = useState("");

  // Read category from URL param whenever it changes
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
    else setCategory("All");
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        if (err.response) setError(`Server error: ${err.response.status}`);
        else if (err.request) setError("Cannot reach server. Is the backend running on port 5000?");
        else setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = applyFilters(products, { search, category, sort });

  const handleAddToCart = (product) => {
    saveToCart(product);
    setToast(`Order for "${product.name}" added!`);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-1">Fresh Crops 🌾</h1>
          <p className="text-green-200 text-sm">
            {loading ? "Loading…" : `${filtered.length} listing${filtered.length !== 1 ? "s" : ""} from farmers across India`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text" placeholder="Search wheat, tomato, mango…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <MdClose size={18} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <MdFilterList className="text-gray-400 shrink-0" size={18} />
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`text-xs font-semibold px-3 py-2 rounded-lg transition ${
                  category === cat ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700"
                }`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <FaSort className="text-gray-400" size={14} />
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white">
              {SORT_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid / States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">⚠️</span>
            <h2 className="text-lg font-bold text-gray-700 mb-2">Could not load listings</h2>
            <p className="text-sm text-gray-400 max-w-sm mb-6">{error}</p>
            <button onClick={() => window.location.reload()}
              className="bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-600 transition">
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="text-6xl mb-4">🔍</span>
            <h2 className="text-lg font-bold text-gray-700 mb-2">No listings found</h2>
            <p className="text-sm text-gray-400">Try changing your search or filter.</p>
            <button onClick={() => { setSearch(""); setCategory("All"); setSort("default"); }}
              className="mt-4 text-sm text-green-700 hover:underline font-medium">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} onView={setSelected} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={selected} onClose={() => setSelected(null)} onAddToCart={handleAddToCart} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-green-800 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <MdShoppingCart size={18} /> {toast}
        </div>
      )}
    </div>
  );
}

export default Products;