import React from "react";
import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./components/context/AuthContext";
import NotificationComponent from "./components/NotificationComponent";
import { registerServiceWorker } from "./services/serviceWorker";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("🧨 Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Algo salió mal. Por favor recarga la página.</h2>;
    }
    return this.props.children;
  }
}

const App = () => {
  const handleNuevoTurno = (turnoData: any) => {
    window.dispatchEvent(new CustomEvent("nuevo-turno", { detail: turnoData }));
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationComponent onNewTurno={handleNuevoTurno} />
        <AppRouter />
      </AuthProvider>
    </ErrorBoundary>
  );
};

registerServiceWorker();

export default App;
