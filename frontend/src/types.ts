export type UserType = 'Student' | 'Faculty' | '';

export type YearOfStudy = '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | '';

export interface ChallengeItem {
  id: string;
  challenge: string;
  solution: string;
}

export interface RegistrationFormData {
  userType: UserType;
  name: string;
  registrationNumber: string;
  email: string;
  mobile: string;
  college: string;
  yearOfStudy: YearOfStudy;
  location: string;
  challenges: ChallengeItem[];
  remarks: string;
}

export interface SubmissionPayload {
  userType: string;
  name: string;
  registrationNumber: string;
  email: string;
  mobile: string;
  college: string;
  yearOfStudy: string;
  location: string;
  challenges: Array<{ challenge: string; solution: string }>;
  remarks: string;
}

export interface BackendResponse {
  status: 'success' | 'error';
  submissionId?: string;
  message?: string;
}

export interface ValidationErrors {
  name?: string;
  registrationNumber?: string;
  email?: string;
  mobile?: string;
  college?: string;
  yearOfStudy?: string;
  location?: string;
  remarks?: string;
  challenges?: Record<string, { challenge?: string; solution?: string }>;
  general?: string;
}
