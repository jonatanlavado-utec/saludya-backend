import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { AppointmentCard } from '@/components/appointment/AppointmentCard';
import { SpecialtyCard } from '@/components/specialty/SpecialtyCard';
import { specialties } from '@/data/mockData';
import { Calendar, MessageSquare, Clock, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, appointments } = useApp();

  const upcomingAppointments = appointments
    .filter(apt => apt.status === 'scheduled')
    .slice(0, 2);

  const popularSpecialties = specialties.slice(0, 4);

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
        <h1 className="text-2xl font-bold mb-1">
          ¡Hola, {user?.firstName || 'Usuario'}!
        </h1>
        <p className="text-primary-foreground/80 mb-4">
          ¿Cómo te sientes hoy?
        </p>
        <div className="flex gap-3">
          <Button 
            onClick={() => navigate('/ai-assistant')}
            variant="secondary"
            className="flex-1"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Consultar IA
          </Button>
          <Button 
            onClick={() => navigate('/book/specialty')}
            variant="outline"
            className="flex-1 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button 
          onClick={() => navigate('/ai-assistant')}
          className="flex flex-col items-center p-4 bg-card rounded-xl shadow-card border border-border hover:shadow-soft transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium">IA Salud</span>
        </button>
        <button 
          onClick={() => navigate('/book/specialty')}
          className="flex flex-col items-center p-4 bg-card rounded-xl shadow-card border border-border hover:shadow-soft transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium">Agendar</span>
        </button>
        <button 
          onClick={() => navigate('/appointments')}
          className="flex flex-col items-center p-4 bg-card rounded-xl shadow-card border border-border hover:shadow-soft transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-2">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <span className="text-sm font-medium">Mis Citas</span>
        </button>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Próximas Citas</h2>
            <button 
              onClick={() => navigate('/appointments')}
              className="text-sm text-primary font-medium flex items-center"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map(apt => (
              <AppointmentCard 
                key={apt.id} 
                appointment={apt}
                onClick={() => navigate(`/appointment/${apt.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Specialties */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Especialidades</h2>
          <button 
            onClick={() => navigate('/book/specialty')}
            className="text-sm text-primary font-medium flex items-center"
          >
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {popularSpecialties.map(specialty => (
            <SpecialtyCard 
              key={specialty.id} 
              specialty={specialty}
              onClick={() => navigate(`/book/doctor/${specialty.id}`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
