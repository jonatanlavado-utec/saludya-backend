import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { AppointmentCard } from '@/components/appointment/AppointmentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Clock } from 'lucide-react';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { appointments } = useApp();

  const pastAppointments = appointments
    .filter(apt => apt.status === 'completed' || apt.status === 'cancelled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold">Historial de Citas</h1>
        <p className="text-muted-foreground">Consultas anteriores</p>
      </div>

      {pastAppointments.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="Sin historial"
          description="Aún no tienes consultas completadas en tu historial."
          actionLabel="Agendar Cita"
          onAction={() => navigate('/book/specialty')}
        />
      ) : (
        <div className="space-y-3">
          {pastAppointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onClick={() => navigate(`/appointment/${appointment.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
