import axios from "axios";

// export const registrarTokenNotificaciones = async (
//   tokenFirebase: string,
//   barberoId: number
// ): Promise<void> => {
//   try {
//     await axios.put("https://localhost:7238/api/barbero/registrar-token", {
//       barberoId,
//       token: tokenFirebase,
//     });
//     console.log("✅ Token Firebase registrado correctamente");
//   } catch (error) {
//     console.error("❌ Error al registrar token Firebase:", error);
//   }
// };

export const registrarTokenNotificaciones = async (
  tokenFirebase: string,
  usuarioId: number
): Promise<void> => {
  try {
     await axios.post("https://backend-barberias-1.onrender.com/api/barbero/registrar-token-usuario", {
    // await axios.post("baseURL:'http://localhost:7238/api/barbero/registrar-token-usuario", {
      usuarioId,
      token: tokenFirebase,
    });
    console.log("✅ Token Firebase registrado correctamente");
  } catch (error) {
    console.error("❌ Error al registrar token Firebase:", error);
  }
};