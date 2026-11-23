export interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
}

export interface StudentSkill {
  id: number;
  skillId: number;
  skillName: string;
  category: string;
  proficiencyLevel: number; // 1 to 5
  experienceMonths?: number;
  evidenceProject?: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  technologiesUsed?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Certification {
  id: number;
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  credentialUrl?: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  rollNumber?: string;
  departmentName?: string;
  departmentCode?: string;
  academicYear?: number;
  graduationYear?: number;
  cgpa?: number;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  targetCareerRole?: string;
  skills: StudentSkill[];
  projects: Project[];
  certifications: Certification[];
}

export interface AddSkillPayload {
  skillId: number;
  proficiencyLevel: number;
  experienceMonths?: number;
  evidenceProject?: string;
}

export interface UpdateProfilePayload {
  bio?: string;
  cgpa?: number;
  academicYear?: number;
  graduationYear?: number;
  linkedinUrl?: string;
  githubUrl?: string;
  targetCareerRole?: string;
}

export interface AddProjectPayload {
  title: string;
  description?: string;
  technologiesUsed?: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface AddCertificationPayload {
  name: string;
  issuingOrganization?: string;
  issueDate?: string;
  credentialUrl?: string;
}
