import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ 
  product, 
  onQuickView, 
  onAddToCart, 
  onAddToWishlist, 
  isInWishlist = false 
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);

  const calculateSavings = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={12} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={12} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const currentPrice = selectedVariant?.salePrice || product?.salePrice;
  const originalPrice = selectedVariant?.originalPrice || product?.originalPrice;
  const savings = calculateSavings(originalPrice, currentPrice);

  return (
    <div className="group bg-card rounded-lg border border-border hover:shadow-warm-md transition-all duration-300 overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to={`/product-detail-page?id=${product?.id}`}>
          <Image
            src={product?.image}
            alt={product?.name}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setIsImageLoading(false)}
          />
        </Link>
        
        {/* Loading Skeleton */}
        {isImageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product?.badges?.map((badge, index) => (
            <span
              key={index}
              className="bg-primary text-primary-foreground text-xs font-caption font-medium px-2 py-1 rounded-full"
            >
              {badge}
            </span>
          ))}
          {savings > 0 && (
            <span className="bg-success text-success-foreground text-xs font-caption font-bold px-2 py-1 rounded-full">
              {savings}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => onAddToWishlist(product?.id)}
          className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors duration-200 opacity-0 group-hover:opacity-100"
        >
          <Icon 
            name="Heart" 
            size={16} 
            className={isInWishlist ? 'text-destructive fill-current' : 'text-muted-foreground'} 
          />
        </button>

        {/* Quick View Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onQuickView(product)}
            className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            Quick View
          </Button>
        </div>
      </div>
      {/* Product Info */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <Link to={`/product-detail-page?id=${product?.id}`}>
          <h3 className="font-body font-medium text-foreground hover:text-primary transition-colors duration-200 line-clamp-2">
            {product?.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {renderStars(product?.rating)}
          </div>
          <span className="font-caption text-xs text-muted-foreground">
            ({product?.reviewCount})
          </span>
        </div>

        {/* Variant Selection */}
        {product?.variants && product?.variants?.length > 1 && (
          <div className="space-y-2">
            <span className="font-caption text-xs text-muted-foreground">Weight:</span>
            <div className="flex flex-wrap gap-1">
              {product?.variants?.map((variant, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedVariant(variant)}
                  className={`px-2 py-1 text-xs font-caption rounded border transition-colors duration-200 ${
                    selectedVariant?.weight === variant?.weight
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-primary'
                  }`}
                >
                  {variant?.weight}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-data font-bold text-lg text-foreground">
              ₹{currentPrice}
            </span>
            {originalPrice && originalPrice > currentPrice && (
              <span className="font-data text-sm text-muted-foreground line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
          {savings > 0 && (
            <p className="font-caption text-xs text-success">
              You save ₹{originalPrice - currentPrice}
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          variant="default"
          fullWidth
          onClick={() => onAddToCart(product, selectedVariant)}
          iconName="ShoppingCart"
          iconPosition="left"
          iconSize={16}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;