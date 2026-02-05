import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SpecialtyCard } from '@/components/specialty/SpecialtyCard';
import { specialties } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';

const SelectSpecialty: React.FC = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold">Seleccionar Especialidad</h1>
          <p className="text-muted-foreground">Elige la especialidad que necesitas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {specialties.map(specialty => (
          <SpecialtyCard
            key={specialty.id}
            specialty={specialty}
            onClick={() => navigate(`/book/doctor/${specialty.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectSpecialty;
