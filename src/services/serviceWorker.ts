export const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("📢 Service Worker registrado correctamente:", registration);
        })
        .catch((error) => {
          console.error("⚠️ Error al registrar el Service Worker:", error);
        });
    }
  };
  