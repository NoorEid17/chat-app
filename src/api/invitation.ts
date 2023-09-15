import axios from "axios";
import { Room } from "./room";
import { User } from "./user";

export interface Invitation {
  id: string;
  from: User;
  to: string;
  room: Room;
}

export const inviteUser = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  const { data } = await axios.post(
    "/invitations/",
    {
      roomId,
      to: userId,
    },
    { withCredentials: true }
  );
  return data.invitation;
};

export const fetchInvitations = async (): Promise<Invitation[]> => {
  const { data } = await axios.get("/invitations", { withCredentials: true });
  return data.invitations;
};

export const acceptInvitation = async (invitationId: string) => {
  return axios.put(
    "/invitations/" + invitationId + "/accept",
    {},
    { withCredentials: true }
  );
};

export const rejectInvitation = async (invitationId: string) => {
  return axios.delete("/invitations/" + invitationId + "/reject", {
    withCredentials: true,
  });
};
