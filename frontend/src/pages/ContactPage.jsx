import React, { useState } from "react";
import axios from "axios";
import { useShop } from "../context/ShopContext";
import "../styles/contact.css";

const ContactPage = () => {
  const { showToast } = useShop();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    reason: "General Inquiry",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post("/api/contact", formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        showToast("Inquiry submitted successfully!");
        setFormData({ name: "", email: "", reason: "General Inquiry", message: "" });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Error submitting message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <section className="contact-hero">
        <div className="hero-content">
          <h1>WANT EMAILS YOU’LL ACTUALLY READ?</h1>
          <p>Joining the community will be the best decision you’ve made since you landed on our website.</p>
        </div>
      </section>

      <section className="email">
        <div className="header">
          <i className="fa-regular fa-envelope"></i>
          <h1>Send Us An Email</h1>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: "#e8f8f0", border: "1px solid #2ed573", color: "#1b8245", padding: "16px 24px", borderRadius: "8px", marginBottom: "24px", maxWidth: "800px", margin: "0 auto 24px" }}>
            <p style={{ margin: 0, fontWeight: "700" }}>{successMsg}</p>
          </div>
        )}

        <div className="form">
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <div className="info">
              <label htmlFor="full_name">Your Name</label>
              <input
                type="text"
                id="full_name"
                placeholder="(Required)"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <label htmlFor="gmail">Your Email</label>
              <input
                type="email"
                id="gmail"
                placeholder="(Required)"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <label htmlFor="reason">Reason for Contact</label>
              <input
                type="text"
                id="reason"
                placeholder="Order tracking, size exchange, community"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />

              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                rows="5"
                placeholder="How can Gymshark help you today?"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ width: "100%", padding: "12px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
              ></textarea>
            </div>

            <div style={{ marginTop: "24px", textAlign: "center" }}>
              <button
                type="submit"
                className="checkout-btn"
                style={{ maxWidth: "300px" }}
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Submit Message"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
