
import React from "react";
import AppRoutes from "./Routes";
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <ErrorBoundary>
            <ScrollToTop />
            <AppRoutes />
          </ErrorBoundary>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
