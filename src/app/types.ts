import { HttpErrorResponse } from "@angular/common/http";

export interface Client {
  id: string
  name: string;
  lastName: string;
  dni: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  birthDate: Date;
  creationDate: Date;
  isActive: boolean;
  photo?: string;
  activities: Activity[]; // Relationship with Activity
  healthData: HealthData; // Relationship with HealthData
  isInsured: boolean;
}

export interface Activity {
  activityName: string;
  attendedLocation: string;
  attendedDays: string;
  goal: string;
  creationDate: Date;
  clientId: string; // Relationship with Client
}

export interface HealthData {
  clientId: string; // Relationship with Client
  healthInsurance: string;
  weight: number;
  height: number;
  currentStudies: string;
  studyImages: string[]; // Path or URL of the image (optional)
  bloodPressure: string;
  diseases: string; // List of diseases (optional)
  medications: string; // List of medications (optional)
  boneIssues: string; // List of bone issues (optional)
  smoker: boolean;
}

export interface Pagination<T> {
  items: T[]
  meta: {
    totalPages: number
    currentPage: number
  }
}

export interface ApiError{
  status: number
  message: string
  error: string
}

export interface ApiErrorResponse extends HttpErrorResponse{
  error: ApiError
}