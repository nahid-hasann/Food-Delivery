import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import MyOrders from './pages/MyOrders';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/food/:id" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <WishlistProvider>
          <CartProvider>
            <ReactLenis root>
              <Router>
                <ScrollToTop />
                <div className="app-container">
                  {/* Sticky Navigation Bar */}
                  <Navbar />
                  
                  {/* Sliding Drawer Cart */}
                  <CartSidebar />
                  
                  {/* Main Page Content */}
                  <main className="main-content">
                    <AnimatedRoutes />
                  </main>

                  {/* Global Footer */}
                  <Footer />
                </div>
              </Router>
            </ReactLenis>
          </CartProvider>
        </WishlistProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
