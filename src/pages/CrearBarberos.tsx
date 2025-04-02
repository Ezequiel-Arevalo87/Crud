import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    TextField, Button, Box, Typography, Stepper, Step, StepLabel,
    InputAdornment, IconButton,
    MenuItem
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import apiTipoDocumentos from "../services/apiTipoDocumentos";
import { useLocation, useNavigate } from "react-router-dom";
import apiBarberoService from "../services/apiBarberoService";

interface FormData {
    email: string;
    password: string;
    nombre: string;
    tipoDocumento: number;
    numeroDocumento: string;
    direccion: string;
    telefono: string;
    roleId: number;
    barberiaId: number;
}

const steps = ["Cuenta", "Información Personal"];

const CrearBarberos = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState<Partial<FormData>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [tipoDocumentos, setTipoDocumentos] = useState([])

    const { control, handleSubmit, setValue, reset } = useForm<FormData>();
    const idBarberia = location.state?.idBarberia; // Obtenemos el ID de `state`

    useEffect(()=>{
        if(!idBarberia){
            navigate('/barberias')
        }

    },[])

    useEffect(() => {
       
        reset(formData);
    }, [activeStep, reset, formData]);

    useEffect(() => {
    
        obtenerTiposDocumentos()
    }, [])

    setValue('roleId', 2)
    setValue('barberiaId', idBarberia)

    const obtenerTiposDocumentos = async () => {

        try {
            const data = await apiTipoDocumentos.getTiposDocumentos();
            setTipoDocumentos(data)
        } catch (error) {
            console.error("Error al guardar la barbería", error);
        }
    }

    const onNext = (data: Partial<FormData>) => {
        setFormData((prev) => {
            const newData = { ...prev, ...data };
            return newData;
        });

       
        Object.entries(data).forEach(([key, value]) => setValue(key as keyof FormData, value));
        setActiveStep((prevStep) => prevStep + 1);
    };

    const onSubmit = async (data: FormData) => {
        const finalData = { ...formData, ...data };
        const id = idBarberia
        try {
            await apiBarberoService.postBarbero(finalData);
            alert("Barbero guardado con éxito");
            navigate("/registrar-barbero", {state : {id}});
        } catch (error) {
            console.error("Error al guardar la barbería", error);
        }
    };


    return (
        <Box sx={{ width: "100%", maxWidth: 400, margin: "auto", mt: 5 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Registro Barbero
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box component="form" onSubmit={handleSubmit(activeStep === 0 ? onNext : onSubmit)} sx={{ mt: 3 }}>
                {activeStep === 0 ? (
                    <>
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            rules={{ required: "El email es requerido" }}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Email" type="email" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            defaultValue=""
                            rules={{ required: "La contraseña es requerida" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    label="Contraseña"
                                    type={showPassword ? "text" : "password"}
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
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Siguiente
                        </Button>
                    </>
                ) : (
                    <>
                        <Controller
                            name="nombre"
                            control={control}
                            defaultValue=""
                            rules={{ required: "El nombre es requerido" }}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Nombre" type="text" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="tipoDocumento"
                            control={control}
                            defaultValue={1}
                            rules={{ required: "El tipo Documento es requerido" }}
                            render={({ field, fieldState }) => (
                                <TextField select {...field} label="Tipo de Documento" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth>
                                    {tipoDocumentos.map((tipo: any) => (
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
                            rules={{ required: "El número Documento es requerido" }}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Número de Documento" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth margin="normal" />
                            )}
                        />
                        <Controller
                            name="direccion"
                            control={control}
                            defaultValue=""
                            rules={{ required: "La dirección es requerido" }}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Dirección" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth margin="normal" />
                            )}
                        />
                        <Controller
                            name="telefono"
                            control={control}
                            rules={{ required: "El teléfon es requerido" }}
                            defaultValue=""
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Teléfono" error={!!fieldState.error} helperText={fieldState.error?.message} fullWidth margin="normal" />
                            )}
                        />
                        <Controller
                            name="roleId"
                            control={control}

                       
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Role ID"
                                    disabled
                                    type="number"
                                    fullWidth margin="normal" />
                            )}
                        />
                        <Controller
                            name="barberiaId"
                            control={control}
                       
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    disabled
                                    label="Barbería ID"
                                    type="number"
                                    fullWidth margin="normal" />
                            )}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                            <Button variant="outlined" onClick={() => setActiveStep((prev) => prev - 1)}>
                                Atrás
                            </Button>
                            <Button type="submit" variant="contained">
                                Registrar
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default CrearBarberos;
