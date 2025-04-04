import axios from "axios";
import { getToken} from "./authService";

const apiHorarioBarberia = axios.create({
  baseURL: "https://localhost:7238/api", // Reemplaza con tu URL real
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
apiHorarioBarberia.interceptors.request.use(
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


const apiHorariosBarberiaService = {




 // Crear barbero
 async postHorarioBarberia(data: any) {
    try {
      const response = await apiHorarioBarberia.post("/horario", data, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error al crear horario barberia", error);
      throw error;
    }
  }

};

export default apiHorariosBarberiaService;
