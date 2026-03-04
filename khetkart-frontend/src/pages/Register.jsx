// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "customer", label: "🛒 Customer", desc: "I want to buy products" },
  { value: "seller",   label: "🏪 Seller",   desc: "I want to sell products" },
];

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "", mobile: "", village: "", role: "customer", password: "", confirmPassword: "",
  });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const { name, mobile, village, password, confirmPassword } = formData;
    if (!name.trim())                      return "Full name is required.";
    if (!/^[6-9]\d{9}$/.test(mobile))     return "Enter a valid 10-digit Indian mobile number.";
    if (!village.trim())                   return "Village / City is required.";
    if (password.length < 6)              return "Password must be at least 6 characters.";
    if (password !== confirmPassword)     return "Passwords do not match.";
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        name: formData.name, mobile: formData.mobile,
        village: formData.village, role: formData.role, password: formData.password,
      });
      login(res.data.user, res.data.token); // auto login after register
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
          <div className="text-center mb-8">
            <span className="text-5xl">🌾</span>
            <h2 className="text-2xl font-extrabold text-green-800 mt-3">Create your account</h2>
            <p className="text-sm text-gray-400 mt-1">Join thousands of farmers on KhetKart</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="name" placeholder="Ramesh Patil" onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
                <input name="mobile" type="tel" maxLength={10} placeholder="9876543210" onChange={handleChange}
                  className="flex-1 border border-gray-300 rounded-r-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Village / City</label>
              <input name="village" placeholder="Nashik, Maharashtra" onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a…</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ value, label, desc }) => (
                  <button type="button" key={value}
                    onClick={() => setFormData({ ...formData, role: value })}
                    className={`border-2 rounded-xl p-3 text-left transition ${
                      formData.role === value ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}>
                    <p className="font-semibold text-sm text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" placeholder="Min. 6 characters" onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Repeat password" onChange={handleChange} className={inputClass} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 rounded-lg transition shadow-md mt-2">
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">Login</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">🔒 Your data is safe with KhetKart</p>
      </div>
    </div>
  );
}

export default Register;