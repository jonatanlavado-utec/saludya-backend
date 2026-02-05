import React from 'react';
import { Specialty } from '@/types';
import { cn } from '@/lib/utils';

interface SpecialtyCardProps {
  specialty: Specialty;
  onClick?: () => void;
  selected?: boolean;
}

export const SpecialtyCard: React.FC<SpecialtyCardProps> = ({ specialty, onClick, selected }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-xl p-4 shadow-card border border-border transition-all cursor-pointer hover:shadow-soft',
        selected && 'ring-2 ring-primary border-primary bg-accent',
        onClick && 'hover:scale-[1.02]'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl">
          {specialty.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{specialty.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{specialty.description}</p>
        </div>
      </div>
    </div>
  );
};
