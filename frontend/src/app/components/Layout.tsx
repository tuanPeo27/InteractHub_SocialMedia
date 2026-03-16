import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import TrendingHashtags from './TrendingHashtags';
import FriendSuggestions from './FriendSuggestions';
import { Toaster } from './ui/sonner';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex max-w-7xl mx-auto pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 pb-20 lg:pb-4">
          <div className="max-w-2xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar - Trending */}
        <aside className="hidden xl:block w-80 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l bg-white">
          <div className="p-4 space-y-4">
            <TrendingHashtags />
            <FriendSuggestions />
          </div>
        </aside>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      <Toaster />
    </div>
  );
};

export default Layout;