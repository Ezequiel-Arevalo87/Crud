import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RegistrarBarbero = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state?.id; // Obtenemos el ID de `state`

    useEffect(() => {
       
        if (!id) {
            navigate("/barberias"); // Redirige si no hay ID
        }
    }, [id, navigate]);

    return id ? (
        <div>
            <h2>Registrar Barbero</h2>
            <p>Registrando barbero con ID: {id}</p>
        </div>
    ) : null;
};

export default RegistrarBarbero;
