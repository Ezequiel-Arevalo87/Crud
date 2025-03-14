import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserRole } from '../services/authService';

const Navbar = () => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const rol:any = getUserRole();
  const location = useLocation();
  const navigate = useNavigate(); // Para redirigir sin recargar la página

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
  }, [location.pathname]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
    navigate("/login"); // Redirige sin recargar
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

          {(token && rol.role !== 'Clinte') && (
            <Button color="inherit" component={Link} to="/usuarios">
              Usuarios
            </Button>
          )}

          {token ? (
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
