import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DoctorCard } from '@/components/doctor/DoctorCard';
import { Button } from '@/components/ui/button';
import { doctors } from '@/data/mockData';
import { TimeSlot } from '@/types';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SelectDateTime: React.FC = () => {
  const navigate = useNavigate();
  const { doctorId } = useParams<{ doctorId: string }>();

  const doctor = doctors.find(d => d.id === doctorId);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const groupedSlots = useMemo(() => {
    if (!doctor) return {};
    
    const groups: Record<string, TimeSlot[]> = {};
    doctor.availableSlots.forEach(slot => {
      if (!groups[slot.date]) {
        groups[slot.date] = [];
      }
      groups[slot.date].push(slot);
    });
    return groups;
  }, [doctor]);

  const dates = Object.keys(groupedSlots).sort();
  const visibleDates = dates.slice(weekOffset * 7, (weekOffset + 1) * 7);

  const formatDayName = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  };

  const formatDayNumber = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.getDate();
  };

  const formatMonth = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { month: 'short' });
  };

  if (!doctor) {
    return <div>Médico no encontrado</div>;
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Seleccionar Fecha y Hora</h1>
          <p className="text-muted-foreground">Elige el horario de tu cita</p>
        </div>
      </div>

      <DoctorCard doctor={doctor} />

      {/* Date Selector */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-sm">
            {visibleDates[0] && formatMonth(visibleDates[0])}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={visibleDates.length < 7}
            className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {visibleDates.map(date => {
            const hasAvailable = groupedSlots[date]?.some(s => s.available);
            const isSelectedDate = selectedSlot?.date === date;
            return (
              <button
                key={date}
                onClick={() => {
                  if (hasAvailable) {
                    const firstAvailable = groupedSlots[date].find(s => s.available);
                    if (firstAvailable) setSelectedSlot(firstAvailable);
                  }
                }}
                disabled={!hasAvailable}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-colors',
                  isSelectedDate && 'bg-primary text-primary-foreground',
                  !isSelectedDate && hasAvailable && 'hover:bg-accent',
                  !hasAvailable && 'opacity-40 cursor-not-allowed'
                )}
              >
                <span className="text-xs uppercase">{formatDayName(date)}</span>
                <span className="text-lg font-semibold">{formatDayNumber(date)}</span>
              </button>
            );
          })}
        </div>

        {/* Time Slots */}
        {selectedSlot && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium mb-3">Horarios disponibles</p>
            <div className="grid grid-cols-4 gap-2">
              {groupedSlots[selectedSlot.date]
                ?.filter(s => s.available)
                .map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot)}
                    className={cn(
                      'py-2 px-3 rounded-lg text-sm font-medium transition-colors',
                      selectedSlot.id === slot.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-accent'
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      <Button
        onClick={() => navigate(`/book/payment/${doctorId}/${selectedSlot?.id}`)}
        disabled={!selectedSlot}
        className="w-full h-12"
      >
        Continuar al Pago
      </Button>
    </div>
  );
};

export default SelectDateTime;
