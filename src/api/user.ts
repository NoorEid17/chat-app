import axios, { AxiosResponse } from "axios";
import { Room } from "./room";

export interface User {
  id: string;
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  fullName: string;
  bio: string;
  avatar: string;
  rooms: Room[] | string[];
  isOnline: boolean;
}

axios.defaults.baseURL = "http://localhost:5000/api";

export const login = (data: any): Promise<AxiosResponse> => {
  return axios.post("/users/login", data, {
    withCredentials: true,
  });
};

export const signup = (data: any): Promise<AxiosResponse> => {
  return axios.post("/users/signup", data, {
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

export const searchUsersOrGroups = async (searchQuery: string) => {
  const {
    data: { results },
  } = await axios.post<{ results: User[] | Room[] }>(
    `/users/search?searchQuery=${searchQuery}`
  );
  return results;
};

export const addContact = async (userId: string) => {
  return axios.post<{
    room: Room;
  }>(
    "/users/contact",
    {
      userId,
    },
    { withCredentials: true }
  );
};

export const fetchContacts = async () => {
  const { data } = await axios.get("/users/contacts", {
    withCredentials: true,
  });
  return data.contacts;
};
