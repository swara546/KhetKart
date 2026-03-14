// src/pages/Home.jsx
import { Link , NavLink} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: "🚫",
    title: "No Middlemen",
    desc: "Farmers sell directly to vendors — no commission agents, no price manipulation.",
  },
  {
    icon: "💰",
    title: "Better Prices",
    desc: "Farmers earn more. Vendors pay less. Everyone wins with direct trade.",
  },
  {
    icon: "🌾",
    title: "Fresh from the Farm",
    desc: "Produce listed directly by the farmer who grew it — as fresh as it gets.",
  },
  {
    icon: "🤝",
    title: "Trusted Network",
    desc: "Verified farmers and vendors. Transparent listings, honest pricing.",
  },
  {
    icon: "🚚",
    title: "Direct Delivery",
    desc: "Coordinate pickup or delivery directly with the farmer — no third party.",
  },
  {
    icon: "📱",
    title: "Simple & Fast",
    desc: "List crops or place bulk orders in minutes from anywhere in India.",
  },
];

const testimonials = [
  {
    name: "Ramesh Patil",
    location: "Nashik, Maharashtra",
    avatar: "🧑‍🌾",
    role: "Farmer",
    quote:
      "Earlier I had to sell wheat at ₹18/kg to the agent. On KhetKart I get ₹24/kg directly from vendors.",
  },
  {
    name: "Suresh Traders",
    location: "Pune, Maharashtra",
    avatar: "🏪",
    role: "Vendor",
    quote:
      "I source fresh vegetables daily from farmers on KhetKart. Quality is better and cost is 20% lower.",
  },
  {
    name: "Sunita Devi",
    location: "Ludhiana, Punjab",
    avatar: "👩‍🌾",
    role: "Farmer",
    quote:
      "I listed my rice harvest and got 3 bulk orders within a day. No agent took a cut!",
  },
];

const categories = [
  {
    path: "/products",
    label: "Grains",
    emoji: "🌾",
    bg: "bg-amber-50",
    border: "border-amber-200",
    desc: "Wheat, Rice, Maize, Bajra",
    cat: "Grains"
  },
  {
    path: "/products",
    label: "Vegetables",
    emoji: "🥦",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    desc: "Tomato, Onion, Potato & more",
    cat: "Vegetables"
  },
  {
    path: "/products",
    label: "Fruits",
    emoji: "🍎",
    bg: "bg-red-50",
    border: "border-red-200",
    desc: "Mango, Banana, Grapes & more",
    cat:"Fruits"
  },
  {
    path: "/products",
    label: "Pulses",
    emoji: "🫘",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    desc: "Dal, Chana, Moong & more",
    cat: "Pulses"
  },
];

const steps = [
  {
    role: "farmer",
    icon: "🧑‍🌾",
    step: "1",
    title: "Farmer Lists Crop",
    desc: "Farmer adds their harvest — crop type, quantity, price per kg, and location.",
  },
  {
    role: "both",
    icon: "🔍",
    step: "2",
    title: "Vendor Discovers",
    desc: "Vendors browse fresh listings filtered by crop, location, and price.",
  },
  {
    role: "vendor",
    icon: "🏪",
    step: "3",
    title: "Vendor Places Order",
    desc: "Vendor places a bulk order directly — no agent, no commission.",
  },
  {
    role: "both",
    icon: "✅",
    step: "4",
    title: "Direct Transaction",
    desc: "Farmer and vendor connect, agree on pickup/delivery, deal is done.",
  },
];

