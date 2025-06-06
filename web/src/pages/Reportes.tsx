import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import jsPDF from 'jspdf';
import { getReportesMetrics, ReportesMetrics } from '../api/dashboard';
import { getOrderReports } from '../api/orders';

interface ClientServiceDetail {
  clientName: string;
  serviceName: string;
  orderDate: string;
  quantity: number;
  subtotal: number;
}

const Reportes: React.FC = () => {
  const [metrics, setMetrics] = useState<ReportesMetrics | null>(null);
  const [clientDetails, setClientDetails] = useState<ClientServiceDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [metricsData, clientData] = await Promise.all([
          getReportesMetrics(),
          getOrderReports(),
        ]);
        setMetrics(metricsData);
        setClientDetails(clientData);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generatePDF = () => {
    if (!metrics?.services.length && !clientDetails.length) return;
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Reporte de Servicios - 2025', 20, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    let yOffset = 40;
    doc.text('Resumen de Servicios', 20, yOffset);
    yOffset += 10;
    metrics?.services.forEach((service) => {
      doc.text(`Servicio: ${service.name}`, 20, yOffset);
      doc.text(`Contrataciones: ${service.count}`, 100, yOffset);
      doc.text(`Ingresos: ${service.revenue} Bs`, 140, yOffset);
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    yOffset += 10;
    doc.text('Detalles por Cliente', 20, yOffset);
    yOffset += 10;
    const filteredDetails = clientDetails.filter((detail) =>
      detail.clientName.toLowerCase().includes(clientFilter.toLowerCase())
    );
    filteredDetails.forEach((detail) => {
      doc.text(`Cliente: ${detail.clientName}`, 20, yOffset);
      doc.text(`Servicio: ${detail.serviceName}`, 60, yOffset);
      doc.text(`Fecha: ${detail.orderDate}`, 100, yOffset);
      doc.text(`Cantidad: ${detail.quantity}`, 140, yOffset);
      doc.text(`Subtotal: ${detail.subtotal} Bs`, 160, yOffset);
      yOffset += 10;
      if (yOffset > 270) {
        doc.addPage();
        yOffset = 20;
      }
    });

    doc.save('reporte_servicios_2025.pdf');
  };

  if (loading) return <Typography>Cargando datos...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  const filteredDetails = clientDetails.filter((detail) =>
    detail.clientName.toLowerCase().includes(clientFilter.toLowerCase())
  );

  return (
    <Box sx={{ p: 4, backgroundColor: '#F2EFEA', minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#B59F6B', fontFamily: `'Playfair Display', serif`, fontWeight: 700 }}>
          Reportes{' '}
          <Typography component="span" variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif` }}>
            Servicios Adquiridos
          </Typography>
        </Typography>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
          Resumen de Servicios - 2025
        </Typography>
        {metrics?.services.map((service, index) => (
          <Box
            key={index}
            sx={{ backgroundColor: '#FFF', p: 2, borderRadius: 2, boxShadow: 1, mb: 1, display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography sx={{ color: '#6C4F4B' }}>{service.name}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>Contrataciones: {service.count}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>Ingresos: ${service.revenue} Bs</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ color: '#6C4F4B', fontFamily: `'Roboto', sans-serif`, mb: 2 }}>
          Detalles por Cliente
        </Typography>
        <TextField
          label="Filtrar por Cliente"
          value={clientFilter}
          onChange={(e) => setClientFilter(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        {filteredDetails.map((detail, index) => (
          <Box
            key={index}
            sx={{ backgroundColor: '#FFF', p: 2, borderRadius: 2, boxShadow: 1, mb: 1, display: 'flex', justifyContent: 'space-between' }}
          >
            <Typography sx={{ color: '#6C4F4B' }}>{detail.clientName}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>{detail.serviceName}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>{detail.orderDate}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>Cantidad: {detail.quantity}</Typography>
            <Typography sx={{ color: '#6C4F4B' }}>{detail.subtotal} Bs</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          onClick={generatePDF}
          disabled={!metrics?.services.length && !clientDetails.length}
          sx={{ backgroundColor: '#B59F6B', color: '#FFF', '&:hover': { backgroundColor: '#A48E5F' } }}
        >
          Generar Reporte PDF
        </Button>
      </Box>
    </Box>
  );
};

export default Reportes;