export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roles: string[];
  isPremium?: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isPremium?: boolean;
}

export interface Job {
  id: number;
  recruiterId: number;
  companyName: string;
  companyLogoUrl?: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  location: string;
  jobType: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  status: string;
  createdAt: string;
}

export interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  status: string;
  resumeUrl?: string;
  coverLetter?: string;
  createdAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  notes?: string;
  status: string;
}

export interface Profile {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  headline?: string;
  bio?: string;
  currentLocation?: string;
  expectedSalary?: number;
  resumeUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string[];
  companyName?: string;
  companyWebsite?: string;
  companyLogoUrl?: string;
  companyDescription?: string;
  companyAddress?: string;
  industry?: string;
  isVerified?: boolean;
}

export interface Education {
  id?: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  description?: string;
}

export interface Experience {
  id?: number;
  companyName: string;
  title: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface AuditLog {
  id: number;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
  userEmail?: string;
}
