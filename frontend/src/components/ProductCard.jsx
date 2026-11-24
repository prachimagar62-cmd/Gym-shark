import React from "react";
import { useShop } from "../context/ShopContext";

const ProductCard = ({ product }) => {
  const { addToCart, wishlist, toggleWishlist, setSelectedProduct } = useShop();

  const isWishlisted = wishlist.some((w) => w.name === product.name);

  return (
    <div className="product-card">
      <div onClick={() => setSelectedProduct(product)}>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.target.src = "/image/men/p1.png";
          }}
        />
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="rating">
            <span className="star">★</span>
            <span className="rating-value">{product.rating || "4.3"}</span>
          </div>
          <p className="product-fit">{product.fit || "Regular Fit"}</p>
          <p className="product-color">{product.color || "Black"}</p>
          <p className="product-price">
            {product.currency || "€"}{product.price}
          </p>
        </div>
      </div>

      <div className="product-card-actions">
        <button
          className="quick-add-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product, "M");
          }}
        >
          Add to Bag
        </button>
        <button
          className={`card-wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <i className={`fa-${isWishlisted ? "solid" : "regular"} fa-heart`}></i>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
