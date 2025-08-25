import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CheckoutProgress from './components/CheckoutProgress';
import ShippingForm from './components/ShippingForm';
import DeliveryOptions from './components/DeliveryOptions';
import PaymentForm from './components/PaymentForm';
import OrderReview from './components/OrderReview';
import OrderSummary from './components/OrderSummary';
import TrustSignals from './components/TrustSignals';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const CheckoutProcess = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  
  // Form data states
  const [shippingData, setShippingData] = useState(null);
  const [deliveryData, setDeliveryData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  // Mock cart data
  const mockCartItems = [
    {
      id: 1,
      name: 'Organic Turmeric Powder',
      variant: '250g',
      price: 299,
      originalPrice: 349,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      name: 'Cold Pressed Coconut Oil',
      variant: '500ml',
      price: 450,
      originalPrice: 500,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      name: 'Himalayan Pink Salt',
      variant: '1kg',
      price: 199,
      originalPrice: 249,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&h=400&fit=crop'
    }
  ];

  // Calculate totals
  const subtotal = mockCartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const shippingCost = deliveryData?.price || (subtotal >= 499 ? 0 : 49);
  const discountAmount = appliedCoupon === 'FLAT10' && subtotal >= 1499 ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - discountAmount;

  // Auto-apply FLAT10 coupon if eligible
  useEffect(() => {
    if (subtotal >= 1499 && !appliedCoupon) {
      setAppliedCoupon('FLAT10');
    }
  }, [subtotal, appliedCoupon]);

  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: 'Shopping Cart', path: '/shopping-cart' },
    { label: 'Checkout', path: '/checkout-process' }
  ];

  const handleStepNext = (stepData) => {
    switch (currentStep) {
      case 1:
        setShippingData(stepData);
        setCurrentStep(2);
        break;
      case 2:
        setDeliveryData(stepData);
        setCurrentStep(3);
        break;
      case 3:
        setPaymentData(stepData);
        setCurrentStep(4);
        break;
      default:
        break;
    }
  };

  const handleStepBack = (targetStep = null) => {
    const newStep = targetStep || currentStep - 1;
    if (newStep >= 1 && newStep <= 4) {
      setCurrentStep(newStep);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock order success
      const orderId = `NN${Date.now()?.toString()?.slice(-6)}`;
      
      // Navigate to success page or show success message
      alert(`Order placed successfully! Order ID: ${orderId}\n\nYou will receive a confirmation email shortly.`);
      navigate('/user-account-dashboard');
      
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyCoupon = (couponCode) => {
    setAppliedCoupon(couponCode);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ShippingForm
            onNext={handleStepNext}
            onAddressSelect={(address) => setShippingData(address)}
          />
        );
      case 2:
        return (
          <DeliveryOptions
            onNext={handleStepNext}
            onBack={handleStepBack}
            shippingAddress={shippingData}
          />
        );
      case 3:
        return (
          <PaymentForm
            onNext={handleStepNext}
            onBack={handleStepBack}
            orderTotal={total}
          />
        );
      case 4:
        return (
          <OrderReview
            onBack={handleStepBack}
            onPlaceOrder={handlePlaceOrder}
            shippingAddress={shippingData}
            deliveryOption={deliveryData}
            paymentMethod={paymentData}
            orderTotal={total}
            isProcessing={isProcessing}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={mockCartItems?.length} />
      <main className="container mx-auto px-4 py-6">
        <Breadcrumb customItems={breadcrumbItems} />
        
        {/* Mobile Order Summary Toggle */}
        <div className="lg:hidden mb-6">
          <Button
            variant="outline"
            fullWidth
            onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
            iconName={orderSummaryExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            {orderSummaryExpanded ? 'Hide' : 'Show'} order summary (₹{total?.toFixed(2)})
          </Button>
          
          {orderSummaryExpanded && (
            <div className="mt-4">
              <OrderSummary
                cartItems={mockCartItems}
                subtotal={subtotal}
                shipping={shippingCost}
                discount={discountAmount}
                total={total}
                onApplyCoupon={handleApplyCoupon}
                appliedCoupon={appliedCoupon}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            <CheckoutProgress currentStep={currentStep} />
            {renderCurrentStep()}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            <OrderSummary
              cartItems={mockCartItems}
              subtotal={subtotal}
              shipping={shippingCost}
              discount={discountAmount}
              total={total}
              onApplyCoupon={handleApplyCoupon}
              appliedCoupon={appliedCoupon}
            />
            
            <TrustSignals />
          </div>
        </div>

        {/* Mobile Trust Signals */}
        <div className="lg:hidden mt-8">
          <TrustSignals />
        </div>

        {/* Guest Checkout Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-muted/50 px-4 py-2 rounded-lg">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <span className="font-body text-sm text-muted-foreground">
              Checking out as guest •{' '}
              <button
                onClick={() => navigate('/user-account-dashboard')}
                className="text-primary hover:underline font-medium"
              >
                Create account
              </button>{' '}
              for faster checkout
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutProcess;