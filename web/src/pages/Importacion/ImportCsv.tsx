import React, { useState } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { importarCsv } from '../../api/importaciones';

export default function ImportCsv() {
  const [file, setFile] = useState<File>();
  const [result, setResult] = useState<any>();

  const upload = async () => {
    if (!file) return;
    const res = await importarCsv(file);
    setResult(res);
  };

  return (
    <Box sx={{ maxWidth: 480, mx: 'auto', mt: 4 }}>
      <Typography variant="h1" gutterBottom>Importar Datos Históricos</Typography>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0])}/>
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={!file}
        onClick={upload}
      >
        Subir
      </Button>

      {result && (
        <Alert sx={{ mt: 3 }}>
          Registros: {result.total_registros} ·
          Exitosos: {result.ok} ·
          Errores: {result.err}
        </Alert>
      )}
    </Box>
  );
}
