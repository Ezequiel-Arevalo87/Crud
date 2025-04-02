import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserRole } from "../services/authService";
import SwalAlert from "./alerts/SwalAlert";

const Navbar = () => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate(); // Para redirigir sin recargar la página
  const roles:any = getUserRole();
  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    const role:any = getUserRole();
    setUserRole(role?.role);
  }, [location.pathname]);

  const handleLogout = async () => {
    const result = await SwalAlert.confirCerrarSesion("¿Estás seguro?", "Cerrar sesión");
    if (result.isConfirmed) {
      sessionStorage.removeItem("token");
      setToken(null);
      setUserRole(null);
      navigate("/", { state: { mensaje: "OK" } });
    }

  };

  return (
    <AppBar position="static">
      <Toolbar>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {userRole ? `Bienvenido, ${roles?.email} - ${userRole}` : "BarberApp"}
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {(token && userRole  === 'Barbero') && (
            <Button color="inherit" component={Link} to="/barbero">
              Barbero
            </Button>
          )}

          {(token && userRole  !== 'Barbero') && (
            <Button color="inherit" component={Link} to="/barberias">
              Barberias
            </Button>
          )}

          {userRole  ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
