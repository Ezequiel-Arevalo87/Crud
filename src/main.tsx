import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { obtenerToken } from "./services/firebaseMessagingService";
import { AuthProvider } from "./components/context/AuthContext";
import "./index.css";
import { ThemeProvider } from "@mui/material";
import theme from "./components/theme/theme";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
     <ThemeProvider theme={theme}>
    <AuthProvider> {/* Envuelve la app con el proveedor de autenticación */}
      <App />
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);




// Solicitar permisos de notificación
// Solicitar permisos de notificación
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
   
    obtenerToken();

  } else {
    console.warn("Permiso de notificación denegado");
  }
});

