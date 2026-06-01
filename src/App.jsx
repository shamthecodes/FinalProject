import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import useUserSync from "./hooks/useUserSync";
import "./App.css";

import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AITryOn from "./pages/AITryOn";
import Wishlist from "./pages/Wishlist";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderConfirmed from "./pages/OrderConfirmed";
import TrackOrder from "./pages/TrackOrder";
import About from "./pages/About";

// Syncs Clerk user to Supabase automatically
const AppContent = () => {
  useUserSync();

  return (
    <Layout>
      <Routes>
        {/* ✅ PUBLIC — anyone can view */}
        <Route path="/" element={<Hero />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/collections/:category" element={<Collections />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />

        {/* 🔑 AUTH — only for non-logged-in users */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/*" element={<Signup />} />
        <Route
          path="/try-on"
          element={
            <ProtectedRoute>
              <AITryOn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        {/* 🔒 PROTECTED — must be logged in */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/try-on"
          element={
            <ProtectedRoute>
              <AITryOn />
            </ProtectedRoute>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <div>Checkout</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmed"
          element={
            <ProtectedRoute>
              <OrderConfirmed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/track-order/:orderId"
          element={
            <ProtectedRoute>
              <TrackOrder />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
