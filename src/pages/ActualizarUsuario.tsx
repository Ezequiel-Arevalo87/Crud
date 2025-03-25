import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import SwalAlert from "../components/alerts/SwalAlert";
import apiService from "../services/api";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface ActualizarUsuarioProps {
  barberias: any;
  formularioActualizar: any;
  fetchUsuarios: any;
  setActualizarDatosBarberias: any;
}


const ActualizarUsuario: React.FC<ActualizarUsuarioProps> = ({ barberias, formularioActualizar, fetchUsuarios, setActualizarDatosBarberias }) => {

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    
    formularioActualizar.setValue('nombre', barberias[0].nombre)
    formularioActualizar.setValue('correo', barberias[0].correo)
    formularioActualizar.setValue('descripcion', barberias[0].descripcion)
  }, [])

  const actualizarUsuaio = async (data: any) => {
    const result = await SwalAlert.confirActualizar("¿Estás seguro?", "Esta acción actualiza los datos anteriores");
    const request = {
      nombre: data?.nombre,
      correo: data?.correo,
      clave: data?.clave,
      descripcion: data?.descripcion
    }
    const id = barberias[0].id

    if (result.isConfirmed) {
      try {
        await apiService.putUsuario(id, request);

        fetchUsuarios()
        SwalAlert.success("Usuario actualizado", "El usuario ha sido actualizado");
        setActualizarDatosBarberias('')
      } catch (error) {
        console.error("Error al actualizar usuario", error);
        SwalAlert.error("Error", "Hubo un problema al actualizar el usuario");
      }
    }
  }

  const cancelar = () => {
    fetchUsuarios()
    setActualizarDatosBarberias('')
  }

  return (
    <Box
      component="form"
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, mx: "auto", mt: 4 }}
    >
      {/* Campo Nombre */}
      <Controller
        name="nombre"
        control={formularioActualizar.control}
        rules={{ required: "El nombre es obligatorio" }}
        render={({ field, fieldState: { error } }) => (
          <TextField {...field}
            label="Nombre"
            variant="outlined"
            fullWidth error={!!error}
            helperText={error?.message} />
        )}
      />

      {/* Campo Email */}
      <Controller
        name="correo"
        control={formularioActualizar.control}
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
      {/* Campo descripción */}
      <Controller
        name="descripcion"
        control={formularioActualizar.control}
        rules={{
          required: "La descripción es obligatoria",
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Descripción"
            variant="outlined"
            fullWidth
            multiline
            rows={4} // Ajusta según lo necesites
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Controller
        name="clave"
        control={formularioActualizar.control}
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

      {/* Botón de Actualizar */}
      <Button

        variant="contained"
        color="primary"
        onClick={formularioActualizar.handleSubmit(actualizarUsuaio)}
      >
        Actualizar Usuario
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => cancelar()}>
        Cancelar
      </Button>
    </Box>
  );
};

export default ActualizarUsuario;


