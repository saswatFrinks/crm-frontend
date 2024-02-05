/* eslint-disable no-undef */
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    // set up get new token here

    return await Promise.reject(err);
  }
);

export default axiosInstance;
