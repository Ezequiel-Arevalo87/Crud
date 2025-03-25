import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Barberias from "../pages/Barberias";
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import RegistrarBarbero from "../pages/RegistrarBarbero";
import CrearBarberia from "../pages/CrearBarberia";


const AppRouter = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/barberias" element={<Barberias />} />
        </Route>
        <Route path="/registrar-barbero" element={<RegistrarBarbero />} />
        <Route path="/crear-barberia" element = {<CrearBarberia/>}/>

      </Routes>
    </Router>
  );
};

export default AppRouter;
