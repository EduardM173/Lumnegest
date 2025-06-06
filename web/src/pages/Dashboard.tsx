import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Section } from '../styles/HomeStyles';

const Dashboard: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F2EFEA' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: '250px',
          backgroundColor: '#6C4F4B',
          color: '#F2EFEA',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: `'Playfair Display', serif`,
            fontWeight: 700,
            mb: 4,
            textAlign: 'center',
          }}
        >
          Dashboard
        </Typography>
        <Box component="nav">
          {['Dashboard', 'Velatorios', 'Inventario', 'Servicios', 'Reportes', 'Usuario', 'Config'].map((item, index) => (
            <Button
              key={index}
              component={NavLink}
              to={item.toLowerCase() === 'dashboard' ? '/dashboard' : `/${item.toLowerCase()}`}
              fullWidth
              sx={{
                color: '#F2EFEA',
                justifyContent: 'flex-start',
                mb: 1,
                borderRadius: 20,
                '&:hover': {
                  backgroundColor: '#A48E5F',
                },
              }}
            >
              {item}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 4 }}>
        <Section
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            borderTop: 'none',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: '#B59F6B',
              fontFamily: `'Playfair Display', serif`,
              fontWeight: 700,
            }}
          >
            Dashboard{' '}
            <Typography
              component="span"
              variant="h6"
              sx={{
                color: '#6C4F4B',
                fontFamily: `'Roboto', sans-serif`,
              }}
            >
              Vista general
            </Typography>
          </Typography>
          <Typography
            sx={{
              color: '#6C4F4B',
              fontFamily: `'Roboto', sans-serif`,
            }}
          >
            2025 Aquelarre de informáticos
          </Typography>
        </Section>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          <Box
            sx={{
              backgroundColor: '#FFF',
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
              Servicios activos
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#B59F6B',
                fontFamily: `'Playfair Display', serif`,
                fontWeight: 700,
              }}
            >
              12
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: '#FFF',
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
              Velatorio Ocupado
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#B59F6B',
                fontFamily: `'Playfair Display', serif`,
                fontWeight: 700,
              }}
            >
              4/6
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: '#FFF',
              p: 3,
              borderRadius: 2,
              boxShadow: 1,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
              Ingreso mensual
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#B59F6B',
                fontFamily: `'Playfair Display', serif`,
                fontWeight: 700,
              }}
            >
              XXXX Bs
            </Typography>
          </Box>
        </Box>

        {/* Chart */}
        <Box
          sx={{
            backgroundColor: '#FFF',
            p: 3,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Box
            sx={{
              height: '200px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
            }}
          >
            {[32, 12, 24, 36, 16].map((height, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: '#B59F6B',
                  width: '50px',
                  height: `${height}%`,
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;