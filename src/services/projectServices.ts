import { axiosApi } from './api';

export const ProjectStatus = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  status: ProjectStatus;
  createdAt: string;
}

export interface GetProjectsResponse {
  projects: Project[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export const getProjectsService = async (page: number = 1, title?: string): Promise<GetProjectsResponse> => {
  const token = localStorage.getItem('@i9:token');

  if (!token) {
    throw new Error('No token found');
  }

  const params: any = { page };
  if (title) {
    params.title = title;
  }

  const response = await axiosApi.get('/projects/all', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
