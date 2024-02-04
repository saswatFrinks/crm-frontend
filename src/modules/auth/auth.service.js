import axiosInstance from '@/core/request/aixosinstance';

const resourceUrl = '/user';

const login = async (data) => {
  return await axiosInstance.post(`${resourceUrl}/login`, data);
};

const create = async (data) => {
  return await axiosInstance.post(`${resourceUrl}/create`, data);
};

export default {
  login,
  create
};
