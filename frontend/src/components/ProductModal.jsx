import React, { useState } from "react";
import { useShop } from "../context/ShopContext";

const ProductModal = () => {
  const { selectedProduct, setSelectedProduct, addToCart, wishlist, toggleWishlist } =
    useShop();
  const [selectedSize, setSelectedSize] = useState("M");

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.some((w) => w.name === selectedProduct.name);
  const sizes = selectedProduct.availableSizes || ["S", "M", "L", "XL", "XXL"];

  return (
    <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
      <div className="modal-card" style={{ maxWidth: "600px" }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={() => setSelectedProduct(null)}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 240px" }}>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{
                width: "100%",
                borderRadius: "8px",
                objectFit: "cover",
                background: "#f7f7f7",
              }}
            />
          </div>

          <div style={{ flex: "1 1 280px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: "800",
                color: "#666",
                textTransform: "uppercase",
              }}
            >
              GYMSHARK {selectedProduct.category?.toUpperCase()}
            </span>
            <h2 style={{ fontSize: "22px", fontWeight: "900", margin: "6px 0 10px" }}>
              {selectedProduct.name}
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <span style={{ color: "#000", fontWeight: "700" }}>★ {selectedProduct.rating || "4.3"}</span>
              <span style={{ fontSize: "12px", color: "#777" }}>
                ({selectedProduct.reviewsCount || 24} reviews)
              </span>
            </div>

            <p style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 16px" }}>
              {selectedProduct.currency || "€"}{selectedProduct.price}
            </p>

            <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.5", marginBottom: "16px" }}>
              {selectedProduct.description ||
                "Engineered with sweat-wicking breathability and flexible stretch fabric. Built for high performance training and rest day recovery."}
            </p>

            <div style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700" }}>COLOR:</span>{" "}
              <span style={{ fontSize: "12px", color: "#666" }}>{selectedProduct.color}</span>
            </div>

            <div>
              <span style={{ fontSize: "12px", fontWeight: "700" }}>SELECT SIZE:</span>
              <div className="size-chips">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`size-chip ${selectedSize === sz ? "selected" : ""}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="checkout-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  addToCart(selectedProduct, selectedSize);
                  setSelectedProduct(null);
                }}
              >
                Add To Bag
              </button>
              <button
                className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
                style={{ width: "48px", height: "48px" }}
                onClick={() => toggleWishlist(selectedProduct)}
              >
                <i className={`fa-${isWishlisted ? "solid" : "regular"} fa-heart`}></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
