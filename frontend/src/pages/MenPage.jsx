import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import "../styles/men.css";

const MenPage = () => {
  const { products, fetchProducts, loading } = useShop();

  const [sortOption, setSortOption] = useState("default");
  const [selectedFit, setSelectedFit] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");

  useEffect(() => {
    fetchProducts({ category: "men" });
  }, []);

  const menProducts = products.filter((p) => p.category === "men");

  // Filter & sort
  let filtered = [...menProducts];
  if (selectedFit !== "all") {
    filtered = filtered.filter((p) =>
      p.fit.toLowerCase().includes(selectedFit.toLowerCase())
    );
  }
  if (selectedColor !== "all") {
    filtered = filtered.filter((p) =>
      p.color.toLowerCase().includes(selectedColor.toLowerCase())
    );
  }
  if (sortOption === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  const handleClear = () => {
    setSortOption("default");
    setSelectedFit("all");
    setSelectedColor("all");
  };

  return (
    <main>
      {/* Men's Hero Banner with Category Circles */}
      <section className="menhero">
        <div className="mens-text">
          <h1>MEN'S PRODUCTS</h1>
          <p>
            Stock up on your workout wardrobe or test a fresh 'fit. Shop all men's
            Gymshark products here.
          </p>
        </div>
        <div className="cloth-type">
          <div className="box" onClick={() => setSelectedFit("all")}>
            <img src="/image/men/hero1.png" alt="Hoodies" />
            <p>Men's Hoodies</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("Regular Fit")}>
            <img src="/image/men/hero2.png" alt="Outerwear" />
            <p>Mens Outwear</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("Slim Fit")}>
            <img src="/image/men/hero3.png" alt="Joggers" />
            <p>Mens Joggers</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("all")}>
            <img src="/image/men/hero4.png" alt="Shorts" />
            <p>Mens Shorts</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("all")}>
            <img src="/image/men/hero5.png" alt="Jackets" />
            <p>Mens Gym Jackets</p>
          </div>
        </div>
      </section>

      {/* Main Content: Filter Aside + Dynamic Products Grid */}
      <section className="content-wrapper">
        <aside className="filter-sort">
          <div className="filter-header">
            <h3>FILTER & SORT</h3>
            <button className="clear-btn" onClick={handleClear}>
              Clear All
            </button>
          </div>

          <div className="filter-group">
            <h4>SORT BY</h4>
            <ul className="sort-list">
              <li>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    checked={sortOption === "price-asc"}
                    onChange={() => setSortOption("price-asc")}
                  />
                  Price: Low to High
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    checked={sortOption === "price-desc"}
                    onChange={() => setSortOption("price-desc")}
                  />
                  Price: High to Low
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="sort"
                    checked={sortOption === "default"}
                    onChange={() => setSortOption("default")}
                  />
                  Featured / Default
                </label>
              </li>
            </ul>
          </div>

          <div className="filter-group">
            <h4>FIT</h4>
            <ul className="sort-list">
              <li>
                <label>
                  <input
                    type="radio"
                    name="fit"
                    checked={selectedFit === "all"}
                    onChange={() => setSelectedFit("all")}
                  />
                  All Fits
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="fit"
                    checked={selectedFit === "Oversized Fit"}
                    onChange={() => setSelectedFit("Oversized Fit")}
                  />
                  Oversized Fit
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="fit"
                    checked={selectedFit === "Slim Fit"}
                    onChange={() => setSelectedFit("Slim Fit")}
                  />
                  Slim Fit
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="fit"
                    checked={selectedFit === "Regular Fit"}
                    onChange={() => setSelectedFit("Regular Fit")}
                  />
                  Regular Fit
                </label>
              </li>
            </ul>
          </div>

          <div className="filter-group">
            <h4>COLOR</h4>
            <ul className="sort-list">
              <li>
                <label>
                  <input
                    type="radio"
                    name="color"
                    checked={selectedColor === "all"}
                    onChange={() => setSelectedColor("all")}
                  />
                  All Colors
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="color"
                    checked={selectedColor === "Black"}
                    onChange={() => setSelectedColor("Black")}
                  />
                  Black
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="color"
                    checked={selectedColor === "Grey"}
                    onChange={() => setSelectedColor("Grey")}
                  />
                  Grey
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="color"
                    checked={selectedColor === "White"}
                    onChange={() => setSelectedColor("White")}
                  />
                  White
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Dynamic Products Display */}
        <div className="products">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#666" }}>
              Showing {filtered.length} Men's Styles
            </p>
          </div>

          {loading ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "32px" }}></i>
              <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading Gymshark Men's Gear...</p>
            </div>
          ) : (
            <div className="product-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
              {filtered.map((item) => (
                <ProductCard key={item._id || item.name} product={item} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MenPage;
