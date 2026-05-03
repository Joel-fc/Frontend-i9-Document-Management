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
  const params: any = { page };
  if (title) {
    params.title = title;
  }

  const response = await axiosApi.get('/projects/all', {
    params,
  });

  return response.data;
};

export interface Employee {
  id: string | number;
  name: string;
  role?: string | null;
  avatarUrl?: string | null;
  email: string;
}

export interface ProjectDetails extends Project {
  users: Employee[];
}

export const getProjectByIdService = async (id: string): Promise<ProjectDetails> => {
  const response = await axiosApi.get(`/projects/${id}`);
  return response.data;
};
