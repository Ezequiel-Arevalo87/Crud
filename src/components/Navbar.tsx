import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserRole } from '../services/authService';
import SwalAlert from "./alerts/SwalAlert";


const Navbar = () => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const rol:any = getUserRole();
  const location = useLocation();
  const navigate = useNavigate(); // Para redirigir sin recargar la página

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, [location.pathname, token]);

  const handleLogout = async() => {
    
    const result = await SwalAlert.confirCerrarSesion("¿Estás seguro?", "Cerrar sesion");
    if(result.isConfirmed){
      setToken(null);
    sessionStorage.removeItem("token");
    
    navigate("/", { state: { mensaje: "OK" } });
    }

    console.log('rol',rol)
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {rol?.email}
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>

          {(token && rol.role !== 'Cliente') && (
            <Button color="inherit" component={Link} to="/barberias">
              Barberias
            </Button>
          )}

          {rol ? (
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
