import { apiRequest } from './queryClient';

export async function login(credentials) {
  const response = await apiRequest('POST', '/api/auth/login', credentials);
  return response.json();
}

export async function refreshToken() {
  const response = await apiRequest('POST', '/api/auth/refresh');
  return response.json();
}

export async function getCurrentUser() {
  const response = await apiRequest('GET', '/api/auth/me');
  return response.json();
}

export function getAuthToken() {
  return localStorage.getItem('jindal-auth-storage') 
    ? JSON.parse(localStorage.getItem('jindal-auth-storage')).state.token 
    : null;
}

export function setupAxiosInterceptors() {
  // This will be handled by the queryClient
}