import React, { createContext, useContext, useState, useCallback } from 'react';
import { Booking, MOCK_BOOKINGS } from '../data/courts';

export type UserMode = 'user' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  mode: UserMode;
  phone?: string;
}

interface AppContextType {
  user: User | null;
  bookings: Booking[];
  isAuthenticated: boolean;
  login: (email: string, password: string, mode: UserMode) => Promise<void>;
  loginWithGoogle: (mode: UserMode) => Promise<void>;
  loginWithApple: (mode: UserMode) => Promise<void>;
  register: (name: string, email: string, password: string, mode: UserMode) => Promise<void>;
  logout: () => void;
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

  const login = useCallback(async (email: string, _password: string, mode: UserMode) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (mode === 'owner') {
      setUser({
        id: 'owner1',
        name: 'Carlos Mendez',
        email: email || 'carlos@canchas.com',
        mode: 'owner',
        phone: '+54 11 1234-5678',
      });
    } else {
      setUser({
        id: 'user1',
        name: 'Juan Pérez',
        email: email || 'juan@example.com',
        mode: 'user',
        phone: '+54 11 9876-5432',
      });
    }
  }, []);

  const loginWithGoogle = useCallback(async (mode: UserMode) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await login('google@user.com', '', mode);
  }, [login]);

  const loginWithApple = useCallback(async (mode: UserMode) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    await login('apple@user.com', '', mode);
  }, [login]);

  const register = useCallback(async (name: string, email: string, _password: string, mode: UserMode) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({
      id: 'user_new',
      name,
      email,
      mode,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const addBooking = useCallback((booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' as const } : b)
    );
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        bookings,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        loginWithApple,
        register,
        logout,
        addBooking,
        cancelBooking,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
