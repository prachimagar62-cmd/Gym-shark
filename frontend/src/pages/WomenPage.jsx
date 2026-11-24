import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import "../styles/women.css";

const WomenPage = () => {
  const { products, fetchProducts, loading } = useShop();

  const [sortOption, setSortOption] = useState("default");
  const [selectedFit, setSelectedFit] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");

  useEffect(() => {
    fetchProducts({ category: "women" });
  }, []);

  const womenProducts = products.filter((p) => p.category === "women");

  // Filter & sort
  let filtered = [...womenProducts];
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
      {/* Women's Hero Banner with Category Circles */}
      <section className="womenhero">
        <div className="womens-text">
          <h1>WOMEN'S PRODUCTS</h1>
          <p>
            Stock up on your workout faves or test a fresh 'fit. Shop all women's
            Gymshark products here.
          </p>
        </div>
        <div className="cloth-type">
          <div className="box" onClick={() => setSelectedFit("all")}>
            <img src="/image/women/hero1.png" alt="Outerwear" />
            <p>Womens Outwear</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("Oversized Fit")}>
            <img src="/image/women/hero2.png" alt="Hoodies" />
            <p>Womens Hoodies</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("all")}>
            <img src="/image/women/hero3.png" alt="Joggers" />
            <p>Womens Joggers</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("High Waisted")}>
            <img src="/image/women/hero4.png" alt="Leggings" />
            <p>Womens Leggings</p>
          </div>
          <div className="box" onClick={() => setSelectedFit("all")}>
            <img src="/image/women/hero5.png" alt="Sports Bras" />
            <p>Womens Sports Bras</p>
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
                    name="wsort"
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
                    name="wsort"
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
                    name="wsort"
                    checked={sortOption === "default"}
                    onChange={() => setSortOption("default")}
                  />
                  Featured / Default
                </label>
              </li>
            </ul>
          </div>

          <div className="filter-group">
            <h4>FIT & STYLE</h4>
            <ul className="sort-list">
              <li>
                <label>
                  <input
                    type="radio"
                    name="wfit"
                    checked={selectedFit === "all"}
                    onChange={() => setSelectedFit("all")}
                  />
                  All Styles
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="wfit"
                    checked={selectedFit === "High Waisted"}
                    onChange={() => setSelectedFit("High Waisted")}
                  />
                  High Waisted
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="wfit"
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
                    name="wfit"
                    checked={selectedFit === "Compression Fit"}
                    onChange={() => setSelectedFit("Compression Fit")}
                  />
                  Compression Fit
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
                    name="wcolor"
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
                    name="wcolor"
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
                    name="wcolor"
                    checked={selectedColor === "Brown"}
                    onChange={() => setSelectedColor("Brown")}
                  />
                  Brown / Taupe
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Dynamic Products Display */}
        <div className="products">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <p style={{ fontSize: "14px", fontWeight: "700", color: "#666" }}>
              Showing {filtered.length} Women's Styles
            </p>
          </div>

          {loading ? (
            <div style={{ padding: "60px 0", textAlign: "center" }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "32px" }}></i>
              <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading Gymshark Women's Gear...</p>
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

export default WomenPage;
