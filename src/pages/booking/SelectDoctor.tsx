import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DoctorCard } from '@/components/doctor/DoctorCard';
import { EmptyState } from '@/components/common/EmptyState';
import { doctors, specialties } from '@/data/mockData';
import { ArrowLeft, UserX } from 'lucide-react';

const SelectDoctor: React.FC = () => {
  const navigate = useNavigate();
  const { specialtyId } = useParams<{ specialtyId: string }>();

  const specialty = specialties.find(s => s.id === specialtyId);
  const filteredDoctors = doctors.filter(d => d.specialtyId === specialtyId);

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
          <h1 className="text-2xl font-bold">Seleccionar Médico</h1>
          <p className="text-muted-foreground">
            {specialty?.icon} {specialty?.name || 'Especialidad'}
          </p>
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <EmptyState
          icon={UserX}
          title="Sin médicos disponibles"
          description="No hay médicos disponibles para esta especialidad en este momento."
          actionLabel="Ver otras especialidades"
          onAction={() => navigate('/book/specialty')}
        />
      ) : (
        <div className="space-y-3">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onClick={() => navigate(`/book/datetime/${doctor.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDoctor;
