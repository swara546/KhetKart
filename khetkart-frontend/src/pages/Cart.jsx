import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdDelete,
  MdShoppingCart,
  MdArrowBack,
  MdLocalShipping,
  MdCheckCircle,
} from "react-icons/md";
import { FiMinus, FiPlus } from "react-icons/fi";

// ── Helpers ──────────────────────────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem("khetkart_cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("khetkart_cart", JSON.stringify(cart));
}

const DELIVERY_FEE = 49;
const FREE_DELIVERY_ABOVE = 500;

// ── Empty State ──────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center px-4">
      <span className="text-8xl mb-5">🛒</span>
      <h2 className="text-2xl font-extrabold text-gray-700 mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-400 text-sm mb-8 max-w-xs">
        Looks like you haven't added any products yet. Go explore our store!
      </p>
      <Link
        to="/products"
        className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition shadow-md"
      >
        Browse Products
      </Link>
    </div>
  );
}

// ── Order Placed Modal ───────────────────────────────────────────
function OrderPlacedModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
        <MdCheckCircle className="text-green-500 mx-auto mb-4" size={64} />
        <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
          Order Placed!
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Thank you for shopping with KhetKart 🌱 <br />
          Your order has been received and will be delivered soon.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

// ── Cart Item Row ────────────────────────────────────────────────
function CartItem({ item, onQtyChange, onRemove }) {
  const emoji = {
    Seeds: "🌱",
    Fertilizers: "🧪",
    Tools: "⛏️",
    Pesticides: "🛡️",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4 items-start">
      {/* Thumbnail */}
      <div className="w-16 h-16 shrink-0 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-3xl">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <span>{emoji[item.category] || "📦"}</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
          {item.category}
        </p>
        <h3 className="font-bold text-gray-800 text-sm leading-snug truncate">
          {item.name}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">
          ₹{item.price} / {item.unit || "unit"}
        </p>

        {/* Qty + remove row */}
        <div className="flex items-center justify-between mt-3">
          {/* Qty controls */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onQtyChange(item._id, item.qty - 1)}
              className="px-3 py-1.5 text-green-700 hover:bg-green-50 transition disabled:opacity-30"
              disabled={item.qty <= 1}
            >
              <FiMinus size={14} />
            </button>
            <span className="px-3 py-1.5 text-sm font-bold text-gray-700 border-x border-gray-200 min-w-[2rem] text-center">
              {item.qty}
            </span>
            <button
              onClick={() => onQtyChange(item._id, item.qty + 1)}
              className="px-3 py-1.5 text-green-700 hover:bg-green-50 transition"
            >
              <FiPlus size={14} />
            </button>
          </div>

          {/* Line total + remove */}
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-green-800 text-sm">
              ₹{(item.price * item.qty).toLocaleString("en-IN")}
            </span>
            <button
              onClick={() => onRemove(item._id)}
              className="text-red-400 hover:text-red-600 transition"
              title="Remove item"
            >
              <MdDelete size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart);
  const [placing, setPlacing] = useState(false);
  const [ordered, setOrdered] = useState(false);

  // ── Cart operations ──────────────────────────────────────────
  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map((i) => (i._id === id ? { ...i, qty: newQty } : i));
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((i) => i._id !== id);
    setCart(updated);
    saveCart(updated);
  };

  const clearCart = () => {
    setCart([]);
    saveCart([]);
  };

  // ── Totals ───────────────────────────────────────────────────
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);

  // ── Place Order ──────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setPlacing(true);

    // ── OPTION A: Simulated (active now, remove when backend is ready)
    // await new Promise((r) => setTimeout(r, 1200));
    // setOrdered(true);
    // clearCart();

    // ── OPTION B: Real API (uncomment when backend is ready)
    try {
      const token = localStorage.getItem("khetkart_token");
      await axios.post(
        "/api/orders",
        {
          items: cart.map(({ _id, qty, price }) => ({
            productId: _id,
            qty,
            price,
          })),
          subtotal,
          delivery,
          total,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrdered(true);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || "Order failed. Please try again.");
    }

    setPlacing(false);
  };

  // ── After order placed ───────────────────────────────────────
  const handleOrderClose = () => {
    setOrdered(false);
    navigate("/products");
  };

  if (cart.length === 0 && !ordered) return <EmptyCart />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 text-white px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-green-200 hover:text-white text-sm mb-3 transition w-fit"
          >
            <MdArrowBack size={18} /> Back to Products
          </Link>
          <h1 className="text-3xl font-extrabold">Your Cart 🛒</h1>
          <p className="text-green-200 text-sm mt-1">
            {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Cart Items ── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free delivery nudge */}
          {subtotal < FREE_DELIVERY_ABOVE && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-4 py-3 flex items-center gap-3 text-sm">
              <MdLocalShipping className="text-yellow-500 shrink-0" size={20} />
              <span className="text-yellow-800">
                Add{" "}
                <strong>
                  ₹{(FREE_DELIVERY_ABOVE - subtotal).toLocaleString("en-IN")}
                </strong>{" "}
                more to get <strong>FREE delivery!</strong>
              </span>
            </div>
          )}
          {subtotal >= FREE_DELIVERY_ABOVE && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3 text-sm">
              <MdLocalShipping className="text-green-500 shrink-0" size={20} />
              <span className="text-green-800 font-semibold">
                🎉 You've unlocked FREE delivery!
              </span>
            </div>
          )}

          {/* Items */}
          {cart.map((item) => (
            <CartItem
              key={item._id}
              item={item}
              onQtyChange={updateQty}
              onRemove={removeItem}
            />
          ))}

          {/* Clear cart */}
          <div className="text-right">
            <button
              onClick={clearCart}
              className="text-sm text-red-400 hover:text-red-600 hover:underline transition"
            >
              Clear entire cart
            </button>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-gray-800 mb-5">
              Order Summary
            </h2>

            {/* Line items */}
            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>
                  Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                </span>
                <span className="font-semibold text-gray-800">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span
                  className={`font-semibold ${
                    delivery === 0 ? "text-green-600" : "text-gray-800"
                  }`}
                >
                  {delivery === 0 ? "FREE" : `₹${delivery}`}
                </span>
              </div>
              {delivery === 0 && (
                <p className="text-xs text-green-600">
                  ✓ Free delivery on orders above ₹{FREE_DELIVERY_ABOVE}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center mb-6">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-2xl font-extrabold text-green-800">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Placing Order…
                </>
              ) : (
                <>
                  <MdShoppingCart size={20} />
                  Place Order · ₹{total.toLocaleString("en-IN")}
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              🔒 Safe & secure checkout
            </p>

            {/* Product breakdown */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Items in order
              </p>
              <ul className="space-y-1.5">
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between text-xs text-gray-500"
                  >
                    <span className="truncate max-w-[65%]">
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-medium text-gray-700">
                      ₹{(item.price * item.qty).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Order placed modal */}
      {ordered && <OrderPlacedModal onClose={handleOrderClose} />}
    </div>
  );
}

export default Cart;
