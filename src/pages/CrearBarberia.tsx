

import { TextField, Button, IconButton, InputAdornment, Box } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Controller } from "react-hook-form";
import apiService from "../services/api";

interface CrearBarberia {
   
    formularioBarberia: any;
    fetchUsuarios: any;
    setactualizarDatosUsuarios: any;
    setAbrirFormBarbe:any;
  }
  

const CrearBarberia: React.FC<CrearBarberia> = ({formularioBarberia, fetchUsuarios, setactualizarDatosUsuarios, setAbrirFormBarbe}) => {



    const [showPassword, setShowPassword] = useState(false);
    const guardarBarberia = async(data: any) => {
        
        console.log(data)
     

        const request = {
            nombre: data.nombre,
            correo: data.correo,
            clave: data.clave,
            roleId: 1
        }
          try {
                await apiService.postUsuario( request);
                fetchUsuarios()
                setactualizarDatosUsuarios('')
                setAbrirFormBarbe(false)
                formularioBarberia.reset()
              } catch (error) {
                console.error("Error al actualizar usuario", error);
              
              }
    }

    const cancelar = () => {
        setAbrirFormBarbe(false)
        formularioBarberia.reset()
        
    }

    return (
        <Box
            component="form"
            sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300, mx: "auto", mt: 4 }}
        >
            {/* Campo nombre */}
            <Controller
                name="nombre"
                control={formularioBarberia.control}
                defaultValue=""
                rules={{
                    required: "El nombre es obligatorio",

                }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label="Nombre"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ""}
                    />
                )}
            />

            {/* Campo nombre */}
            <Controller
                name="descripcion"
                control={formularioBarberia.control}
                defaultValue=""
                rules={{
                    required: "La descripción es obligatorio",

                }}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        label="Descripción"
                        variant="outlined"
                        fullWidth
                        error={!!error}
                        helperText={error ? error.message : ""}
                    />
                )}
            />

            {/* Campo Email */}
            <Controller
                name="correo"
                control={formularioBarberia.control}
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
                control={formularioBarberia.control}
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
                onClick={(formularioBarberia.handleSubmit(guardarBarberia))}>
                Guardar Barberia
            </Button>
            <Button type="submit" variant="contained" color="primary"
               onClick={() => cancelar()}>
                Cancelar
            </Button>
        </Box>
    );
};

export default CrearBarberia;
