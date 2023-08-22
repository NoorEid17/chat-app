import axios, { AxiosResponse } from "axios";

export const login = (data: any): Promise<AxiosResponse> => {
  return axios.post("http://localhost:5000/api/users/login", data, {
    withCredentials: true,
  });
};

export const refreshToken = () => {
  return axios.post("http://localhost:5000/api/users/token", undefined, {
    withCredentials: true,
  });
};
