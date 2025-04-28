import axios from "axios";
import { getToken} from "./authService";
const API_URL = import.meta.env.VITE_API_URL;
const apiBarbero = axios.create({
  
   baseURL:API_URL, // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
apiBarbero.interceptors.request.use(
  (config) => {
    const token = getToken();
    

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const apiBarberoService = {

   // Obtener un barberos  por ID de barberia
   async getBarberoPorBarberia(id: number) { // <-- Asegurar que el ID es un número
    try {
      const response = await apiBarbero.get(`barbero/barberia/${id}`); // <-- Corrección en la URL
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberos de la barbería", error);
      throw error;
    }
  },
  
   async getBarberoPorSucursal(id: number) { // <-- Asegurar que el ID es un número
    try {
      const response = await apiBarbero.get(`barbero/sucursal/${id}`); // <-- Corrección en la URL
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberos de la barbería", error);
      throw error;
    }
  },
  

 // Crear barbero
  async postBarbero(data: any) {
    try {
      const response = await apiBarbero.post("/barbero", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear barberia", error);
      throw error;
    }
  },

 
  async putBarbero(id: string, data: any) {
    try {
      const response = await apiBarbero.put(`/barbero/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar barberia", error);
      throw error;
    }
  },

  // Eliminar usuario
//   async deleteBarberia(id: string) {
//     try {
//       const response = await apiBarberia.delete(`/barberias/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error al eliminar barberia", error);
//       throw error;
//     }
//   },
};

export default apiBarberoService;
