import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("gymshark_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("gymshark_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User Auth
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("gymshark_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("gymshark_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("gymshark_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Fetch Products
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products", { params });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.warn("Error fetching products:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Cart Actions
  const addToCart = (product, size = "M") => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.name === product.name && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.name === product.name && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id || product.name,
          name: product.name,
          price: product.price,
          currency: product.currency || "€",
          image: product.image,
          color: product.color,
          fit: product.fit,
          size,
          quantity: 1,
        },
      ];
    });
    showToast(`Added ${product.name} (${size}) to your bag!`);
  };

  const updateQuantity = (name, size, qty) => {
    if (qty <= 0) {
      removeFromCart(name, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.name === name && item.size === size
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const removeFromCart = (name, size) => {
    setCart((prev) =>
      prev.filter((item) => !(item.name === name && item.size === size))
    );
    showToast("Item removed from bag");
  };

  const clearCart = () => setCart([]);

  // Wishlist Actions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.name === product.name);
      if (exists) {
        showToast(`Removed ${product.name} from wishlist.`);
        return prev.filter((p) => p.name !== product.name);
      } else {
        showToast(`Saved ${product.name} to wishlist ❤️`);
        return [...prev, product];
      }
    });
  };

  // Auth Actions
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("gymshark_user", JSON.stringify(userData));
    localStorage.setItem("gymshark_token", token);
    showToast(`Welcome back, ${userData.name}!`);
    setIsAuthOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gymshark_user");
    localStorage.removeItem("gymshark_token");
    showToast("Logged out successfully");
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        user,
        login,
        logout,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAuthOpen,
        setIsAuthOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProduct,
        setSelectedProduct,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
