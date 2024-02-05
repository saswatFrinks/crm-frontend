import axiosInstance from '@/core/request/aixosinstance';

import resourceUrl from '@/core/resourceUrl';

const login = async (data) => {
  return await axiosInstance.post(`${resourceUrl.userUrl}/login`, data);
};

const create = async (data) => {
  return await axiosInstance.post(
    `${resourceUrl.organizationUrl}/create`,
    data
  );
};

export default {
  login,
  create,
};
