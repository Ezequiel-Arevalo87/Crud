

import axios from "axios";
import { setToken } from "./authService";

const apiLoginService = axios.create({
  baseURL: "https://localhost:7238/api/Auth/login", // Reemplaza con tu URL real
  headers: { "Content-Type": "application/json" },
});

const apiLoginServiceBarberia = axios.create({
  baseURL: "https://localhost:7238/api/Auth/loginBarberia", // Reemplaza con tu URL real
  headers: { "Content-Type": "application/json" },
});
const apiLoginServiceBarbero = axios.create({
  baseURL: "https://localhost:7238/api/Auth/loginBarbero", // Reemplaza con tu URL real
  headers: { "Content-Type": "application/json" },
});

export const login = async (correo: string, clave: string) => {
  try {
    const response = await apiLoginService.post("", { correo, clave });

    if (response.data?.token) {
      setToken(response.data.token); // Guarda el token en sessionStorage
      return response.data;
    }

    // Verifica si el mensaje indica que los datos no fueron encontrados
    if (response.data?.mensaje === "Datos no encontrados") {
      console.warn("Intentando loginBarbero...");
      const responseBarberia = await apiLoginServiceBarberia.post("", { correo, clave });

      if (responseBarberia.data?.token) {
        setToken(responseBarberia.data.token); // Guarda el token en sessionStorage
        return responseBarberia.data;
      }

      if(response.data?.mensaje === "Datos no encontrados"){
        const responseBarbero = await apiLoginServiceBarbero.post("", { correo, clave });

      if (responseBarbero.data?.token) {
        setToken(responseBarbero.data.token); // Guarda el token en sessionStorage
        return responseBarbero.data;
      }
      }



      
    }

    throw new Error(response.data?.mensaje || "Error desconocido");
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error);

    let errorMessage = "Error desconocido al iniciar sesión";
    if (error.response) {
      errorMessage = error.response.data?.mensaje || "Credenciales incorrectas";
    } else if (error.request) {
      errorMessage = "No se recibió respuesta del servidor";
    } else {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
};


