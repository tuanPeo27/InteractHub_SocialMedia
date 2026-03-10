import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Users, Hash, User, Settings } from 'lucide-react';
import { cn } from './ui/utils';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: Users, label: 'Bạn bè', path: '/friends' },
    { icon: Hash, label: 'Khám phá', path: '/search' },
    { icon: User, label: 'Hồ sơ', path: '/profile' },
  ];

  return (
    <nav className="py-4 space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;
