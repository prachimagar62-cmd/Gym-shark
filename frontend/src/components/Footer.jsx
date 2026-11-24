import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { showToast } = useShop();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      showToast("Thank you for subscribing to Gymshark newsletter!");
      setEmail("");
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-col">
            <h4>HELP</h4>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#delivery">Delivery Information</a></li>
              <li><a href="#returns">Returns Policy</a></li>
              <li><a href="#orders">Make A Return</a></li>
              <li><a href="#orders">Orders</a></li>
              <li><a href="#submit">Submit a Fake</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>MY ACCOUNT</h4>
            <ul>
              <li><a href="#login">Login</a></li>
              <li><a href="#register">Register</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>PAGES</h4>
            <ul>
              <li><Link to="/men">Men's Workout Clothes</Link></li>
              <li><Link to="/women">Women's Gym Clothes</Link></li>
              <li><Link to="/accessories">Fitness Accessories</Link></li>
              <li><Link to="/contact">Contact Community</Link></li>
            </ul>
          </div>

          <div className="footer-col newsletter-col">
            <h4>MORE ABOUT GYMSHARK</h4>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "14px" }}>
              Be the first to know about new drops, training events and exclusive sales.
            </p>
            <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "8px" }}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  padding: "10px 14px",
                  borderRadius: "20px",
                  border: "1px solid #ddd",
                  fontSize: "13px",
                  flex: 1,
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "20px",
                  padding: "10px 18px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                JOIN
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom" style={{ borderTop: "1px solid #e5e5e5", paddingTop: "24px", marginTop: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <p style={{ fontSize: "12px", color: "#888" }}>
            © {new Date().getFullYear()} Gymshark Ltd. All rights reserved. Be a visionary.
          </p>
          <div className="payment-icons" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <img src="/image/home/pay1.svg" alt="Visa" style={{ height: "20px" }} />
            <img src="/image/home/pay2.svg" alt="Mastercard" style={{ height: "20px" }} />
            <img src="/image/home/pay3.svg" alt="Amex" style={{ height: "20px" }} />
            <img src="/image/home/pay4.svg" alt="PayPal" style={{ height: "20px" }} />
            <img src="/image/home/pay5.svg" alt="Apple Pay" style={{ height: "20px" }} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
