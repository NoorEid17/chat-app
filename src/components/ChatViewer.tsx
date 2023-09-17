import { fetchRoomInfo, Room } from "@/api/room";
import { User } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import InviteMembersToGroupDialog from "./InviteMembersToGrouoDialog";
import MessagesWrapper from "./MessagesWrapper";
import UpdateGroupAvatarDialog from "./UpdateGroupAvatarDialog";

const ChatViewer = () => {
  const {
    state: { user },
  } = useContext(AuthContext);
  const { roomId } = useParams();
  const [receiver, setReceiver] = useState<User>();
  const { data: room, isLoading } = useQuery({
    queryKey: ["rooms", roomId],
    queryFn: () => fetchRoomInfo(roomId!),
  });
  useEffect(() => {
    if (room) {
      setReceiver(room.members.find((member) => member.id !== user.id));
    }
  }, [room]);

  return (
    <div
      className="h-full grid w-full col-span-5 px-5 max-md:col-span-7"
      style={{ gridTemplateRows: "15% 1fr 10%" }}
    >
      {isLoading ? (
        <span className="loading loading-dots"></span>
      ) : (
        <>
          {room?.isGroup ? (
            <GroupRoomHeader room={room} />
          ) : (
            <PrivateRoomHeader receiver={receiver} />
          )}
          <MessagesWrapper roomId={room?.id!} />
        </>
      )}
    </div>
  );
};

const PrivateRoomHeader = ({ receiver }: { receiver?: User }) => (
  <header className="p-4">
    <div>
      <div className="flex gap-4 items-center">
        <div
          className={`avatar placeholder ${
            receiver?.isOnline ? "online" : "offline"
          }`}
        >
          <div className="w-12 rounded-full bg-gray-500">
            {receiver?.avatar && <img src={receiver?.avatar} />}
            {!receiver?.avatar && (
              <span className="text-xl">{receiver?.firstName[0]}</span>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg text-white font-bold">{receiver?.fullName}</h3>
          <span className="text-base">
            {receiver?.isOnline ? "online" : "offline"}
          </span>
        </div>
      </div>
    </div>
    <hr className="border-t-2 border-solid border-slate-700/40 my-4"></hr>
  </header>
);

const GroupRoomHeader = ({ room }: { room: Room }) => {
  const {
    state: { user },
  } = useContext(AuthContext);
  return (
    <header className="p-4">
      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <div className={`avatar placeholder `}>
            <div className="w-12 rounded-full bg-gray-500">
              {room.avatar && <img src={room.avatar} />}
              {!room.avatar && <span className="text-xl">{room.name[0]}</span>}
            </div>
          </div>
          <div>
            <h3 className="text-lg text-white font-bold">{room.name}</h3>
            {room.members.map((member) => member.firstName).join(", ")}
          </div>
        </div>
        <div>
          {room.admins.includes(user.id) && (
            <>
              <UpdateGroupAvatarDialog roomId={room.id} />
              <InviteMembersToGroupDialog room={room} />
            </>
          )}
        </div>
      </div>
      <hr className="border-t-2 border-solid border-slate-700/40 my-4"></hr>
    </header>
  );
};

export default ChatViewer;
