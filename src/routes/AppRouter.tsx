import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Barberias from "../pages/Barberias";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import RegistrarBarbero from "../pages/RegistrarBarbero";
import CrearBarberia from "../pages/CrearBarberia";
import CrearBarberos from "../pages/CrearBarberos";
import ServiciosBarbero from "../pages/ServiciosBarbero";
import CrearServicioBarbero from "../pages/CrearServicioBarbero";
import HorariosBarberia from "../pages/HorariosBarberia";
import NavigationBreadcrumbs from "../components/NavigationBreadcrumbs";
import BarberPage from "../components/PagesBarbero/BarberPage";

const AppRouter = () => {
  return (
    <Router>

      <Navbar />

      <NavigationBreadcrumbs/>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />


        <Route element={<ProtectedRoute allowedRoles={["Admin", "Super_Admin"]} />}>
          <Route path="/barberias" element={<Barberias />} />
        </Route>

     
        <Route element={<ProtectedRoute allowedRoles={["Super_Admin", "Admin"]} />}>
          <Route path="/registrar-barbero" element={<RegistrarBarbero />} />
          <Route path="/crear-barberia" element={<CrearBarberia />} />
          <Route path="/crear-barbero" element={<CrearBarberos />} />
        </Route>

        {/* Rutas exclusivas para "Barbero" */}

        <Route element={<ProtectedRoute allowedRoles={["Barbero"]} />}>
        <Route path="/barbero" element={<BarberPage />} />

        </Route>

        <Route element={<ProtectedRoute allowedRoles={["Super_Admin", "Admin"]} />}>
          <Route path="/servicios-barbero" element={<ServiciosBarbero />} />
          <Route path="/crear-servicio-barbero" element={<CrearServicioBarbero />} />
          <Route path="/horario-barberia" element={<HorariosBarberia/>} />
        </Route>

        {/* Redirección para rutas no existentes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
