// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: "🌱",
    title: "Premium Seeds",
    desc: "Certified, high-yield seeds sourced directly from trusted farms across India.",
  },
  {
    icon: "🧪",
    title: "Fertilizers & Nutrients",
    desc: "Organic and chemical fertilizers to maximise your harvest every season.",
  },
  {
    icon: "🛠️",
    title: "Farming Tools",
    desc: "Durable, affordable tools built for Indian soil and modern agriculture.",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Doorstep delivery across rural and urban areas within 3–5 business days.",
  },
  {
    icon: "💰",
    title: "Best Prices",
    desc: "No middlemen. Direct from supplier to farmer — guaranteed fair pricing.",
  },
  {
    icon: "🤝",
    title: "Trusted by Farmers",
    desc: "Over 10,000 farmers across India shop with KhetKart every season.",
  },
];

const testimonials = [
  {
    name: "Ramesh Patil",
    location: "Nashik, Maharashtra",
    avatar: "🧑‍🌾",
    quote:
      "KhetKart saved me ₹4,000 this season. The seeds germinated faster than anything I've used before.",
  },
  {
    name: "Sunita Devi",
    location: "Ludhiana, Punjab",
    avatar: "👩‍🌾",
    quote:
      "Delivery was on time and the fertilizer quality was excellent. Will definitely order again!",
  },
  {
    name: "Arjun Reddy",
    location: "Warangal, Telangana",
    avatar: "🧑‍🌾",
    quote:
      "Best online agri store I've found. Simple to use and prices are genuinely lower than local shops.",
  },
];

const categories = [
  {
    label: "Seeds",
    emoji: "🌾",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  {
    label: "Fertilizers",
    emoji: "🧪",
    bg: "bg-lime-50",
    border: "border-lime-200",
  },
  {
    label: "Tools",
    emoji: "⛏️",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    label: "Pesticides",
    emoji: "🛡️",
    bg: "bg-sky-50",
    border: "border-sky-200",
  },
];

function Home() {
  const { user } = useAuth(); // ← know if user is logged in

  return (
    <div className="font-sans text-gray-800">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 opacity-10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative container mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              India's Agri Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Everything Your Farm <br />
              <span className="text-yellow-300">Needs, Delivered.</span>
            </h1>

            {/* ── Auth-aware greeting ── */}
            {user ? (
              <p className="text-green-100 text-lg mb-8 max-w-md">
                Welcome back, <strong>{user.name?.split(" ")[0]}</strong>! 👋{" "}
                <br />
                Ready to shop for your farm today?
              </p>
            ) : (
              <p className="text-green-100 text-lg mb-8 max-w-md">
                Seeds, fertilizers, tools & more — at prices that respect the
                farmer. Shop smart, grow better with <strong>KhetKart</strong>.
              </p>
            )}

            {/* ── Auth-aware buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/products"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-8 py-3 rounded-lg transition shadow-lg"
              >
                Shop Now →
              </Link>

              {/* Show "Create Account" only if NOT logged in */}
              {!user && (
                <Link
                  to="/register"
                  className="border border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  Create Account
                </Link>
              )}

              {/* Show "My Cart" if logged in */}
              {user && (
                <Link
                  to="/cart"
                  className="border border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  🛒 My Cart
                </Link>
              )}
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 bg-white/10 rounded-3xl flex items-center justify-center text-9xl shadow-2xl border border-white/20">
              🌾
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <section className="bg-green-900 text-white">
        <div className="container mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "10,000+", label: "Farmers Served" },
            { val: "500+", label: "Products Listed" },
            { val: "28", label: "States Covered" },
            { val: "4.8 ★", label: "Avg. Rating" },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold text-yellow-300">{val}</p>
              <p className="text-sm text-green-300 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
          Browse by Category
        </h2>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Find exactly what your farm needs
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(({ label, emoji, bg, border }) => (
            <Link
              to="/products"
              key={label}
              className={`${bg} ${border} border-2 rounded-2xl p-6 flex flex-col items-center gap-3 hover:shadow-md transition group`}
            >
              <span className="text-5xl group-hover:scale-110 transition-transform">
                {emoji}
              </span>
              <span className="font-semibold text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
            Why KhetKart?
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm">
            Built for Indian farmers, by people who care about agriculture
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
          What Farmers Say
        </h2>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Real reviews from real farmers across India
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ name, location, avatar, quote }) => (
            <div
              key={name}
              className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6"
            >
              <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                "{quote}"
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{avatar}</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{name}</p>
                  <p className="text-xs text-gray-400">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── changes based on login state ───────── */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white">
        <div className="container mx-auto px-6 py-14 text-center">
          {user ? (
            <>
              <h2 className="text-3xl font-extrabold mb-4">
                Happy farming, {user.name?.split(" ")[0]}! 🌿
              </h2>
              <p className="text-green-100 mb-8 max-w-lg mx-auto">
                Your farm deserves the best. Browse our latest products and get
                them delivered fast.
              </p>
              <Link
                to="/products"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-10 py-3 rounded-lg transition shadow-lg inline-block"
              >
                Browse Products →
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold mb-4">
                Ready to grow smarter? 🌿
              </h2>
              <p className="text-green-100 mb-8 max-w-lg mx-auto">
                Join thousands of farmers who save time and money with KhetKart
                every season.
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-10 py-3 rounded-lg transition shadow-lg inline-block"
                >
                  Join for Free →
                </Link>
                <Link
                  to="/products"
                  className="border border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  Explore Products
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
