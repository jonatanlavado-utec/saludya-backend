import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { TopNav } from './TopNav';
import { BottomNav } from './BottomNav';
import { useApp } from '@/context/AppContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, sessionRestored } = useApp();

  if (!sessionRestored) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner className="border-primary/30 border-t-primary" />
      </div>
    );
  }

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
