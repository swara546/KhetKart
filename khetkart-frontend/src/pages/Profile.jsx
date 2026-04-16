// src/pages/Profile.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";

export default function Profile() {
  const { user, login } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    mobile: user?.mobile || "",
    village: user?.village || "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);
  const [showPw, setShowPw] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await axios.put("/api/profile", {
        name: form.name,
        village: form.village,
        // mobile is read-only — not sent
      });
      // Update AuthContext so Navbar name updates immediately
      const stored = JSON.parse(localStorage.getItem("khetkart_user") || "{}");
      const updated = {
        ...stored,
        name: res.data.name,
        village: res.data.village,
      };
      localStorage.setItem("khetkart_user", JSON.stringify(updated));
      login(updated, localStorage.getItem("khetkart_token"));
      setMsg({ type: "success", text: "✅ Profile updated successfully!" });
    } catch {
      setMsg({ type: "error", text: "Update failed. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    try {
      await axios.put("/api/profile/password", {
        currentPassword: pwForm.current,
        newPassword: pwForm.newPw,
      });
      setPwMsg({ type: "success", text: "✅ Password changed successfully!" });
      setPwForm({ current: "", newPw: "", confirm: "" });
    } catch (err) {
      setPwMsg({
        type: "error",
        text: err.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setPwSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        {/* ── Profile Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-800 to-emerald-700 px-6 py-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-yellow-400 flex items-center justify-center text-2xl font-extrabold text-green-900 shrink-0">
              {form.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-white text-xl font-extrabold">{form.name}</h1>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-md mt-1 inline-block ${
                  user?.role === "farmer"
                    ? "bg-green-600 text-white"
                    : "bg-yellow-400 text-green-900"
                }`}
              >
                {user?.role === "farmer" ? "🧑‍🌾 Farmer" : "🏪 Vendor"}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="px-6 py-6 space-y-4">
            {msg && (
              <div
                className={`text-sm px-4 py-3 rounded-lg font-medium ${
                  msg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-600 border border-red-200"
                }`}
              >
                {msg.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                Mobile Number
              </label>
              <input
                value={form.mobile}
                disabled
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-100 text-gray-500 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Mobile number cannot be changed.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">
                {user?.role === "farmer" ? "Village" : "City"}
              </label>
              <input
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder="Village / City name"
                required
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-2.5 rounded-xl transition text-sm"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        {/* ── Change Password Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowPw((p) => !p)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <span className="font-bold text-gray-700">🔒 Change Password</span>
            <span className="text-gray-400 text-sm">
              {showPw ? "▲ Hide" : "▼ Show"}
            </span>
          </button>

          {showPw && (
            <form
              onSubmit={handlePasswordChange}
              className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4"
            >
              {pwMsg && (
                <div
                  className={`text-sm px-4 py-3 rounded-lg font-medium ${
                    pwMsg.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-600 border border-red-200"
                  }`}
                >
                  {pwMsg.text}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={pwForm.current}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, current: e.target.value })
                  }
                  placeholder="Enter current password"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={pwForm.newPw}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, newPw: e.target.value })
                  }
                  placeholder="Min 6 characters"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={pwForm.confirm}
                  onChange={(e) =>
                    setPwForm({ ...pwForm, confirm: e.target.value })
                  }
                  placeholder="Repeat new password"
                  required
                  className={inputClass}
                />
              </div>
              <button
                type="submit"
                disabled={pwSaving}
                className="w-full bg-green-700 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-2.5 rounded-xl transition text-sm"
              >
                {pwSaving ? "Changing…" : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
