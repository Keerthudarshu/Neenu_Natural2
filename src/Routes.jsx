import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your page components
import Homepage from './pages/homepage';
import ProductCollectionGrid from './pages/product-collection-grid';
import ProductDetailPage from './pages/product-detail-page';
import ShoppingCart from './pages/shopping-cart';
import CheckoutProcess from './pages/checkout-process';
import UserAuth from './pages/user-auth';
import UserAccountDashboard from './pages/user-account-dashboard';
import AdminLogin from './pages/admin-login';
import AdminPanel from './pages/admin-panel';
import AdminDashboard from './pages/admin-dashboard';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/product-collection-grid" element={<ProductCollectionGrid />} />
        <Route path="/product-detail-page/:id" element={<ProductDetailPage />} />
        <Route path="/product-detail-page" element={<ProductDetailPage />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/checkout-process" element={<CheckoutProcess />} />
        <Route path="/user-login" element={<UserAuth />} />
        <Route path="/user-register" element={<UserAuth />} />
        <Route path="/user-account-dashboard" element={<UserAccountDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;