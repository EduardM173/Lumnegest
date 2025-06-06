// frontend/src/contexts/NotificationContext.tsx

import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import axios from "../api/axiosInstance"; // baseURL apunta a "/api"

interface Notification {
  id: string;
  asunto: string;
  cuerpo: string;
  leida: boolean;
  enviado_en: string;    // ISO string
  previewUrl?: string;   // Si es “local” (preview de Ethereal)
}

interface NotificationContextProps {
  notifications: Notification[];
  fetchNotifications: () => Promise<void>;
  markAsRead: (notifId: string) => Promise<void>;
  addNotification: (orderId: number, previewUrl: string) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const useNotifications = (): NotificationContextProps => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications debe usarse dentro de NotificationProvider"
    );
  return ctx;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 1) Carga todas las notificaciones del backend
   *    + conserva en memoria (merge) aquellas locales (con previewUrl) no leídas.
   */
  const fetchNotifications = async () => {
    try {
      const resp = await axios.get<Notification[]>("/notificaciones");
      // Conserva sólo las locales no leídas:
      const localPendientes = notifications.filter(
        (n) => n.previewUrl && !n.leida
      );

      // Combina locales + servidor (ordenadas por enviado_en del servidor)
      setNotifications([...localPendientes, ...resp.data]);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
    }
  };

  /**
   * 2) Marca una notificación como leída.
   *    - Si tiene previewUrl, es local: sólo marcar en memoria.
   *    - Si no, invocar PATCH al backend.
   */
  const markAsRead = async (id: string) => {
    const noti = notifications.find((n) => n.id === id);
    if (!noti) return;

    // Si es “local” (tiene previewUrl), sólo marcar en memoria:
    if (noti.previewUrl) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
      return;
    }

    // Si no, hacemos PATCH contra el servidor:
    try {
      await axios.patch(`/notificaciones/${id}/leer`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
    } catch (err) {
      console.error("Error al marcar notificación como leída:", err);
    }
  };

  /**
   * 3) Inserta una nueva notificación “local” justo después de crear la orden.
   */
  const addNotification = (orderId: number, previewUrl: string) => {
    const asunto = `Orden #${orderId} creada exitosamente`;
    const cuerpo = `Haga clic aquí para ver el correo de confirmación.`;
    const newNotif: Notification = {
      id: Date.now().toString(),          // ID único en cliente
      asunto,
      cuerpo,
      leida: false,
      enviado_en: new Date().toISOString(),
      previewUrl,                         // saber que es local
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  useEffect(() => {
    // 1) Traer notificaciones inmediatamente al montar
    fetchNotifications();

    // 2) Iniciar polling cada 15 segundos
    pollingRef.current = setInterval(fetchNotifications, 15000);

    // 3) Limpiar polling al desmontar
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, fetchNotifications, markAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
