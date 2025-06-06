// web/src/pages/Servicios/AdminCategorias.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  Divider,
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAsync } from '../../hooks/useAsync';
import {
  getCategorias,
  deleteCategoria,
  createCategoria,
  updateCategoria,
  uploadCategoriaImage,
  Categoria,
  getServicios,
  deleteServicio,
  createServicio,
  updateServicio,
  uploadServicioImage,
  Servicio,
} from '../../api/services';

import '../../styles/adminCategorias.css';

export default function AdminCategorias() {
  // --- Estados para categorías ---
  const { data: cats = [], run: loadCategorias } = useAsync(getCategorias);
  const [openCatDialog, setOpenCatDialog] = useState(false);
  const [isEditingCat, setIsEditingCat] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null);
  const [categoriaNombre, setCategoriaNombre] = useState('');
  const [categoriaFile, setCategoriaFile] = useState<File | null>(null);

  const [openDeleteCatDialog, setOpenDeleteCatDialog] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<Categoria | null>(null);

  // --- Estados para expandir/colapsar servicios ---
  const [expandedCats, setExpandedCats] = useState<number[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<number, Servicio[]>>({});

  // --- Estados para editar/crear un servicio ---
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [isEditingService, setIsEditingService] = useState(false);
  const [selectedService, setSelectedService] = useState<Servicio | null>(null);
  const [serviceNombre, setServiceNombre] = useState('');
  const [serviceDescripcion, setServiceDescripcion] = useState('');
  const [servicePrecio, setServicePrecio] = useState<number>(0);
  const [serviceCatId, setServiceCatId] = useState<number | null>(null);
  const [serviceFile, setServiceFile] = useState<File | null>(null);

  // --- Estados para confirmación de eliminación de servicio ---
  const [openDeleteServiceDialog, setOpenDeleteServiceDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<{ service: Servicio; catId: number } | null>(null);

  // Carga inicial de categorías
  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  // Función para cargar servicios de una categoría
  const loadServiciosForCategory = async (catId: number) => {
    try {
      const servicios = await getServicios(String(catId));
      setServicesMap(prev => ({ ...prev, [catId]: servicios }));
    } catch (err) {
      console.error('Error al cargar servicios para categoría', catId, err);
    }
  };

  // Toggle expandir/colapsar servicios
  const handleToggleCategory = async (cat: Categoria) => {
    const alreadyExpanded = expandedCats.includes(cat.id);
    if (alreadyExpanded) {
      setExpandedCats(prev => prev.filter(id => id !== cat.id));
    } else {
      if (!servicesMap[cat.id]) {
        await loadServiciosForCategory(cat.id);
      }
      setExpandedCats(prev => [...prev, cat.id]);
    }
  };

  // ---- Crear/editar categoría ----
  const handleOpenNewCat = () => {
    setIsEditingCat(false);
    setSelectedCategoria(null);
    setCategoriaNombre('');
    setCategoriaFile(null);
    setOpenCatDialog(true);
  };
  const handleOpenEditCat = (cat: Categoria) => {
    setIsEditingCat(true);
    setSelectedCategoria(cat);
    setCategoriaNombre(cat.nombre);
    setCategoriaFile(null);
    setOpenCatDialog(true);
  };
  const handleCloseCatDialog = () => {
    setOpenCatDialog(false);
    setSelectedCategoria(null);
    setCategoriaNombre('');
    setCategoriaFile(null);
  };
  const handleSubmitCat = async () => {
    try {
      let createdCat: Categoria | null = null;

      if (isEditingCat && selectedCategoria) {
        // Actualizar solo nombre
        await updateCategoria(selectedCategoria.id, { nombre: categoriaNombre });
        // Si subieron archivo nuevo, enviarlo
        if (categoriaFile) {
          await uploadCategoriaImage(selectedCategoria.id, categoriaFile);
        }
      } else {
        // Crear categoría
        createdCat = await createCategoria({ nombre: categoriaNombre });
        // Si hay archivo, subir imagen
        if (createdCat && categoriaFile) {
          await uploadCategoriaImage(createdCat.id, categoriaFile);
        }
      }
    } catch (err) {
      console.error('Error al guardar categoría:', err);
    } finally {
      loadCategorias();
      handleCloseCatDialog();
    }
  };

  // ---- Eliminar categoría ----
  const handleOpenDeleteCat = (cat: Categoria) => {
    setCategoriaToDelete(cat);
    setOpenDeleteCatDialog(true);
  };
  const handleCloseDeleteCat = () => {
    setCategoriaToDelete(null);
    setOpenDeleteCatDialog(false);
  };
  const handleConfirmDeleteCat = async () => {
    if (categoriaToDelete) {
      await deleteCategoria(categoriaToDelete.id);
      loadCategorias();
      setExpandedCats(prev => prev.filter(id => id !== categoriaToDelete.id));
      setServicesMap(prev => {
        const copy = { ...prev };
        delete copy[categoriaToDelete.id];
        return copy;
      });
    }
    handleCloseDeleteCat();
  };

  // ---- Abrir modal para crear servicio ----
  const handleOpenNewService = (catId: number) => {
    setIsEditingService(false);
    setSelectedService(null);
    setServiceCatId(catId);
    setServiceNombre('');
    setServiceDescripcion('');
    setServicePrecio(0);
    setServiceFile(null);
    setOpenServiceDialog(true);
  };

  // ---- Editar servicio: abrir modal con datos precargados ----
  const handleOpenEditService = (catId: number, serv: Servicio) => {
    setIsEditingService(true);
    setSelectedService(serv);
    setServiceCatId(catId);
    setServiceNombre(serv.nombre);
    setServiceDescripcion(serv.descripcion || '');
    setServicePrecio(Number(serv.precio_base) || 0);
    setServiceFile(null);
    setOpenServiceDialog(true);
  };
  const handleCloseServiceDialog = () => {
    setOpenServiceDialog(false);
    setSelectedService(null);
    setServiceNombre('');
    setServiceDescripcion('');
    setServicePrecio(0);
    setServiceCatId(null);
    setServiceFile(null);
  };
  const handleSubmitService = async () => {
    try {
      let savedService: Servicio | null = null;

      if (isEditingService && selectedService && serviceCatId != null) {
        // Actualizar campos (sin imagen)
        const payload = {
          nombre: serviceNombre,
          descripcion: serviceDescripcion,
          precio_base: servicePrecio,
          categoriaId: serviceCatId,
        };
        await updateServicio(selectedService.id, payload);
        // Si subieron un archivo, lo enviamos
        if (serviceFile) {
          await uploadServicioImage(selectedService.id, serviceFile);
        }
        // Recargar servicios de esta categoría
        await loadServiciosForCategory(serviceCatId);
      } else if (!isEditingService && serviceCatId != null) {
        // Crear nuevo servicio
        const newService = await createServicio({
          nombre: serviceNombre,
          descripcion: serviceDescripcion,
          precio_base: servicePrecio,
          categoriaId: serviceCatId,
        });
        savedService = newService;
        // Si hay imagen, subirla
        if (savedService && serviceFile) {
          await uploadServicioImage(savedService.id, serviceFile);
        }
        // Recargar servicios
        await loadServiciosForCategory(serviceCatId);
      }
    } catch (err) {
      console.error('Error al guardar servicio:', err);
    } finally {
      handleCloseServiceDialog();
    }
  };

  // ---- Eliminar servicio: abrir diálogo de confirmación ----
  const handleOpenDeleteService = (catId: number, serv: Servicio) => {
    setServiceToDelete({ service: serv, catId });
    setOpenDeleteServiceDialog(true);
  };
  const handleCloseDeleteService = () => {
    setServiceToDelete(null);
    setOpenDeleteServiceDialog(false);
  };
  const handleConfirmDeleteService = async () => {
    if (serviceToDelete) {
      const { service, catId } = serviceToDelete;
      await deleteServicio(service.id);
      const serviciosActuales = servicesMap[catId] || [];
      setServicesMap(prev => ({
        ...prev,
        [catId]: serviciosActuales.filter(s => s.id !== service.id),
      }));
    }
    handleCloseDeleteService();
  };

  return (
    <Box sx={{ mt: 4, px: 2 }}>
      {/* Título con estilo personalizado */}
      <Typography variant="h4" className="page-title">
        Administrar Categorías y Servicios
      </Typography>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        {/* Botón “Nueva categoría” */}
        <Button variant="contained" onClick={handleOpenNewCat} className="btn-primary">
          Nueva categoría
        </Button>
      </Box>

      {cats.length === 0 ? (
        <Typography>No hay categorías registradas.</Typography>
      ) : (
        <List>
          {[...cats]
            .sort((a, b) => a.id - b.id)
            .map((c: Categoria) => {
              const isExpanded = expandedCats.includes(c.id);
              const servicios = servicesMap[c.id] || [];

              return (
                <React.Fragment key={c.id}>
                  <ListItem divider>
                    <IconButton
                      edge="start"
                      onClick={() => handleToggleCategory(c)}
                      size="small"
                    >
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                    <ListItemText primary={c.nombre} className="category-item" />
                    <ListItemSecondaryAction className="category-actions">
                      <IconButton edge="end" onClick={() => handleOpenEditCat(c)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton edge="end" onClick={() => handleOpenDeleteCat(c)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box sx={{ ml: 4, mr: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1} mt={1}>
                        <Typography variant="subtitle1">
                          Servicios de "{c.nombre}"
                        </Typography>
                        {/* Botón “Nuevo servicio” */}
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => handleOpenNewService(c.id)}
                          className="btn-primary"
                        >
                          Nuevo servicio
                        </Button>
                      </Box>

                      {servicios.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No hay servicios en esta categoría.
                        </Typography>
                      ) : (
                        <List dense>
                          {servicios.map((s: Servicio) => (
                            <ListItem key={s.id} divider sx={{ pl: 2 }} className="service-item">
                              <ListItemText
                                primary={s.nombre}
                                secondary={`Bs ${Number(s.precio_base).toFixed(2)}`}
                              />
                              <ListItemSecondaryAction className="service-actions">
                                <IconButton
                                  edge="end"
                                  onClick={() => handleOpenEditService(c.id, s)}
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  onClick={() => handleOpenDeleteService(c.id, s)}
                                  size="small"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          ))}
                        </List>
                      )}
                      <Divider sx={{ mt: 2, mb: 2 }} />
                    </Box>
                  </Collapse>
                </React.Fragment>
              );
            })}
        </List>
      )}

      {/* Diálogo para crear/editar categoría */}
      <Dialog open={openCatDialog} onClose={handleCloseCatDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditingCat ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la categoría"
            type="text"
            fullWidth
            value={categoriaNombre}
            onChange={(e) => setCategoriaNombre(e.target.value)}
          />
          {/* Input para la imagen */}
          <Box mt={2}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setCategoriaFile(e.target.files[0]);
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCatDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmitCat}
            disabled={categoriaNombre.trim().length === 0}
            className="btn-primary"
          >
            {isEditingCat ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación de categoría */}
      <Dialog
        open={openDeleteCatDialog}
        onClose={handleCloseDeleteCat}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la categoría "{categoriaToDelete?.nombre}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteCat}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteCat}
            className="btn-primary"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para crear/editar servicio */}
      <Dialog open={openServiceDialog} onClose={handleCloseServiceDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditingService ? 'Editar Servicio' : 'Crear Servicio'}
        </DialogTitle>
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
          {/* Input para la imagen de servicio */}
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
          <Button onClick={handleCloseServiceDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSubmitService}
            disabled={serviceNombre.trim().length === 0}
            className="btn-primary"
          >
            {isEditingService ? 'Guardar cambios' : 'Crear'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación de eliminación de servicio */}
      <Dialog
        open={openDeleteServiceDialog}
        onClose={handleCloseDeleteService}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el servicio "{serviceToDelete?.service.nombre}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteService}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteService}
            className="btn-primary"
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
