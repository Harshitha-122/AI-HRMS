export enum UserRole {
  Admin = 'Admin',
  Manager = 'Manager',
  HR = 'HR',
  Employee = 'Employee',
}

export interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  hireDate: string;
  avatarUrl: string;
  performance: number[];
  attendance: {
    present: number;
    absent: number;
    late: number;
  };
}

export interface User {
  email: string;
  role: UserRole;
  name: string;
  avatarUrl: string;
  employeeId: number;
}

export interface ResumeScreeningResult {
  candidateName: string;
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  isQualified: boolean;
}

export interface TranscriptionTurn {
  speaker: 'user' | 'model';
  text: string;
}

export interface PerformanceReview {
  id: number;
  employeeId: number;
  reviewer: string;
  date: string;
  score: number;
  comments: string;
}

export interface JobOpening {
    id: number;
    title: string;
    department: string;
    status: 'Open' | 'Closed' | 'On Hold';
    applications: number;
    interviews: number;
    hired: number;
    hiringManager: string;
}

export interface HiredCandidate {
    id: number;
    name: string;
    jobTitle: string;
    expertise: string[];
    hireDate: string;
    avatarUrl: string;
}

export interface InterviewAnalysisResult {
  isQualified: boolean;
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}
