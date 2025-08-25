import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const CategoryTiles = () => {
  const categories = [
    {
      id: 1,
      name: "Sweets",
      description: "Traditional Indian sweets made with pure ingredients",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
      link: "/product-collection-grid?category=sweets",
      productCount: "25+ Products",
      featured: true
    },
    {
      id: 2,
      name: "Savouries",
      description: "Crispy and flavorful snacks for every occasion",
      image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=300&fit=crop",
      link: "/product-collection-grid?category=savouries",
      productCount: "18+ Products"
    },
    {
      id: 3,
      name: "Pickles",
      description: "Authentic homemade pickles with traditional recipes",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      link: "/product-collection-grid?category=pickles",
      productCount: "12+ Products"
    },
    {
      id: 4,
      name: "Combos",
      description: "Curated gift sets and product combinations",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      link: "/product-collection-grid?category=combos",
      productCount: "8+ Products",
      badge: "Popular"
    },
    {
      id: 5,
      name: "Summer Coolers",
      description: "Refreshing drinks and cooling treats",
      image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop",
      link: "/product-collection-grid?category=summer-coolers",
      productCount: "10+ Products",
      seasonal: true
    },
    {
      id: 6,
      name: "Kitchen Essentials",
      description: "Premium spices, oils, and cooking ingredients",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop",
      link: "/product-collection-grid?category=kitchen-essentials",
      productCount: "30+ Products"
    },
    {
      id: 7,
      name: "Gifts",
      description: "Perfect gift hampers for your loved ones",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
      link: "/product-collection-grid?category=gifts",
      productCount: "15+ Products",
      badge: "New"
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collection of natural and handmade food products
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6">
          {categories?.map((category) => (
            <Link
              key={category?.id}
              to={category?.link}
              className="group relative bg-card border border-border rounded-xl overflow-hidden hover:shadow-warm-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Category Image */}
              <div className="aspect-square overflow-hidden">
                <Image
                  src={category?.image}
                  alt={category?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-heading font-semibold text-sm lg:text-base mb-1">
                  {category?.name}
                </h3>
                <p className="font-caption text-xs opacity-90 hidden lg:block">
                  {category?.productCount}
                </p>
              </div>

              {/* Badges */}
              {category?.badge && (
                <div className="absolute top-2 right-2">
                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
                    {category?.badge}
                  </span>
                </div>
              )}

              {category?.seasonal && (
                <div className="absolute top-2 left-2">
                  <span className="bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
                    Seasonal
                  </span>
                </div>
              )}

              {category?.featured && (
                <div className="absolute top-2 left-2">
                  <div className="bg-warning text-warning-foreground p-1 rounded-full">
                    <Icon name="Star" size={12} />
                  </div>
                </div>
              )}

              {/* Hover Arrow */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Icon name="ArrowRight" size={20} color="white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-8">
          <Link to="/product-collection-grid">
            <button className="font-body font-medium text-primary hover:text-primary/80 transition-colors duration-200 inline-flex items-center space-x-2">
              <span>View All Products</span>
              <Icon name="ArrowRight" size={16} />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;