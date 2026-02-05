export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dni: string;
  birthDate: string;
  phone: string;
  avatarUrl?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialtyId: string;
  rating: number;
  experience: number;
  price: number;
  photoUrl: string;
  availableSlots: TimeSlot[];
}

export interface Specialty {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  symptoms?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}
