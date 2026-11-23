export type RoleType = 'STUDENT' | 'FACULTY' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleType;
  phone?: string;
  profileId?: number;
  department?: string;
  company?: string;
  cgpa?: number;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleType;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: RoleType;
  rollNumber?: string;
  departmentCode?: string;
  academicYear?: number;
  cgpa?: number;
  companyName?: string;
  designation?: string;
}
