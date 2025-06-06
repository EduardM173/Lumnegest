import api from './axiosInstance';

export const importarCsv = (file: File) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post('/importaciones', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};
