// frontend/src/components/Navbar.tsx

import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Theme,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { styled, keyframes } from "@mui/system";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNotifications } from "../contexts/NotificationContext";
import Logo from "../assets/Logo_B.png";

const NAV_BG = "#3A4A58";
const TEXT_COLOR = "#FFFFFF";

const NavLink = styled(Link)({
  color: TEXT_COLOR,
  textDecoration: "none",
  fontFamily: `'Source Sans Pro', sans-serif`,
  fontWeight: 600,
});

const bump = keyframes`
  0% { transform: scale(1) }
  20% { transform: scale(1.2) }
  40% { transform: scale(.9) }
  60% { transform: scale(1.05) }
  100% { transform: scale(1) }
`;

export default function Navbar() {
  const { user, logout } = useContext(AuthContext) ?? {};
  const { items, clear } = useCart();
  const { notifications, fetchNotifications, markAsRead } = useNotifications();
  const nav = useNavigate();
  const loc = useLocation();
  const isMb = useMediaQuery((t: Theme) => t.breakpoints.down("md"));

  // Cantidad de notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.leida).length;

  // “Bump” en el carrito cuando cambia items
  const itemCount = items.reduce((a, l) => a + l.cantidad, 0);
  const [bumpCart, setBumpCart] = useState(false);
  useEffect(() => {
    if (itemCount === 0) return;
    setBumpCart(true);
    const t = setTimeout(() => setBumpCart(false), 300);
    return () => clearTimeout(t);
  }, [itemCount]);

  const [drawer, setDrawer] = useState(false);
  const [adminAnchor, setAdmA] = useState<HTMLElement | null>(null);
  const [notifAnchor, setNotifAnchor] = useState<HTMLElement | null>(null);

  const scrollAbout = () => {
    if (loc.pathname !== "/") nav("/");
    setTimeout(
      () =>
        document
          .getElementById("quienes-somos")
          ?.scrollIntoView({ behavior: "smooth" }),
      100
    );
  };

  const doLogout = () => {
    clear();
    logout?.();
    nav("/login");
  };

  const links: { label: string; path?: string; action?: () => void }[] = [
    { label: "Servicios", path: "/servicios" },
    { label: "Quiénes somos", action: scrollAbout },
    { label: "Contacto", path: "/contacto" },
    { label: "Obituarios", path: "/obituarios" },
  ];

  const canSeeOrders = user && ["CLIENTE", "OPERADOR", "ADMIN"].includes(user.rol);
  if (canSeeOrders) {
    links.push({ label: "Órdenes", path: "/ordenes" });
  }

  const adminItems =
    user?.rol === "ADMIN"
      ? [
          { to: "/servicios/categorias", txt: "Categorías" },
          { to: "/usuarios", txt: "Administrar usuarios" },
          { to: "/auditoria", txt: "Ver auditoría" },
          { to: "/dashboard", txt: "Dashboard" },
        ]
      : null;

  const CartBtn = () =>
    user && (user.rol === "CLIENTE" || user.rol === "OPERADOR") && (
      <Tooltip title="Mi carrito">
        <IconButton sx={{ color: TEXT_COLOR }} onClick={() => nav("/checkout")}>
          <Badge
            color="error"
            badgeContent={itemCount}
            overlap="circular"
            invisible={itemCount === 0}
          >
            <ShoppingCart
              sx={bumpCart ? { animation: `${bump} 300ms ease-out` } : undefined}
            />
          </Badge>
        </IconButton>
      </Tooltip>
    );

  const RegCliBtn = () =>
    user && (user.rol === "OPERADOR" || user.rol === "ADMIN") && (
      <Button
        startIcon={<PersonAddIcon />}
        sx={{ color: TEXT_COLOR, fontWeight: 600 }}
        onClick={() => nav("/RegistrarCliente")}
      >
        Registrar cliente
      </Button>
    );

  // Solo usuarios CLIENTE pueden ver la campanita
  const NotifBtn = () =>
    user?.rol === "CLIENTE" ? (
      <Tooltip title="Notificaciones">
        <IconButton
          sx={{ color: TEXT_COLOR, ml: 1 }}
          onClick={(e) => {
            fetchNotifications();
            setNotifAnchor(e.currentTarget);
          }}
        >
          <Badge
            color="error"
            badgeContent={unreadCount}
            overlap="circular"
            invisible={unreadCount === 0}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    ) : null;

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  /**
   * Al hacer clic en cada notificación:
   * - Si tiene previewUrl (local), abrir la URL.
   * - Si no, extraer el ID de la orden del asunto y navegar a /ordenes/seguimiento/:id
   */
  const handleNotifClick = async (notifId: string, asunto: string) => {
    // 1) Marca como leída (local o backend)
    await markAsRead(notifId);

    // 2) Buscar la notificación en nuestro estado
    const noti = notifications.find((n) => n.id === notifId);
    if (!noti) {
      handleNotifClose();
      return;
    }

    // 3) Si tiene previewUrl -> abrir en nueva pestaña
    if (noti.previewUrl) {
      window.open(noti.previewUrl, "_blank");
      handleNotifClose();
      return;
    }

    // 4) Si no, extraer ID de la orden del asunto
    const match = asunto.match(/Orden\s+#(\d+)/i);
    if (match) {
      const orderId = Number(match[1]);
      nav(`/ordenes/seguimiento/${orderId}`);
    }
    handleNotifClose();
  };

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: NAV_BG,
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Box component="img" src={Logo} alt="LumenGest" sx={{ height: 40, mr: 2 }} />
            <Typography
              variant="h6"
              sx={{
                color: TEXT_COLOR,
                fontFamily: `'Playfair Display'`,
                fontWeight: 700,
              }}
            >
              LumenGest
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {isMb ? (
            <>
              <IconButton sx={{ color: TEXT_COLOR }} onClick={() => setDrawer(true)}>
                <MenuIcon />
              </IconButton>

              <Drawer anchor="right" open={drawer} onClose={() => setDrawer(false)}>
                <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawer(false)}>
                  <List>
                    {links.map((l) =>
                      l.path ? (
                        <ListItemButton key={l.label} component={Link} to={l.path}>
                          <ListItemText
                            primary={l.label}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItemButton>
                      ) : (
                        <ListItemButton key={l.label} onClick={l.action}>
                          <ListItemText
                            primary={l.label}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItemButton>
                      )
                    )}

                    {(user?.rol === "CLIENTE" || user?.rol === "OPERADOR") && (
                      <ListItemButton component={Link} to="/checkout">
                        <ShoppingCart sx={{ mr: 1 }} />
                        <ListItemText
                          primary={`Mi carrito (${itemCount})`}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItemButton>
                    )}

                    {canSeeOrders && (
                      <ListItemButton component={Link} to="/ordenes">
                        <ListItemText
                          primary="Órdenes"
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItemButton>
                    )}

                    {(user?.rol === "OPERADOR" || user?.rol === "ADMIN") && (
                      <ListItemButton component={Link} to="/RegistrarCliente">
                        <PersonAddIcon sx={{ mr: 1 }} />
                        <ListItemText
                          primary="Registrar cliente"
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItemButton>
                    )}

                    {adminItems?.map((i) => (
                      <ListItemButton key={i.to} component={Link} to={i.to}>
                        <ListItemText
                          primary={i.txt}
                          primaryTypographyProps={{ fontWeight: 600 }}
                        />
                      </ListItemButton>
                    ))}

                    <ListItemButton onClick={doLogout}>
                      <AccountCircle sx={{ mr: 1 }} />
                      <ListItemText
                        primary={user ? "Cerrar sesión" : "Iniciar sesión"}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                    </ListItemButton>
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              {links.map((l) =>
                l.path ? (
                  <NavLink key={l.label} to={l.path}>
                    {l.label}
                  </NavLink>
                ) : (
                  <Button
                    key={l.label}
                    onClick={l.action}
                    sx={{ color: TEXT_COLOR, fontWeight: 600 }}
                  >
                    {l.label}
                  </Button>
                )
              )}

              <CartBtn />
              <RegCliBtn />
              {/* Solo aparece si user.rol === "CLIENTE" */}
              <NotifBtn />

              {canSeeOrders && (
                <Button
                  sx={{ color: TEXT_COLOR, fontWeight: 600 }}
                  onClick={() => nav("/ordenes")}
                >
                  Órdenes
                </Button>
              )}

              {adminItems?.length ? (
                <>
                  <Button
                    sx={{ color: TEXT_COLOR, fontWeight: 600 }}
                    onClick={(e) => setAdmA(e.currentTarget)}
                  >
                    Administración
                  </Button>
                  <Menu
                    anchorEl={adminAnchor}
                    open={Boolean(adminAnchor)}
                    onClose={() => setAdmA(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    {adminItems.map((i) => (
                      <MenuItem
                        key={i.to}
                        component={Link}
                        to={i.to}
                        onClick={() => setAdmA(null)}
                        sx={{ fontWeight: 600 }}
                      >
                        {i.txt}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              ) : null}

              <Button
                startIcon={<AccountCircle />}
                sx={{ color: TEXT_COLOR, fontWeight: 600 }}
                onClick={doLogout}
              >
                {user ? "Cerrar sesión" : "Iniciar sesión"}
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Menú de notificaciones: solo para el botón que ya valida “CLIENTE” */}
      <Menu
        anchorEl={notifAnchor}
        open={Boolean(notifAnchor)}
        onClose={handleNotifClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { minWidth: 300, boxShadow: 3, mt: 1 } }}
      >
        {notifications.filter((n) => !n.leida).length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2">No hay notificaciones nuevas</Typography>
          </MenuItem>
        ) : (
          notifications
            .filter((n) => !n.leida)
            .map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => handleNotifClick(n.id, n.asunto)}
                sx={{
                  backgroundColor: "rgba(255, 235, 59, 0.12)",
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {n.asunto}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      whiteSpace: "normal",
                      mt: 0.5,
                    }}
                  >
                    {n.cuerpo}
                  </Typography>
                </Box>
              </MenuItem>
            ))
        )}
      </Menu>
    </>
  );
}
