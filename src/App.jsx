import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import useUserSync from "./hooks/useUserSync";
import "./App.css";

import Hero from "./pages/Hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Collections from "./pages/Collections";
import ProductDetail from "./pages/ProductDetails";
import Cart from "./pages/Cart";

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
        <Route path="/about" element={<div>About Page</div>} />

        {/* 🔑 AUTH — only for non-logged-in users */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/*" element={<Signup />} />

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
              <div>Payment</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <div>Wishlist</div>
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
          path="/orders"
          element={
            <ProtectedRoute>
              <div>Orders</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

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
