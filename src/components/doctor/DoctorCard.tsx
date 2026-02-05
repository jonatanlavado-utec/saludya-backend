import React from 'react';
import { Star } from 'lucide-react';
import { Doctor } from '@/types';
import { cn } from '@/lib/utils';

interface DoctorCardProps {
  doctor: Doctor;
  onClick?: () => void;
  selected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onClick, selected }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-xl p-4 shadow-card border border-border transition-all cursor-pointer hover:shadow-soft',
        selected && 'ring-2 ring-primary border-primary',
        onClick && 'hover:scale-[1.02]'
      )}
    >
      <div className="flex gap-4">
        <img
          src={doctor.photoUrl}
          alt={doctor.name}
          className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{doctor.name}</h3>
          <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-warning text-warning" />
              <span className="font-medium text-foreground">{doctor.rating}</span>
            </div>
            <span>{doctor.experience} años exp.</span>
          </div>
          
          <div className="mt-2">
            <span className="text-lg font-bold text-primary">${doctor.price}</span>
            <span className="text-sm text-muted-foreground"> / consulta</span>
          </div>
        </div>
      </div>
    </div>
  );
};
