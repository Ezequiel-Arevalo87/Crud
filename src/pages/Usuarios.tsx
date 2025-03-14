import { useEffect, useState } from "react";
import apiService from "../services/api";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Container, Box, Stack
} from "@mui/material";
import SwalAlert from "../components/alerts/SwalAlert";
import { useForm } from "react-hook-form";
import ActualizarUsuario from "./ActualizarUsuario";
import CrearBarberia from "./CrearBarberia";
import { getUserRole } from "../services/authService";

const Usuarios = () => {

    const formularioBarberia = useForm({
        defaultValues: {
            nombre: '',
            descripcion:'',
            correo: '',
            clave: '',
        }
    })

    const [usuarios, setUsuarios] = useState([]);
    const [actualizarDatosUsuarios, setactualizarDatosUsuarios] = useState('');
    const [ abrirFormBarbe,  setAbrirFormBarbe] = useState(false);
    const rol:any = getUserRole();
  

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const data = await apiService.getUsuarios();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        }
    };

    const handleEliminarUsuario = async (id: string) => {
        const result = await SwalAlert.confirmDelete("¿Estás seguro?", "Esta acción no se puede deshacer");
        if (result.isConfirmed) {
            try {
                await apiService.deleteUsuario(id);
                setUsuarios(usuarios.filter((user: any) => user.id !== id));
                SwalAlert.success("Usuario eliminado", "El usuario ha sido eliminado correctamente");
            } catch (error) {
                console.error("Error al eliminar usuario", error);
                SwalAlert.error("Error", "Hubo un problema al eliminar el usuario");
            }
        }
    };
    const handActualizar = async (id: string) => {
        setactualizarDatosUsuarios(id)
        setUsuarios(usuarios.filter((user: any) => user.id === id));
    };
    
    const abrirFormularioCrearBarberia = () => {
        setAbrirFormBarbe(true)
        formularioBarberia.reset()
       }

    return (
        <Container maxWidth={false} sx={{ width: "80%", p: 3 }}>
            <Typography variant="h2" sx={{ mb: 3, textAlign: "center" }}>
                Lista de Usuarios
            </Typography>
            <Button 
            onClick={()=> abrirFormularioCrearBarberia() }
            >Agregar Barberia</Button>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
                <TableContainer component={Paper} sx={{ width: "80%" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Fecha de Ingreso</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuarios?.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.nombre}</TableCell>
                                    <TableCell>{user.correo}</TableCell>
                                    <TableCell>{user.fechaRegistro}</TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={2}>
                                      
                                               
                                                <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => handActualizar(user.id)}
                                            >
                                                Actualizar
                                            </Button>
                                        
                                           {
                                             rol?.role !== 'Admin' ? null:
                                             <Button
                                             variant="contained"
                                             color="error"
                                             onClick={() => handleEliminarUsuario(user.id)}
                                         >
                                             Eliminar
                                         </Button>
                                           }
                                         
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {
                actualizarDatosUsuarios !== '' ?
                    <ActualizarUsuario
                        usuarios={usuarios}
                        formularioActualizar={formularioBarberia}
                        fetchUsuarios={fetchUsuarios}
                        setactualizarDatosUsuarios={setactualizarDatosUsuarios}
                    /> : null
            }
            { abrirFormBarbe ?
                <CrearBarberia 
                formularioBarberia={formularioBarberia}
                fetchUsuarios={fetchUsuarios}
                setactualizarDatosUsuarios={setactualizarDatosUsuarios}
                setAbrirFormBarbe = {setAbrirFormBarbe}/>: null
            }
        </Container>
    );
};

export default Usuarios;
