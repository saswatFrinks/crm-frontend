/* eslint-disable no-undef */
import { getCookie, removeCookie } from '@/shared/hocs/withAuthenticated';
import axios from 'axios';
import toast from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

let navigate;

axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${getCookie()}`

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response && err.response.status === 403) {
      toast.error(err.response.data.data.message);
      removeCookie();
      navigate('/login')
    }
    return await Promise.reject(err);
  }
);

export const setNavigate = (nav) => {
  navigate = nav;
};

export default axiosInstance;
