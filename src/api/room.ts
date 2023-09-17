import axios from "axios";
import { Message } from "./message";
import { User } from "./user";

export interface Room {
  id: string;
  name: string;
  members: User[];
  admins: string[];
  isGroup: boolean;
  lastMessage?: Message;
  unreadMessagesCount: number;
  avatar?: string;

  haveMember(userId: any): boolean;
}

export const fetchRooms = async () => {
  return axios.get("/users/rooms", { withCredentials: true });
};

export const fetchRoomInfo = async (roomId: string) => {
  const res = await axios.get<{ room: Room }>("/rooms/" + roomId);
  return Promise.resolve(res.data.room);
};

export const createGroup = async (inputs: { name: string }) => {
  const { data } = await axios.post(
    "/rooms",
    { ...inputs, isGroup: true },
    { withCredentials: true }
  );
  return data;
};

export const updateGroupAvatar = async ({
  roomId,
  avatar,
}: {
  roomId: string;
  avatar: File;
}) => {
  const formData = new FormData();
  formData.append("avatar", avatar);
  return axios.put("/rooms/" + roomId + "/update-avatar", formData, {
    withCredentials: true,
  });
};
