import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ShopProvider, useShop } from "./context/ShopContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import WishlistDrawer from "./components/WishlistDrawer";
import ProductModal from "./components/ProductModal";
import CheckoutModal from "./components/CheckoutModal";
import AuthModal from "./components/AuthModal";

// Pages
import HomePage from "./pages/HomePage";
import MenPage from "./pages/MenPage";
import WomenPage from "./pages/WomenPage";
import AccessoriesPage from "./pages/AccessoriesPage";
import ContactPage from "./pages/ContactPage";

// Global App Styles
import "./styles/App.css";

const ToastNotice = () => {
  const { toast } = useShop();
  if (!toast) return null;
  return (
    <div className="toast-container">
      <i className="fa-solid fa-circle-check" style={{ color: "#2ed573" }}></i>
      <span>{toast}</span>
    </div>
  );
};

function MainLayout() {
  return (
    <div className="gymshark-app">
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      {/* Interactive Global Modals & Drawers */}
      <CartDrawer />
      <WishlistDrawer />
      <ProductModal />
      <CheckoutModal />
      <AuthModal />
      <ToastNotice />
    </div>
  );
}

function App() {
  return (
    <ShopProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </ShopProvider>
  );
}

export default App;
