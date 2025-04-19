import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    TextField, Button, Box, Typography, InputAdornment, IconButton, MenuItem
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import apiTipoDocumentos from "../services/apiTipoDocumentos";
import apiBarberoService from "../services/apiBarberoService";

interface FormData {
    email: string;
    password: string;
    nombre: string;
    tipoDocumento: string;
    numeroDocumento: string;
    direccion: string;
    telefono: string;
    roleId: number;
    barberiaId: number;
    fotoBarbero: string;
    estado: number;
    sucursalId? : number;
}

const CrearBarberos = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [tipoDocumentos, setTipoDocumentos] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
  
    const barberiaSucursal = location?.state?.barberiaSucursal;
    const barberiaId =  location?.state?.idBarberia

    console.log('ver', barberiaId )
    console.log('ver2', barberiaSucursal )

    const { control, handleSubmit, setValue } = useForm<FormData>({
        defaultValues: {
            email: "",
            password: "",
            nombre: "",
            tipoDocumento: "",
            numeroDocumento: "",
            direccion: "",
            telefono: "",
            roleId: 2,
            barberiaId: barberiaId ?? 0,
            sucursalId: barberiaSucursal?.id ?? undefined,
            fotoBarbero: "",
            estado: 1,
        }
    });  


    useEffect(() => {
        
        if (!barberiaId && !barberiaSucursal) {
            navigate("/barberias");
        } else {
            if(barberiaSucursal){
                setValue('barberiaId',barberiaSucursal.barberiaId )
            }
            obtenerTiposDocumentos();
        }
    }, []);

    const obtenerTiposDocumentos = async () => {
        try {
            const data = await apiTipoDocumentos.getTiposDocumentos();
            setTipoDocumentos(data);
        } catch (error) {
            console.error("Error al obtener documentos", error);
        }
    };

    const onSubmit = async (data: FormData) => {
        
        try {
          await apiBarberoService.postBarbero(data);
          alert("Barbero guardado con éxito");
      
          if (barberiaSucursal) {
            navigate("/registrar-barbero", { state: { datosBarberia: barberiaSucursal } });
          } else {
            navigate("/registrar-barbero", { state: { id: barberiaId } });
          }
      
        } catch (error) {
          console.error("Error al guardar barbero", error);
        }
      };
      
    return (
        <Box sx={{ width: "100%", maxWidth: 400, margin: "auto", mt: 5 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Registro Barbero
            </Typography>

            <Box component="form" autoComplete="off" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Controller
                    name="email"
                    control={control}
                    rules={{ required: "El email es requerido" }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Email"
                            type="email"
                            autoComplete="off"
                            fullWidth
                            margin="normal"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "La contraseña es requerida",
                        minLength: { value: 6, message: "Mínimo 6 caracteres" }
                    }}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            label="Contraseña"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            fullWidth
                            margin="normal"
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
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


                <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field, fieldState }) => (
                        <TextField {...field} label="Nombre" fullWidth margin="normal"
                            error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                />
                <Controller
                    name="fotoBarbero"
                    control={control}
                    rules={{ required: "La foto es requerida" }}
                    render={({ field, fieldState }) => (
                        <TextField {...field} label="Foto URL" fullWidth margin="normal"
                            error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                />
                <Controller
                    name="tipoDocumento"
                    control={control}
                    rules={{ required: "El tipo de documento es requerido" }}
                    render={({ field, fieldState }) => (
                        <TextField {...field} select label="Tipo de Documento" fullWidth
                            error={!!fieldState.error} helperText={fieldState.error?.message}>
                            <MenuItem value="">Selecciona un tipo</MenuItem>
                            {tipoDocumentos.map((tipo: any) => (
                                <MenuItem key={tipo.id} value={tipo.id}>{tipo.nombre}</MenuItem>
                            ))}
                        </TextField>
                    )}
                />
                <Controller
                    name="numeroDocumento"
                    control={control}
                    rules={{ required: "El número de documento es requerido" }}
                    render={({ field, fieldState }) => (
                        <TextField {...field} label="Número de Documento" fullWidth margin="normal"
                            error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                />
                <Controller
                    name="estado"
                    control={control}
                    render={({ field }) => (
                        <TextField {...field} select label="Estado" fullWidth margin="normal">
                            <MenuItem value={1}>Activo</MenuItem>
                            <MenuItem value={0}>Inactivo</MenuItem>
                        </TextField>
                    )}
                />
                <Controller
                    name="direccion"
                    control={control}
                    rules={{ required: "La dirección es requerida" }}
                    render={({ field, fieldState }) => (
                        <TextField {...field} label="Dirección" fullWidth margin="normal"
                            error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                />
                <Controller
                    name="telefono"
                    control={control}
                    rules={{ required: "El teléfono es requerido" }}
                    render={({ field, fieldState }) => (
                        <TextField {...field} label="Teléfono" fullWidth margin="normal"
                            error={!!fieldState.error} helperText={fieldState.error?.message} />
                    )}
                />
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                    Registrar
                </Button>
            </Box>
        </Box>
    );
};

export default CrearBarberos;
