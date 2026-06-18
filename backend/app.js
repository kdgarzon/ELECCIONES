require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');
const { errorHandler, notFound } = require('./src/middlewares/errorHandler');

const partidoRoutes = require('./src/routes/partidoRoutes');
const candidatoRoutes = require('./src/routes/candidatoRoutes');
const votoRoutes = require('./src/routes/votoRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

const app = express();

// Middlewares globales
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'API Electoral - OATI UD',
  customCss: '.swagger-ui .topbar { background-color: #0F172A; }',
}));

// Rutas API
app.use('/api/partidos', partidoRoutes);
app.use('/api/candidatos', candidatoRoutes);
app.use('/api/votos', votoRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));

// Manejo de rutas no encontradas y errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;