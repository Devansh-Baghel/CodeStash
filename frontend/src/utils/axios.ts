import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  withCredentials: true,
});

const fetcher = {
  get: async (url: string) => {
    const response = await axiosInstance(url);
    return response.data.data;
  },
  post: async (url: string, options = {}) => {
    const response = await axiosInstance.post(url, options);
    return response.data.data;
  },
  put: async (url: string, options = {}) => {
    const response = await axiosInstance.put(url, options);
    return response.data.data;
  },
  patch: async (url: string, options = {}) => {
    const response = await axiosInstance.patch(url, options);
    return response.data.data;
  },
  delete: async (url: string) => {
    const response = await axiosInstance.delete(url);
    return response.data.data;
  },
};

export default fetcher;
