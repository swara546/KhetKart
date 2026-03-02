import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    village: "",
    role: "customer",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    const { name, mobile, village, password, confirmPassword } = formData;

    if (!name || !mobile || !village || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // TEMP until backend
    alert("Registration successful (UI only)");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

        {/* Heading */}
        <h2 className="text-2xl font-bold text-primary text-center">
          Create Account 🌱
        </h2>
        <p className="text-sm text-muted text-center mt-2">
          Join KhetKart today
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="mt-6 space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border border-muted rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />

          <input
            name="mobile"
            placeholder="Mobile Number"
            onChange={handleChange}
            className="w-full border border-muted rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />

          <input
            name="village"
            placeholder="Village"
            onChange={handleChange}
            className="w-full border border-muted rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />

          <select
            name="role"
            onChange={handleChange}
            className="w-full border border-muted rounded-lg px-4 py-2 bg-white focus:outline-none focus:border-primary"
          >
            <option value="customer">Customer (Buy Products)</option>
            <option value="seller">Seller (Sell Products)</option>
          </select>

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border border-muted rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full border border-muted rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            Sign Up
          </button>
        </form>

        {/* Login Redirect */}
        <p className="text-sm text-center text-muted mt-6">
          Already have an account?
          <span
            onClick={() => navigate("/login")}
            className="text-primary font-semibold cursor-pointer hover:underline"
          >
            Log in
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;
