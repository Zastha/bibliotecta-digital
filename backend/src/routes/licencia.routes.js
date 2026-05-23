const express = require('express');
const router = express.Router();
const LicenciaController = require('../controllers/licencia.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

router.get('/',               authMiddleware, rolesMiddleware('administrador'), LicenciaController.getAll);
router.get('/libro/:libroId', authMiddleware, rolesMiddleware('administrador'), LicenciaController.getByLibro);
router.post('/',              authMiddleware, rolesMiddleware('administrador'), LicenciaController.create);
router.delete('/:id',         authMiddleware, rolesMiddleware('administrador'), LicenciaController.delete);

module.exports = router;