import RoomsContextProvider from "@/components/RoomsContext";
import Sidebar from "@/components/Sidebar";
import SocketProvider from "@/components/SocketProvider";
import { Toaster } from "react-hot-toast";
import { Outlet, Navigate } from "react-router-dom";

const Home = () => {
  return (
    <SocketProvider>
      <Toaster
        toastOptions={{
          error: { style: { color: "white", background: "#2e3741" } },
          position: "top-right",
        }}
      />
      <RoomsContextProvider>
        <Sidebar />
        <div className="pl-24 pt-4 grid grid-cols-7 h-screen">
          <Navigate to="/chats" />
          <Outlet />
        </div>
      </RoomsContextProvider>
    </SocketProvider>
  );
};

export default Home;
