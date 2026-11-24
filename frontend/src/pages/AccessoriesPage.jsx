import React, { useState, useEffect } from "react";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import "../styles/accessories.css";

const AccessoriesPage = () => {
  const { products, fetchProducts, loading } = useShop();

  const [sortOption, setSortOption] = useState("default");
  const [selectedSub, setSelectedSub] = useState("all");

  useEffect(() => {
    fetchProducts({ category: "accessories" });
  }, []);

  const accProducts = products.filter((p) => p.category === "accessories");

  let filtered = [...accProducts];
  if (selectedSub !== "all") {
    filtered = filtered.filter((p) =>
      p.subCategory.toLowerCase().includes(selectedSub.toLowerCase())
    );
  }
  if (sortOption === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <main>
      <section className="acc-hero">
        <div className="upper-text">
          <h1>ALL ACCESSORIES</h1>
          <p>
            A workout outfit is never complete without sports accessories. From
            gym bags to lifting straps, shakers to knee sleeves, you'll never be
            short of anything.
          </p>
        </div>
        <div className="acc-banner">
          <img src="/image/accessories/banner.png" alt="Accessories Banner" />
        </div>
      </section>

      <section className="container" style={{ padding: "30px 40px" }}>
        {/* Quick Filter Buttons */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "30px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "700" }}>FILTER BY:</span>
          {["all", "Bags", "Lifting Gear", "Bottles", "Socks", "Headwear"].map((cat) => (
            <button
              key={cat}
              className={`size-chip ${selectedSub === cat ? "selected" : ""}`}
              onClick={() => setSelectedSub(cat)}
            >
              {cat === "all" ? "All Accessories" : cat}
            </button>
          ))}

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: "700" }}>SORT:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              style={{
                padding: "8px 12px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "60px 0", textAlign: "center" }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "32px" }}></i>
            <p style={{ marginTop: "12px", fontWeight: "600" }}>Loading Gymshark Accessories...</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "24px" }}>
            {filtered.map((item) => (
              <ProductCard key={item._id || item.name} product={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AccessoriesPage;
