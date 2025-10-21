import { create } from 'zustand';
import type { User } from '../types';
import { authService } from '../services/api/authService';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  initialize: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const user = await authService.login(email, password);
      if (user) {
        set({ user, isAuthenticated: true, isLoading: false });
        return user;
      }
      set({ isLoading: false });
      return null;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('token');
    if (user && token) {
      set({ user, isAuthenticated: true });
    }
  },
}));
