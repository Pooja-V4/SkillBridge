export interface InternshipSkillRequirement {
  id: number;
  skillId: number;
  skillName: string;
  category: string;
  minProficiencyLevel: number;
  weight: number;
  isMandatory: boolean;
}

export interface Internship {
  id: number;
  title: string;
  description: string;
  companyId: number;
  companyName: string;
  companyLocation?: string;
  companyLogoUrl?: string;
  location?: string;
  durationMonths: number;
  stipendMonthly?: number;
  minCgpa?: number;
  applicationDeadline?: string;
  isActive: boolean;
  createdAt: string;
  requiredSkills: InternshipSkillRequirement[];
}

export interface CreateInternshipPayload {
  title: string;
  description: string;
  location?: string;
  durationMonths?: number;
  stipendMonthly?: number;
  minCgpa?: number;
  applicationDeadline?: string;
  requiredSkills: {
    skillId: number;
    minProficiencyLevel: number;
    weight: number;
    isMandatory: boolean;
  }[];
}

export type ApplicationStatus = 'APPLIED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';
export type ApplicationType = 'JOB' | 'INTERNSHIP';

export interface Application {
  id: number;
  type: ApplicationType;
  status: ApplicationStatus;
  skillMatchPercentage: number;
  coverLetter?: string;
  recruiterFeedback?: string;
  appliedAt: string;

  studentId: number;
  studentName: string;
  studentEmail: string;
  studentRoll?: string;
  departmentName?: string;
  studentCgpa?: number;

  targetId: number;
  targetTitle: string;
  companyName: string;
  location?: string;
}

export interface SubmitApplicationPayload {
  type: ApplicationType;
  jobId?: number;
  internshipId?: number;
  coverLetter?: string;
}

export interface UpdateStatusPayload {
  status: ApplicationStatus;
  recruiterFeedback?: string;
}
