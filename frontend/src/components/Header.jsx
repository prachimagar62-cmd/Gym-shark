import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";

const Header = () => {
  const {
    cartCount,
    wishlist,
    user,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthOpen,
    logout,
    products,
    setSelectedProduct,
  } = useShop();

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Search filtered items
  const filteredSearch = searchTerm.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.color.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
    : [];

  return (
    <>
      <header>
        <div className="container">
          <nav>
            <NavLink to="/women">Women</NavLink>
            <NavLink to="/men">Men</NavLink>
            <NavLink to="/accessories">Accessories</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          <div className="logo">
            <Link to="/">GYMSHARK</Link>
          </div>

          <div className="gap1">
            <div className="search search-container">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="What are you looking for today?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {filteredSearch.length > 0 && (
                <div className="search-results-dropdown">
                  {filteredSearch.map((item, idx) => (
                    <div
                      key={idx}
                      className="search-result-item"
                      onClick={() => {
                        setSelectedProduct(item);
                        setSearchTerm("");
                      }}
                    >
                      <img src={item.image} alt={item.name} />
                      <div className="search-item-info">
                        <h5>{item.name}</h5>
                        <p>
                          {item.currency || "€"}{item.price} • {item.color}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="icon">
              {/* Wishlist Heart */}
              <div
                className="badge-wrapper"
                onClick={() => setIsWishlistOpen(true)}
                title="Wishlist"
              >
                <i className="fa-regular fa-heart"></i>
                {wishlist.length > 0 && (
                  <span className="count-badge">{wishlist.length}</span>
                )}
              </div>

              {/* User Account */}
              <div
                className="badge-wrapper user-badge"
                onClick={() => (!user ? setIsAuthOpen(true) : logout())}
                title={user ? `Signed in as ${user.name} (Click to logout)` : "Sign In"}
              >
                <i className={`fa-${user ? "solid" : "regular"} fa-user`}></i>
                {user && <span className="user-name-tag">{user.name.split(" ")[0]}</span>}
              </div>

              {/* Shopping Bag */}
              <div
                className="badge-wrapper"
                onClick={() => setIsCartOpen(true)}
                title="Shopping Bag"
              >
                <i className="fa-solid fa-bag-shopping"></i>
                {cartCount > 0 && (
                  <span className="count-badge">{cartCount}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header Navigation Bar */}
      <section className="shop">
        <div className="container">
          <Link to="/women">Shop Women's</Link>
          <Link to="/men">Shop Men's</Link>
        </div>
      </section>
    </>
  );
};

export default Header;
