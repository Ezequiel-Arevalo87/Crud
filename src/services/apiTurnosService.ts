import axios from "axios";
import { getToken} from "./authService";
const API_URL = import.meta.env.VITE_API_URL;
const apiTurno = axios.create({
  
   baseURL: API_URL, // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
apiTurno.interceptors.request.use(
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


const apiTurnosService = {

 async getTurnos(id: number) {
    try {
        const response = await apiTurno.get(`Turno?barberoId=${id}`); // <-- Corrección en la URL ?barberoId=1
        return response.data;
      } catch (error) {
        console.error("Error al obtener barberos de la barbería", error);
        throw error;
      }
  },

 async cancelarTurno(data: any) {
    try {
        const response = await apiTurno.put(`Turno/cancelar`, data); 
        return response.data;
      } catch (error) {
        console.error("Error al cancelar turno", error);
        throw error;
      }
  }

};



export default apiTurnosService;
