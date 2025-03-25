import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../services/authService";

const ProtectedRoute = () => {
  const token = sessionStorage.getItem("token");
  const rol:any = getUserRole()

  return token && rol.role !=='Cliente' ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
