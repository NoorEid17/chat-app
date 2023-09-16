import { Invitation } from "@/api/invitation";
import { fetchLastMessage, Message } from "@/api/message";
import { Room } from "@/api/room";
import { addContact, searchUsersOrGroups, User } from "@/api/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCheck, Image, Search } from "lucide-react";
import moment from "moment";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "react-hot-toast";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import CreateGroupDialog from "./CreateGroupDialog";
import InvitationToast from "./InvitationToast";
import { roomsContext } from "./RoomsContext";
import { useSocket } from "./SocketProvider";

const ChatsList = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Room[] | User[]>([]);
  const { state: rooms, dispatch } = useContext(roomsContext);
  const searchMutation = useMutation({
    mutationFn: searchUsersOrGroups,
  });
  const socket = useSocket();
  const queryClient = useQueryClient();

  socket.on("message", (message: Message) => {
    const { roomId } = message;
    if (rooms.find((room) => room.id === roomId)) {
      return queryClient.invalidateQueries(["rooms"]);
    }
    dispatch({
      type: "SET_LAST_MESSAGE",
      payload: {
        message,
        roomId: message.roomId,
      },
    });
    dispatch({
      type: "INCREMENT_UNREAD_COUNT",
      payload: {
        roomId: message.roomId,
      },
    });
  });

  useEffect(() => {
    socket.on("invitation", (invitation: Invitation) => {
      toast.custom((t) => <InvitationToast invitation={invitation} t={t} />);
    });

    return () => {
      socket.off("invitation");
    };
  }, []);

  useEffect(() => {
    setSearchResults(searchMutation.data || []);
  }, [searchMutation.data]);

  return (
    <>
      <div className="flex flex-col h-full py-4 px-4 gap-5 col-span-2">
        <SearchInput
          setIsSearching={setIsSearching}
          searchRequest={searchMutation.mutate}
        />
        <div className="flex justify-between items-center px-5">
          <h4 className="text-xl font-bold text-primary-content">My Rooms: </h4>
          <CreateGroupDialog />
        </div>
        {isSearching && (
          <>
            {!searchResults.length && (
              <h3 className="text-center">No Results found!</h3>
            )}
            <div className="h-screen">
              {searchResults.map((searchResult) => (
                <SearchItem
                  searchItem={searchResult as User}
                  setIsSearching={setIsSearching}
                />
              ))}
            </div>
          </>
        )}
        {!isSearching &&
          rooms.map((room) =>
            room.isGroup ? (
              <GroupRoomCard room={room} key={room.id} />
            ) : (
              <RoomCard room={room} key={room.id} />
            )
          )}
      </div>
      <Outlet />
    </>
  );
};

const SearchInput = ({
  setIsSearching,
  searchRequest,
}: {
  setIsSearching: Dispatch<SetStateAction<boolean>>;
  searchRequest: any;
}) => {
  return (
    <div className="mb-5 bg-slate-700 mx-4 input flex align-middle items-center gap-4 focus-within:outline focus-within:outline-2 focus-within:outline-base-content/20 focus-within:outline-offset-2">
      <Search />
      <input
        className="bg-transparent w-full h-full focus:outline-none"
        type="search"
        name="search"
        placeholder="Search"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.value === "") {
            setIsSearching(false);
            return;
          }
          setIsSearching(true);
          searchRequest(e.target.value);
        }}
      />
    </div>
  );
};

