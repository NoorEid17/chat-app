import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

export const login = (data: any): Promise<AxiosResponse> => {
  return axios.post("/users/login", data, {
    withCredentials: true,
  });
};

export const refreshToken = () => {
  return axios.post("/users/token", undefined, {
    withCredentials: true,
  });
};

export const logout = () => {
  return axios.post("/users/logout", undefined, {
    withCredentials: true,
  });
};

export const updateProfile = (data: any) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (!value) {
      continue;
    }

    if (value instanceof FileList) {
      formData.append(key, value[0] as Blob);
    }

    formData.append(key, value as string);
  }
  return axios.patch("/users", formData, { withCredentials: true });
};
