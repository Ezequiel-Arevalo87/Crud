import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { obtenerToken } from "./services/firebaseMessagingService";
import { AuthProvider } from "./components/context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider> {/* Envuelve la app con el proveedor de autenticación */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);




// Solicitar permisos de notificación
// Solicitar permisos de notificación
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Permiso de notificación concedido");

    
    // Llamar a obtenerToken() después de que el usuario haya concedido el permiso
    obtenerToken();

  } else {
    console.warn("Permiso de notificación denegado");
  }
});

