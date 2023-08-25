import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <ProtectedRoute>
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </ProtectedRoute>
  );
};

export default Home;
