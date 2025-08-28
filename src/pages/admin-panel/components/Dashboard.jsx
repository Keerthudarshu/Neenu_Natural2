
import React, { useState, useEffect } from 'react';
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import dataService from '../../../services/dataService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
    lowStockProducts: []
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productsResponse, usersResponse, ordersResponse] = await Promise.all([
        dataService.getProducts(),
        dataService.getUsers ? dataService.getUsers() : Promise.resolve({ data: [] }),
        dataService.getOrders ? dataService.getOrders() : Promise.resolve({ data: [] })
      ]);

      const products = productsResponse.data;
      const users = usersResponse.data;
      const orders = ordersResponse.data;

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const recentOrders = orders.slice(-5).reverse();
      const lowStockProducts = products.filter(p => (p.stockQuantity || 0) < 10);

      setStats({
        totalProducts: products.length,
        totalUsers: users.filter(u => u.role === 'customer').length,
        totalOrders: orders.length,
        totalRevenue,
        recentOrders,
        lowStockProducts
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleQuickRestockProduct = (productId) => {
    const restockAmount = prompt('Enter quantity to add to stock:');
    if (restockAmount && !isNaN(restockAmount) && parseInt(restockAmount) > 0) {
      const product = dataService.getProduct(productId);
      if (product) {
        const newStock = (product.stockQuantity || 0) + parseInt(restockAmount);
        dataService.updateProduct(productId, { 
          stockQuantity: newStock,
          inStock: newStock > 0 
        });
        loadDashboardData(); // Refresh data
        alert(`Stock updated! ${product.name} now has ${newStock} items in stock.`);
      }
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, color = 'primary' }) => (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-body text-muted-foreground">{title}</p>
          <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              {trend > 0 ? (
                <TrendingUp className="w-4 h-4 text-success mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive mr-1" />
              )}
              <span className={trend > 0 ? 'text-success' : 'text-destructive'}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}/10`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          trend={5}
          color="primary"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalUsers}
          icon={Users}
          trend={12}
          color="success"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={8}
          color="warning"
        />
        <StatCard
          title="Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={15}
          color="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-body font-medium text-foreground">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body font-medium text-foreground">₹{order.total}</p>
                    <p className={`text-sm capitalize ${
                      order.status === 'pending' ? 'text-warning' :
                      order.status === 'completed' ? 'text-success' :
                      'text-muted-foreground'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-heading font-semibold text-foreground mb-4">
            Low Stock Alert 
            {stats.lowStockProducts.length > 0 && (
              <span className="ml-2 bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs">
                {stats.lowStockProducts.length}
              </span>
            )}
          </h2>
          <div className="space-y-3">
            {stats.lowStockProducts.length > 0 ? (
              stats.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div className="flex-1">
                    <p className="font-body font-medium text-foreground">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.weight}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={`font-body font-medium ${
                        product.stockQuantity <= 5 ? 'text-destructive' : 'text-warning'
                      }`}>
                        {product.stockQuantity} left
                      </p>
                    </div>
                    <button
                      onClick={() => handleQuickRestockProduct(product.id)}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 transition-colors"
                    >
                      Quick Restock
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">All products are well stocked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
