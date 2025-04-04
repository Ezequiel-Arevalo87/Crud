import { Box, Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import SwalAlert from "../components/alerts/SwalAlert";
import apiBarberiaService from "../services/apiBarberiaService";


interface ActualizarUsuarioProps {
  barberias: any;
  formularioActualizar: any;
  fetchUsuarios: any;
  setActualizarDatosBarberias: any;
}


const ActualizarUsuario: React.FC<ActualizarUsuarioProps> = ({ barberias, formularioActualizar, fetchUsuarios, setActualizarDatosBarberias }) => {

 

  useEffect(() => {
    
    formularioActualizar.setValue('nombre', barberias[0].nombre)
    formularioActualizar.setValue('direccion', barberias[0].direccion)
    formularioActualizar.setValue('fotoBarberia', barberias[0].fotoBarberia )
    formularioActualizar.setValue('telefono', barberias[0].telefono )
    
  }, [])

  const actualizarUsuaio = async (data: any) => {
    const result = await SwalAlert.confirActualizar("¿Estás seguro?", "Esta acción actualiza los datos anteriores");
    const request = {
      nombre: data?.nombre,
      direccion: data?.direccion,
      fotoBarberia: data?.fotoBarberia,
      telefono: data?.telefono
   
    }
    const id = barberias[0].id

    if (result.isConfirmed) {
      try {
        
        await apiBarberiaService.putBarberia(id, request);

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

    
      <Controller
        name="fotoBarberia"
        control={formularioActualizar.control}
        rules={{
          required: "Foto Barberia",
        
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField {...field} label="Foto Barberia" variant="outlined" fullWidth error={!!error} helperText={error?.message} />
        )}
      />
      {/* Campo descripción */}
      <Controller
        name="direccion"
        control={formularioActualizar.control}
        rules={{
          required: "La dirección es obligatoria",
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Direccion"
            variant="outlined"
            fullWidth
            // multiline
            // rows={4} // Ajusta según lo necesites
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Controller
        name="telefono"
        control={formularioActualizar.control}
        rules={{
          required: "El teléfono es obligatorio",
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Teléfono"
            variant="outlined"
            fullWidth
            error={!!error}
            helperText={error?.message}
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


