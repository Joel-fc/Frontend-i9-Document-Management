import { axiosApi } from './api';

export interface Document {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  createdAt: string;
}

export const getEmployeeDocumentsService = async (employeeId: string): Promise<Document[]> => {
  const response = await axiosApi.get(`/users/${employeeId}/documents`);
  return response.data;
};
