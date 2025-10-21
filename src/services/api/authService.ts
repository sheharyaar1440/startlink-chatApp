import apiClient from './apiClient';
import type { User, AuthResponse, AuthSession } from '../../types';

const LOGIN_ENDPOINT = import.meta.env.VITE_LOGIN_URL || '/auth/login';

export const authService = {
  // Progressive enhancement:
  // 1) Try real auth endpoint returning { user, token }
  // 2) Fallback to json-server users query and generate a mock token
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      // Attempt real API first (POST /auth/login or configured)
      if (LOGIN_ENDPOINT !== '/auth/login') {
        const res = await apiClient.post<AuthResponse>(LOGIN_ENDPOINT, {
          email,
          password,
        });
        const session: AuthSession = {
          user: res.data.user,
          token: res.data.token,
        };
        localStorage.setItem('user', JSON.stringify(session.user));
        localStorage.setItem('token', session.token);
        return session.user;
      }

      // Fallback: json-server mock
      const response = await apiClient.get<User[]>(`/users`, {
        params: { email, password },
      });

      if (response.data && response.data.length > 0) {
        const user = response.data[0];
        const { password: _, ...userWithoutPassword } = user;
        // Generate a mock token (base64 of user id + timestamp)
        const token = btoa(`${user.id}:${Date.now()}`);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('token', token);
        return userWithoutPassword;
      }

      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },
};
