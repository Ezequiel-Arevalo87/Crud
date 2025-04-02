import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../services/authService";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = sessionStorage.getItem("token");
  const userRole:any = getUserRole();

  // Verifica si el usuario tiene un token y su rol está en los permitidos
  const isAuthorized = token && allowedRoles.includes(userRole?.role);

  return isAuthorized ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
