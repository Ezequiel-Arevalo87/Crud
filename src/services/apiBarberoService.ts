import axios from "axios";
import { getToken} from "./authService";

const apiBarbero = axios.create({
  // baseURL:'http://localhost:7238/api',
   baseURL: "https://backend-barberias-1.onrender.com/api", // Reemplaza con tu URL real
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

// Métodos API con autenticación
const apiBarberoService = {
  // Obtener lista de usuarios
//   async getBarberias() {
//     try {
//       const response = await apiBarberia.get("/barberias");
//       return response.data;
//     } catch (error) {
//       console.error("Error al obtener barberias", error);
//       throw error;
//     }
//   },

  // Obtener un usuario por ID
//   async getBarberiaById(id: string) {
//     try {
//       const response = await apiBarberia.get(`/barberias/${id}`);
//       return response.data;
//     } catch (error) {
//       console.error("Error al obtener barberia", error);
//       throw error;
//     }
//   },

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
