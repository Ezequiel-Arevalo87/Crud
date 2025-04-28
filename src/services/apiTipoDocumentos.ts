import axios from "axios";
import { getToken} from "./authService";
const API_URL = import.meta.env.VITE_API_URL;
const apiBarberia = axios.create({
  
   baseURL: API_URL, // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
apiBarberia.interceptors.request.use(
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
const apiTipoDocumentos = {
  // Obtener lista de usuarios
  async getTiposDocumentos() {
    try {
      const response = await apiBarberia.get("/tipoDocumento");
      return response.data;
    } catch (error) {
      console.error("Error al obtener barberias", error);
      throw error;
    }
  },
};

export default apiTipoDocumentos;
