import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!mobile || !password) {
      alert("Please enter mobile number and password");
      return;
    }

    // TEMP (until backend is ready)
    alert("Login successful (UI only)");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        
        {/* Heading */}
        <h2 className="text-2xl font-bold text-primary text-center">
          Login to KhetKart 🌱
        </h2>
        <p className="text-sm text-muted text-center mt-2">
          Welcome back to KhetKart 🌱
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-muted rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-muted rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
          />

          <div className="text-right text-sm text-primary cursor-pointer hover:underline">
            Forgot password?
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition"
          >
            Login
          </button>
        </form>

        {/* Register */}
        <p className="text-sm text-center text-muted mt-6">
          New user?
          <span
            onClick={() => navigate("/register")}
            className="text-primary font-semibold cursor-pointer hover:underline"
          >
          {""}  Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
