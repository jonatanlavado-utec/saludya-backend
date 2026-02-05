import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Clock, User, MessageSquare, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/home', icon: Home, label: 'Inicio' },
  { path: '/ai-assistant', icon: MessageSquare, label: 'Asistente IA' },
  { path: '/appointments', icon: Calendar, label: 'Mis Citas' },
  { path: '/history', icon: Clock, label: 'Historial' },
  { path: '/profile', icon: User, label: 'Perfil' },
];

export const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container flex items-center justify-between h-16">
        <div 
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => navigate('/home')}
        >
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-primary">SaludYa</span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-accent text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Salir
        </Button>
      </div>
    </nav>
  );
};
