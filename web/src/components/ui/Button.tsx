import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'outline' | 'default';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', children, ...rest }) => {
  // Estilos básicos usando clases Tailwind (puedes adaptarlos a tu librería de estilos)
  const baseStyle = 'px-4 py-2 rounded transition-all duration-300';
  const variantStyle = variant === 'outline'
    ? 'border border-gray-400 text-gray-700 hover:bg-gray-100'
    : 'bg-blue-600 text-white hover:bg-blue-700';
  return (
    <button className={`${baseStyle} ${variantStyle}`} {...rest}>
      {children}
    </button>
  );
};

export default Button;
