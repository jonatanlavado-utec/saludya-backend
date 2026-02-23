import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Appointment, Doctor, TimeSlot } from '@/types';
import { initialAppointments } from '@/data/mockData';

// URL of reverse proxy, replace with EC2 public IP
const PROXY_URL = import.meta.env.VITE_PROXY_URL || '';
const AUTH_API_URL = `${PROXY_URL}/api/auth`;
const USER_SERVICE_URL = `${PROXY_URL}/api/users`;
const AI_API_URL = `${PROXY_URL}/api/ai`;
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
  updateProfile: (userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
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

async function fetchUserProfile(userId: string): Promise<User | null> {
  try {
    const res = await fetch(`${USER_SERVICE_URL}/${userId}`); // PROXY_URL prefix automatically applied
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: String(data.id),
      email: data.email ?? '',
      firstName: data.first_name ?? '',
      lastName: data.last_name ?? '',
      dni: data.dni ?? '',
      birthDate: data.birth_date ?? '',
      phone: data.phone ?? '',
    };
  } catch {
    return null;
  }
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
    fetch(`${AUTH_API_URL}/me`, {
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
      .then(async (data) => {
        if (data?.id != null && data?.email != null) {
          const profile = await fetchUserProfile(data.id);
          if (profile) {
            setUser(profile);
          } else {
            setUser(authUserFromResponse(data.id, data.email));
          }
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
      const res = await fetch(`${AUTH_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.detail ?? (res.status === 401 ? 'Credenciales inválidas' : 'Error al iniciar sesión');
        return { success: false, error: typeof message === 'string' ? message : message[0]?.msg ?? 'Error al iniciar sesión' };
      }
      const profile = await fetchUserProfile(data.id);
      if (profile) {
        setUser(profile);
      } else {
        setUser(authUserFromResponse(data.id, data.email));
      }
      setToken(data.token);
      if (data.token) localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      return { success: true, error: '' };
    } catch {
      return { success: false, error: 'No se pudo conectar.' };
    }
  };

  const register = async (userData: Partial<User>, password: string): Promise<AuthResult> => {
    if (!userData.email?.trim()) return { success: false, error: 'El correo es obligatorio' };
    if (!userData.firstName?.trim()) return { success: false, error: 'El nombre es obligatorio' };
    if (!userData.lastName?.trim()) return { success: false, error: 'Los apellidos son obligatorios' };
    if (!userData.dni?.trim()) return { success: false, error: 'El DNI es obligatorio' };
    try {
      const body: Record<string, unknown> = {
        email: userData.email.trim(),
        password,
        first_name: userData.firstName.trim(),
        last_name: userData.lastName.trim(),
        dni: userData.dni.trim(),
        phone: userData.phone?.trim() || null,
      };
      if (userData.birthDate?.trim()) body.birth_date = userData.birthDate.trim();
      const res = await fetch(`${AUTH_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.detail ?? (res.status === 400 ? 'Error al registrar' : 'Error en el servidor');
        return { success: false, error: typeof message === 'string' ? message : message[0]?.msg ?? 'Error al registrar' };
      }
      const profile = await fetchUserProfile(data.id);
      if (profile) {
        setUser(profile);
      } else {
        setUser(authUserFromResponse(data.id, data.email, userData));
      }
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

  const updateProfile = async (userData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) return { success: false, error: 'No hay sesión' };
    try {
      const body: Record<string, unknown> = {
        first_name: userData.firstName?.trim() ?? user.firstName,
        last_name: userData.lastName?.trim() ?? user.lastName,
        dni: userData.dni?.trim() ?? user.dni,
        email: userData.email?.trim() ?? user.email,
        phone: userData.phone?.trim() || null,
      };
      if (userData.birthDate !== undefined) body.birth_date = userData.birthDate?.trim() || null;
      const res = await fetch(`${USER_SERVICE_URL}/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.detail ?? (res.status === 400 ? 'Error al actualizar' : 'Error en el servidor');
        return { success: false, error: typeof message === 'string' ? message : message[0]?.msg ?? 'Error al actualizar' };
      }
      setUser({
        ...user,
        firstName: data.first_name ?? user.firstName,
        lastName: data.last_name ?? user.lastName,
        dni: data.dni ?? user.dni,
        email: data.email ?? user.email,
        phone: data.phone ?? user.phone ?? '',
        birthDate: data.birth_date ?? user.birthDate ?? '',
      });
      return { success: true };
    } catch {
      return { success: false, error: 'No se pudo conectar con el servidor.' };
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
