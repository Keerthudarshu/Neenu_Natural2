import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../AppImage';

const MegaMenu = ({ isOpen, onClose }) => {
  const categories = [
    {
      title: 'Spices & Seasonings',
      items: [
        { name: 'Whole Spices', path: '/product-collection-grid?category=whole-spices' },
        { name: 'Ground Spices', path: '/product-collection-grid?category=ground-spices' },
        { name: 'Spice Blends', path: '/product-collection-grid?category=spice-blends' },
        { name: 'Organic Spices', path: '/product-collection-grid?category=organic-spices' }
      ],
      image: '/assets/images/category-spices.jpg'
    },
    {
      title: 'Oils & Ghee',
      items: [
        { name: 'Cold Pressed Oils', path: '/product-collection-grid?category=cold-pressed-oils' },
        { name: 'Coconut Oil', path: '/product-collection-grid?category=coconut-oil' },
        { name: 'Pure Ghee', path: '/product-collection-grid?category=pure-ghee' },
        { name: 'Sesame Oil', path: '/product-collection-grid?category=sesame-oil' }
      ],
      image: '/assets/images/category-oils.jpg'
    },
    {
      title: 'Grains & Pulses',
      items: [
        { name: 'Organic Rice', path: '/product-collection-grid?category=organic-rice' },
        { name: 'Millets', path: '/product-collection-grid?category=millets' },
        { name: 'Lentils', path: '/product-collection-grid?category=lentils' },
        { name: 'Quinoa', path: '/product-collection-grid?category=quinoa' }
      ],
      image: '/assets/images/category-grains.jpg'
    },
    {
      title: 'Snacks & Sweets',
      items: [
        { name: 'Healthy Snacks', path: '/product-collection-grid?category=healthy-snacks' },
        { name: 'Traditional Sweets', path: '/product-collection-grid?category=traditional-sweets' },
        { name: 'Dry Fruits', path: '/product-collection-grid?category=dry-fruits' },
        { name: 'Nuts & Seeds', path: '/product-collection-grid?category=nuts-seeds' }
      ],
      image: '/assets/images/category-snacks.jpg'
    }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-[1001] lg:hidden"
        onClick={onClose}
      />
      {/* Mega Menu Content */}
      <div className="absolute top-full left-0 w-full bg-card shadow-warm-lg border-t border-border z-[1002] lg:relative lg:shadow-warm-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories?.map((category, index) => (
              <div key={index} className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={category?.image}
                    alt={category?.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    {category?.title}
                  </h3>
                  <ul className="space-y-2">
                    {category?.items?.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <Link
                          to={item?.path}
                          onClick={onClose}
                          className="font-body text-sm text-muted-foreground hover:text-primary transition-colors duration-200 block py-1"
                        >
                          {item?.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          {/* Featured Section */}
          <div className="mt-8 pt-8 border-t border-border">
            <div className="flex flex-col lg:flex-row items-center justify-between bg-muted rounded-lg p-6">
              <div className="text-center lg:text-left mb-4 lg:mb-0">
                <h4 className="font-heading font-semibold text-lg text-foreground mb-2">
                  New Arrivals
                </h4>
                <p className="font-body text-muted-foreground">
                  Discover our latest collection of premium natural products
                </p>
              </div>
              <Link
                to="/product-collection-grid?filter=new-arrivals"
                onClick={onClose}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-caption font-medium hover:bg-primary/90 transition-colors duration-200"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;