import { fetchInvitations } from "@/api/invitation";
import { useQuery } from "@tanstack/react-query";
import { LogOut, MessagesSquare, Settings, Users } from "lucide-react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

const Sidebar = () => {
  const {
    state: { user },
  } = useContext(AuthContext);
  const { data: invitations } = useQuery({
    queryKey: ["invitations"],
    queryFn: fetchInvitations,
  });

  return (
    <nav
      className={`flex flex-col gap-8 fixed sm:top-0 left-0 h-screen bg-base-200 px-2 items-center w-24`}
    >
      <div className="mt-4 mb-8">
        <span className="text-2xl font-bold cursor-pointer text-white brightness-150">
          CA
        </span>
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
        to="/chats"
        className={({ isActive }: { isActive: boolean }) =>
          `flex flex-col items-center ${isActive && "text-white"}`
        }
      >
        <MessagesSquare />
        <span className="text-sm">All chats</span>
      </NavLink>
      <NavLink
        to="/invitations"
        className={({ isActive }: { isActive: boolean }) =>
          `flex flex-col items-center ${isActive && "text-white"}`
        }
      >
        <div className="indicator">
          {invitations && invitations.length > 0 && (
            <span className="indicator-item badge badge-primary">
              {invitations.length}
            </span>
          )}
          <Users />
        </div>
        <span className="text-sm">Invitations</span>
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
