import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import FilterSidebar from './components/FilterSidebar';
import FilterChips from './components/FilterChips';
import SortDropdown from './components/SortDropdown';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import Button from '../../components/ui/Button';


const ProductCollectionGrid = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('best-selling');
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);

  // Filter state
  const [filters, setFilters] = useState({
    priceRange: [],
    dietary: [],
    categories: [],
    brands: []
  });

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "Traditional Mysore Pak",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"
      ],
      salePrice: 299,
      originalPrice: 399,
      rating: 4.5,
      reviewCount: 128,
      badges: ["Handmade", "No Preservatives"],
      category: "sweets",
      brand: "neenus-natural",
      variants: [
        { weight: "225g", salePrice: 299, originalPrice: 399 },
        { weight: "450g", salePrice: 549, originalPrice: 699 }
      ],
      shortDescription: "Authentic Mysore Pak made with pure ghee and traditional methods. Rich, melt-in-mouth texture with the perfect sweetness.",
      dietary: ["handmade", "no-preservatives"],
      bestseller: true
    },
    {
      id: 2,
      name: "Organic Coconut Laddu",
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400"
      ],
      salePrice: 249,
      originalPrice: 299,
      rating: 4.7,
      reviewCount: 95,
      badges: ["Organic", "Vegan"],
      category: "sweets",
      brand: "neenus-natural",
      variants: [
        { weight: "200g", salePrice: 249, originalPrice: 299 },
        { weight: "400g", salePrice: 449, originalPrice: 549 }
      ],
      shortDescription: "Soft and delicious coconut laddus made with organic coconut and jaggery. Perfect for festivals and celebrations.",
      dietary: ["organic", "vegan", "no-preservatives"],
      bestseller: false
    },
    {
      id: 3,
      name: "Spicy Mixture Namkeen",
      image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400"
      ],
      salePrice: 189,
      originalPrice: 229,
      rating: 4.3,
      reviewCount: 76,
      badges: ["Handmade", "No Palm Oil"],
      category: "savouries",
      brand: "neenus-natural",
      variants: [
        { weight: "250g", salePrice: 189, originalPrice: 229 },
        { weight: "500g", salePrice: 349, originalPrice: 429 }
      ],
      shortDescription: "Crispy and spicy mixture made with premium ingredients. Perfect tea-time snack with authentic flavors.",
      dietary: ["handmade", "no-palm-oil"],
      bestseller: true
    },
    {
      id: 4,
      name: "Mango Pickle Premium",
      image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400"
      ],
      salePrice: 329,
      originalPrice: 399,
      rating: 4.6,
      reviewCount: 142,
      badges: ["Handmade", "No Preservatives"],
      category: "pickles",
      brand: "traditional-tastes",
      variants: [
        { weight: "300g", salePrice: 329, originalPrice: 399 },
        { weight: "500g", salePrice: 499, originalPrice: 599 }
      ],
      shortDescription: "Traditional mango pickle made with fresh mangoes and authentic spices. Aged to perfection for rich flavors.",
      dietary: ["handmade", "no-preservatives"],
      bestseller: false
    },
    {
      id: 5,
      name: "Festive Sweet Combo",
      image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400"
      ],
      salePrice: 799,
      originalPrice: 999,
      rating: 4.8,
      reviewCount: 89,
      badges: ["Combo Pack", "Handmade"],
      category: "combos",
      brand: "neenus-natural",
      variants: [
        { weight: "1kg", salePrice: 799, originalPrice: 999 }
      ],
      shortDescription: "Perfect festive combo with assorted sweets including Mysore Pak, Coconut Laddu, and Kaju Katli.",
      dietary: ["handmade", "no-preservatives"],
      bestseller: true
    },
    {
      id: 6,
      name: "Rose Sherbet Concentrate",
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400"
      ],
      salePrice: 149,
      originalPrice: 199,
      rating: 4.4,
      reviewCount: 67,
      badges: ["Natural", "No Artificial Colors"],
      category: "summer-coolers",
      brand: "organic-origins",
      variants: [
        { weight: "200ml", salePrice: 149, originalPrice: 199 },
        { weight: "500ml", salePrice: 329, originalPrice: 429 }
      ],
      shortDescription: "Refreshing rose sherbet made with natural rose extracts. Perfect summer cooler with authentic taste.",
      dietary: ["organic", "no-preservatives"],
      bestseller: false
    },
    {
      id: 7,
      name: "Cold Pressed Coconut Oil",
      image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400"
      ],
      salePrice: 449,
      originalPrice: 549,
      rating: 4.9,
      reviewCount: 203,
      badges: ["Cold Pressed", "Organic"],
      category: "kitchen-essentials",
      brand: "organic-origins",
      variants: [
        { weight: "500ml", salePrice: 449, originalPrice: 549 },
        { weight: "1L", salePrice: 849, originalPrice: 999 }
      ],
      shortDescription: "Pure cold-pressed coconut oil extracted from fresh coconuts. Perfect for cooking and health benefits.",
      dietary: ["organic", "no-preservatives"],
      bestseller: true
    },
    {
      id: 8,
      name: "Artisan Chocolate Box",
      image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400",
      gallery: [
        "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400"
      ],
      salePrice: 899,
      originalPrice: 1199,
      rating: 4.7,
      reviewCount: 156,
      badges: ["Gift Box", "Handmade"],
      category: "gifts",
      brand: "homemade-heritage",
      variants: [
        { weight: "300g", salePrice: 899, originalPrice: 1199 }
      ],
      shortDescription: "Premium artisan chocolate collection in beautiful gift packaging. Perfect for special occasions.",
      dietary: ["handmade"],
      bestseller: false
    }
  ];

  // Initialize products and apply URL filters
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);

    // Apply URL filters
    const category = searchParams?.get('category');
    const filter = searchParams?.get('filter');
    
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
    
    if (filter === 'new-arrivals') {
      setCurrentSort('newest');
    }
  }, [searchParams]);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply filters
    if (filters?.priceRange?.length > 0) {
      filtered = filtered?.filter(product => {
        return filters?.priceRange?.some(range => {
          switch (range) {
            case 'under-200':
              return product?.salePrice < 200;
            case '200-500':
              return product?.salePrice >= 200 && product?.salePrice <= 500;
            case '500-1000':
              return product?.salePrice >= 500 && product?.salePrice <= 1000;
            case 'above-1000':
              return product?.salePrice > 1000;
            default:
              return true;
          }
        });
      });
    }

    if (filters?.dietary?.length > 0) {
      filtered = filtered?.filter(product =>
        filters?.dietary?.some(diet => product?.dietary?.includes(diet))
      );
    }

    if (filters?.categories?.length > 0) {
      filtered = filtered?.filter(product =>
        filters?.categories?.includes(product?.category)
      );
    }

    if (filters?.brands?.length > 0) {
      filtered = filtered?.filter(product =>
        filters?.brands?.includes(product?.brand)
      );
    }

    // Apply sorting
    switch (currentSort) {
      case 'price-low-high':
        filtered?.sort((a, b) => a?.salePrice - b?.salePrice);
        break;
      case 'price-high-low':
        filtered?.sort((a, b) => b?.salePrice - a?.salePrice);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.id - a?.id);
        break;
      case 'oldest':
        filtered?.sort((a, b) => a?.id - b?.id);
        break;
      case 'name-a-z':
        filtered?.sort((a, b) => a?.name?.localeCompare(b?.name));
        break;
      case 'name-z-a':
        filtered?.sort((a, b) => b?.name?.localeCompare(a?.name));
        break;
      case 'rating-high-low':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'best-selling':
      default:
        filtered?.sort((a, b) => (b?.bestseller ? 1 : 0) - (a?.bestseller ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters, currentSort]);

  // Handle filter changes
  const handleFilterChange = (filterType, newValue) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: newValue
    }));
  };

  const handleRemoveFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev?.[filterType]?.filter(item => item !== value)
    }));
  };

  const handleClearAllFilters = () => {
    setFilters({
      priceRange: [],
      dietary: [],
      categories: [],
      brands: []
    });
  };

  // Handle product actions
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToCart = (product, variant = null, quantity = 1) => {
    const cartItem = {
      id: `${product?.id}-${variant?.weight || 'default'}`,
      productId: product?.id,
      name: product?.name,
      image: product?.image,
      price: variant?.salePrice || product?.salePrice,
      variant: variant?.weight || 'Default',
      quantity: quantity
    };

    setCartItems(prev => {
      const existingItem = prev?.find(item => item?.id === cartItem?.id);
      if (existingItem) {
        return prev?.map(item =>
          item?.id === cartItem?.id
            ? { ...item, quantity: item?.quantity + quantity }
            : item
        );
      }
      return [...prev, cartItem];
    });

    // Show success feedback (could be a toast notification)
    console.log('Added to cart:', cartItem);
  };

  const handleAddToWishlist = (productId) => {
    setWishlistItems(prev => {
      if (prev?.includes(productId)) {
        return prev?.filter(id => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'Products', path: '/product-collection-grid' }
  ];

  const categoryTitle = searchParams?.get('category')?.replace(/-/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase()) || 'All Products';

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItems?.reduce((sum, item) => sum + item?.quantity, 0)}
        cartItems={cartItems}
        onSearch={(query) => console.log('Search:', query)}
      />
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb customItems={breadcrumbItems} />

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
            {categoryTitle}
          </h1>
          <p className="font-body text-muted-foreground">
            Discover our collection of natural, handmade products crafted with love and tradition.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              isOpen={false}
              onClose={() => {}}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearAllFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Mobile Filter Button & Sort */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setIsMobileFilterOpen(true)}
                iconName="Filter"
                iconPosition="left"
                className="lg:hidden"
              >
                Filters
              </Button>

              <div className="flex items-center gap-4">
                <span className="font-body text-sm text-muted-foreground">
                  {filteredProducts?.length} products
                </span>
                <SortDropdown
                  currentSort={currentSort}
                  onSortChange={setCurrentSort}
                />
              </div>
            </div>

            {/* Active Filter Chips */}
            <FilterChips
              activeFilters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleClearAllFilters}
            />

            {/* Product Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onQuickView={handleQuickView}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              wishlistItems={wishlistItems}
            />

            {/* Load More Button */}
            {!loading && filteredProducts?.length > 0 && hasMoreProducts && (
              <div className="text-center pt-8">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Simulate loading more products
                    setCurrentPage(prev => prev + 1);
                    // In real app, this would load more products
                    if (currentPage >= 3) {
                      setHasMoreProducts(false);
                    }
                  }}
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearAllFilters}
        isMobile={true}
      />
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default ProductCollectionGrid;