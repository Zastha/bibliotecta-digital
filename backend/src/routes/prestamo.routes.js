const express = require('express');
const router = express.Router();
const PrestamoController = require('../controllers/prestamo.controller');

router.get('/', PrestamoController.getAll);
router.get('/activos', PrestamoController.getActivos);
router.get('/vencer', PrestamoController.getProximosAVencer);
router.get('/usuario/:usuarioId', PrestamoController.getByUsuario);
router.post('/', PrestamoController.create);
router.delete('/:id/devolver', PrestamoController.devolver);

module.exports = router;