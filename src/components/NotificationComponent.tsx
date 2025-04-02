import React, { useEffect, useState } from "react";
import useNotification from "./useNotification";
import { Alert, Snackbar } from "@mui/material";

interface NotificationComponentProps {
  onNewTurno?: (turnoData: any) => void;
}

const NotificationComponent: React.FC<NotificationComponentProps> = ({ onNewTurno }) => {
  const notification:any = useNotification();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (notification) {
      setOpen(true);

      // Si contiene datos, enviarlos
      if (notification.data && onNewTurno) {
        onNewTurno(notification.data);
      }

      const timer = setTimeout(() => {
        setOpen(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
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