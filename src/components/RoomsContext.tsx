import { fetchRooms, Room } from "@/api/room";
import { useQuery } from "@tanstack/react-query";
import {
  useReducer,
  useContext,
  ReactNode,
  createContext,
  useEffect,
  Dispatch,
} from "react";
import { AuthContext } from "./AuthProvider";

type Action = {
  type: string;
  payload?: any;
};

type State = Room[];

const reducer = (state: State, action: Action) => {
  let { roomId, message } = action.payload;
  switch (action.type) {
    case "ADD_ROOMS":
      return [...action.payload];
    case "INCREMENT_UNREAD_COUNT":
      return state.map((room) => {
        if (room.id === roomId) {
          return { ...room, unreadMessagesCount: room.unreadMessagesCount++ };
        }
        return room;
      });
    case "DECREMENT_UNREAD_COUNT":
      return state.map((room) => {
        if (room.id === roomId) {
          return { ...room, unreadMessagesCount: room.unreadMessagesCount-- };
        }
        return room;
      });
    case "SET_LAST_MESSAGE":
      return state.map((room) => {
        if (room.id === roomId) {
          return { ...room, lastMessage: message };
        }
        return room;
      });
    default:
      throw new Error("unknown action type!");
  }
};

type RoomsContext = {
  state: Room[];
  dispatch: Dispatch<any>;
};

export const roomsContext = createContext<RoomsContext>({
  state: [],
  dispatch: () => null,
});

const RoomsContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, []);
  const {
    state: { user },
  } = useContext(AuthContext);

  const { isLoading, data: response } = useQuery({
    queryKey: ["rooms", user.id],
    queryFn: fetchRooms,
  });

  useEffect(() => {
    if (response) {
      dispatch({ type: "ADD_ROOMS", payload: response.data.rooms });
    }
  }, [response]);

  return isLoading ? (
    <span className="loading loading-spinner"></span>
  ) : (
    <roomsContext.Provider value={{ state, dispatch }}>
      {children}
    </roomsContext.Provider>
  );
};

export default RoomsContextProvider;
