import { useForm, Controller } from "react-hook-form";
import { TextField, Button, IconButton, InputAdornment, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useAuth } from "../components/context/AuthContext";


const RegistrarCliente = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      nombre: "",
      tipoDocumento: "",
      numeroDocumento: "",
      fechaNacimiento: "",
      correo: "",
      clave: "",
      confirmarClave: "",
    },
  });

  const { setVerRegistro } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (data: any) => {
    console.log("Datos registrados:", data);
    setVerRegistro(false); // Regresar al login
  };

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, mx: "auto", mt: 4 }}
    >
      <Controller 
      name="nombre" 
      control={control} 
      render={({ field }) =>
       <TextField {...field} 
       label="Nombre" 
       fullWidth />} />

      <Controller 
      name="correo" 
      control={control} 
      render={({ field }) => 
      <TextField {...field} 
      label="Correo" 
      fullWidth />} />

      <Controller
        name="clave"
        control={control}
        rules={{
          required: "La contraseña es obligatoria",
          minLength: { value: 8, message: "Mínimo 8 caracteres" },
          pattern: { value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, message: "Debe incluir números y caracteres especiales" },
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Contraseña"
            type={showPassword ? "text" : "password"}
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

      <Button variant="contained" color="primary" onClick={handleSubmit(handleRegister)}>
        Registrar
      </Button>

      <Button variant="outlined" color="secondary" onClick={() => setVerRegistro(false)}>
        Volver al login
      </Button>
    </Box>
  );
};

export default RegistrarCliente;
