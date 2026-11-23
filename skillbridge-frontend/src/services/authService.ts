import api from './api';
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(data: LoginPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<User>('/auth/me');
    return res.data;
  },
};
