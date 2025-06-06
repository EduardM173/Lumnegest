// web/src/pages/AdminPanel.tsx
import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Alert,
  Button as MuiButton
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import UserAdminModal, { Usuario } from "../components/UserAdminModal";

export default function AdminPanel() {
  const { user } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState<Usuario[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user || user.email !== "admin.general@funeraria.com") {
      navigate("/login");
    } else {
      fetchUsuarios();
    }
  }, [user, navigate]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get<Usuario[]>("/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
      setError("");
    } catch (err: any) {
      console.error(err);
      setError("Error al obtener usuarios");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (u: Usuario) => {
    setSelectedUser(u);
    setModalOpen(true);
  };
  const closeModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Administración
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios?.map(u => (
              <TableRow key={u.id}>
                <TableCell>{u.nombre}</TableCell>
                <TableCell>{u.correo}</TableCell>
                <TableCell>{u.rol}</TableCell>
                <TableCell>{u.estado}</TableCell>
                <TableCell>
                  <MuiButton
                    variant="outlined"
                    onClick={() => openModal(u)}
                  >
                    Administrar
                  </MuiButton>
                </TableCell>
              </TableRow>
            )) || (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay usuarios
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <UserAdminModal
        open={modalOpen}
        onClose={closeModal}
        user={selectedUser}
        onSaved={fetchUsuarios}
      />
    </Container>
  );
}
