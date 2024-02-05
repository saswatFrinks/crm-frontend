import axiosInstance from './aixosinstance';

export function updateAuthenHeader(token) {
  axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
}
