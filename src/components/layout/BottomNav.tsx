import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/home', icon: Home, label: 'Inicio' },
  { path: '/ai-assistant', icon: MessageSquare, label: 'IA' },
  { path: '/appointments', icon: Calendar, label: 'Citas' },
  { path: '/history', icon: Clock, label: 'Historial' },
  { path: '/profile', icon: User, label: 'Perfil' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5 mb-1', isActive && 'stroke-[2.5px]')} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
