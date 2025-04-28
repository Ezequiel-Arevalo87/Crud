import axios from "axios";
import { getToken} from "./authService";
const API_URL = import.meta.env.VITE_API_URL;
const apiServicios = axios.create({

   baseURL: API_URL, // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
apiServicios.interceptors.request.use(
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
const apiServiciosService = {

   async getServicios() { // <-- Asegurar que el ID es un número
    try {
      const response = await apiServicios.get(`service`); // <-- Corrección en la URL
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios del barbero", error);
      throw error;
    }
  },
   async getMisServicios() { // <-- Asegurar que el ID es un número
    try {
      const response = await apiServicios.get(`service/mis-servicios`); // <-- Corrección en la URL
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios del barbero", error);
      throw error;
    }
  },
  
   async getServiciosPorBarbero(id:number) { // <-- Asegurar que el ID es un número
    try {
      const response = await apiServicios.get(`/Service/barbero/${id}`); // <-- Corrección en la URL
      return response.data;
    } catch (error) {
      console.error("Error al obtener servicios del barbero", error);
      throw error;
    }
  },
  

 // Crear barbero
  async postServicio(data: any) {
    try {
      const response = await apiServicios.post("/service", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear el servicio", error);
      throw error;
    }
  },

  // Actualizar usuario
  async putServicioPorId(id: string, data: any) {
    try {
      const response = await apiServicios.put(`/service/${id}`, data);
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

export default apiServiciosService;
