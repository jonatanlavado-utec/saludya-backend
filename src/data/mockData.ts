import { Doctor, Specialty, Appointment } from '@/types';

export const specialties: Specialty[] = [
  { id: '1', name: 'Medicina General', icon: '🩺', description: 'Atención primaria y consultas generales' },
  { id: '2', name: 'Pediatría', icon: '👶', description: 'Salud infantil y adolescente' },
  { id: '3', name: 'Cardiología', icon: '❤️', description: 'Corazón y sistema cardiovascular' },
  { id: '4', name: 'Dermatología', icon: '🧴', description: 'Piel, cabello y uñas' },
  { id: '5', name: 'Ginecología', icon: '👩', description: 'Salud femenina' },
  { id: '6', name: 'Traumatología', icon: '🦴', description: 'Huesos, músculos y articulaciones' },
  { id: '7', name: 'Neurología', icon: '🧠', description: 'Sistema nervioso' },
  { id: '8', name: 'Oftalmología', icon: '👁️', description: 'Salud visual' },
  { id: '9', name: 'Psicología', icon: '🧘', description: 'Salud mental y bienestar emocional' },
  { id: '10', name: 'Nutrición', icon: '🥗', description: 'Alimentación y dietas' },
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
    id: '1',
    name: 'Dra. María García López',
    specialty: 'Medicina General',
    specialtyId: '1',
    rating: 4.9,
    experience: 15,
    price: 50,
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '2',
    name: 'Dr. Carlos Rodríguez Sánchez',
    specialty: 'Cardiología',
    specialtyId: '3',
    rating: 4.8,
    experience: 20,
    price: 80,
    photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '3',
    name: 'Dra. Ana Martínez Ruiz',
    specialty: 'Pediatría',
    specialtyId: '2',
    rating: 4.95,
    experience: 12,
    price: 60,
    photoUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '4',
    name: 'Dr. Luis Fernández Torres',
    specialty: 'Dermatología',
    specialtyId: '4',
    rating: 4.7,
    experience: 8,
    price: 70,
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '5',
    name: 'Dra. Patricia Gómez Vega',
    specialty: 'Ginecología',
    specialtyId: '5',
    rating: 4.85,
    experience: 18,
    price: 75,
    photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '6',
    name: 'Dr. Roberto Díaz Mendoza',
    specialty: 'Traumatología',
    specialtyId: '6',
    rating: 4.6,
    experience: 22,
    price: 85,
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '7',
    name: 'Dra. Elena Castro Navarro',
    specialty: 'Neurología',
    specialtyId: '7',
    rating: 4.9,
    experience: 16,
    price: 90,
    photoUrl: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '8',
    name: 'Dr. Miguel Herrera Blanco',
    specialty: 'Oftalmología',
    specialtyId: '8',
    rating: 4.75,
    experience: 14,
    price: 65,
    photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '9',
    name: 'Dra. Laura Jiménez Ortega',
    specialty: 'Psicología',
    specialtyId: '9',
    rating: 4.92,
    experience: 10,
    price: 55,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
  {
    id: '10',
    name: 'Dr. Antonio Morales Prieto',
    specialty: 'Nutrición',
    specialtyId: '10',
    rating: 4.8,
    experience: 7,
    price: 45,
    photoUrl: 'https://images.unsplash.com/photo-1612531386530-97286d97c2d2?w=200&h=200&fit=crop&crop=face',
    availableSlots: generateTimeSlots(),
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: '1',
    doctor: doctors[0],
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '10:00',
    status: 'scheduled',
    symptoms: 'Dolor de cabeza frecuente',
  },
  {
    id: '2',
    doctor: doctors[2],
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '14:30',
    status: 'scheduled',
    symptoms: 'Control pediátrico',
  },
  {
    id: '3',
    doctor: doctors[1],
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
