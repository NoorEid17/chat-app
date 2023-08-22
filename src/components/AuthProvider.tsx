import { useQuery } from "@tanstack/react-query";
import jwtDecode from "jwt-decode";
import {
  createContext,
  useEffect,
  useReducer,
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
  const {
    error,
    data: response,
    isLoading,
  } = useQuery({
    queryKey: ["users", "token"],
    queryFn: async () => await refreshToken(),
  });

  useEffect(() => {
    if (!response) {
      return;
    }
    const token = response?.data.token;
    axios.defaults.headers["Authorization"] = `bearer ${token}`;
    if (response?.statusText !== "OK") {
      dispatch({ type: "LOGOUT" });
      return;
    }
    dispatch({ type: "LOGIN", payload: jwtDecode(token) });
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
