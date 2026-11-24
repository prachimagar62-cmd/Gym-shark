import React, { useState } from "react";
import axios from "axios";
import { useShop } from "../context/ShopContext";

const CheckoutModal = () => {
  const { isCheckoutOpen, setIsCheckoutOpen, cart, cartTotal, clearCart, showToast } =
    useShop();

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    street: "",
    city: "Kathmandu",
    paymentMethod: "Cash on Delivery",
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
        },
        items: cart,
        totalAmount: cartTotal,
        paymentMethod: formData.paymentMethod,
      };

      const res = await axios.post("/api/orders", payload);
      if (res.data.success) {
        setOrderComplete(res.data.order);
        clearCart();
        showToast("Order placed successfully!");
      }
    } catch (err) {
      showToast("Order error: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={() => {
            setIsCheckoutOpen(false);
            setOrderComplete(null);
          }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {orderComplete ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <i
              className="fa-solid fa-circle-check"
              style={{ fontSize: "56px", color: "#2ed573", marginBottom: "16px" }}
            ></i>
            <h2 style={{ fontSize: "22px", fontWeight: "900", marginBottom: "8px" }}>
              THANK YOU FOR YOUR ORDER!
            </h2>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
              Order Reference: <strong>{orderComplete.orderNumber || "GS-789412"}</strong>
            </p>
            <p style={{ fontSize: "13px", color: "#777", marginBottom: "24px" }}>
              We've dispatched a confirmation email to <strong>{formData.email}</strong>.
              Your Gymshark gear will arrive shortly!
            </p>
            <button
              className="checkout-btn"
              onClick={() => {
                setIsCheckoutOpen(false);
                setOrderComplete(null);
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "20px" }}>
              GYMSHARK SECURE CHECKOUT
            </h2>

            <form onSubmit={handleSubmit} className="gymshark-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+977 9800000000"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="Thamel, Street 4"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>City / Location</label>
                <input
                  type="text"
                  required
                  placeholder="Kathmandu"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentMethod: e.target.value })
                  }
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="eSewa / Khalti">eSewa / Khalti Mobile Wallet</option>
                  <option value="Credit / Debit Card">Credit / Debit Card</option>
                </select>
              </div>

              <div
                style={{
                  padding: "14px",
                  background: "#f9f9f9",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span>Items Total ({cart.reduce((a, b) => a + b.quantity, 0)}):</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "6px" }}>
                  <span>Delivery:</span>
                  <span>{cartTotal >= 75 ? "FREE" : "€5.00"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "16px", marginTop: "10px", borderTop: "1px solid #ddd", paddingTop: "8px" }}>
                  <span>Total To Pay:</span>
                  <span>€{(cartTotal + (cartTotal >= 75 ? 0 : 5)).toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="checkout-btn" disabled={submitting}>
                {submitting ? "Placing Order..." : "Confirm & Place Order"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
