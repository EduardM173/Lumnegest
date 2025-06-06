import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#CED2D4',
        py: 3,
        px: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body1"
          sx={{ color: '#3A4A58', textAlign: 'center', mb: 1 }}
        >
          Contactanos:{" "}
          <Link
            href="LumenGest@funeraria.com"
            sx={{ color: '#3A4A58', textDecoration: 'none', fontWeight: 600 }}
          >
            LumenGest@funeraria.com
          </Link>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            mb: 1,
            color: '#3A4A58',
          }}
        >
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#3A4A58' }}
          >
            <FacebookIcon fontSize="large" />
          </Link>
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#3A4A58' }}
          >
            <TwitterIcon fontSize="large" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#3A4A58' }}
          >
            <InstagramIcon fontSize="large" />
          </Link>
        </Box>
        <Typography
          variant="caption"
          sx={{ color: '#3A4A58', display: 'block', textAlign: 'center' }}
        >
          © {new Date().getFullYear()} LumenGest. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
