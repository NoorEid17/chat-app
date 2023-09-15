import ChatsList from "@/components/ChatsList";
import ChatViewer from "@/components/ChatViewer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "@/pages/Home";
import Invitations from "@/pages/Invitations";
import Logout from "@/pages/Logout";
import Settings from "@/pages/Settings";
import Signup from "@/pages/Signup";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/chats",
        Component: ChatsList,
        children: [
          {
            path: "/chats/:roomId",
            Component: ChatViewer,
          },
        ],
      },
      {
        path: "/settings",
        Component: Settings,
      },
      {
        path: "/invitations",
        Component: Invitations,
      },
    ],
  },
  {
    path: "/logout",
    Component: Logout,
  },
]);

export default router;
