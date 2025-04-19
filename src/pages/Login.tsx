import { useForm, Controller } from "react-hook-form";
import { TextField, Button, IconButton, InputAdornment, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../services/apiLoginService";
import { useNavigate } from "react-router-dom";
import SwalAlert from "../components/alerts/SwalAlert";

import RegistrarCliente from "./RegistrarCliente";
import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";
import { getUserId, getUserRole } from "../services/authService";
import { obtenerToken } from "../services/firebaseMessagingService";
import { registrarTokenNotificaciones } from "../services/registrarToken";


const Login = () => {
  const { control, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const { verRegistro, setVerRegistro } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    try {
      await login(e.correo, e.clave);
  
      // ✅ Obtenemos los datos del token JWT
      const usuarioId = getUserId();      // ej. 1
      const rol = getUserRole();          // ej. "Barbero"
  
      // ✅ Solo si es barbero, obtenemos y registramos el token de Firebase
      if (rol?.toLowerCase() === "barbero" && usuarioId) {
        const tokenFirebase = await obtenerToken();
        if (tokenFirebase) {
          await registrarTokenNotificaciones(tokenFirebase, usuarioId);
          console.log("🎯 Token Firebase registrado para barbero", usuarioId);
        }
      }
  
      // ✅ Navegar al home
      navigate("/");
    } catch (error: any) {
      SwalAlert.errorInicioSesion("Error Login", "Correo o contraseña incorrectos");
    }
  };
  
 

  return (
    <>
      {!verRegistro ? (
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, mx: "auto", mt: 4 }}
        >
          <Controller
            name="correo"
            control={control}
            defaultValue=""
            rules={{
              required: "El correo es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Correo inválido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField {...field} label="Correo" variant="outlined" fullWidth error={!!error} helperText={error?.message} />
            )}
          />

          <Controller
            name="clave"
            control={control}
            defaultValue=""
            rules={{
              required: "La contraseña es obligatoria",
              minLength: { value: 6, message: "Mínimo 6 caracteres" },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit(handleLogin)}>
            Iniciar sesión
          </Button>

        

          <Button variant="outlined" color="secondary" onClick={() => setVerRegistro(true)}>
            Registrar
          </Button>
        </Box>
      ) : (
        <RegistrarCliente />
      )}
    </>
  );
};

export default Login;
