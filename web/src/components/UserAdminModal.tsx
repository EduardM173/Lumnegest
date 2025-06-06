// web/src/components/UserAdminModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import api from "../api/axiosInstance";

export type Usuario = {
  id: number;
  nombre: string;
  correo: string;
  rol: "CLIENTE" | "OPERADOR" | "ADMIN" | "USUARIO";
  estado: "ACTIVO" | "INACTIVO";
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: Usuario | null;
  onSaved: () => void;
};

export default function UserAdminModal({ open, onClose, user, onSaved }: Props) {
  const [rol, setRol] = useState<Usuario["rol"]>("USUARIO");
  const [estado, setEstado] = useState<Usuario["estado"]>("ACTIVO");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setRol(user.rol);
      setEstado(user.estado);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.patch(
        `/usuarios/${user.id}`,
        { rol, estado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved();
      onClose();
    } catch (err) {
      console.error("Error actualizando usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.delete(
        `/usuarios/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSaved();
      onClose();
    } catch (err) {
      console.error("Error eliminando usuario:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Administrar Usuario</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nombre"
            value={user?.nombre}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <TextField
            label="Correo"
            value={user?.correo}
            InputProps={{ readOnly: true }}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Rol</InputLabel>
            <Select
              value={rol}
              label="Rol"
              onChange={e => setRol(e.target.value as Usuario["rol"])}
            >
              <MenuItem value="USUARIO">Usuario</MenuItem>
              <MenuItem value="CLIENTE">Cliente</MenuItem>
              <MenuItem value="OPERADOR">Operador</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              value={estado}
              label="Estado"
              onChange={e => setEstado(e.target.value as Usuario["estado"])}
            >
              <MenuItem value="ACTIVO">Activo</MenuItem>
              <MenuItem value="INACTIVO">Inactivo</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>Cerrar</Button>
        <Button color="error" onClick={handleDelete} disabled={loading}>
          Eliminar
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
