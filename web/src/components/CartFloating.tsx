// web/src/components/CartFloating.tsx
import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useCart } from '../contexts/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

export default function CartFloating() {
  const { items, subtotal } = useCart();
  const nav = useNavigate();
  if (items.length === 0) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'fixed',
        top: 72,
        right: 24,
        p: 2,
        width: 240,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <ShoppingCartIcon />
        <Typography sx={{ ml: 1, fontWeight: 600 }}>Carrito</Typography>
      </Box>
      <Typography>Items: {items.length}</Typography>
      <Typography>Subtotal: Bs {subtotal.toFixed(2)}</Typography>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => nav('/checkout')}
      >
        Checkout
      </Button>
    </Paper>
  );
}
