import api from './api';
import type { Job, CreateJobPayload, Company, UpdateCompanyPayload } from '../types/job';

export const jobService = {
  async getAllActiveJobs(): Promise<Job[]> {
    const res = await api.get<Job[]>('/jobs');
    return res.data;
  },

  async getJobById(id: number): Promise<Job> {
    const res = await api.get<Job>(`/jobs/${id}`);
    return res.data;
  },

  async getMyPostedJobs(): Promise<Job[]> {
    const res = await api.get<Job[]>('/jobs/my-postings');
    return res.data;
  },

  async createJob(payload: CreateJobPayload): Promise<Job> {
    const res = await api.post<Job>('/jobs', payload);
    return res.data;
  },

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/jobs/${id}`);
  },
};

export const recruiterService = {
  async updateCompany(payload: UpdateCompanyPayload): Promise<Company> {
    const res = await api.put<Company>('/recruiters/company', payload);
    return res.data;
  },
};
