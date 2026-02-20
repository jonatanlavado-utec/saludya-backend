import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Appointment, Doctor, TimeSlot } from '@/types';
import { initialAppointments } from '@/data/mockData';

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL ?? 'http://localhost:8001';
const AUTH_TOKEN_KEY = 'saludya_token';

export type AuthResult = { success: boolean; error: string } ; 

interface AppContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  /** True once initial session restore from localStorage has finished (success or not). */
  sessionRestored: boolean;
  appointments: Appointment[];
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: Partial<User>, password: string) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
  bookAppointment: (doctor: Doctor, slot: TimeSlot, symptoms?: string) => void;
  cancelAppointment: (appointmentId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function authUserFromResponse(id: string, email: string, extra: Partial<User> = {}): User {
  return {
    id: String(id),
    email,
    firstName: extra.firstName ?? '',
    lastName: extra.lastName ?? '',
    dni: extra.dni ?? '',
    birthDate: extra.birthDate ?? '',
    phone: extra.phone ?? '',
  };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [sessionRestored, setSessionRestored] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!storedToken) {
      setSessionRestored(true);
      return;
    }
    fetch(`${AUTH_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then((res) => {
        if (!res.ok) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setSessionRestored(true);
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.id != null && data?.email != null) {
          setUser(authUserFromResponse(data.id, data.email));
          setToken(storedToken);
        }
        setSessionRestored(true);
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setSessionRestored(true);
      });
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch(`${AUTH_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.detail ?? (res.status === 401 ? 'Credenciales inválidas' : 'Error al iniciar sesión');
        return { success: false, error: typeof message === 'string' ? message : message[0]?.msg ?? 'Error al iniciar sesión' };
      }
      setUser(authUserFromResponse(data.id, data.email));
      setToken(data.token);
      if (data.token) localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      return { success: true, error: '' };
    } catch {
      return { success: false, error: 'No se pudo conectar.' };
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<AuthResult> => {
    if (!userData.email?.trim()) return { success: false, error: 'El correo es obligatorio' };
    try {
      const res = await fetch(`${AUTH_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userData.email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.detail ?? (res.status === 400 ? 'Error al registrar' : 'Error en el servidor');
        return { success: false, error: typeof message === 'string' ? message : message[0]?.msg ?? 'Error al registrar' };
      }
      setUser(authUserFromResponse(data.id, data.email, userData));
      setToken(data.token);
      if (data.token) localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      return { success: true, error: '' };
    } catch {
      return { success: false, error: 'No se pudo conectar.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
        token,
        isAuthenticated: !!user,
        sessionRestored,
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
