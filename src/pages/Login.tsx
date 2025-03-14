import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, IconButton, InputAdornment, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../services/apiLoginService";
import { useNavigate } from "react-router-dom";
import SwalAlert from "../components/alerts/SwalAlert";


const Login = () => {
  const { control, handleSubmit, } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  

  const handleLogin = async (e: any) => {
    try {
      await login(e.correo, e.clave);
      navigate("/"); // Redirige al home después de iniciar sesión
    } catch (error:any) {
      SwalAlert.errorInicioSesion('Error Login', "Correo o contraseña incorrectos")

  
    }
  };
  

  return (
    <Box
      component="form"
      
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, mx: "auto", mt: 4 }}
    >
      {/* Campo Email */}
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
          <TextField
            {...field}
            label="Correo"
            variant="outlined"
            fullWidth
            error={!!error}
            helperText={error ? error.message : ""}
          />
        )}
      />

      {/* Campo Password */}
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
            helperText={error ? error.message : ""}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          )} 
          />
      {/* Botón de Login */}
      <Button type="submit" variant="contained" color="primary"
      onClick={handleSubmit(handleLogin)  }>
        Iniciar sesión
      </Button>
    </Box>
  );
};

export default Login;
