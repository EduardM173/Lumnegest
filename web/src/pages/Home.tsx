import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import {
  Section,
  Title,
  SubTitle,
  Paragraph,
} from '../styles/HomeStyles';

// Importa la imagen para el banner
import bannerImage from '../assets/inicio.png';
import logo from '../assets/Logo_B.png';
import tarjeta from '../components/Testimoneo';
import PackageCard from '../components/PackageCard';
import Carrusel from '../components/carrusel';

export default function Home() {
  const testimonios = [ 
    {
      name: 'María López',
      text: 'El servicio fue excepcional',
      date: '15 de marzo de 2023',
    },
    {
      name: 'Juan Pérez',
      text: 'LumenGest nos ofreció un trato humano y profesional.',
      date: '22 de abril de 2023',
    },
  ];

  const paquetes = [
    {
      title: 'Paquete Básico',
      description: 'Incluye servicios esenciales.',
      price: '$1,200',
      features: ['Ataúd estándar', 'Traslado local', 'Asesoría básica'],
      image: 'https://via.placeholder.com/300x200?text=Paquete+Basico',
    },
    {
      title: 'Paquete Premium',
      description: 'Un servicio completo con detalles personalizados.',
      price: '$3,500',
      features: ['Ataúd de lujo', 'Ceremonia personalizada', 'Asesoría completa'],
      image: 'https://via.placeholder.com/300x200?text=Paquete+Premium',
    },
    {
      title: 'Paquete Familiar',
      description: 'Pensado para brindar apoyo integral a toda la familia.',
      price: '$2,800',
      features: ['Ataúd premium', 'Traslado regional', 'Apoyo psicológico'],
      image: 'https://via.placeholder.com/300x200?text=Paquete+Familiar',
    },
    {
      title: 'Paquete Ejecutivo',
      description: 'Servicios exclusivos para clientes exigentes.',
      price: '$5,000',
      features: ['Ataúd ejecutivo', 'Traslado internacional', 'Ceremonia VIP'],
      image: 'https://via.placeholder.com/300x200?text=Paquete+Ejecutivo',
    },
    {
      title: 'Paquete Económico',
      description: 'Una opción accesible sin comprometer la calidad.',
      price: '$900',
      features: ['Ataúd básico', 'Traslado local', 'Asesoría económica'],
      image: 'https://via.placeholder.com/300x200?text=Paquete+Economico',
    },
    {
      title: 'Paquete Memorial',
      description: 'Incluye servicios para honrar la memoria de manera especial.',
      price: '$4,200',
      features: ['Ataúd personalizado', 'Ceremonia conmemorativa', 'Libro de recuerdos'],
      image: 'https://via.placeholder.com/300x200?text=Paquete+Memorial',
    },
  ];

  return (
    <>
      <Section
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          borderTop: 'none',
        }}
      >
        {/* Imagen del banner */}
        <Box
          component="img"
          src={bannerImage}
          alt="Banner"
          sx={{
            flex: { xs: '0 0 100%', md: '0 0 40%' },
            height: 'auto',
            width: '100%',
            objectFit: 'contain',
          }}
        />

        {/* Contenido a la derecha */}
        <Box
          sx={{
            flex: { xs: '0 0 100%', md: '0 0 60%' },
            backgroundColor: '#F2EFEA',
            color: '#6C4F4B',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            p: { xs: 3, md: 5 },
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: '#B59F6B',
              fontFamily: `'Playfair Display', serif`,
              fontWeight: 700,
              mb: 3,
            }}
          >
            LUMENGEST
          </Typography>
          <br /><br /><br />
            <Typography
            variant="body1"
            sx={{
              color: '#6C4F4B',
              fontFamily: `'Roboto', sans-serif`,
              fontSize: '1.2rem',
              mb: 4,
              lineHeight: 1.8,
              borderLeft: '4px solid #B59F6B',
              borderRight: '4px solid #B59F6B',
              pl: 2,
              pr: 2,
            }}
            >
            En LumenGest, entendemos la importancia de honrar la memoria de sus seres queridos. 
            Nuestro compromiso es ofrecer un servicio cálido, respetuoso y profesional, 
            brindando apoyo en los momentos más difíciles. Nos esforzamos por ser un pilar de 
            confianza y empatía para las familias que confían en nosotros.
            </Typography>
            <br />
          {/* Imagen y botón */}
            <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 2,
              mt: 4,
            }}
            >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 250, width: 'auto', mb: 2 }}
            />
            <br /><br />
            <Button
              variant="contained"
              sx={{
              backgroundColor: '#6C4F4B',
              color: '#F2EFEA',
              borderRadius: 50,
              px: 16,
              py: 6, 
              fontSize: '1rem', 
              whiteSpace: 'nowrap',
              '&:hover': { backgroundColor: '#A48E5F' },
              }}
            >
              Cotizar ahora
            </Button>
            </Box>

          {/* Palabras como botones */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              mt: 4,
              gap: 1,
            }}
          >
            {['Apoyo', 'Respeto', 'Cuidado', 'Memoria', 'Honrar'].map((word, index) => (
              <Button
                key={index}
                variant="outlined"
                sx={{
                  borderColor: '#6C4F4B',
                  color: '#6C4F4B',
                  borderRadius: 20,
                  px: 2,
                  py: 0.5,
                  '&:hover': {
                    backgroundColor: '#A48E5F',
                    color: '#F2EFEA',
                    borderColor: '#A48E5F',
                  },
                }}
              >
                {word}
              </Button>
            ))}
          </Box>
        </Box>
      </Section>

      {/* Sección de Paquetes */}
