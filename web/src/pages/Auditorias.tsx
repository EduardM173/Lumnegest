import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  Container, Typography, TextField, MenuItem, Select, Alert,
  Box, InputLabel, FormControl, CircularProgress
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { format, isValid, parseISO } from 'date-fns';
import { debounce } from 'lodash';
import api from '../api/axiosInstance';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import "../styles/auditoria.css";

interface AuditLog {
  id: number;
  user: string;
  tabla: string;
  operacion: string;
  registroId: number;
  antes: Record<string, any>;
  despues: Record<string, any>;
  realizado_en: string;
}

const tablaMap: Record<string,string> = {
  servicio: 'Servicios',
  obituario: 'Obituarios',
  usuario: 'Usuarios',
  orden: 'Órdenes',
  difunto: 'Difuntos',
  condolencia: 'Condolencias',
};

const operacionMap: Record<string,string> = {
  INSERT: 'Creado',
  UPDATE: 'Editado',
  DELETE: 'Eliminado',
};

// Helper para extraer sólo las diferencias entre dos objetos
const diffState = (antes: Record<string, any>, despues: Record<string, any>) =>
  Object.keys({ ...antes, ...despues })
    .filter(key => antes[key] !== despues[key])
    .map(key => {
      const label = key.charAt(0).toUpperCase() + key.slice(1);
      const from = antes[key] ?? '—';
      const to   = despues[key] ?? '—';
      return `${label}: ${from} → ${to}`;
    });

const Auditorias: React.FC = () => {
  const { user } = useContext(AuthContext) ?? {};
  const navigate = useNavigate();

  const [auditLogs, setAuditLogs]     = useState<AuditLog[]>([]);
  const [filterTabla, setFilterTabla] = useState('');
  const [filterDate, setFilterDate]   = useState('');
  const [dateError, setDateError]     = useState('');
  const [loading, setLoading]         = useState(false);
  const [totalLogs, setTotalLogs]     = useState(0);
  const [error, setError]             = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });

  const columnas: GridColDef[] = [
    { field: 'user', headerName: 'Usuario', width: 180 },
    {
      field: 'realizado_en',
      headerName: 'Fecha y Hora',
      width: 180,
      renderCell: ({ value }) => {
        if (!value) return '';
        const dt = isValid(parseISO(value)) ? parseISO(value) : new Date(value);
        return isValid(dt) ? format(dt, 'dd/MM/yyyy HH:mm:ss') : '';
      }
    },
    {
      field: 'tabla',
      headerName: 'Módulo',
      width: 140,
      renderCell: ({ value }) => tablaMap[value as string] ?? (value as string) ?? ''
    },
    {
      field: 'operacion',
      headerName: 'Acción',
      width: 130,
      renderCell: ({ value }) => operacionMap[value as string] ?? (value as string) ?? ''
    },
    { field: 'registroId', headerName: 'ID Registro', width: 110 },

    // Columna que muestra sólo los campos que cambiaron
    {
      field: 'cambios',
      headerName: 'Cambios',
      flex: 1,
      renderCell: ({ row }) => {
        const diffs = diffState(row.antes, row.despues);
        if (diffs.length === 0) return '';
        return (
          <Box
            component="pre"
            sx={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontFamily: 'inherit',
              margin: 0,
            }}
          >
            {diffs.join('\n')}
          </Box>
        );
      }
    },
  ];

  const fetchLogs = useCallback(async () => {
    if (user?.rol !== 'ADMIN') {
      setError('Acceso no autorizado');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const params: any = {
        page:  paginationModel.page + 1,
        limit: paginationModel.pageSize,
      };
      if (filterTabla) params.tabla = filterTabla;
      if (filterDate)  params.date  = filterDate;

      const { data } = await api.get('/auditoria', { params });
      setAuditLogs(data.logs);
      setTotalLogs(data.total);
    } catch (e: any) {
      setError(e.response?.data?.error || 'Error cargando auditorías');
      if ([401,403].includes(e.response?.status)) navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [user, filterTabla, filterDate, paginationModel, navigate]);

  const debouncedFetch = useCallback(debounce(fetchLogs, 200), [fetchLogs]);

  useEffect(() => {
    debouncedFetch();
    return debouncedFetch.cancel;
  }, [
    filterTabla,
    filterDate,
    paginationModel.page,
    paginationModel.pageSize,
    debouncedFetch
  ]);

  const onTablaChange = (e: any) => {
    setFilterTabla(e.target.value);
    setPaginationModel(p => ({ ...p, page: 0 }));
  };
  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setFilterDate(v);
    setPaginationModel(p => ({ ...p, page: 0 }));
    if (v && !isValid(new Date(v))) setDateError('Fecha inválida');
    else setDateError('');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt:8, mb:4 }}
      className="audit-page"
    >
      <Typography
        variant="h4"
        gutterBottom
        className="page-title"
        sx={{ fontFamily:"'Playfair Display'", color:'#3A4A58' }}
      >
        Auditorías
      </Typography>

      {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

      <Box
        className="audit-filters"
        display="flex" gap={2} mb={2} flexWrap="wrap"
      >
        <FormControl sx={{ flex:'1 1 300px' }}>
          <InputLabel>Filtrar por módulo</InputLabel>
          <Select value={filterTabla} onChange={onTablaChange}>
            <MenuItem value=''>Todos</MenuItem>
            {Object.keys(tablaMap).map(t => (
              <MenuItem key={t} value={t}>
                {tablaMap[t]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Filtrar por fecha"
          type="date"
          value={filterDate}
          onChange={onDateChange}
          error={!!dateError}
          helperText={dateError}
          InputLabelProps={{ shrink: true }}
          sx={{ flex:'1 1 300px' }}
        />
      </Box>

      <Box
        className="audit-table-container"
        sx={{ height:600, width:'100%' }}
      >
        {loading && <CircularProgress sx={{ display:'block', mx:'auto', my:2 }} />}
        <DataGrid
          rows={auditLogs}
          columns={columnas}
          paginationMode="server"
          rowCount={totalLogs}
          loading={loading}
          pageSizeOptions={[10,25,50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
        />
      </Box>
    </Container>
  );
};

export default Auditorias;
