import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { AppointmentCard } from '@/components/appointment/AppointmentCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, cancelAppointment } = useApp();

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled' || apt.status === 'cancelled')
    .sort((a, b) => {
      if (a.status === 'scheduled' && b.status !== 'scheduled') return -1;
      if (a.status !== 'scheduled' && b.status === 'scheduled') return 1;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis Citas</h1>
          <p className="text-muted-foreground">Próximas citas programadas</p>
        </div>
        <Button onClick={() => navigate('/book/specialty')} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nueva
        </Button>
      </div>

      {upcomingAppointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Sin citas programadas"
          description="No tienes citas próximas. Agenda una consulta con nuestros especialistas."
          actionLabel="Agendar Cita"
          onAction={() => navigate('/book/specialty')}
        />
      ) : (
        <div className="space-y-3">
          {upcomingAppointments.map(appointment => (
            <div key={appointment.id}>
              <AppointmentCard
                appointment={appointment}
                onClick={() => navigate(`/appointment/${appointment.id}`)}
              />
              {appointment.status === 'scheduled' && (
                <div className="mt-2 px-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        Cancelar Cita
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Cancelar esta cita?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Tu cita con {appointment.doctor.name} será cancelada.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>No, mantener</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => cancelAppointment(appointment.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sí, cancelar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
