import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import RelatedProducts from './components/RelatedProducts';
import SavedItems from './components/SavedItems';

import Button from '../../components/ui/Button';

const ShoppingCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [pincode, setPincode] = useState('');
  const [shippingLocation, setShippingLocation] = useState('');

  // Mock cart data
  useEffect(() => {
    const mockCartItems = [
      {
        id: 1,
        name: 'Organic Turmeric Powder',
        price: 149,
        originalPrice: 199,
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&h=300&fit=crop',
        variant: '250g',
        quantity: 2,
        badges: ['Organic', 'Pure']
      },
      {
        id: 2,
        name: 'Homemade Mango Pickle',
        price: 299,
        originalPrice: 349,
        image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=300&fit=crop',
        variant: '500g',
        quantity: 1,
        badges: ['Handmade', 'Traditional']
      },
      {
        id: 3,
        name: 'Cold Pressed Coconut Oil',
        price: 399,
        originalPrice: 499,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop',
        variant: '500ml',
        quantity: 1,
        badges: ['Cold Pressed', 'Pure']
      }
    ];

    const mockSavedItems = [
      {
        id: 4,
        name: 'Premium Basmati Rice',
        price: 299,
        originalPrice: 349,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
        variant: '1kg',
        badges: ['Premium', 'Aged']
      }
    ];

    setCartItems(mockCartItems);
    setSavedItems(mockSavedItems);
  }, []);

  // Calculate totals
  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const discount = appliedCoupon ? appliedCoupon?.discount : 0;
  const discountedSubtotal = subtotal - discount;
  
  // Shipping calculation based on location
  const getShippingCost = () => {
    if (shippingLocation === 'bengaluru') {
      return discountedSubtotal >= 499 ? 0 : 49;
    } else if (shippingLocation === 'other') {
      return discountedSubtotal >= 999 ? 0 : 99;
    }
    return 0;
  };
  
  const shipping = getShippingCost();
  const total = discountedSubtotal + shipping;

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(items =>
      items?.map(item =>
        item?.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(items => items?.filter(item => item?.id !== itemId));
  };

  const handleSaveForLater = (itemId) => {
    const item = cartItems?.find(item => item?.id === itemId);
    if (item) {
      setSavedItems(prev => [...prev, { ...item, quantity: 1 }]);
      handleRemoveItem(itemId);
    }
  };

  const handleMoveToCart = (item) => {
    setCartItems(prev => [...prev, { ...item, quantity: 1 }]);
    setSavedItems(prev => prev?.filter(saved => saved?.id !== item?.id));
  };

  const handleRemoveFromSaved = (itemId) => {
    setSavedItems(items => items?.filter(item => item?.id !== itemId));
  };

  const handleApplyCoupon = (couponCode) => {
    if (!couponCode) {
      setAppliedCoupon(null);
      return;
    }

    // Mock coupon validation
    const coupons = {
      'FLAT10': {
        code: 'FLAT10',
        discount: subtotal >= 1499 ? subtotal * 0.1 : 0,
        minOrder: 1499,
        description: '10% off on orders ≥₹1,499'
      },
      'FREE50': {
        code: 'FREE50',
        discount: 0,
        minOrder: shippingLocation === 'bengaluru' ? 499 : 999,
        description: 'Free shipping'
      }
    };

    const coupon = coupons?.[couponCode];
    if (coupon && subtotal >= coupon?.minOrder) {
      setAppliedCoupon(coupon);
    } else {
      alert(`Coupon ${couponCode} is not valid or minimum order requirement not met.`);
    }
  };

  const handlePincodeChange = (newPincode) => {
    setPincode(newPincode);
    // Mock pincode validation
    const bengaluruPincodes = ['560001', '560002', '560003', '560004', '560005'];
    if (bengaluruPincodes?.includes(newPincode)) {
      setShippingLocation('bengaluru');
    } else {
      setShippingLocation('other');
    }
  };

  const handleAddToCart = (product) => {
    const existingItem = cartItems?.find(item => item?.id === product?.id);
    if (existingItem) {
      handleUpdateQuantity(product?.id, existingItem?.quantity + 1);
    } else {
      setCartItems(prev => [...prev, product]);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'Shopping Cart', path: '/shopping-cart' }
  ];

  return (
    <>
      <Helmet>
        <title>Shopping Cart - Neenu's Natural | Review Your Natural Products</title>
        <meta name="description" content="Review and modify your cart items. Secure checkout with natural and organic food products. Free shipping available on orders above ₹499 in Bengaluru." />
        <meta name="keywords" content="shopping cart, natural products, organic food, checkout, free shipping, Neenu's Natural" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header 
          cartItemCount={cartItems?.length}
          cartItems={cartItems}
          onSearch={(query) => console.log('Search:', query)}
        />

        <main className="container mx-auto px-4 py-6">
          <Breadcrumb customItems={breadcrumbItems} />

          {cartItems?.length === 0 ? (
            <EmptyCart />
          ) : (
            <>
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="font-heading font-bold text-2xl lg:text-3xl text-foreground">
                  Shopping Cart ({cartItems?.length} {cartItems?.length === 1 ? 'item' : 'items'})
                </h1>
                <Link to="/product-collection-grid">
                  <Button variant="ghost" iconName="ArrowLeft" iconPosition="left">
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              {/* Main Cart Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items - Left Column */}
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    {cartItems?.map((item) => (
                      <CartItem
                        key={item?.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onSaveForLater={handleSaveForLater}
                      />
                    ))}
                  </div>

                  {/* Saved Items */}
                  <SavedItems
                    savedItems={savedItems}
                    onMoveToCart={handleMoveToCart}
                    onRemoveFromSaved={handleRemoveFromSaved}
                  />
                </div>

                {/* Order Summary - Right Column */}
                <div className="lg:col-span-1">
                  <OrderSummary
                    subtotal={subtotal}
                    discount={discount}
                    shipping={shipping}
                    total={total}
                    onApplyCoupon={handleApplyCoupon}
                    appliedCoupon={appliedCoupon}
                    onPincodeChange={handlePincodeChange}
                    pincode={pincode}
                    shippingLocation={shippingLocation}
                  />
                </div>
              </div>

              {/* Related Products */}
              <RelatedProducts onAddToCart={handleAddToCart} />
            </>
          )}
        </main>

        {/* Mobile Sticky Checkout */}
        {cartItems?.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-warm-lg z-50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-body text-sm text-muted-foreground">
                Total ({cartItems?.length} items)
              </span>
              <span className="font-data font-bold text-lg text-foreground">
                ₹{total?.toFixed(2)}
              </span>
            </div>
            <Link to="/checkout-process">
              <Button
                variant="default"
                fullWidth
                size="lg"
                iconName="ArrowRight"
                iconPosition="right"
              >
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}

        {/* Footer Spacer for Mobile */}
        {cartItems?.length > 0 && <div className="lg:hidden h-24" />}
      </div>
    </>
  );
};

export default ShoppingCart;