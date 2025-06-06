import React from 'react';
import './PackageCard.css';

interface Servicio {
  nombre: string;
}

interface PackageCardProps {
  nombre: string;
  imagen?: string;
  servicios: Servicio[];
  descripcion: string;
  precio: string;
  onVerPaquete?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  nombre,
  imagen,
  servicios,
  descripcion,
  precio,
  onVerPaquete
}) => {
  return (
    <div className="package-card">
      <h2 className="package-title">{nombre}</h2>
      <div className="package-image">
        {imagen ? <img src={imagen} alt="Paquete" /> : 'Imagen'}
      </div>
      <div className="services-and-description">
        <div className="services-list">
          {servicios.map((servicio, index) => (
          <p key={index} className="service-item">- {servicio.nombre}</p>
          ))}
        </div>
        <p className="package-description">{descripcion}</p>
      </div>
      <div className="package-footer">
        <span className="package-price">Precio: {precio}</span>
        <button className="view-package-btn" onClick={onVerPaquete}>Ver paquete</button>
      </div>
    </div>
  );
};

export default PackageCard;