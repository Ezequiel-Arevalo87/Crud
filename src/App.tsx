import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./components/context/AuthContext"; // Asegúrate de importar correctamente

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
