import React from 'react';
import { Link, useLocation } from 'react-router';
import { Home, Users, PlusSquare, Hash, User } from 'lucide-react';
import { cn } from './ui/utils';

const MobileNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Trang chủ', path: '/' },
    { icon: Users, label: 'Bạn bè', path: '/friends' },
    { icon: Hash, label: 'Khám phá', path: '/search' },
    { icon: User, label: 'Hồ sơ', path: '/profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors min-w-[4rem]',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
