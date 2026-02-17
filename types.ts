
export enum ResourceType {
  NOTES = 'Notes',
  QUESTION_PAPERS = 'Question Papers',
  SOLUTIONS = 'Solutions',
  PROJECT_REPORTS = 'Project Reports',
  STUDY_MATERIAL = 'Study Material'
}

export enum PrivacyLevel {
  PUBLIC = 'Public',
  PRIVATE = 'Private'
}

export interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  branch: string;
  semester: string;
  bio?: string;
  profilePic?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  uploaderId: string;
  uploaderName: string;
  uploaderCollege: string;
  title: string;
  subject: string;
  semester: string;
  type: ResourceType;
  yearBatch: string;
  description: string;
  tags: string[];
  privacy: PrivacyLevel;
  fileUrl: string;
  fileName: string;
  reviews: Review[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
