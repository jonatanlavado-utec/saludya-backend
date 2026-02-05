import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { useApp } from '@/context/AppContext';

export const AppLayout: React.FC = () => {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="pt-0 md:pt-16 pb-20 md:pb-8">
        <div className="container py-4 md:py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
