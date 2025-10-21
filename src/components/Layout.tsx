import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (tab: string) => {
    if (tab === 'home') {
      setActiveTab('home');
      navigate('/');
    } else if (tab === 'chat') {
      setActiveTab('chat');
      navigate('/chat');
    }
  };

  // Update active tab based on current route
  useEffect(() => {
    if (location.pathname === '/chat') {
      setActiveTab('chat');
    } else if (location.pathname === '/') {
      setActiveTab('home');
    } else {
      setActiveTab('');
    }
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;

