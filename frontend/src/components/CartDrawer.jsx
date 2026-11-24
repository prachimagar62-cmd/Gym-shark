import React from "react";
import { useShop } from "../context/ShopContext";

const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartTotal,
    updateQuantity,
    removeFromCart,
    setIsCheckoutOpen,
  } = useShop();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 75;
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3>Your Bag ({cart.reduce((a, b) => a + b.quantity, 0)})</h3>
          <button className="modal-close-btn" onClick={() => setIsCartOpen(false)}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="drawer-body">
          {/* Free Shipping Meter */}
          <div style={{ marginBottom: "18px" }}>
            <p style={{ fontSize: "12px", fontWeight: "700", margin: "0 0 4px" }}>
              {remainingForFreeShipping === 0
                ? "🎉 You've unlocked FREE standard delivery!"
                : `Spend €${remainingForFreeShipping.toFixed(2)} more for FREE delivery`}
            </p>
            <div className="free-shipping-bar">
              <div
                className="free-shipping-progress"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <i
                className="fa-solid fa-bag-shopping"
                style={{ fontSize: "48px", color: "#ccc", marginBottom: "16px" }}
              ></i>
              <h4>Your bag is empty</h4>
              <p style={{ fontSize: "13px", color: "#666" }}>
                Explore Men's, Women's, or Accessories to start shopping!
              </p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.name}-${item.size}-${idx}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h4 className="cart-item-title">{item.name}</h4>
                  <p className="cart-item-meta">
                    Size: {item.size} • Color: {item.color}
                  </p>
                  <p className="cart-item-price">
                    {item.currency}{item.price * item.quantity}
                  </p>

                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.name, item.size, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        updateQuantity(item.name, item.size, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.name, item.size)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="drawer-footer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
                fontSize: "16px",
                fontWeight: "800",
              }}
            >
              <span>SUBTOTAL</span>
              <span>€{cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              Checkout (€{cartTotal.toFixed(2)})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
