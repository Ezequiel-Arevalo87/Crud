import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Stack
} from "@mui/material";
import SwalAlert from "../components/alerts/SwalAlert";
import apiBarberoService from "../services/apiBarberoService";

interface ActualizarBarberoProps {
    listaBarberos: any;
    obtenerBarberosPorBarberias: any;
    setActualizarDatosBarbero: any;


}

const ActualizarBarbero: React.FC<ActualizarBarberoProps> = ({
    listaBarberos,

    obtenerBarberosPorBarberias,
    setActualizarDatosBarbero,

}) => {
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            fotoBarbero: "",
            nombre: "",
            estado: "",
            direccion: "",
            telefono: ""
        }
    });

    useEffect(() => {
        
        if (listaBarberos.length !== 0) {
            setValue("fotoBarbero", listaBarberos[0].fotoBarbero);
            setValue("nombre", listaBarberos[0].nombre);
            setValue("estado", listaBarberos[0].estado);
            setValue("direccion", listaBarberos[0].direccion);
            setValue("telefono", listaBarberos[0].telefono);
        }
    }, [listaBarberos, setValue]);

    const onSubmit = async (data: any) => {

        const result = await SwalAlert.confirActualizar("¿Estás seguro?", "Esta acción actualiza los datos anteriores");
        const request = {
            fotoBarbero: data?.fotoBarbero,
            nombre: data?.nombre,
            estado: data?.estado,
            telefono: data?.telefono,
            direccion: data?.direccion,

        }
        const id = listaBarberos[0].id

        if (result.isConfirmed) {
            try {
                await apiBarberoService.putBarbero(id, request);
                obtenerBarberosPorBarberias()
                SwalAlert.success("Barbero actualizado", "El Baarbero ha sido actualizado");
                setActualizarDatosBarbero('')
            } catch (error) {
                console.error("Error al actualizar usuario", error);
                SwalAlert.error("Error", "Hubo un problema al actualizar el usuario");
            }
        }
    };

    const cancelar = () => {
        obtenerBarberosPorBarberias()
        setActualizarDatosBarbero('')
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ maxWidth: 400, mx: "auto", mt: 3, p: 2, borderRadius: 2, boxShadow: 2 }}
        >
            <Typography variant="h6" align="center" gutterBottom>
                Actualizar Barbero
            </Typography>

            <Controller
                name="fotoBarbero"
                control={control}
                rules={{ required: "La foto es requerida" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Foto URL"
                        fullWidth
                        margin="normal"
                        error={!!errors.fotoBarbero}
                        helperText={errors.fotoBarbero?.message}
                    />
                )}
            />

            <Controller
                name="nombre"
                control={control}
                rules={{ required: "El nombre es requerido" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Nombre"
                        fullWidth
                        margin="normal"
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                    />
                )}
            />

            <Controller
                name="estado"
                control={control}
                rules={{ required: "El estado es requerido" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="Estado"
                        fullWidth
                        margin="normal"
                        error={!!errors.estado}
                        helperText={errors.estado?.message}
                    >
                        <MenuItem value="1">Activo</MenuItem>
                        <MenuItem value="0">Inactivo</MenuItem>
                    </TextField>
                )}
            />

            <Controller
                name="direccion"
                control={control}
                rules={{ required: "La dirección es requerida" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Dirección"
                        fullWidth
                        margin="normal"
                        error={!!errors.direccion}
                        helperText={errors.direccion?.message}
                    />
                )}
            />

            <Controller
                name="telefono"
                control={control}
                rules={{ required: "El teléfono es requerido" }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="Teléfono"
                        fullWidth
                        margin="normal"
                        error={!!errors.telefono}
                        helperText={errors.telefono?.message}
                    />
                )}
            />

            <Stack direction="row" spacing={2} mt={3} justifyContent="space-between">
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Actualizar
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    onClick={cancelar}
                    fullWidth
                >
                    Cancelar
                </Button>
            </Stack>
        </Box>
    );
};

export default ActualizarBarbero;
