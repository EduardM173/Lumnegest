// web/src/pages/Servicios/CategoriasLanding.tsx

import React, { useEffect, useContext, useRef, useState } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

import { useAsync } from '../../hooks/useAsync';
import {
  getCategorias,
  uploadCategoriaImage,
  Categoria,
} from '../../api/services';
import { AuthContext } from '../../contexts/AuthContext';

import * as S from '../../styles/categoriasLandingStyles';

export default function CategoriasLanding() {
  const nav = useNavigate();
  const { data: cats = [], run, loading } = useAsync<Categoria[]>(getCategorias);
  const auth = useContext(AuthContext);

  // Id de la categoría cuyo archivo se está cargando
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  // Estado de carga específica de la imagen
  const [uploadingImage, setUploadingImage] = useState(false);

  // Ref para el input file oculto
  const inputFileRef = useRef<HTMLInputElement>(null);

  // Cuando se selecciona un archivo, se dispara esta función
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCatId) return;
    const files = e.target.files;
    if (!files || files.length === 0) {
      setEditingCatId(null);
      return;
    }
    const file = files[0];
    setUploadingImage(true);

    try {
      // Llamamos al servicio que sube la imagen
      await uploadCategoriaImage(editingCatId, file);
      // Refrescamos las categorías (traemos la nueva imagenUrl)
      await run();
    } catch (err) {
      console.error('Error al subir la imagen:', err);
    } finally {
      setUploadingImage(false);
      setEditingCatId(null);
      if (inputFileRef.current) {
        inputFileRef.current.value = ''; // resetea el input para permitir re-subir el mismo archivo si se desea
      }
    }
  };

  // Al hacer clic en el lápiz, guardamos la categoría y disparamos el input file
  const handleEditarImagen = (categoria: Categoria) => {
    setEditingCatId(categoria.id);
    // Disparamos el click en el input oculto
    inputFileRef.current?.click();
  };

  // Carga inicial de categorías
  useEffect(() => {
    run();
  }, [run]);

  // Creamos una copia ordenada de cats por id ascendente.
  // Como en nuestro tipo `Categoria.id` es string, convertimos a Number para asegurarnos de un orden numérico.
  const sortedCats = [...cats].sort((a, b) => Number(a.id) - Number(b.id));

  return (
    <Box sx={{ px: 2, py: 3 }}>
      <Typography variant="h1" gutterBottom>
        Servicios &amp; Productos
      </Typography>

      {loading && (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={S.gridContainer}>
        {sortedCats.map((c) => {
          const rolActual = auth?.user?.rol || 'CLIENTE';
          const puedeEditarImagen =
            rolActual === 'ADMIN' || rolActual === 'OPERADOR';
          const isUploadingThis = uploadingImage && editingCatId === c.id;

          // Usamos directamente c.imagenUrl si proviene como URL completa
          const imagenSrc = c.imagenUrl
            ? c.imagenUrl
            : '/images/categorias/placeholder.jpg';

          return (
            <Card key={c.id} sx={S.cardRoot} variant="outlined">
              <CardActionArea
                sx={S.actionArea}
                onClick={() => nav(`/servicios/cat/${c.id}`)}
              >
                <Box sx={S.mediaContainer}>
                  <CardMedia
                    component="img"
                    image={imagenSrc}
                    alt={c.nombre}
                    sx={S.media}
                  />

                  {puedeEditarImagen && (
                    <Tooltip title="Editar imagen">
                      <IconButton
                        component="span"
                        size="small"
                        color="primary"
                        sx={S.editIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditarImagen(c);
                        }}
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

                <Box sx={S.contentBox}>
                  <Typography sx={S.title}>{c.nombre}</Typography>
                </Box>
              </CardActionArea>
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
    </Box>
  );
}
