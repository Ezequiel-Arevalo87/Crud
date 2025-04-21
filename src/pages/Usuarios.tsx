import { useEffect, useState } from "react";
import apiService from "../services/api";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Button, Typography, Container, Box, Stack,
    TablePagination,
    IconButton,
    Tooltip
} from "@mui/material";
import SwalAlert from "../components/alerts/SwalAlert";
import { useForm } from "react-hook-form";
import { getUserRole } from "../services/authService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Usuarios = () => {

    const formularioBarberia = useForm({
        defaultValues: {
            nombreBarberia: '',
            nombre: '',
            descripcion: '',
            direccion: '',
            telefono: '',
            correo: '',
            clave: '',

        }
    })

    const [usuarios, setUsuarios] = useState([]);
    const [actualizarDatosUsuarios, setactualizarDatosUsuarios] = useState('');
    const [abrirFormBarbe, setAbrirFormBarbe] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const rol: any = getUserRole();
    const navigate = useNavigate();


    useEffect(() => {
        // fetchUsuarios();
       console.log({actualizarDatosUsuarios}) 
    }, []);

    // const fetchUsuarios = async () => {
    //     try {
    //         const data = await apiService.getUsuarios();
    //         setUsuarios(data);
    //     } catch (error) {
    //         console.error("Error al cargar usuarios", error);
    //     }
    // };

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

    const handleChangePage = (event: any, newPage: any) => {
        console.log(event)
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRegistrar = (id: number) => {
        navigate("/registrar-barbero", { state: { id } });
    };

    return (
        <> {!abrirFormBarbe ?
            <Container maxWidth={false} sx={{ p: 3 }}>
                <Typography variant="h2" sx={{ mb: 3, textAlign: "center" }}>
                    Lista de Barberias Admin
                </Typography>

                <Box sx={{ mt: 3, overflowX: "auto" }}>

                    <TableContainer component={Paper} sx={{
                        width: "80%",
                        minWidth: "1000px",
                        margin: "auto",
                        mt: 2,
                        p: 2,
                        boxShadow: 3,
                    }}>
                        <br />
                        <br />
                        <Button variant="contained" color="primary" onClick={abrirFormularioCrearBarberia}>
                            Agregar Barberia
                        </Button>
                        <br />
                        <br />
                        <Table size="small"> {/* Hace la tabla más compacta */}
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: "4%", textAlign: "center", p: 1 }}>ID</TableCell>
                                    <TableCell sx={{ width: "12%", p: 1 }}>Nombre Barbería</TableCell>
                                    <TableCell sx={{ width: "10%", p: 1 }}>Nombre</TableCell>
                                    <TableCell sx={{ width: "15%", p: 1 }}>Email</TableCell>
                                    <TableCell sx={{ width: "18%", p: 1 }}>Descripción</TableCell>
                                    <TableCell sx={{ width: "10%", p: 1 }}>Dirección</TableCell>
                                    <TableCell sx={{ width: "8%", p: 1 }}>Teléfono</TableCell>
                                    <TableCell sx={{ width: "8%", whiteSpace: "nowrap", p: 1 }}>Fecha de Ingreso</TableCell>
                                    <TableCell sx={{ width: "5%", textAlign: "center", p: 1 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usuarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user: any) => (
                                    <TableRow key={user.id}>
                                        <TableCell sx={{ textAlign: "center", p: 1 }}>{user.id}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.nombreBarberia}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.nombre}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.correo}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.descripcion}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.direccion}</TableCell>
                                        <TableCell sx={{ p: 1 }}>{user.telefono}</TableCell>
                                        <TableCell sx={{ whiteSpace: "nowrap", p: 1 }}>{user.fechaRegistro}</TableCell>
                                        <TableCell sx={{ textAlign: "center", p: 1 }}>
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Actualizar">
                                                    <IconButton color="warning" onClick={() => handActualizar(user.id)}>
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                {rol?.role === "Admin" && (
                                                    <Tooltip title="Agregar Barbero">
                                                        <IconButton color="error" onClick={() => handleRegistrar(user.id) }>
                                                            <Add fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {rol?.role === "Admin" && (
                                                    <Tooltip title="Eliminar">
                                                        <IconButton color="error" onClick={() => handleEliminarUsuario(user.id)}>
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={usuarios.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableContainer>
                </Box>
              
            </Container> : null
        }
            {/* {abrirFormBarbe ?
                <CrearBarberia
                     /> : null
            } */}
        </>
    );
};

export default Usuarios;
