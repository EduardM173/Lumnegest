import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import type { Servicio } from '../api/services';

export interface CartItem {
  servicio: Servicio;
  cantidad: number;
}

interface CartContextValue {
  items: CartItem[];
  total: () => number;
  addItem: (servicio: Servicio, cantidad?: number) => void;
  removeItem: (servicioId: number) => void;
  clear: () => void;
  updateItem: (servicioId: number, nuevaCantidad: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // 1) Inicializar desde localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const datosGuardados = localStorage.getItem('cart');
      return datosGuardados ? JSON.parse(datosGuardados) : [];
    } catch (error) {
      console.error('Error leyendo carrito de localStorage:', error);
      return [];
    }
  });

  // 2) Cada vez que cambie `items`, actualizar localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error guardando carrito en localStorage:', error);
    }
  }, [items]);

  const addItem = (servicio: Servicio, cantidad: number = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((ci) => ci.servicio.id === servicio.id);
      if (idx >= 0) {
        const newArr = [...prev];
        newArr[idx] = {
          servicio: newArr[idx].servicio,
          cantidad: newArr[idx].cantidad + cantidad,
        };
        return newArr;
      }
      return [...prev, { servicio, cantidad }];
    });
  };

  const removeItem = (servicioId: number) => {
    setItems((prev) => prev.filter((ci) => ci.servicio.id !== servicioId));
  };

  const clear = () => {
    setItems([]); // Esto también borrará la clave "cart" de localStorage en el siguiente useEffect
  };

  const updateItem = (servicioId: number, nuevaCantidad: number) => {
    setItems((prev) =>
      prev.map((ci) =>
        ci.servicio.id === servicioId
          ? { servicio: ci.servicio, cantidad: nuevaCantidad }
          : ci
      )
    );
  };

  const total = () => {
    return items.reduce((acc, ci) => {
      const precio = Number(ci.servicio.precio_base) || 0;
      return acc + precio * ci.cantidad;
    }, 0);
  };

  const value: CartContextValue = {
    items,
    total,
    addItem,
    removeItem,
    clear,
    updateItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de un <CartProvider>');
  }
  return ctx;
}
