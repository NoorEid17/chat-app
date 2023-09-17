import axios from "axios";
import { Room } from "./room";
import { User } from "./user";

export interface Message {
  id: string;
  text: string;
  media: string;
  room: Room;
  roomId: Room | string;
  userId: string | User;
  createdAt: Date;
  seenBy: Date[];
  sender: User;
  pending?: boolean;
  isNew?: boolean;
  delivered: boolean;
}

export const fetchLastMessage = async (roomId: string) => {
  return axios.get<{ messages: Message[] }>(
    `/messages/${roomId}?page=1&size=1`,
    {
      withCredentials: true,
    }
  );
};

export const fetchMessages = async ({
  pageParam = 1,
  size = 10,
  roomId,
}: {
  pageParam?: number;
  size?: number;
  roomId: string;
}) => {
  const response = await axios.get(
    `/messages/${roomId}?page=${pageParam}&size=${size}`
  );
  return response.data.messages;
};

export const fetchUnreadMessages = async (roomId: string) => {
  const response = await axios.get("/messages/" + roomId + "/unread", {
    withCredentials: true,
  });
  return response.data.messages;
};
