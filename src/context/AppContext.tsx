import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Appointment, Doctor, TimeSlot } from '@/types';
import { initialAppointments } from '@/data/mockData';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  appointments: Appointment[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User>, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  bookAppointment: (doctor: Doctor, slot: TimeSlot, symptoms?: string) => void;
  cancelAppointment: (appointmentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      setUser({
        id: '1',
        email,
        firstName: 'Juan',
        lastName: 'Pérez García',
        dni: '12345678A',
        birthDate: '1990-05-15',
        phone: '+34 612 345 678',
      });
      return true;
    }
    return false;
  };

  const register = async (userData: Partial<User>, password: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (userData.email && password) {
      setUser({
        id: '1',
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        dni: userData.dni || '',
        birthDate: userData.birthDate || '',
        phone: userData.phone || '',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const bookAppointment = (doctor: Doctor, slot: TimeSlot, symptoms?: string) => {
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctor,
      date: slot.date,
      time: slot.time,
      status: 'scheduled',
      symptoms,
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'cancelled' } : apt
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        appointments,
        login,
        register,
        logout,
        updateProfile,
        bookAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
