
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import OrderManagement from './components/OrderManagement';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import dataService from '../../services/dataService';

const AdminPanel = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check both localStorage sources for admin session
    const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
    const sessionData = localStorage.getItem('neenu_auth_session');
    
    let validAdmin = null;
    
    if (adminUser && adminUser.role === 'admin') {
      validAdmin = adminUser;
    } else if (sessionData) {
      const session = JSON.parse(sessionData);
      const user = dataService.getUser(session.userId);
      if (user && user.role === 'admin') {
        validAdmin = user;
        // Sync adminUser in localStorage
        localStorage.setItem('adminUser', JSON.stringify(user));
      }
    }
    
    if (!validAdmin) {
      // Clear any invalid sessions
      localStorage.removeItem('adminUser');
      localStorage.removeItem('neenu_auth_session');
      navigate('/admin-login');
      return;
    }
    
    setCurrentUser(validAdmin);
  }, [navigate]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'users':
        return <UserManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        user={currentUser}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
