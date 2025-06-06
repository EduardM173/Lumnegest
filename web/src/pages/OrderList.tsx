import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import api from "../api/axiosInstance";
import { AuthContext } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

import "../styles/orderList.css";
import "../styles/orderDetail.css";

interface OrdenResumen {
  id: number;
  fecha_creacion: string; // ISO string
  estado: string; // "PENDIENTE" | "CONFIRMADO" | "RECHAZO" | "DEVOLUCION" | "PAGADO"
}

interface ServicioResumen {
  id: number;
  nombre: string;
  precio_base: number;
  cantidad: number;
  subtotal: number;
  imagenUrl?: string | null;
}

interface ClienteResumen {
  id: number;
  nombres: string;
  email: string;
}

interface DifuntoResumen {
  nombres: string;
  fecha_fallecido: string;
  lugar_fallecimiento?: string | null;
  contacto_responsable?: string | null;
  relacion_solicitante?: string | null;
  notas_adicionales?: string | null;
}

interface DetalleOrden {
  id: number;
  fecha_creacion: string;
  estado: string;
  servicios: ServicioResumen[];
  cliente: ClienteResumen;
  difunto: DifuntoResumen;
  total: number;
}

interface OrderRowProps {
  orden: OrdenResumen;
  userRole: string;
  estadoUpdates: Record<number, string>;
  onEstadoChange: (orderId: number, newEstado: string) => void;
  onSaveEstado: (orderId: number) => void;
  onVerDetalles: (orderId: number) => void;
}

