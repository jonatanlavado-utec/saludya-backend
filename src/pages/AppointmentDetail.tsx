import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Star, Download, FileText, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

const AppointmentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { appointments, cancelAppointment } = useApp();

  const appointment = appointments.find(a => a.id === appointmentId);

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Cita no encontrada</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

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

  const handleDownload = (type: string) => {
    alert(`Descargando ${type}... (simulado)`);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Detalle de Cita</h1>
        </div>
        <span className={cn('text-sm font-medium px-3 py-1 rounded-full', statusColors[appointment.status])}>
          {statusLabels[appointment.status]}
        </span>
      </div>

      {/* Doctor Info */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card">
        <div className="flex gap-4">
          <img
            src={appointment.doctor.photoUrl}
            alt={appointment.doctor.name}
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{appointment.doctor.name}</h3>
            <p className="text-primary font-medium">{appointment.doctor.specialty}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span>{appointment.doctor.rating}</span>
              </div>
              <span>{appointment.doctor.experience} años exp.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="bg-card rounded-xl p-4 border border-border shadow-card space-y-4">
        <h3 className="font-semibold">Información de la Cita</h3>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Fecha</p>
            <p className="font-medium">{formatDate(appointment.date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hora</p>
            <p className="font-medium">{appointment.time}</p>
          </div>
        </div>

        {appointment.symptoms && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-1">Síntomas reportados</p>
            <p className="text-foreground">{appointment.symptoms}</p>
          </div>
        )}
      </div>

      {/* Medical Info (for completed appointments) */}
      {appointment.status === 'completed' && (
        <>
          {appointment.diagnosis && (
            <div className="bg-card rounded-xl p-4 border border-border shadow-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Diagnóstico
              </h3>
              <p className="text-foreground">{appointment.diagnosis}</p>
            </div>
          )}

          {appointment.prescription && (
            <div className="bg-card rounded-xl p-4 border border-border shadow-card">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Receta
              </h3>
              <p className="text-foreground">{appointment.prescription}</p>
            </div>
          )}

          {appointment.notes && (
            <div className="bg-card rounded-xl p-4 border border-border shadow-card">
              <h3 className="font-semibold mb-3">Notas del Doctor</h3>
              <p className="text-muted-foreground">{appointment.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => handleDownload('receta')}>
              <Download className="w-4 h-4 mr-2" />
              Receta
            </Button>
            <Button variant="outline" onClick={() => handleDownload('informe')}>
              <Download className="w-4 h-4 mr-2" />
              Informe
            </Button>
          </div>
        </>
      )}

      {/* Actions */}
      {appointment.status === 'scheduled' && (
        <Button 
          variant="outline" 
          className="w-full text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={() => {
            cancelAppointment(appointment.id);
            navigate('/appointments');
          }}
        >
          Cancelar Cita
        </Button>
      )}
    </div>
  );
};

export default AppointmentDetail;
