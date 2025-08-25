import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ShoppingCart from './pages/shopping-cart';
import ProductCollectionGrid from './pages/product-collection-grid';
import ProductDetailPage from './pages/product-detail-page';
import UserAccountDashboard from './pages/user-account-dashboard';
import CheckoutProcess from './pages/checkout-process';
import Homepage from './pages/homepage';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<CheckoutProcess />} />
        <Route path="/shopping-cart" element={<ShoppingCart />} />
        <Route path="/product-collection-grid" element={<ProductCollectionGrid />} />
        <Route path="/product-detail-page" element={<ProductDetailPage />} />
        <Route path="/user-account-dashboard" element={<UserAccountDashboard />} />
        <Route path="/checkout-process" element={<CheckoutProcess />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
