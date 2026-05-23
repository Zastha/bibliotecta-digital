const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// Middlewares globales
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor de Biblioteca Digital funcionando 📚' });
});

// Rutas
app.use('/api/libros',       require('./routes/libro.routes'));
app.use('/api/licencias',    require('./routes/licencia.routes'));
app.use('/api/prestamos',    require('./routes/prestamo.routes'));
app.use('/api/lista-espera', require('./routes/listaEspera.routes'));
app.use('/api/categorias',   require('./routes/categoria.routes'));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;