const OrderRow = React.memo<OrderRowProps>(
  ({
    orden,
    userRole,
    estadoUpdates,
    onEstadoChange,
    onSaveEstado,
    onVerDetalles,
  }) => {
    const navigate = useNavigate(); // <-- Hook para navegar

    // Memoizar el formato de fecha para no recalcularlo en cada render de la fila
    const fechaFormateada = useMemo(() => {
      return new Date(orden.fecha_creacion).toLocaleDateString("es-BO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }, [orden.fecha_creacion]);

    return (
      <TableRow key={orden.id}>
        <TableCell>{orden.id}</TableCell>
        <TableCell>{fechaFormateada}</TableCell>
        <TableCell>{orden.estado}</TableCell>
        <TableCell align="center">
          {/* Botón “Detalles” */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              fontFamily: "var(--font-subtitulo)",
              color: "var(--color-azul-gris)",
              borderColor: "var(--color-marron)",
              "&:hover": {
                backgroundColor: "rgba(182,159,107,0.1)",
              },
            }}
            onClick={() => onVerDetalles(orden.id)}
          >
            Detalles
          </Button>

          {userRole === "CLIENTE" && (
            <Tooltip
              title={
                orden.estado === "CONFIRMADO"
                  ? "Pagar orden"
                  : "Disponible solo cuando esté CONFIRMADO"
              }
            >
              <span>
                <IconButton
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                  disabled={orden.estado !== "CONFIRMADO"}
                  onClick={() => {
                    if (orden.estado === "CONFIRMADO") {
                      // Navegar a la página de pago final:
                      navigate(`/ordenes/${orden.id}/pagar`);
                    }
                  }}
                >
                  <ShoppingCartIcon />
                </IconButton>
              </span>
            </Tooltip>
          )}

          {(userRole === "OPERADOR" || userRole === "ADMIN") && (
            <Box
              component="span"
              sx={{
                ml: 1,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <TextField
                select
                size="small"
                value={estadoUpdates[orden.id] || orden.estado}
                onChange={(e) =>
                  onEstadoChange(orden.id, e.target.value.trim())
                }
                sx={{
                  width: 130,
                  mr: 1,
                  fontFamily: "var(--font-texto)",
                }}
              >
                {[
                  "PENDIENTE",
                  "CONFIRMADO",
                  "RECHAZO",
                  "DEVOLUCION",
                  "PAGADO",
                ].map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                variant="contained"
                size="small"
                sx={{
                  backgroundColor: "var(--color-dorado)",
                  fontFamily: "var(--font-subtitulo)",
                  "&:hover": {
                    backgroundColor: "#9F864C",
                  },
                }}
                onClick={() => onSaveEstado(orden.id)}
              >
                Guardar
              </Button>
            </Box>
          )}
        </TableCell>
      </TableRow>
    );
  }
);

export default function OrderList() {
  const [loading, setLoading] = useState<boolean>(true);
  const [ordenes, setOrdenes] = useState<OrdenResumen[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [estadoUpdates, setEstadoUpdates] = useState<Record<number, string>>(
    {}
  );

  // Para detalles en modal
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [detalle, setDetalle] = useState<DetalleOrden | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [estadoEdit, setEstadoEdit] = useState<string>("");

  // Filtros
  const [filterEstado, setFilterEstado] = useState<string>("TODOS");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");

  // Paginación
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { fetchNotifications } = useNotifications();

  const rawRole = authCtx?.user?.rol ?? "";
  const userRole = rawRole.toString().toUpperCase().trim();
  const validRoles = ["CLIENTE", "OPERADOR", "ADMIN"];
  const isValidRole = validRoles.includes(userRole);

  // ─── 1) Fetch inicial de órdenes ─────────────────────────────────────────────
  useEffect(() => {
    const fetchOrdenes = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: OrdenResumen[] = [];
        if (userRole === "CLIENTE") {
          const resp = await api.get<OrdenResumen[]>("/ordenes/mias");
          data = resp.data;
        } else if (userRole === "OPERADOR" || userRole === "ADMIN") {
          const resp = await api.get<OrdenResumen[]>("/ordenes");
          data = resp.data;
        } else {
          data = [];
        }

        setOrdenes(data);

        // Inicializar estadoUpdates con el estado actual de cada orden
        const initMap: Record<number, string> = {};
        data.forEach((o) => {
          initMap[o.id] = o.estado;
        });
        setEstadoUpdates(initMap);
      } catch (err: any) {
        console.error("Error al traer las órdenes:", err);
        setError("No se pudo cargar las órdenes. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    if (isValidRole) {
      fetchOrdenes();
    } else {
      setLoading(false);
    }
  }, [userRole, fetchNotifications]);

  // ─── Memoización del filtrado ────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    if (!ordenes.length) return [];

    return ordenes.filter((o) => {
      if (filterEstado !== "TODOS" && o.estado !== filterEstado) {
        return false;
      }
      if (filterDateFrom) {
        const fechaOrden = new Date(o.fecha_creacion);
        const fechaDesde = new Date(filterDateFrom);
        if (fechaOrden < fechaDesde) {
          return false;
        }
      }
      if (filterDateTo) {
        const fechaOrden = new Date(o.fecha_creacion);
        const fechaHasta = new Date(filterDateTo);
        fechaHasta.setHours(23, 59, 59);
        if (fechaOrden > fechaHasta) {
          return false;
        }
      }
      return true;
    });
  }, [ordenes, filterEstado, filterDateFrom, filterDateTo]);

  // ─── Handlers memoizados para tablas y filas ─────────────────────────────────
  const handleEstadoChange = useCallback(
    (orderId: number, newEstado: string) => {
      setEstadoUpdates((prev) => ({
        ...prev,
        [orderId]: newEstado,
      }));
    },
    []
  );

  const handleSaveEstado = useCallback(
    async (orderId: number) => {
      const nuevoEstado = estadoUpdates[orderId]?.trim();
      const estadosDisponibles = [
        "PENDIENTE",
        "CONFIRMADO",
        "RECHAZO",
        "DEVOLUCION",
        "PAGADO",
      ];
      if (!nuevoEstado || !estadosDisponibles.includes(nuevoEstado)) {
        return alert("Selecciona un estado válido antes de guardar.");
      }

      try {
        await api.patch(`/ordenes/${orderId}/estado`, {
          estado: nuevoEstado,
        });
        setOrdenes((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, estado: nuevoEstado } : o
          )
        );
        await fetchNotifications();
        alert(`Estado actualizado a “${nuevoEstado}” para orden #${orderId}.`);
      } catch (err: any) {
        console.error("Error al actualizar la orden:", err);
        if (err.response?.data?.error) {
          alert(`No se pudo cambiar el estado: ${err.response.data.error}`);
        } else {
          alert("No se pudo cambiar el estado. Intenta nuevamente.");
        }
      }
    },
    [estadoUpdates, fetchNotifications]
  );

  const handleVerDetalles = useCallback((orderId: number) => {
    setSelectedOrderId(orderId);
    setOpenDialog(true);
    fetchDetalle(orderId);
  }, []);

  const fetchDetalle = async (orderId: number) => {
    setLoadingDetail(true);
    setErrorDetail(null);
    setDetalle(null);

    try {
      const resp = await api.get<DetalleOrden>(`/ordenes/${orderId}`);
      const data = resp.data;
      setDetalle(data);

      if (userRole === "OPERADOR" || userRole === "ADMIN") {
        setEstadoEdit(data.estado);
      }
    } catch (err: any) {
      console.error("Error al traer el detalle de la orden:", err);
      if (err.response?.data?.error) {
        setErrorDetail(err.response.data.error);
      } else {
        setErrorDetail("No se pudo cargar el detalle de la orden.");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleGuardarCambios = async () => {
    if (!detalle || selectedOrderId === null) return;

    const nuevoEstado = estadoEdit.trim();
    const estadosDisponibles = [
      "PENDIENTE",
      "CONFIRMADO",
      "RECHAZO",
      "DEVOLUCION",
      "PAGADO",
    ];
    if (!estadosDisponibles.includes(nuevoEstado)) {
      return alert("Selecciona un estado válido antes de guardar.");
    }

    try {
      setLoadingDetail(true);
      await api.patch(`/ordenes/${selectedOrderId}/estado`, {
        estado: nuevoEstado,
      });

      setDetalle({ ...detalle, estado: nuevoEstado });
      setOrdenes((prev) =>
        prev.map((o) =>
          o.id === selectedOrderId ? { ...o, estado: nuevoEstado } : o
        )
      );
      setEstadoUpdates((prev) => ({
        ...prev,
        [selectedOrderId]: nuevoEstado,
      }));
      await fetchNotifications();
      alert("Cambios guardados correctamente.");
    } catch (err: any) {
      console.error("Error al actualizar la orden:", err);
      if (err.response?.data?.error) {
        alert(`No se pudo guardar los cambios: ${err.response.data.error}`);
      } else {
        alert("No se pudo guardar los cambios. Intenta nuevamente.");
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrderId(null);
    setDetalle(null);
    setErrorDetail(null);
    setEstadoEdit("");
  };

  // ─── Paginación ───────────────────────────────────────────────────────────────
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  // ─── Título según rol ────────────────────────────────────────────────────────
  let titulo = "";
  if (userRole === "CLIENTE") {
    titulo = "Mis órdenes";
  } else if (userRole === "OPERADOR" || userRole === "ADMIN") {
    titulo = "Todas las órdenes";
  } else {
    titulo = "No tienes permisos para ver órdenes";
  }

  return (
    <Box
      sx={{
        mt: 4,
        mx: "auto",
        maxWidth: 1000,
        mb: 6,
        backgroundColor: "var(--color-crema)",
        p: 2,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontFamily: "var(--font-titulo)",
          fontSize: "36px",
          fontWeight: 700,
          color: "var(--color-dorado)",
        }}
        gutterBottom
      >
        {titulo}
      </Typography>

      {/* ─── Controles de filtrado ────────────────────────────────────────────── */}
      {isValidRole && !loading && !error && ordenes.length > 0 && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            select
            label="Filtrar por estado"
            size="small"
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            sx={{
              width: 180,
              fontFamily: "var(--font-texto)",
              "& .MuiInputLabel-root": {
                color: "var(--color-azul-gris)",
                fontFamily: "var(--font-texto)",
              },
            }}
          >
            <MenuItem value="TODOS">TODOS</MenuItem>
            {[
              "PENDIENTE",
              "CONFIRMADO",
              "RECHAZO",
              "DEVOLUCION",
              "PAGADO",
            ].map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Fecha desde"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            sx={{
              fontFamily: "var(--font-texto)",
              "& .MuiInputLabel-root": {
                color: "var(--color-azul-gris)",
                fontFamily: "var(--font-texto)",
              },
            }}
          />

          <TextField
            label="Fecha hasta"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            sx={{
              fontFamily: "var(--font-texto)",
              "& .MuiInputLabel-root": {
                color: "var(--color-azul-gris)",
                fontFamily: "var(--font-texto)",
              },
            }}
          />

          <Button
            variant="outlined"
            size="small"
            sx={{
              fontFamily: "var(--font-subtitulo)",
              color: "var(--color-azul-gris)",
              borderColor: "var(--color-marron)",
              "&:hover": {
                backgroundColor: "rgba(108,79,75,0.1)",
              },
            }}
            onClick={() => {
              setFilterEstado("TODOS");
              setFilterDateFrom("");
              setFilterDateTo("");
            }}
          >
            Limpiar filtros
          </Button>
        </Box>
      )}

      {loading ? (
        <Box className="orderlist-loading">
          <CircularProgress />
        </Box>
      ) : !isValidRole ? null : error ? (
        <Typography
          sx={{
            fontFamily: "var(--font-texto)",
            color: "red",
          }}
        >
          {error}
        </Typography>
      ) : ordenes.length === 0 ? (
        <Typography
          sx={{
            fontFamily: "var(--font-texto)",
            color: "var(--color-azul-gris)",
          }}
        >
          No hay órdenes para mostrar.
        </Typography>
      ) : filteredOrders.length === 0 ? (
        <Typography
          sx={{
            fontFamily: "var(--font-texto)",
            color: "var(--color-azul-gris)",
          }}
        >
          No hay órdenes que coincidan con los filtros.
        </Typography>
      ) : (
        <>
          <Table className="orderlist-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Fecha de creación</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((o) => (
                <OrderRow
                  key={o.id}
                  orden={o}
                  userRole={userRole}
                  estadoUpdates={estadoUpdates}
                  onEstadoChange={handleEstadoChange}
                  onSaveEstado={handleSaveEstado}
                  onVerDetalles={handleVerDetalles}
                />
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página"
          />
        </>
      )}

      {/* ─────── DIALOG: Detalle de la orden ────────────────────────────────────── */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openDialog}
        onClose={handleCloseDialog}
        scroll="paper"
      >
        <DialogTitle
          sx={{
            fontFamily: "var(--font-subtitulo)",
            color: "var(--color-azul-gris)",
          }}
        >
          {detalle
            ? `Detalle de la orden #${detalle.id}`
            : loadingDetail
            ? "Cargando detalle..."
            : "Detalle no disponible"}
        </DialogTitle>
        <DialogContent dividers>
          {loadingDetail ? (
            <Box className="orderdetail-loading">
              <CircularProgress />
            </Box>
          ) : errorDetail ? (
            <Typography
              sx={{
                fontFamily: "var(--font-texto)",
                color: "red",
              }}
            >
              {errorDetail}
            </Typography>
          ) : detalle ? (
            <Paper className="orderdetail-paper" elevation={2} sx={{ p: 3 }}>
              <Grid container spacing={2}>
                {/* Fecha de creación */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Fecha de creación:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-texto)",
                      color: "var(--color-azul-gris)",
                    }}
                  >
                    {new Date(detalle.fecha_creacion).toLocaleString(
                      "es-BO",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Typography>
                </Grid>

                {/* Estado */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Estado:
                  </Typography>
                  {userRole === "CLIENTE" ? (
                    <Typography className="orderdetail-estado">
                      {detalle.estado}
                    </Typography>
                  ) : (
                    <TextField
                      select
                      label="Estado"
                      value={estadoEdit}
                      onChange={(e) => setEstadoEdit(e.target.value)}
                      fullWidth
                      size="small"
                      sx={{
                        fontFamily: "var(--font-texto)",
                        "& .MuiInputLabel-root": {
                          color: "var(--color-azul-gris)",
                          fontFamily: "var(--font-texto)",
                        },
                      }}
                    >
                      {[
                        "PENDIENTE",
                        "CONFIRMADO",
                        "RECHAZO",
                        "DEVOLUCION",
                        "PAGADO",
                      ].map((e) => (
                        <MenuItem key={e} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                </Grid>

                {/* Datos del cliente */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Cliente:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-texto)",
                      color: "var(--color-azul-gris)",
                    }}
                  >
                    {detalle.cliente.nombres} ({detalle.cliente.email})
                  </Typography>
                </Grid>

                {/* ► Listado de TODOS los servicios */}
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Servicios contratados:
                  </Typography>
                  {detalle.servicios.map((srv) => (
                    <Box
                      key={srv.id}
                      sx={{
                        mb: 2,
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid var(--color-gris-claro)",
                        borderRadius: 2,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {srv.imagenUrl && (
                        <Box
                          component="img"
                          src={srv.imagenUrl}
                          alt={srv.nombre}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 1,
                            mr: 2,
                          }}
                        />
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "var(--font-texto)",
                            color: "var(--color-azul-gris)",
                            fontWeight: 600,
                          }}
                        >
                          {srv.nombre}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "var(--font-texto)",
                            color: "var(--color-azul-gris)",
                          }}
                        >
                          Precio unitario: {srv.precio_base.toFixed(2)} Bs
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "var(--font-texto)",
                            color: "var(--color-azul-gris)",
                          }}
                        >
                          Cantidad: {srv.cantidad}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "var(--font-texto)",
                            color: "var(--color-azul-gris)",
                          }}
                        >
                          Subtotal: {srv.subtotal.toFixed(2)} Bs
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Grid>

                {/* Datos del difunto */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Nombre del difunto:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-texto)",
                      color: "var(--color-azul-gris)",
                    }}
                  >
                    {detalle.difunto.nombres}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Fecha de fallecimiento:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-texto)",
                      color: "var(--color-azul-gris)",
                    }}
                  >
                    {new Date(detalle.difunto.fecha_fallecido).toLocaleDateString(
                      "es-BO",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </Typography>
                </Grid>
                {detalle.difunto.lugar_fallecimiento && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Lugar:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-texto)",
                        color: "var(--color-azul-gris)",
                      }}
                    >
                      {detalle.difunto.lugar_fallecimiento}
                    </Typography>
                  </Grid>
                )}
                {detalle.difunto.contacto_responsable && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Contacto responsable:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-texto)",
                        color: "var(--color-azul-gris)",
                      }}
                    >
                      {detalle.difunto.contacto_responsable}
                    </Typography>
                  </Grid>
                )}
                {detalle.difunto.relacion_solicitante && (
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Relación solicitante:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-texto)",
                        color: "var(--color-azul-gris)",
                      }}
                    >
                      {detalle.difunto.relacion_solicitante}
                    </Typography>
                  </Grid>
                )}
                {detalle.difunto.notas_adicionales && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle1"
                      className="orderdetail-label"
                    >
                      Notas adicionales:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "var(--font-texto)",
                        color: "var(--color-azul-gris)",
                      }}
                    >
                      {detalle.difunto.notas_adicionales}
                    </Typography>
                  </Grid>
                )}

                {/* Total */}
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    className="orderdetail-label"
                  >
                    Total:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "var(--font-texto)",
                      color: "var(--color-azul-gris)",
                      fontWeight: 600,
                    }}
                  >
                    {detalle.total.toFixed(2)} Bs
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ) : (
            <Typography
              sx={{
                fontFamily: "var(--font-texto)",
                color: "var(--color-azul-gris)",
              }}
            >
              No se encontraron datos de la orden.
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              fontFamily: "var(--font-subtitulo)",
              color: "var(--color-azul-gris)",
              borderColor: "var(--color-marron)",
              "&:hover": {
                backgroundColor: "rgba(108,79,75,0.1)",
              },
            }}
          >
            Cerrar
          </Button>

          {userRole !== "CLIENTE" && detalle && (
            <Button
              onClick={handleGuardarCambios}
              variant="contained"
              disabled={loadingDetail}
              sx={{
                backgroundColor: "var(--color-dorado)",
                fontFamily: "var(--font-subtitulo)",
                "&:hover": {
                  backgroundColor: "#9F864C",
                },
              }}
            >
              {loadingDetail ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
