import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={cn(
        'rounded-full border-primary/30 border-t-primary animate-spin',
        sizeClasses[size],
        className
      )}
    />
  );
};

export const LoadingScreen: React.FC<{ message?: string }> = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <LoadingSpinner size="lg" />
      <p className="text-muted-foreground animate-pulse-soft">{message}</p>
    </div>
  );
};
