import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDecodedToken, getUserRole } from "../services/authService";
import SwalAlert from "./alerts/SwalAlert";

const Navbar = () => {
  const [token, setToken] = useState(sessionStorage.getItem("token"));
  const [userRole, setUserRole] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  const navigate = useNavigate();

  

  useEffect(() => {
    setToken(sessionStorage.getItem("token"));
    const role = getUserRole();
    setUserRole(role);
  }, [location.pathname]);
  
  const decoded = getDecodedToken();
  const email = decoded?.email;

  const handleLogout = async () => {
    const result = await SwalAlert.confirCerrarSesion(
      "¿Estás seguro?",
      "Cerrar sesión"
    );
    if (result.isConfirmed) {
      sessionStorage.removeItem("token");
      setToken(null);
      setUserRole(null);
      navigate("/", { state: { mensaje: "OK" } });
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: "Home", to: "/" },
    ...(token && userRole === "Barbero"
      ? [{ label: "Barbero", to: "/barbero" }]
      : token
      ? [{ label: "Barberías", to: "/barberias" }]
      : []),
    userRole
      ? { label: "Logout", action: handleLogout }
      : { label: "Login", to: "/login" },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: "#13487a" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
       {isMobile ? <Typography variant="h6" component="div">
          {`Hola, ${email}`}
        </Typography>: <Typography variant="h6" component="div">
        {userRole ? `Hola, ${email} (${userRole})` : "BarberApp"}
        </Typography>}

        {isMobile ? (
          
          <>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {menuItems.map((item, index) =>
                item.action ? (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      handleMenuClose();
                      item.action();
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ) : (
                  <MenuItem
                    key={index}
                    component={Link}
                    to={item.to}
                    onClick={handleMenuClose}
                  >
                    {item.label}
                  </MenuItem>
                )
              )}
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            {menuItems.map((item, index) =>
              item.action ? (
                <Button
                  key={index}
                  color="inherit"
                  onClick={item.action}
                  sx={{ textTransform: "none" }}
                >
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={index}
                  color="inherit"
                  component={Link}
                  to={item.to}
                  sx={{ textTransform: "none" }}
                >
                  {item.label}
                </Button>
              )
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
