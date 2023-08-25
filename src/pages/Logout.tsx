import { logout } from "@/api/user";
import { AuthContext } from "@/components/AuthProvider";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function logoutAction() {
      logout().then(() => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
      });
    }
    logoutAction();
  }, []);
  return (
    <span className="loading loading-spinner loading-lg mx-auto mt-20 block"></span>
  );
};

export default Logout;
