const express = require('express');
const router = express.Router();
const ListaEsperaController = require('../controllers/listaEspera.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

router.get('/',                   authMiddleware, rolesMiddleware('administrador'), ListaEsperaController.getAll);
router.get('/libro/:libroId',     authMiddleware, rolesMiddleware('administrador'), ListaEsperaController.getByLibro);
router.get('/usuario/:usuarioId', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), ListaEsperaController.getByUsuario);
router.post('/',                  authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), ListaEsperaController.create);
router.patch('/desactivar',       authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), ListaEsperaController.desactivar);

module.exports = router;