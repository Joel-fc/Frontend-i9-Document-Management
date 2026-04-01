import { axiosApi } from './api';

export async function login(email:string, password:string):Promise<any> {
  const response = await axiosApi.post('/auth/login', {
    login: email,
    password,
  });

  return response.data;
}