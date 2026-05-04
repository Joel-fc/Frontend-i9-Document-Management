import { axiosApi } from './api';

export interface Document {
  id: string;
  name: string;
  fileUrl: string;
  userId: number;
  createdAt: string;
}

export interface EmployeeDocumentsResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  documents: Document[];
}

export interface EmployeeListItem {
  id: string;
  name: string;
  email: string;
  role?: string | null;
  avatarUrl?: string | null;
}

export const getEmployeeDocumentsService = async (employeeId: string): Promise<EmployeeDocumentsResponse> => {
  const response = await axiosApi.get(`/users/${employeeId}/documents`);
  return response.data;
};

export const getAllEmployeesService = async (): Promise<EmployeeListItem[]> => {
  const response = await axiosApi.get('/employees');
  return response.data;
};

export const addEmployeeDocumentService = async (employeeId: string, data: { name: string; fileUrl: string }): Promise<Document> => {
  const response = await axiosApi.post(`/users/${employeeId}/documents`, data);
  return response.data;
};
