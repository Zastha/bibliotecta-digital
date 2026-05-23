const express = require('express');
const router = express.Router();
const PrestamoController = require('../controllers/prestamo.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

router.get('/',                   authMiddleware, rolesMiddleware('administrador'), PrestamoController.getAll);
router.get('/activos',            authMiddleware, rolesMiddleware('administrador'), PrestamoController.getActivos);
router.get('/vencer',             authMiddleware, rolesMiddleware('administrador'), PrestamoController.getProximosAVencer);
router.get('/usuario/:usuarioId', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), PrestamoController.getByUsuario);
router.post('/',                  authMiddleware, rolesMiddleware('alumno', 'maestro'), PrestamoController.create);
router.patch('/:id/devolver',     authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), PrestamoController.devolver);

module.exports = router;