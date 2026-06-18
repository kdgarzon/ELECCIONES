const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema Electoral - OATI Universidad Distrital',
      version: '1.0.0',
      description:
        'API REST para la gestión del sistema electoral. Administra partidos, candidatos y votos.',
      contact: {
        name: 'OATI - Universidad Distrital',
        email: 'oati@udistrital.edu.co',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}`,
        description: 'Servidor de desarrollo',
      },
    ],
    tags: [
      { name: 'Partidos', description: 'Gestión de partidos políticos' },
      { name: 'Candidatos', description: 'Gestión de candidatos' },
      { name: 'Votos', description: 'Registro y consulta de votos' },
    ],
    components: {
      schemas: {
        Partido: {
          type: 'object',
          required: ['nombre', 'sigla', 'descripcion'],
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Partido Democrático' },
            sigla: { type: 'string', example: 'PD' },
            descripcion: { type: 'string', example: 'Partido político de centro' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Candidato: {
          type: 'object',
          required: ['nombre', 'apellido', 'documento', 'correo', 'id_partido'],
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan' },
            apellido: { type: 'string', example: 'García' },
            documento: { type: 'string', example: '12345678' },
            correo: { type: 'string', format: 'email', example: 'juan.garcia@email.com' },
            id_partido: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Voto: {
          type: 'object',
          required: ['id_candidato', 'id_partido'],
          properties: {
            id: { type: 'integer', example: 1 },
            id_candidato: { type: 'integer', example: 1 },
            id_partido: { type: 'integer', example: 1 },
            fecha_voto: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);