import api from './api';
import type { Skill } from '../types/student';

export const skillService = {
  async getAllSkills(category?: string): Promise<Skill[]> {
    const params = category ? { category } : {};
    const res = await api.get<Skill[]>('/skills', { params });
    return res.data;
  },
};
