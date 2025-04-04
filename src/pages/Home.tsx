import { Container, Typography, Box, Card, CardContent, CardMedia, Grid, Button } from "@mui/material";
import NuestrosClientes from "./NuestrosClientes";
import { useEffect, useState } from "react";
import apiService from "../services/api";
import { useLocation } from "react-router-dom";
import LoadingScissors from "../components/loading/LoadingScissors";
import { getUserRole } from "../services/authService";

const Home = () => {
   const rol:any = getUserRole();
  const [token , setToken] = useState( sessionStorage.getItem("token"))
  const [barbershops, setBarbershops] = useState<any>([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false)
  const mensaje = location.state?.mensaje || "No hay mensaje";

  useEffect(() => {
    
    if(rol?.role === "Admin"){
      obtenerBarberiasPorId()
    }else{
      obtenerAllBarberias();
    }
    
  }, [token]);
  useEffect(() => {
    if(mensaje == 'OK'){
      setToken(null)
    }
  }, [mensaje == 'OK']);



  const obtenerAllBarberias = async () => {
    setLoading(true)
    try {
      const data = await apiService.getUsuarios();
      setBarbershops(data);
      setLoading(false)
    } catch (error) {
      console.error("Error al cargar barberías", error);
      setLoading(false)
    }
  };

  const obtenerBarberiasPorId = async () => {
    setLoading(true)
    const id = Number(rol?.nameid)
    try {
      const data = await apiService.getUsuarioById(id);
      setBarbershops([data]);
      setLoading(false)
    } catch (error) {
      console.error("Error al cargar barberías", error);
      setLoading(false)
    }
  };

  if(loading){
    return <LoadingScissors/>
}


  return (
    <Container>
      <Box my={5}>
        <Typography variant="h3" align="center" gutterBottom>
          Bienvenido a las mejores barberías
        </Typography>
      </Box>

      {/* Galería de Barberías */}
      <Grid container spacing={3} justifyContent="center">
        {barbershops.map((barber: any, index: any) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardMedia
                component="img"
                height="200"
                image={barber?.fotoBarberia || "/default-barber.jpg"}
                alt={barber?.nombre}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ textAlign: "center", padding: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {barber.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {barber.descripcion}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {barber.direccion}
                </Typography>
                {
                  token && 

                  <Button>Ir a la sala</Button>
                }
               
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <NuestrosClientes reviews = {barbershops} />
    </Container>
  );
};

export default Home;
