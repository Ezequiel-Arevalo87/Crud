import axios from "axios";

// ✅ Lee la base URL desde el entorno (.env)
const API_URL = import.meta.env.VITE_API_URL;

export const registrarTokenNotificaciones = async (
  tokenFirebase: string,
  usuarioId: number
): Promise<void> => {
  try {
    await axios.post(`${API_URL}/barbero/registrar-token-usuario`, {
      usuarioId,
      token: tokenFirebase,
    });

    console.log("✅ Token Firebase registrado correctamente");
  } catch (error) {
    console.error("❌ Error al registrar token Firebase:", error);
  }
};
