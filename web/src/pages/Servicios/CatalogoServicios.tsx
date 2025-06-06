// web/src/pages/Servicios/CatalogoServicios.tsx

import React, { useEffect, useContext, useState, useRef } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useParams } from 'react-router-dom';

import { useAsync } from '../../hooks/useAsync';
import {
  Servicio,
  getServicios,
  deleteServicio,
  uploadServicioImage,
  updateServicio,
  Categoria,
  getCategorias,
} from '../../api/services';
import { AuthContext } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

import * as S from '../../styles/catalogoServiciosStyles'; // ← estilos

export default function CatalogoServicios() {
  const { id: catId } = useParams<{ id?: string }>();
  const nav = useNavigate();
  const { user } = useContext(AuthContext)!;
  const { addItem } = useCart();

  /* ------ datos ------------------------------------------------------- */
  const { data: servicios = [], run: loadServicios, loading: loadingServicios } =
    useAsync(() => getServicios(catId));
  const { data: categorias = [], run: loadCategorias } =
    useAsync<Categoria[]>(getCategorias);

  const [catName, setCatName] = useState<string | null>(null);

  // Estados para confirmación de eliminación
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Servicio | null>(null);

  // Estados para edición de servicio en modal
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [serviceNombre, setServiceNombre] = useState('');
  const [serviceDescripcion, setServiceDescripcion] = useState('');
  const [servicePrecio, setServicePrecio] = useState<number>(0);
  const [serviceFile, setServiceFile] = useState<File | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Ref para input file oculto
  const inputFileRef = useRef<HTMLInputElement>(null);

  /* carga inicial categorías (una vez) */
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;
    loadCategorias();
  }, [loadCategorias]);

  /* recarga lista al cambiar categoría */
  useEffect(() => {
    loadServicios();
  }, [loadServicios, catId]);

  /* resuelve título */
  useEffect(() => {
    if (catId && categorias.length) {
      const c = categorias.find(c => String(c.id) === String(catId));
      setCatName(c?.nombre ?? `#${catId}`);
    } else {
      setCatName(null);
    }
  }, [catId, categorias]);

  /* handlers */
  const confirmDelete = async () => {
    if (!serviceToDelete) return;
    await deleteServicio(serviceToDelete.id);
    loadServicios();
    setOpenDeleteDialog(false);
    setServiceToDelete(null);
  };

  const handleDeleteClick = (s: Servicio) => {
    setServiceToDelete(s);
    setOpenDeleteDialog(true);
  };

  const handleAdd = (s: Servicio) => {
    if (!user) return nav('/login');
    addItem(s);
  };

  // Abrir modal de editar servicio
  const handleOpenEditService = (s: Servicio) => {
    setSelectedService(s);
    setServiceNombre(s.nombre);
    setServiceDescripcion(s.descripcion || '');
    setServicePrecio(Number(s.precio_base) || 0);
    setServiceFile(null);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedService(null);
    setServiceNombre('');
    setServiceDescripcion('');
    setServicePrecio(0);
    setServiceFile(null);
  };

  const handleSubmitEdit = async () => {
    if (!selectedService) return;
    const payload = {
      nombre: serviceNombre,
      descripcion: serviceDescripcion,
      precio_base: servicePrecio,
      categoriaId: catId ? Number(catId) : undefined,
    };
    await updateServicio(selectedService.id, payload);
    if (serviceFile) {
      // sube imagen nueva
      await uploadServicioImage(selectedService.id, serviceFile);
    }
    loadServicios();
    handleCloseEditDialog();
  };

  // Al hacer clic en lápiz de imagen dentro de la tarjeta
  const handleEditarImagen = (service: Servicio) => {
    setEditingServiceId(service.id);
    inputFileRef.current?.click();
  };

  // Cuando selecciona archivo para imagen
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingServiceId) return;
    const files = e.target.files;
    if (!files || files.length === 0) {
      setEditingServiceId(null);
      return;
    }
    const file = files[0];
    setUploadingImage(true);
    try {
      await uploadServicioImage(editingServiceId, file);
      loadServicios();
    } catch (err) {
      console.error('Error al subir imagen de servicio:', err);
    } finally {
      setUploadingImage(false);
      setEditingServiceId(null);
      if (inputFileRef.current) inputFileRef.current.value = '';
    }
  };

  /* --------------------------- UI ------------------------------------ */
  return (
    <Box>
      {/* -------- encabezado -------------------------- */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h1">
          {catId ? `Servicios de ${catName}` : 'Servicios Funerarios'}
        </Typography>
      </Stack>

      {loadingServicios && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* -------- GRID de tarjetas ------------------------------------ */}
      <Box sx={S.gridContainer}>
        {[
          ...servicios
        ]
          .sort((a, b) => a.id - b.id)
          .map(s => {
            const precio = Number(s.precio_base) || 0;
            const imagenSrc = s.imagenUrl
              ? s.imagenUrl
              : '/images/servicios/placeholder.jpg';
            const isUploadingThis = uploadingImage && editingServiceId === s.id;

            return (
              <Card key={s.id} variant="outlined" sx={S.cardRoot}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    image={imagenSrc}
                    alt={s.nombre}
                    sx={{
                      height: 140,
                      objectFit: 'cover',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    }}
                  />
                  {user?.rol === 'ADMIN' && (
                    <Tooltip title="Editar imagen">
                      <IconButton
                        component="span"
                        size="small"
                        color="primary"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                        }}
                        onClick={() => handleEditarImagen(s)}
                        disabled={isUploadingThis}
                      >
                        {isUploadingThis ? (
                          <CircularProgress size={20} />
                        ) : (
                          <EditIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <CardContent sx={S.cardContent}>
                  <Typography sx={S.cardHeader}>{s.nombre}</Typography>

                  {s.descripcion && (
                    <Typography
                      sx={S.cardDescription}
                      color="text.secondary"
                    >
                      {s.descripcion}
                    </Typography>
                  )}

                  <Typography variant="h6" color="secondary">
                    Bs {precio.toFixed(2)}
                  </Typography>
                </CardContent>

                <Stack spacing={1} sx={S.actionStack}>
                  {user?.rol === 'ADMIN' ? (
                    <>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(s)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handleOpenEditService(s)}
                      >
                        Editar
                      </Button>
                    </>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => handleAdd(s)}
                    >
                      Añadir al carrito
                    </Button>
                  )}
                </Stack>
              </Card>
            );
          })}
      </Box>

      {/* Input oculto para subir archivo */}
      <input
        type="file"
        accept="image/*"
        ref={inputFileRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el servicio "
            {serviceToDelete?.nombre}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para editar servicio */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Editar Servicio</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del servicio"
            type="text"
            fullWidth
            value={serviceNombre}
            onChange={(e) => setServiceNombre(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Descripción"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={serviceDescripcion}
            onChange={(e) => setServiceDescripcion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Precio base"
            type="number"
            fullWidth
            value={servicePrecio}
            onChange={(e) => setServicePrecio(parseFloat(e.target.value) || 0)}
            sx={{ mb: 2 }}
          />
          <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setServiceFile(e.target.files[0]);
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmitEdit}
            disabled={serviceNombre.trim().length === 0}
          >
            Guardar cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
