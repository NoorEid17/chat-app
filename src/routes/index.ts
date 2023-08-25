import Home from "@/pages/Home";
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
    Component: Home,
    children: [
      {
        path: "/settings",
        Component: Settings,
      },
    ],
  },
  {
    path: "/logout",
    Component: Logout,
  },
]);

export default router;
