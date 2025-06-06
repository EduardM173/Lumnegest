// web/src/contexts/AuthContext.tsx

import React, { createContext, useEffect, useState, ReactNode } from 'react';
import api from '../api/axiosInstance';

export interface Usuario {
  id: number;
  nombre_usuario: string;
  email: string;
  rol: 'ADMIN' | 'OPERADOR' | 'CLIENTE';
}

interface AuthCtx {
  user: Usuario | null;
  token: string | null;
  login: (u: Usuario, t: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  // 1) Al montarse, rehidratamos desde localStorage:
  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) {
      setInitializing(false);
      return;
    }

    // (Opcional) Si no usas interceptor (pero con el ejemplo anterior de interceptor, no haría falta esto):
    // api.defaults.headers.common['Authorization'] = `Bearer ${t}`;

    // Intentamos validar ese token recuperando al usuario:
    api
      .get<Usuario>('/auth/me')
      .then((r) => {
        setToken(t);
        setUser(r.data);
      })
      .catch(() => {
        // Si falla (token expirado, inválido, etc.), lo removemos de una vez.
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setInitializing(false);
      });
  }, []);

  // 2) Función de login: guardamos token y user, y nos aseguramos de setear el header.
  const login = (u: Usuario, t: string) => {
    localStorage.setItem('token', t);
    setToken(t);
    setUser(u);

    // Si no estás usando el interceptor anterior, descomenta esto:
    // api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  };

  // 3) Función de logout: removemos todo.
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);

    // Si no estás usando interceptor, remueve el header:
    // delete api.defaults.headers.common['Authorization'];
  };

  // Mientras “rehidratamos”, no renderizamos nada (para evitar parpadeo de sesión cerrada)
  if (initializing) {
    return null; // o un <CircularProgress /> mientras carga
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