<Box
  sx={{
    width: '100%',
    backgroundColor: '#6C4F4B',
    color: '#F2EFEA',
    py: 5,
    textAlign: 'center',
    borderRadius: 2, // Redondea las esquinas del contenedor principal
  }}
>
  <Container sx={{ width: '100%' }}>
    <Typography
      variant="h2"
      sx={{
        fontFamily: `'Playfair Display', serif`,
        fontWeight: 700,
        mb: 3,
      }}
    >
      Paquetes
    </Typography>
    <Carrusel>
      {paquetes.map((paquete, index) => (
        <Box
          key={index}
          sx={{
            flex: '0 0 auto',
            minWidth: '300px',
            borderRadius: 2, // Redondea las esquinas de cada tarjeta
            overflow: 'hidden', // Asegura que el contenido no se desborde
          }}
        >
          <PackageCard
            nombre={paquete.title}
            descripcion={paquete.description}
            precio={paquete.price}
            servicios={paquete.features.map((feature) => ({
              nombre: feature,
              descripcion: '',
            }))}
          />
        </Box>
      ))}
    </Carrusel>
  </Container>
</Box>

      {/* Secciones adicionales */}
      <Box
        id="quienes-somos"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mt: 4,
        }}
      >
        {/* Primera sección */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#F2EFEA',
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Container maxWidth="md">
            <Title>Acerca de nosotros</Title>
            <Paragraph>
              Fundada en 1995, LumenGest ha crecido hasta convertirse en un referente regional,
              gracias a la confianza de más de 10.000 familias atendidas a lo largo de los años.
            </Paragraph>
            <SubTitle>Misión</SubTitle>
            <Paragraph>
              Brindar servicios funerarios humanizados y accesibles, cuidando cada detalle para apoyar
              a las familias en momentos difíciles.
            </Paragraph>
            <SubTitle>Visión</SubTitle>
            <Paragraph>
              Ser la empresa líder en innovación y calidad de servicios funerarios, destacándonos por
              nuestro compromiso con la excelencia y la empatía.
            </Paragraph>
          </Container>
        </Box>

        {/* Segunda sección */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#F2EFEA',
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Container maxWidth="md">
            <Title>Testimonios</Title>
            {testimonios.map((testimonio, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {React.createElement(tarjeta, {
                  name: testimonio.name,
                  text: testimonio.text,
                  date: testimonio.date,
                })}
              </Box>
            ))}
          </Container>
        </Box>
      </Box>
    </>
  );
}