function Home() {
  const { user } = useAuth();

  return (
    <div className="font-sans text-gray-800">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white opacity-5 rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 opacity-10 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative container mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
              India's Farm-to-Vendor Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Buy Direct from <br />
              <span className="text-yellow-300">Indian Farmers. 🌾</span>
            </h1>

            {user ? (
              <p className="text-green-100 text-lg mb-8 max-w-md">
                Welcome back, <strong>{user.name?.split(" ")[0]}</strong>! 👋
                <br />
                {user.role === "farmer"
                  ? "Ready to list your harvest today?"
                  : "Fresh produce from farmers is waiting for you."}
              </p>
            ) : (
              <p className="text-green-100 text-lg mb-8 max-w-md">
                No agents. No commission. Farmers earn more, vendors pay less.{" "}
                <strong>Direct trade, fair prices.</strong>
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link
                to="/products"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-8 py-3 rounded-lg transition shadow-lg"
              >
                Browse Crops →
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="border border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  Join KhetKart Free
                </Link>
              )}
              {user && (
                <Link
                  to={user.role === "farmer" ? "/seller-dashboard" : "/cart"}
                  className="border border-white/50 hover:bg-white/10 text-white font-semibold px-8 py-3 rounded-lg transition"
                >
                  {user.role === "farmer" ? "📋 My Listings" : "🛒 My Orders"}
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

      {/* ── STATS ────────────────────────────────────────────── */}
      <section className="bg-green-900 text-white">
        <div className="container mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: "12,000+", label: "Farmers Registered" },
            { val: "3,500+", label: "Vendors Connected" },
            { val: "28", label: "States Covered" },
            { val: "0%", label: "Commission Charged" },
          ].map(({ val, label }) => (
            <div key={label}>
              <p className="text-2xl font-extrabold text-yellow-300">{val}</p>
              <p className="text-sm text-green-300 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
          How KhetKart Works
        </h2>
        <p className="text-center text-gray-500 mb-12 text-sm">
          Simple, transparent, direct
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon, step, title, desc }) => (
            <div key={step} className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
                {icon}
              </div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
                Step {step}
              </span>
              <h3 className="font-bold text-gray-800 mt-1 mb-2">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
            Browse by Crop Type
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm">
            Fresh produce listed directly by farmers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ label, emoji, bg, border, desc, cat, path }) => (
              <NavLink
                to={{ pathname: path, search: `?category=${cat}` }}
                key={label}
                className={`${bg} ${border} border-2 rounded-2xl p-6 flex flex-col items-center gap-2 hover:shadow-md transition group`}
              >
                <span className="text-5xl group-hover:scale-110 transition-transform">
                  {emoji}
                </span>
                <span className="font-bold text-gray-700">{label}</span>
                <span className="text-xs text-gray-400 text-center">
                  {desc}
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
          Why KhetKart?
        </h2>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Built to remove the middleman, empower the farmer
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
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-green-800 mb-2">
            Real Stories
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm">
            From farmers and vendors across India
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, location, avatar, role, quote }) => (
              <div
                key={name}
                className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm"
              >
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">
                  "{quote}"
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{avatar}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {name}
                    </p>
                    <p className="text-xs text-gray-400">{location}</p>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                        role === "Farmer"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white">
        <div className="container mx-auto px-6 py-14">
          {user ? (
            <div className="text-center">
              <h2 className="text-3xl font-extrabold mb-4">
                {user.role === "farmer"
                  ? "List your harvest today! 🌾"
                  : "Find fresh produce now! 🏪"}
              </h2>
              <p className="text-green-100 mb-8 max-w-lg mx-auto">
                {user.role === "farmer"
                  ? "Add your crops and connect with hundreds of vendors looking to buy directly from you."
                  : "Browse crops listed by verified farmers and place bulk orders at the best prices."}
              </p>
              <Link
                to={user.role === "farmer" ? "/seller-dashboard" : "/products"}
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-10 py-3 rounded-lg transition shadow-lg inline-block"
              >
                {user.role === "farmer"
                  ? "Go to My Dashboard →"
                  : "Browse Crops →"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Farmer CTA */}
              <div className="bg-white/10 rounded-2xl p-8 text-center border border-white/20">
                <span className="text-5xl">🧑‍🌾</span>
                <h3 className="text-xl font-extrabold mt-3 mb-2">
                  Are you a Farmer?
                </h3>
                <p className="text-green-100 text-sm mb-5">
                  List your crops and sell directly to vendors. No agent, no
                  commission.
                </p>
                <Link
                  to="/register"
                  className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-6 py-2.5 rounded-lg transition inline-block"
                >
                  Register as Farmer →
                </Link>
              </div>
              {/* Vendor CTA */}
              <div className="bg-white/10 rounded-2xl p-8 text-center border border-white/20">
                <span className="text-5xl">🏪</span>
                <h3 className="text-xl font-extrabold mt-3 mb-2">
                  Are you a Vendor?
                </h3>
                <p className="text-green-100 text-sm mb-5">
                  Source fresh produce directly from farmers at wholesale
                  prices.
                </p>
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-green-800 font-bold px-6 py-2.5 rounded-lg transition inline-block"
                >
                  Register as Vendor →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
