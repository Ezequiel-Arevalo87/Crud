import React, { useEffect, useState } from "react";
import useNotification from "./useNotification";
import { Alert, Snackbar } from "@mui/material";
import { useTurnos } from "../context/TurnosContext"; // ✅ Importa el contexto

const NotificationComponent: React.FC = () => {
  const notification: any = useNotification();
  const [open, setOpen] = useState(false);

  const { agregarTurno } = useTurnos(); // ✅ Usa la función de contexto

  useEffect(() => {
    if (notification) {
      setOpen(true);

      // Si contiene datos, agregarlos al Contexto
      if (notification.data) {
        const data = notification.data;

        const nuevoTurno = {
          id: Number(data.id),
          barberoId: Number(data.barberoId),
          clienteNombre: data.clienteNombre,
          clienteApellido: data.clienteApellido,
          servicioNombre: data.servicioNombre,
          fechaHoraInicio: data.fechaHoraInicio,
          duracion: data.duracion,
          estado: Number(data.estado),
          motivoCancelacion: data.motivoCancelacion || "",
        };

        agregarTurno(nuevoTurno); // ✅ Agrega al contexto
      }

      const timer = setTimeout(() => {
        setOpen(false);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [notification, agregarTurno]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={() => setOpen(false)} severity="info">
        <strong>{notification?.title}</strong>
        <p>{notification?.body}</p>
      </Alert>
    </Snackbar>
  );
};

export default NotificationComponent;
