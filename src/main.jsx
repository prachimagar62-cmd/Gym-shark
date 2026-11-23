import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import homePage from "../html/home.html?raw";
import womenPage from "../html/women.html?raw";
import menPage from "../html/men.html?raw";
import accessoriesPage from "../html/accessories.html?raw";
import contactPage from "../html/contact.html?raw";
import "../css/home.css";
import "../css/women.css";
import "../css/men.css";
import "../css/accessories.css";
import "../css/contact.css";
import "./storefront.css";

const pages = {
  "/": homePage,
  "/home": homePage,
  "/women": womenPage,
  "/men": menPage,
  "/accessories": accessoriesPage,
  "/contact": contactPage,
};

const routes = {
  "home.html": "/",
  "women.html": "/women",
  "men.html": "/men",
  "accessories.html": "/accessories",
  "contact.html": "/contact",
};

function preparePage(source) {
  const parsedPage = new DOMParser().parseFromString(source, "text/html");
  const content = parsedPage.body;

  for (const image of content.querySelectorAll("img[src]")) {
    image.setAttribute("src", image.getAttribute("src").replace(/^\.?\/?image\//, "/image/"));
  }

  for (const link of content.querySelectorAll("a[href]")) {
    const target = link.getAttribute("href").split("/").pop();
    if (routes[target]) link.setAttribute("href", routes[target]);
  }

  for (const button of content.querySelectorAll("button[onclick]")) {
    const destination = button.getAttribute("onclick").match(/location\.href\s*=\s*['"]([^'"]+)/)?.[1];
    if (destination) button.dataset.appRoute = routes[destination.split("/").pop()] || destination;
    button.removeAttribute("onclick");
  }

  const cartIcon = content.querySelector(".icon .fa-bag-shopping");
  if (cartIcon) {
    cartIcon.setAttribute("role", "button");
    cartIcon.setAttribute("tabindex", "0");
    cartIcon.setAttribute("aria-label", "Open shopping bag");
    cartIcon.dataset.openCart = "true";
  }

  const searchInput = content.querySelector(".search input");
  if (searchInput) {
    searchInput.setAttribute("aria-label", "Search products");
    searchInput.setAttribute("type", "search");
  }

  const contactFields = content.querySelector(".email .form");
  if (contactFields) {
    const info = contactFields.querySelector(".info");
    const message = document.createElement("div");
    message.className = "message";
    message.innerHTML = '<label for="mes">Your Message</label><textarea id="mes" name="message" placeholder="Write your message here" required></textarea><button type="submit">SEND</button>';

    const form = document.createElement("form");
    form.className = "contact-form";
    form.append(info, message);
    contactFields.replaceChildren(form);

    for (const [index, input] of info.querySelectorAll("input").entries()) {
      input.required = true;
      input.name = ["name", "email", "subject"][index];
      if (index === 1) input.type = "email";
    }
  }

  return content.innerHTML;
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("gymshark-cart") || "[]");
  } catch {
    return [];
  }
}

function addBagButton(card, name, price, image) {
  if (!name || !image || !price || card.querySelector(".bag-add-btn")) return;
  card.dataset.productName = name;
  const button = document.createElement("button");
  button.className = "bag-add-btn";
  button.type = "button";
  button.dataset.addToBag = "true";
  button.textContent = "ADD TO BAG";
  button.setAttribute("aria-label", `Add ${name} to bag`);
  card.querySelector(".product-info")?.append(button);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  const image = document.createElement("img");
  image.src = product.image;
  image.alt = product.name;
  const info = document.createElement("div");
  info.className = "product-info";
  const name = document.createElement("h3");
  name.className = "product-name";
  name.textContent = product.name;
  const rating = document.createElement("div");
  rating.className = "rating";
  rating.innerHTML = '<span class="star">★</span>';
  const ratingValue = document.createElement("span");
  ratingValue.className = "rating-value";
  ratingValue.textContent = String(product.rating || 4.5);
  rating.append(ratingValue);
  const fit = document.createElement("p");
  fit.className = "product-fit";
  fit.textContent = product.fit || "Regular Fit";
  const color = document.createElement("p");
  color.className = "product-color";
  color.textContent = product.color || "Black";
  const price = document.createElement("p");
  price.className = "product-price";
  price.textContent = `€${Number(product.price).toFixed(2)}`;
  info.append(name, rating, fit, color, price);
  card.append(image, info);
  return card;
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const pageRef = useRef(null);
  const page = pages[path] || homePage;

  useEffect(() => {
    const navigateBack = () => setPath(window.location.pathname);
    window.addEventListener("popstate", navigateBack);
    return () => window.removeEventListener("popstate", navigateBack);
  }, []);

  useEffect(() => {
    const container = pageRef.current;
    if (!container) return;

    container.querySelectorAll(".product-card").forEach((card) => {
      const name = card.querySelector(".product-name")?.textContent.trim();
      const image = card.querySelector("img");
      const priceText = card.querySelector(".product-price")?.textContent || "";
      const price = Number(priceText.replace(/[^\d.]/g, ""));
      addBagButton(card, name, price, image?.getAttribute("src"));
    });
  }, [page]);

  useEffect(() => {
    const category = path.slice(1);
    if (!["women", "men", "accessories"].includes(category)) return;
    const controller = new AbortController();

    fetch(`/api/products?category=${category}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : [])
      .then((products) => {
        const grid = pageRef.current?.querySelector(".product-grid");
        if (!grid || !Array.isArray(products)) return;
        const cards = [...grid.querySelectorAll(".product-card")];

        products.forEach((product) => {
          const existing = cards.find((card) => card.querySelector(".product-name")?.textContent.trim() === product.name);
          if (existing) {
            const image = existing.querySelector("img");
            if (image && product.image) image.src = product.image;
            const fit = existing.querySelector(".product-fit");
            if (fit && product.fit) fit.textContent = product.fit;
            const color = existing.querySelector(".product-color");
            if (color && product.color) color.textContent = product.color;
            const rating = existing.querySelector(".rating-value");
            if (rating && product.rating) rating.textContent = String(product.rating);
            const price = existing.querySelector(".product-price");
            if (price && Number.isFinite(product.price)) price.textContent = `€${product.price.toFixed(2)}`;
            addBagButton(existing, product.name, product.price, product.image || image?.getAttribute("src"));
            return;
          }

          let row = grid.lastElementChild;
          if (!row || row.querySelectorAll(".product-card").length >= 4) {
            row = document.createElement("div");
            row.className = "product-row";
            grid.append(row);
          }
          const card = createProductCard(product);
          row.append(card);
          addBagButton(card, product.name, product.price, product.image);
        });
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Catalog request failed:", error);
      });

    return () => controller.abort();
  }, [path]);

  useEffect(() => {
    localStorage.setItem("gymshark-cart", JSON.stringify(cart));
  }, [cart]);

  function navigate(destination) {
    const nextPath = pages[destination] ? destination : "/";
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    setCartOpen(false);
    window.scrollTo(0, 0);
  }

  function handleClick(event) {
    const routeTarget = event.target.closest("[data-app-route]");
    if (routeTarget) {
      event.preventDefault();
      navigate(routeTarget.dataset.appRoute);
      return;
    }

    const link = event.target.closest("a[href]");
    if (link && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      const destination = link.getAttribute("href");
      if (Object.values(routes).includes(destination)) {
        event.preventDefault();
        navigate(destination);
        return;
      }
    }

    if (event.target.closest("[data-open-cart]")) {
      setCartOpen(true);
      return;
    }

    if (event.target.closest("[data-add-to-bag]")) {
      const card = event.target.closest(".product-card");
      const name = card?.dataset.productName;
      const price = Number((card?.querySelector(".product-price")?.textContent || "").replace(/[^\d.]/g, ""));
      const image = card?.querySelector("img")?.getAttribute("src");
      if (name && price) {
        setCart((current) => [...current, { name, price, image }]);
        setNotice(`${name} added to bag`);
        window.setTimeout(() => setNotice(""), 2400);
      }
    }
  }

  function handleInput(event) {
    if (!event.target.matches(".search input")) return;
    const query = event.target.value.trim().toLowerCase();
    pageRef.current?.querySelectorAll(".product-card").forEach((card) => {
      card.hidden = !card.textContent.toLowerCase().includes(query);
    });
  }

  async function handleSubmit(event) {
    if (!event.target.matches(".contact-form")) return;
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const message = document.createElement("p");
    message.className = "form-status";
    submitButton.disabled = true;
    submitButton.textContent = "SENDING...";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to send your message.");
      message.textContent = "Thanks. Your message has been received.";
      form.reset();
    } catch (error) {
      message.textContent = error.message || "The server is unavailable. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "SEND";
      form.querySelector(".form-status")?.remove();
      form.append(message);
    }
  }

  async function checkout() {
    if (!cart.length) return;
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to place this demo order.");
      setCart([]);
      setNotice(`Demo order ${result.orderId} placed`);
      setCartOpen(false);
      window.setTimeout(() => setNotice(""), 3200);
    } catch (error) {
      setNotice(error.message || "The server is unavailable. Please try again.");
      window.setTimeout(() => setNotice(""), 3200);
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="storefront" onClick={handleClick} onInput={handleInput} onSubmit={handleSubmit}>
      <div ref={pageRef} dangerouslySetInnerHTML={{ __html: preparePage(page) }} />
      <span className="bag-count" aria-live="polite">{cart.length ? cart.length : ""}</span>
      {notice && <div className="store-notice" role="status">{notice}</div>}
      {cartOpen && <div className="bag-backdrop" onClick={() => setCartOpen(false)} />}
      <aside className={`bag-drawer${cartOpen ? " is-open" : ""}`} aria-label="Shopping bag" aria-hidden={!cartOpen}>
        <div className="bag-heading">
          <h2>Your bag <span>({cart.length})</span></h2>
          <button type="button" className="bag-close" aria-label="Close bag" onClick={() => setCartOpen(false)}>×</button>
        </div>
        <div className="bag-items">
          {cart.length ? cart.map((item, index) => (
            <div className="bag-item" key={`${item.name}-${index}`}>
              <img src={item.image} alt="" />
              <div><strong>{item.name}</strong><span>€{item.price.toFixed(2)}</span></div>
              <button type="button" aria-label={`Remove ${item.name}`} onClick={() => setCart((items) => items.filter((_, itemIndex) => itemIndex !== index))}>Remove</button>
            </div>
          )) : <p className="bag-empty">Your bag is currently empty.</p>}
        </div>
        <div className="bag-summary">
          <p><span>Subtotal</span><strong>€{total.toFixed(2)}</strong></p>
          <button type="button" disabled={!cart.length} onClick={checkout}>CHECKOUT</button>
          <small>Demo checkout only. No payment is collected.</small>
        </div>
      </aside>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);