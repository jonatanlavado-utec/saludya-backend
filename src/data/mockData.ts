import { Doctor, Specialty, Appointment } from '@/types';

export const specialties: Specialty[] = [
  { id: 'b897c291-3ca0-44b6-a376-1fb13e2dda4c', name: 'Medicina General', icon: '🩺', description: 'Atención primaria y consultas generales' },
  { id: '9d9dc434-a2bc-4a5a-9867-b9dc514c4e2d', name: 'Cardiología', icon: '❤️', description: 'Corazón y sistema cardiovascular' },
  { id: '4d309499-1286-4869-ad20-a336f1eece37', name: 'Pediatría', icon: '👶', description: 'Salud infantil y adolescente' },
  { id: '5955b0a7-1351-4991-84c1-04836a24da72', name: 'Dermatología', icon: '🧴', description: 'Piel, cabello y uñas' },
  { id: '2a73e4aa-21ca-4cd1-89f9-6de7bd0d851b', name: 'Ginecología', icon: '👩', description: 'Salud femenina' },
  { id: '6b73299b-0b43-44f8-9340-751aa8b0c089', name: 'Traumatología', icon: '🦴', description: 'Huesos, músculos y articulaciones' },
  { id: 'e94b5251-a759-4a48-bba5-5eaf777e4aac', name: 'Neurología', icon: '🧠', description: 'Sistema nervioso' },
  { id: 'c4e78714-f890-4e8d-890b-aff96ae39529', name: 'Oftalmología', icon: '👁️', description: 'Salud visual' },
  { id: '6052bdea-3ddd-4512-afb9-e36b87238cbe', name: 'Psicología', icon: '🧘', description: 'Salud mental y bienestar emocional' },
  { id: '80217568-4d6d-4021-90f3-20a951a3172d', name: 'Nutrición', icon: '🥗', description: 'Alimentación y dietas' },
];

const generateTimeSlots = () => {
  const slots = [];
  const today = new Date();
  for (let day = 1; day <= 14; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split('T')[0];
    
    const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
    times.forEach((time, idx) => {
      slots.push({
        id: `${dateStr}-${time}`,
        date: dateStr,
        time,
        available: Math.random() > 0.3,
      });
    });
  }
  return slots;
};

export const doctors: Doctor[] = [
  {
    id: 'e1a72605-6a58-47bc-9b6f-4770fc60f47e',
    name: 'Dra. María García López',
    specialty: 'Medicina General',
    specialtyId: 'b897c291-3ca0-44b6-a376-1fb13e2dda4c',
    rating: 4.9,
    experience: 15,
    price: 50,
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '4d98d28a-7517-4560-8438-66db00244675',
    name: 'Dr. Carlos Rodríguez Sánchez',
    specialty: 'Cardiología',
    specialtyId: '9d9dc434-a2bc-4a5a-9867-b9dc514c4e2d',
    rating: 4.8,
    experience: 20,
    price: 80,
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '78235213-9a3b-4819-863d-498c1cd81711',
    name: 'Dra. Ana Martínez Ruiz',
    specialty: 'Pediatría',
    specialtyId: '4d309499-1286-4869-ad20-a336f1eece37',
    rating: 4.95,
    experience: 12,
    price: 60,
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: 'b863a3c9-0261-41bd-8c76-50851f5e27fb',
    name: 'Dr. Luis Fernández Torres',
    specialty: 'Dermatología',
    specialtyId: '5955b0a7-1351-4991-84c1-04836a24da72',
    rating: 4.7,
    experience: 8,
    price: 70,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: 'f8a0322c-5690-4d57-8fb6-829d660e5b0b',
    name: 'Dra. Patricia Gómez Vega',
    specialty: 'Ginecología',
    specialtyId: '2a73e4aa-21ca-4cd1-89f9-6de7bd0d851b',
    rating: 4.85,
    experience: 18,
    price: 75,
    photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '2c8a705e-a89f-43b9-a417-2fb078b54203',
    name: 'Dr. Roberto Díaz Mendoza',
    specialty: 'Traumatología',
    specialtyId: '6b73299b-0b43-44f8-9340-751aa8b0c089',
    rating: 4.6,
    experience: 22,
    price: 85,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: 'e0c5c678-5db6-4299-9730-1be66fbab6f2',
    name: 'Dra. Elena Castro Navarro',
    specialty: 'Neurología',
    specialtyId: 'e94b5251-a759-4a48-bba5-5eaf777e4aac',
    rating: 4.9,
    experience: 16,
    price: 90,
    photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '11c42f02-cd6e-44dc-9d8d-bb35d21c3b1e',
    name: 'Dr. Miguel Herrera Blanco',
    specialty: 'Oftalmología',
    specialtyId: 'c4e78714-f890-4e8d-890b-aff96ae39529',
    rating: 4.75,
    experience: 14,
    price: 65,
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: 'c369fc6a-2f47-49a3-9a8c-9c98bc0eeb13',
    name: 'Dra. Laura Jiménez Ortega',
    specialty: 'Psicología',
    specialtyId: '6052bdea-3ddd-4512-afb9-e36b87238cbe',
    rating: 4.92,
    experience: 10,
    price: 55,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '9f05e263-ea7c-4ab4-9721-3fc75fbfa9c7',
    name: 'Dr. Antonio Morales Prieto',
    specialty: 'Nutrición',
    specialtyId: '80217568-4d6d-4021-90f3-20a951a3172d',
    rating: 4.8,
    experience: 7,
    price: 45,
    photoUrl: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  }
];


export const initialAppointments: Appointment[] = [
  {
    id: '1',
    doctor: doctors[0],
    appointment_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    status: 'pending',
    symptoms: 'Dolor de cabeza frecuente',
  },
  {
    id: '2',
    doctor: doctors[2],
    appointment_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:30',
    status: 'pending',
    symptoms: 'Control pediátrico',
  },
  {
    id: '3',
    doctor: doctors[1],
    appointment_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '09:00',
    status: 'completed',
    symptoms: 'Chequeo cardiovascular',
    diagnosis: 'Presión arterial ligeramente elevada',
    prescription: 'Losartán 50mg - 1 vez al día',
    notes: 'Control en 3 meses. Reducir consumo de sal.',
  },
  {
    id: '4',
    doctor: doctors[3],
    appointment_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '11:00',
    status: 'completed',
    symptoms: 'Manchas en la piel',
    diagnosis: 'Dermatitis leve',
    prescription: 'Crema hidratante con urea al 10%',
    notes: 'Evitar exposición solar directa.',
  },
];

export const symptomSpecialtyMap: Record<string, string[]> = {
  'dolor de cabeza': ['Medicina General', 'Neurología'],
  'migraña': ['Neurología', 'Medicina General'],
  'fiebre': ['Medicina General', 'Pediatría'],
  'tos': ['Medicina General', 'Pediatría'],
  'dolor de pecho': ['Cardiología', 'Medicina General'],
  'palpitaciones': ['Cardiología'],
  'manchas en la piel': ['Dermatología'],
  'acné': ['Dermatología'],
  'dolor de huesos': ['Traumatología'],
  'fractura': ['Traumatología'],
  'ansiedad': ['Psicología', 'Medicina General'],
  'depresión': ['Psicología'],
  'problemas de visión': ['Oftalmología'],
  'ojos rojos': ['Oftalmología'],
  'embarazo': ['Ginecología'],
  'menstruación': ['Ginecología'],
  'nutrición': ['Nutrición'],
  'dieta': ['Nutrición'],
  'niño': ['Pediatría'],
  'bebé': ['Pediatría'],
};
