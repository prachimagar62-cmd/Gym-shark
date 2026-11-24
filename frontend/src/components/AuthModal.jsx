import React, { useState } from "react";
import axios from "axios";
import { useShop } from "../context/ShopContext";

const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, login, showToast } = useShop();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegister ? "/api/users/register" : "/api/users/login";

    try {
      const res = await axios.post(endpoint, formData);
      if (res.data.success) {
        login(res.data.user, res.data.token);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setIsAuthOpen(false)}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "8px" }}>
          {isRegister ? "CREATE GYMSHARK ACCOUNT" : "SIGN IN TO GYMSHARK"}
        </h2>
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
          Track orders, build your wishlist, and get exclusive drop access.
        </p>

        <form onSubmit={handleSubmit} className="gymshark-form">
          {isRegister && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                required
                placeholder="David Laid"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="athlete@gymshark.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="checkout-btn" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "13px" }}>
          {isRegister ? (
            <p>
              Already have an account?{" "}
              <button
                style={{ background: "none", border: "none", fontWeight: "700", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setIsRegister(false)}
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to Gymshark?{" "}
              <button
                style={{ background: "none", border: "none", fontWeight: "700", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setIsRegister(true)}
              >
                Register Now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
