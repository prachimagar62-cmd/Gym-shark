import React from "react";
import { useShop } from "../context/ShopContext";

const WishlistDrawer = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, addToCart } =
    useShop();

  if (!isWishlistOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Your Wishlist ({wishlist.length})</h3>
          <button className="modal-close-btn" onClick={() => setIsWishlistOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="drawer-body">
          {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <i
                className="fa-regular fa-heart"
                style={{ fontSize: "48px", color: "#ccc", marginBottom: "16px" }}
              ></i>
              <h4>Your wishlist is empty</h4>
              <p style={{ fontSize: "13px", color: "#666" }}>
                Tap the heart on any item to save it for later.
              </p>
            </div>
          ) : (
            wishlist.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <p className="cart-item-meta">{item.color} • {item.fit}</p>
                  <p className="cart-item-price">
                    {item.currency || "€"}{item.price}
                  </p>

                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button
                      className="quick-add-btn"
                      onClick={() => addToCart(item, "M")}
                    >
                      Move to Bag
                    </button>
                    <button
                      className="cart-item-remove"
                      onClick={() => toggleWishlist(item)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
