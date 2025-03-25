import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Box, Card, CardContent, Typography } from "@mui/material";
import apiBarberiaService from "../services/apiBarberiaService";
import { useNavigate } from "react-router-dom";
import apiTipoDocumentos from '../services/apiTipoDocumentos';


interface BarberiaForm {
  nombre: string;
  tipoDocumento: number;
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  email: string;
  roleId: string ;
}



const FormBarberia: React.FC = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, reset } = useForm<BarberiaForm>({
    defaultValues: {
      roleId: '1'
    }
  });

  const [tipoDocumentos, setTipoDocumentos] = useState([])

  useEffect(()=> {
    obtenerTiposDocumentos()
  },[])

  const obtenerTiposDocumentos = async () => {
    try {
      const data =  await apiTipoDocumentos.getTiposDocumentos();
      
      setTipoDocumentos(data)
     
    } catch (error) {
      console.error("Error al guardar la barbería", error);
    }
  }

  const onSubmit = async (data: BarberiaForm) => {
   
    try {
      await apiBarberiaService.postBarberia(data);
      alert("Barbería guardada con éxito");
      reset();
      navigate("/barberias");
    } catch (error) {
      console.error("Error al guardar la barbería", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Registrar Barbería
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            name="nombre"
            control={control}
            defaultValue=""
            rules={{ required: "El nombre es obligatorio" }}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Nombre" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
            )}
          />
          
          <Controller
            name="tipoDocumento"
            control={control}
            defaultValue={1}
            render={({ field }) => (
              <TextField select {...field} label="Tipo de Documento" fullWidth>
                {tipoDocumentos.map((tipo:any) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="numeroDocumento"
            control={control}
            defaultValue=""
            rules={{ required: "El número de documento es obligatorio" }}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Número de Documento" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
            )}
          />

          <Controller
            name="direccion"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Dirección" fullWidth />}
          />

          <Controller
            name="telefono"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Teléfono" fullWidth />}
          />

          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo no válido" } }}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Email" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
            )}
          />

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, borderRadius: 2 }}>
            Guardar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormBarberia;