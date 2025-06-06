// web/src/components/PrivateRoute.tsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function PrivateRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  // no hay contexto o no hay usuario → manda a login
  if (!auth || !auth.user) {
    localStorage.setItem('afterLogin', location.pathname);
    return <Navigate to="/login" replace />;
  }

  // rol no autorizado → home
  if (roles && !roles.includes(auth.user.rol)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
