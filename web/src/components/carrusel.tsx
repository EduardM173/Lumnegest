import React, { useState } from 'react';

interface CarruselProps {
    children: React.ReactNode; // Accepts any valid React children
}

const Carrusel: React.FC<CarruselProps> = ({ children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 3; // Número de elementos a mostrar
    const totalItems = React.Children.count(children);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? totalItems - itemsToShow : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsToShow >= totalItems ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="carousel" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
                className="carousel-button prev"
                onClick={handlePrev}
                style={{
                    position: 'absolute',
                    left: '10px',
                    zIndex: 1,
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                }}
            >
                &#10094;
            </button>
            <div
                className="carousel-images"
                style={{
                    display: 'flex',
                    overflow: 'hidden',
                    width: `${itemsToShow * 500}px`, // Ajusta el ancho según el tamaño de los elementos
                }}
            >
                <div
                    className="carousel-track"
                    style={{
                        display: 'flex',
                        transform: `translateX(-${currentIndex * 500}px)`, // Ajusta el desplazamiento
                        transition: 'transform 0.3s ease-in-out',
                    }}
                >
                    {React.Children.map(children, (child) => (
                        <div
                            className="carousel-item"
                            style={{
                                flex: '0 0 auto',
                                width: '450px', // Ajusta el ancho de cada elemento
                                height: '500px', // Ajusta la altura de cada elemento
                                boxSizing: 'border-box', // Asegura que el padding y border no afecten el ancho
                                marginRight: '10px', // Espaciado entre elementos
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#f0f0f0', // Fondo para visualizar mejor las tarjetas
                                borderRadius: '8px', // Bordes redondeados
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra para las tarjetas
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>
            <button
                className="carousel-button next"
                onClick={handleNext}
                style={{
                    position: 'absolute',
                    right: '10px',
                    zIndex: 1,
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                }}
            >
                &#10095;
            </button>
        </div>
    );
};

export default Carrusel;