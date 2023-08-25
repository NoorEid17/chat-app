import { Bell, LogOut, MessagesSquare, Settings } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const Sidebar = () => {
  const {
    state: { user },
  } = useContext(AuthContext);

  return (
    <nav className="flex flex-col gap-8 fixed top-0 left-0 h-screen bg-base-200 px-2 items-center">
      <div className="mt-4 mb-8">
        <span className="text-2xl font-bold">CA</span>
      </div>
      <NavLink
        to={`/user/${user.username}`}
        className={({ isActive }: { isActive: boolean }) =>
          `flex flex-col items-center ${isActive && "text-white"}`
        }
      >
        <div className="avatar placeholder">
          <div className="w-10 rounded-full bg-gray-500">
            {user.avatar && <img src={user.avatar} />}
            {!user.avatar && (
              <span className="text-xl">{user.firstName[0]}</span>
            )}
          </div>
        </div>
      </NavLink>
      <NavLink
        to="/"
        className={({ isActive }: { isActive: boolean }) =>
          `flex flex-col items-center ${isActive && "text-white"}`
        }
      >
        <MessagesSquare />
        <span className="text-sm">All chats</span>
      </NavLink>
      <NavLink
        to="/notifications"
        className={({ isActive }: { isActive: boolean }) =>
          `flex flex-col items-center ${isActive && "text-white"}`
        }
      >
        <Bell />
        <span className="text-sm">Notifications</span>
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }: { isActive: boolean }) =>
          `flex flex-col items-center ${isActive && "text-white"}`
        }
      >
        <Settings />
        <span className="text-sm">Settings</span>
      </NavLink>
      <NavLink
        to="/logout"
        className={({ isActive }: { isActive: boolean }) =>
          `flex flex-col items-center mt-auto mb-4 ${
            isActive && "text-red-400"
          }`
        }
      >
        <LogOut />
      </NavLink>
    </nav>
  );
};

export default Sidebar;
