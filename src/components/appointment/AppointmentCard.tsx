import React from 'react';
import { Calendar, Clock, X } from 'lucide-react';
import { Appointment } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
  onCancel?: () => void;
  showCancelButton?: boolean;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short' 
  });
};

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onClick,
  onCancel,
  showCancelButton = false
}) => {
  const statusColors = {
    scheduled: 'bg-primary/10 text-primary',
    completed: 'bg-success/10 text-success',
    cancelled: 'bg-destructive/10 text-destructive',
  };

  const statusLabels = {
    scheduled: 'Programada',
    completed: 'Completada',
    cancelled: 'Cancelada',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-xl p-4 shadow-card border border-border transition-all',
        onClick && 'cursor-pointer hover:shadow-soft hover:scale-[1.01]'
      )}
    >
      <div className="flex gap-4">
        <img
          src={appointment.doctor.photoUrl}
          alt={appointment.doctor.name}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-foreground truncate">{appointment.doctor.name}</h3>
              <p className="text-sm text-primary">{appointment.doctor.specialty}</p>
            </div>
            <span className={cn('text-xs font-medium px-2 py-1 rounded-full', statusColors[appointment.status])}>
              {statusLabels[appointment.status]}
            </span>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </div>
      </div>

      {showCancelButton && appointment.status === 'scheduled' && onCancel && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar Cita
          </Button>
        </div>
      )}
    </div>
  );
};
