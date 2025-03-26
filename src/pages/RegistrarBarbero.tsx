import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import apiBarberoService from "../services/aoiBarberoService";

const RegistrarBarbero = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const id = location.state?.id; // Obtenemos el ID de `state`

    const [listaBarberos, setListadosBarberos] = useState([])

    useEffect(() => {
       
        if (!id) {
            navigate("/barberias"); // Redirige si no hay ID
        }
        obtenerBarberosPorBarberias()
    }, [id, navigate]);


    const obtenerBarberosPorBarberias = async() => {
        try {
        const data = await apiBarberoService.getBarberoPorBarberia(id);
        setListadosBarberos(data)
        console.log({data})
        console.log({listaBarberos})
     
          } catch (error) {
            console.error("Error al obtener barberos por id", error);
          }
    }

    return id ? (
        <div>
            <h2>Registrar Barbero</h2>
            <p>Registrando barbero con ID: {id}</p>
            
        </div>
    ) : null;
};

export default RegistrarBarbero;
