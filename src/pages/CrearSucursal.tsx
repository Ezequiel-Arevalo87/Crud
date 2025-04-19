import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Box, Card, CardContent, Typography, useMediaQuery } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import apiTipoDocumentos from '../services/apiTipoDocumentos';
import theme from "../components/theme/theme";
import apiBarberiaSucursalService from "../services/apiSucursalService";


interface BarberiaForm {
  nombre: string;
  tipoDocumento: number;
  numeroDocumento: string;
  direccion: string;
  telefono: string;
  correo: string;
  roleId: number ;
  clave: string;
  fotoBarberia: string;
  barberiaId: string

}



const CrearSucursal: React.FC = () => {


  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { control, handleSubmit, reset } = useForm<BarberiaForm>({
    defaultValues: {
      barberiaId:'',
      nombre: '',
      tipoDocumento: 0,
      numeroDocumento: '',
      direccion: '',
      telefono: '',
      fotoBarberia: ''
    }
  });

  const [tipoDocumentos, setTipoDocumentos] = useState([])
 

  const barberiaId = location.state?.barberiaId ; 

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
    const resquest = {
    
        nombre:data.nombre,
        direccion:data.direccion,
        telefono:data.telefono,
        fechaRegistro: new Date(),
        barberiaId: barberiaId,
        fotoSucursal: data.fotoBarberia,
        tipoDocumentoId: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        estado:1
    }
    try {
      await apiBarberiaSucursalService.postBarberiaSucursal(resquest);
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
      { isMobile ? <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
                    Crear Sucursal Barberias
                </Typography>: <Typography variant="h3" sx={{ mb: 3, textAlign: "center" }}>
                Crear Sucursal Barberias
                </Typography>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        <Controller
            name="fotoBarberia"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="URL de la Foto" fullWidth />}
          />
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

       

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, borderRadius: 2 }}>
            Guardar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CrearSucursal;