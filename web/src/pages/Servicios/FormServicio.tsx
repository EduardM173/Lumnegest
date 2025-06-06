// web/src/pages/Servicios/FormServicio.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, MenuItem, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import {
  Servicio,
  createServicio,
  updateServicio,
  getServicios,
  getCategorias,
  Categoria
} from '../../api/services';
import { useAsync } from '../../hooks/useAsync';

type FormValues = {
  nombre: string;
  descripcion?: string;
  precio_base: number;
  categoriaId?: string; // manejamos como string en el select
};

export default function FormServicio() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ defaultValues: { categoriaId: '' } });
  const { data: cats = [], run: loadCats } = useAsync<Categoria[]>(getCategorias);
  const [submitError, setSubmitError] = React.useState<string>();

  // cargo categorías
  useEffect(() => {
    loadCats();
  }, [loadCats]);

  // si estoy editando, precargo el servicio
  useEffect(() => {
    if (!id) return;
    getServicios().then(list => {
      const srv = list.find(s => s.id === id);
      if (srv) {
        reset({
          nombre: srv.nombre,
          descripcion: srv.descripcion ?? '',
          precio_base: Number(srv.precio_base),
          categoriaId: srv.categoriaId != null ? String(srv.categoriaId) : ''
        });
      }
    });
  }, [id, reset]);

  const onSubmit = async (data: FormValues) => {
    setSubmitError(undefined);
    // armo el payload con tipos correctos
    const payload: Partial<Omit<Servicio, 'id' | 'activo'>> = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      precio_base: data.precio_base,
      categoriaId:
        data.categoriaId && data.categoriaId !== ''
          ? Number(data.categoriaId)
          : null
    };
    try {
      if (id) {
        await updateServicio(id, payload);
      } else {
        await createServicio(payload);
      }
      nav('/servicios');
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || err.message || 'Error');
    }
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
      <Typography variant="h1" gutterBottom>
        {id ? 'Editar Servicio' : 'Nuevo Servicio'}
      </Typography>
      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <TextField
          label="Nombre"
          fullWidth
          required
          sx={{ mb: 2 }}
          error={!!errors.nombre}
          helperText={errors.nombre && 'Requerido'}
          {...register('nombre', { required: true })}
        />

        <TextField
          label="Descripción"
          fullWidth
          sx={{ mb: 2 }}
          multiline
          rows={3}
          {...register('descripcion')}
        />

        <TextField
          label="Precio base"
          type="number"
          fullWidth
          required
          sx={{ mb: 2 }}
          error={!!errors.precio_base}
          helperText={errors.precio_base && 'Requerido y numérico'}
          {...register('precio_base', { required: true, valueAsNumber: true })}
        />

        <Controller
          name="categoriaId"
          control={control}
          render={({ field }) => (
            <TextField
              select
              label="Categoría"
              fullWidth
              sx={{ mb: 2 }}
              {...field}
            >
              <MenuItem value="">Sin categoría</MenuItem>
              {cats.map(c => (
                <MenuItem key={c.id} value={String(c.id)}>
                  {c.nombre}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Button
          variant="contained"
          type="submit"
          fullWidth
          disabled={isSubmitting}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
}
