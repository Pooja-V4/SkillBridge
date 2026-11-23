import api from './api';
import type { 
  Internship, 
  CreateInternshipPayload, 
  Application, 
  SubmitApplicationPayload, 
  UpdateStatusPayload 
} from '../types/application';

export const internshipService = {
  async getAllActiveInternships(): Promise<Internship[]> {
    const res = await api.get<Internship[]>('/internships');
    return res.data;
  },

  async getInternshipById(id: number): Promise<Internship> {
    const res = await api.get<Internship>(`/internships/${id}`);
    return res.data;
  },

  async getMyPostedInternships(): Promise<Internship[]> {
    const res = await api.get<Internship[]>('/internships/my-postings');
    return res.data;
  },

  async createInternship(payload: CreateInternshipPayload): Promise<Internship> {
    const res = await api.post<Internship>('/internships', payload);
    return res.data;
  },

  async deleteInternship(id: number): Promise<void> {
    await api.delete(`/internships/${id}`);
  },
};

export const applicationService = {
  async submitApplication(payload: SubmitApplicationPayload): Promise<Application> {
    const res = await api.post<Application>('/applications', payload);
    return res.data;
  },

  async getMyApplications(): Promise<Application[]> {
    const res = await api.get<Application[]>('/applications/me');
    return res.data;
  },

  async getRecruiterApplications(): Promise<Application[]> {
    const res = await api.get<Application[]>('/applications/recruiter');
    return res.data;
  },

  async updateStatus(id: number, payload: UpdateStatusPayload): Promise<Application> {
    const res = await api.patch<Application>(`/applications/${id}/status`, payload);
    return res.data;
  },
};
