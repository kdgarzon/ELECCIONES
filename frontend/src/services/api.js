import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.message ||
      'Error de conexión con el servidor';
    return Promise.reject({ ...error, userMessage: message });
  }
);

// Partidos
export const partidoService = {
  getAll: () => api.get('/partidos'),
  getById: (id) => api.get(`/partidos/${id}`),
  create: (data) => api.post('/partidos', data),
  update: (id, data) => api.put(`/partidos/${id}`, data),
  delete: (id) => api.delete(`/partidos/${id}`),
};

// Candidatos
export const candidatoService = {
  getAll: () => api.get('/candidatos'),
  getById: (id) => api.get(`/candidatos/${id}`),
  create: (data) => api.post('/candidatos', data),
  update: (id, data) => api.put(`/candidatos/${id}`, data),
  delete: (id) => api.delete(`/candidatos/${id}`),
};

// Votos
export const votoService = {
  getAll: () => api.get('/votos'),
  create: (data) => api.post('/votos', data),
  getEstadisticas: () => api.get('/votos/estadisticas'),
};

// Dashboard
export const dashboardService = {
  getResumen: () => api.get('/dashboard'),
};

export default api;
