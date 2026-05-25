const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Biblioteca Digital',
      version: '1.0.0',
      description: 'Documentación de la API del módulo de Biblioteca Digital',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        authId: {
          type: 'apiKey',
          in: 'header',
          name: 'auth-id',
          description: 'ID de autenticación del usuario',
        },
      },
    },
    security: [{ authId: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);