import api from './api';
import type { 
  StudentProfile, 
  StudentSkill, 
  AddSkillPayload, 
  UpdateProfilePayload, 
  Project, 
  AddProjectPayload, 
  Certification, 
  AddCertificationPayload 
} from '../types/student';

export const studentService = {
  async getMyProfile(): Promise<StudentProfile> {
    const res = await api.get<StudentProfile>('/students/me');
    return res.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<StudentProfile> {
    const res = await api.put<StudentProfile>('/students/me', payload);
    return res.data;
  },

  async addOrUpdateSkill(payload: AddSkillPayload): Promise<StudentSkill> {
    const res = await api.post<StudentSkill>('/students/me/skills', payload);
    return res.data;
  },

  async deleteSkill(studentSkillId: number): Promise<void> {
    await api.delete(`/students/me/skills/${studentSkillId}`);
  },

  async addProject(payload: AddProjectPayload): Promise<Project> {
    const res = await api.post<Project>('/students/me/projects', payload);
    return res.data;
  },

  async addCertification(payload: AddCertificationPayload): Promise<Certification> {
    const res = await api.post<Certification>('/students/me/certifications', payload);
    return res.data;
  },
};
