import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

import Input from './Input';
import AnnouncementBar from './AnnouncementBar';
import MegaMenu from './MegaMenu';
import CartDrawer from './CartDrawer';
import { useCart } from '../../contexts/CartContext.jsx';
const Header = ({ isLoggedIn = false, onSearch = () => {} }) => {
  const { cartItems, getCartItemCount, updateQuantity, removeFromCart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(true);

  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const navigationItems = [
    {
      label: 'Shop',
      path: '/product-collection-grid',
      hasDropdown: true,
      onClick: () => setIsMegaMenuOpen(!isMegaMenuOpen)
    },
    { label: 'Account', path: '/user-account-dashboard' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <AnnouncementBar
        isVisible={showAnnouncementBar}
        onClose={() => setShowAnnouncementBar(false)}
      />
      {/* Main Header */}
      <header className="sticky top-0 bg-background border-b border-border z-[1001] shadow-warm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/homepage" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Leaf" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground hidden sm:block">
                Neenu's Natural
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems?.map((item, index) => (
                <div key={index} className="relative">
                  {item?.hasDropdown ? (
                    <button
                      onClick={item?.onClick}
                      className="flex items-center space-x-1 font-body font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
                    >
                      <span>{item?.label}</span>
                      <Icon
                        name="ChevronDown"
                        size={16}
                        className={`transform transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item?.path}
                      className="font-body font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
                    >
                      {item?.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search for natural products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Icon name="Search" size={20} />
                </button>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Toggle - Mobile */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-full transition-colors duration-200"
                aria-label="Toggle search"
              >
                <Icon name="Search" size={20} />
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 hover:bg-muted rounded-full transition-colors duration-200"
                aria-label="Shopping cart"
              >
                <Icon name="ShoppingCart" size={20} />
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>

              {/* User Account */}
              {/* User Actions */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/admin-login"
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
                  >
                    <Icon name="Shield" size={16} />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                  <Link
                    to="/user-account-dashboard"
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
                  >
                    <Icon name="User" size={16} />
                    <span className="hidden sm:inline">Account</span>
                  </Link>
                </div>
              ) : (
                <Link
                  to="/user-login"
                  className="hidden sm:flex p-2 hover:bg-muted rounded-full transition-colors duration-200"
                  aria-label="User login"
                >
                  <Icon name="User" size={20} />
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-muted rounded-full transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <form onSubmit={handleSearch}>
                <Input
                  type="search"
                  placeholder="Search for natural products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  autoFocus
                />
              </form>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              {navigationItems?.map((item, index) => (
                <div key={index}>
                  {item?.hasDropdown ? (
                    <button
                      onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                      className="flex items-center justify-between w-full font-body font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
                    >
                      <span>{item?.label}</span>
                      <Icon
                        name="ChevronDown"
                        size={16}
                        className={`transform transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item?.path}
                      className="block font-body font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
                    >
                      {item?.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile-only links */}
              <Link
                to="/user-account-dashboard"
                className="flex items-center space-x-2 font-body font-medium text-foreground hover:text-primary transition-colors duration-200 py-2 sm:hidden"
              >
                <Icon name="User" size={16} />
                <span>My Account</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Mega Menu */}
        <MegaMenu
          isOpen={isMegaMenuOpen}
          onClose={() => setIsMegaMenuOpen(false)}
        />
      </header>
      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </>
  );
};

export default Header;