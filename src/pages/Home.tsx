import { Container, Typography, Box, Card, CardContent, CardMedia, Grid } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay } from "swiper/modules"; // Importa módulos adicionales

const Home = () => {
  const barbershops = [
    { name: "Barbería Elite", image: "https://source.unsplash.com/600x400/?barber" },
    { name: "Barber Masters", image: "https://source.unsplash.com/600x400/?barbershop" },
    { name: "Corte Clásico", image: "https://source.unsplash.com/600x400/?haircut" },
  ];

  const reviews = [
    { name: "Carlos R.", comment: "Excelente servicio y ambiente. ¡Volveré pronto!" },
    { name: "Ana P.", comment: "El mejor corte que he tenido, profesionales de verdad." },
    { name: "Javier M.", comment: "Muy recomendable, atención de primera y buen precio." },
  ];

  return (
    <Container>
      <Typography variant="h3" align="center" gutterBottom>
        Bienvenido a las mejores barberías
      </Typography>

      {/* Galería de Barberías */}
      <Grid container spacing={3}>
        {barbershops.map((barber, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardMedia component="img" height="200" image={barber.image} alt={barber.name} />
              <CardContent>
                <Typography variant="h6" align="center">{barber.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Testimonios */}
      <Box mt={5}>
        <Typography variant="h4" align="center" gutterBottom>
          Lo que dicen nuestros clientes
        </Typography>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[Autoplay]} // Aquí agregamos los módulos
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <Box p={3} textAlign="center" bgcolor="#f5f5f5" borderRadius={2}>
                <Typography variant="h6">{review.name}</Typography>
                <Typography variant="body1">"{review.comment}"</Typography>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Container>
  );
};

export default Home;
