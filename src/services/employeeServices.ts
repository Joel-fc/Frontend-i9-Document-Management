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

export const getEmployeeDocumentsService = async (employeeId: string): Promise<EmployeeDocumentsResponse> => {
  const response = await axiosApi.get(`/users/${employeeId}/documents`);
  return response.data;
};
