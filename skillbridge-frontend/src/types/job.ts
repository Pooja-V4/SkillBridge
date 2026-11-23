export interface JobSkillRequirement {
  id: number;
  skillId: number;
  skillName: string;
  category: string;
  minProficiencyLevel: number;
  weight: number;
  isMandatory: boolean;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  companyId: number;
  companyName: string;
  companyLocation?: string;
  companyLogoUrl?: string;
  jobRoleTitle?: string;
  location?: string;
  employmentType?: string;
  minCgpa?: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  applicationDeadline?: string;
  isActive: boolean;
  createdAt: string;
  requiredSkills: JobSkillRequirement[];
}

export interface CreateJobPayload {
  title: string;
  jobRoleId?: number;
  description: string;
  location?: string;
  employmentType?: string;
  minCgpa?: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  applicationDeadline?: string;
  requiredSkills: {
    skillId: number;
    minProficiencyLevel: number;
    weight: number;
    isMandatory: boolean;
  }[];
}

export interface Company {
  id: number;
  name: string;
  industry?: string;
  websiteUrl?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
}

export interface UpdateCompanyPayload {
  name: string;
  industry?: string;
  websiteUrl?: string;
  location?: string;
  description?: string;
  logoUrl?: string;
}
