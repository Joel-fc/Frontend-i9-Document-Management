import { axiosApi } from './api';

export async function signInService(email:string, password:string):Promise<any> {
  const response = await axiosApi.post('/auth/login', {
    email,
    password
  });

  return response.data;
}

export async function signUpService(email:string, name: string, password:string):Promise<any> {
  const response = await axiosApi.post('/auth/register', {
    email,
    name,
    password,
  });

  return response.data;
}