import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import {
  createContext,
  useEffect,
  useReducer,
  useState,
  type Dispatch,
  type ReactNode,
} from "react";
import { refreshToken } from "@/api/user";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state: any, action: any) => {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export type AuthContext = {
  state: {
    isAuthenticated: boolean;
    user: any;
  };
  dispatch: Dispatch<any>;
};

export const AuthContext = createContext<AuthContext>({
  state: initialState,
  dispatch: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const { error, data: response } = useQuery({
    queryKey: ["users", "token"],
    queryFn: async () => await refreshToken(),
    refetchInterval: 15 * 60 * 1000,
    retry: 0,
  });

  useEffect(() => {
    if (response) {
      const token = response?.data.token;
      axios.defaults.headers["Authorization"] = `bearer ${token}`;
      setIsLoading(false);
      dispatch({ type: "LOGIN", payload: jwtDecode(token) });
      return;
    }
    if (error) {
      dispatch({ type: "LOGOUT" });
      setTimeout(() => setIsLoading(false), 2000);
      return;
    }
  }, [response, error]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {isLoading ? (
        <span className="loading loading-spinner loading-lg block mt-20 mx-auto"></span>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
