import { Box, Typography } from "@mui/material";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface PrposOpiniones {
    reviews:any
}


const NuestrosClientes:React.FC<PrposOpiniones> = ({reviews}) => {
  return (
    <>
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
       {reviews.map((review:any, index:any) => (
         <SwiperSlide key={index}>
           <Box p={3} textAlign="center" bgcolor="#f5f5f5" borderRadius={2}>
             <Typography variant="h6">{review.name}</Typography>
             <Typography variant="body1">"{review.comment}"</Typography>
           </Box>
         </SwiperSlide>
       ))}
     </Swiper>
   </Box></>
    
  );
}

export default NuestrosClientes;
