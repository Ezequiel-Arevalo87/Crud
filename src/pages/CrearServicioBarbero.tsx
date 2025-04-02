
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, MenuItem, Box, Card, CardContent, Typography } from "@mui/material";
import apiServiciosService from "../services/apiServiciosService";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";


interface ServicioForm {
  servicio: string;
  estado: string;
  descripcion: string;
  foto: string;
  precioEspecial: number;
  precio: number;
  tiempo: number;
  observacion: string;
  barberoId: number;
}

const FormServicio: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate();
  

    const idBarbero = location.state?.idBarbero ; 
  const { control, handleSubmit, reset, setValue } = useForm<ServicioForm>({
    defaultValues: {
      estado: "Activo"
    }
  });

  useEffect(()=>{
    setValue('barberoId', idBarbero )
  },[])



  const onSubmit = async (data: ServicioForm) => {
    try {
      await apiServiciosService.postServicio(data);
      alert("Servicio guardado con éxito");
      reset();
      navigate("/servicios-barbero", {state :{idBarbero}});
    } catch (error) {
      console.error("Error al guardar el servicio", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 500, margin: "auto", mt: 5, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" align="center" gutterBottom>
          Registrar Servicio
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            name="servicio"
            control={control}
            defaultValue=""
            rules={{ required: "El servicio es obligatorio" }}
            render={({ field, fieldState }) => (
              <TextField {...field} label="Nombre del Servicio" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
            )}
          />
          
          <Controller
            name="estado"
            control={control}
            defaultValue="Activo"
            render={({ field }) => (
              <TextField select {...field} label="Estado" fullWidth>
                <MenuItem value={1}>Activo</MenuItem>
                <MenuItem value={0}>Inactivo</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="descripcion"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Descripción" fullWidth />}
          />

          <Controller
            name="foto"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="URL de la Foto" fullWidth />}
          />

          <Controller
            name="precioEspecial"
            control={control}
            defaultValue={0}
            render={({ field }) => <TextField {...field} type="number" label="Precio Especial" fullWidth />}
          />

          <Controller
            name="precio"
            control={control}
            defaultValue={0}
            rules={{ required: "El precio es obligatorio" }}
            render={({ field, fieldState }) => (
              <TextField {...field} type="number" label="Precio" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
            )}
          />

          <Controller
            name="tiempo"
            control={control}
            defaultValue={0}
            rules={{ required: "El tiempo es obligatorio" }}
            render={({ field, fieldState }) => (
              <TextField {...field} type="number" label="Tiempo (minutos)" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth />
            )}
          />

          <Controller
            name="observacion"
            control={control}
            defaultValue=""
            render={({ field }) => <TextField {...field} label="Observación" fullWidth />}
          />
          <Controller
            name="barberoId"
            control={control}
         
            render={({ field }) => <TextField {...field} label="barberoId" fullWidth />}
          />


          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, borderRadius: 2 }}>
            Guardar
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default FormServicio;