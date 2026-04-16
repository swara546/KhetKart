import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const categories = [
  { path: "/products", cat: "Grains",     label: "🌾 Grains" },
  { path: "/products", cat: "Vegetables", label: "🥦 Vegetables" },
  { path: "/products", cat: "Fruits",     label: "🍎 Fruits" },
  { path: "/products", cat: "Pulses",     label: "🫘 Pulses" },
];

const socials = [
  { label: "WhatsApp", icon: FaWhatsapp, href: "#" },
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "YouTube", icon: FaYoutube, href: "#" },
];

function Footer() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  // Quick links change based on role
  const quickLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Browse Crops" },
    ...(user?.role === "farmer"
      ? [{ path: "/seller-dashboard", label: "My Dashboard" }]
      : []),
    ...(user?.role === "vendor"
      ? [
          { path: "/cart", label: "Cart" },
          { path: "/orders", label: "My Orders" },
        ]
      : []),
    ...(!user
      ? [
          { path: "/login", label: "Login" },
          { path: "/register", label: "Register" },
        ]
      : []),
  ];

  return (
    <footer className="bg-green-900 text-white mt-16">

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-extrabold tracking-tight">KhetKart 🌱</h2>
          <p className="mt-3 text-sm text-green-300 leading-relaxed">
            India's direct farm-to-vendor marketplace. No middlemen, no agents — farmers earn more, vendors pay less.
          </p>
          <div className="flex gap-2 mt-4">
            <span className="text-xs bg-green-700 text-green-200 px-2.5 py-1 rounded-full">🧑‍🌾 For Farmers</span>
            <span className="text-xs bg-green-700 text-green-200 px-2.5 py-1 rounded-full">🏪 For Vendors</span>
          </div>
          <div className="flex gap-3 mt-5">
            {socials.map(({ label, icon: Icon, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label} title={label}
                className="w-9 h-9 bg-green-700 hover:bg-yellow-400 hover:text-green-900 rounded-lg flex items-center justify-center text-base transition">
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-green-400 mb-4">Quick Links</h3>
          <ul className="space-y-2.5">
            {quickLinks.map(({ path, label }) => (
              <li key={label}>
                <NavLink to={path}
                  className="text-sm text-green-200 hover:text-yellow-400 transition flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-green-500 group-hover:bg-yellow-400 transition" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-green-400 mb-4">Crop Categories</h3>
          <ul className="space-y-2.5">
            {categories.map(({ path, cat, label }) => (
              <li key={label}>
                <NavLink to={{ pathname: path, search: `?category=${cat}` }}
                  className="text-sm text-green-200 hover:text-yellow-400 transition flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-green-500 group-hover:bg-yellow-400 transition" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-6 bg-green-800 rounded-xl p-3 text-xs text-green-300">
            <p className="font-bold text-white text-sm">0% Commission</p>
            <p className="mt-0.5">Farmers keep 100% of what they earn on KhetKart.</p>
          </div>
        </div>

        {/* Contact + Newsletter */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-green-400 mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-green-200 mb-6">
            <li className="flex items-center gap-2">
              <MdEmail className="text-green-400 shrink-0" size={16} />
              <a href="#" className="hover:text-yellow-400 transition">support@khetkart.com</a>
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-green-400 shrink-0" size={16} />
              <a href="#" className="hover:text-yellow-400 transition">+91 1234567890</a>
            </li>
            <li className="flex items-start gap-2">
              <MdLocationOn className="text-green-400 shrink-0 mt-0.5" size={16} />
              <span className="text-green-300">Ahmedabad, Gujarat, India</span>
            </li>
          </ul>

          <h3 className="font-bold text-sm uppercase tracking-widest text-green-400 mb-3">Get Updates</h3>
          {subscribed ? (
            <p className="text-sm text-yellow-400 font-medium">
              ✅ Thanks! We'll notify you of fresh crop listings.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 min-w-0 bg-green-800 border border-green-600 text-white placeholder-green-500 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition" />
              <button type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-sm px-3 py-2 rounded-lg transition whitespace-nowrap">
                Join
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-green-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-green-400">
          <span>&copy; {new Date().getFullYear()} KhetKart. All rights reserved.</span>
          <div className="flex gap-4">
            <NavLink to="/privacy" className="hover:text-yellow-400 transition">Privacy Policy</NavLink>
            <NavLink to="/terms" className="hover:text-yellow-400 transition">Terms of Use</NavLink>
            <NavLink to="/refund" className="hover:text-yellow-400 transition">Refunds</NavLink>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;