const RoomCard = ({ room }: { room: Room }) => {
  const {
    state: { user },
  } = useContext(AuthContext);
  const receiver = room.members.find((member: any) => member.id !== user.id);
  const { data: response, isLoading } = useQuery({
    queryKey: ["messages", "last", room.id],
    queryFn: () => fetchLastMessage(room.id),
  });
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (response) {
      setLastMessage(response.data.messages[0]);
    }
  }, [response]);

  return (
    <NavLink
      to={"/chats/" + room.id}
      className={({ isActive }: { isActive: boolean }) =>
        `flex w-full gap-4 rounded-lg transition-colors p-4 hover:bg-slate-700 ${
          isActive && "bg-slate-700"
        }`
      }
      key={room.id}
    >
      {isLoading ? (
        <span className="loading loading-spinner"></span>
      ) : (
        <>
          <div className="avatar placeholder">
            <div className="w-12 h-12 rounded-full bg-gray-500">
              {receiver!.avatar && <img src={receiver!.avatar} />}
              {!receiver!.avatar && (
                <span className="text-xl">{receiver!.firstName[0]}</span>
              )}
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between w-full">
              <h3 className="text-lg text-white">{receiver!.fullName}</h3>
              <div className="flex gap-2">
                {lastMessage?.userId === user.id && (
                  <CheckCheck
                    color={lastMessage?.seenAt.length ? "#00caff" : "gray"}
                  />
                )}
                <span>{moment(lastMessage?.createdAt).fromNow(true)}</span>
              </div>
            </div>
            <div className="flex justify-between">
              {lastMessage?.media && (
                <span className="mr-1">
                  <Image />
                </span>
              )}
              <p className="w-56 h-5 overflow-hidden text-ellipsis whitespace-nowrap">
                {lastMessage?.text}
              </p>
              {room.unreadMessagesCount
                ? room.unreadMessagesCount > 0 && (
                    <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-center">
                      {room.unreadMessagesCount}
                    </span>
                  )
                : ""}
            </div>
          </div>
        </>
      )}
    </NavLink>
  );
};

const GroupRoomCard = ({ room }: { room: Room }) => {
  const {
    state: { user },
  } = useContext(AuthContext);

  return (
    <NavLink
      to={"/chats/" + room.id}
      className={({ isActive }: { isActive: boolean }) =>
        `flex w-full gap-4 rounded-lg transition-colors p-4 hover:bg-slate-700 ${
          isActive && "bg-slate-700"
        }`
      }
      key={room.id}
    >
      <>
        <div className="avatar placeholder">
          <div className="w-12 h-12 rounded-full bg-gray-500">
            <span className="text-xl">{room.name[0]}</span>
          </div>
        </div>
        <div className="w-full">
          <div className="flex justify-between w-full">
            <h3 className="text-lg text-white">{room.name}</h3>
            <div className="flex gap-2">
              {room.lastMessage?.userId === user.id && (
                <CheckCheck
                  color={room.lastMessage?.seenAt.length ? "#00caff" : "gray"}
                />
              )}
              <span>{moment(room.lastMessage?.createdAt).fromNow(true)}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="w-56 h-5 flex gap-2">
              {room.lastMessage?.media && (
                <span>
                  <Image />
                </span>
              )}
              <p className="w-56 h-5 overflow-hidden text-ellipsis whitespace-nowrap">
                {room.lastMessage?.text}
              </p>
            </div>
            {room.unreadMessagesCount
              ? room.unreadMessagesCount > 0 && (
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-center">
                    {room.unreadMessagesCount}
                  </span>
                )
              : ""}
          </div>
        </div>
      </>
    </NavLink>
  );
};

const SearchItem = ({
  searchItem,
  setIsSearching,
}: {
  searchItem: User;
  setIsSearching: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const addContactMutation = useMutation({
    mutationFn: addContact,
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSuccess: (response) => {
      const {
        data: { room },
      } = response;

      toast.success("Switching to chat room...");

      setIsSearching(false);

      queryClient.invalidateQueries(["rooms"]);

      navigate("/chats/" + room.id);
    },
  });

  return (
    <button
      className="flex w-full gap-4 rounded-lg transition-colors p-4 hover:bg-slate-700"
      onClick={() => addContactMutation.mutate(searchItem.id)}
    >
      <div className="avatar placeholder items-center">
        <div className="w-12 h-12 rounded-full bg-gray-500">
          {searchItem.avatar && <img src={searchItem.avatar} />}
          {!searchItem.avatar && (
            <span className="text-xl">{searchItem.fullName[0]}</span>
          )}
        </div>
      </div>
      <div className="col-span-4">
        <h4 className="text-lg text-white font-bold">{searchItem.fullName}</h4>
      </div>
    </button>
  );
};

export default ChatsList;
