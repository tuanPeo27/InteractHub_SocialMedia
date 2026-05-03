import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import TrendingHashtags from './TrendingHashtags';
import FriendSuggestions from './FriendSuggestions';

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
    <div className="h-screen overflow-hidden bg-gray-50">
      <Header />
      
      <div className="flex max-w-7xl mx-auto pt-16 h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 xl:mr-80 pb-20 lg:pb-4 overflow-y-auto h-full">
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
    </div>
  );
};

export default Layout;