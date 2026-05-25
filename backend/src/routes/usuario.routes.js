const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

router.get('/',       authMiddleware, rolesMiddleware('administrador'), UsuarioController.getAll);
router.get('/:id',    authMiddleware, rolesMiddleware('administrador'), UsuarioController.getById);
router.post('/',      authMiddleware, rolesMiddleware('administrador'), UsuarioController.create);
router.patch('/:id',  authMiddleware, rolesMiddleware('administrador'), UsuarioController.update);
router.delete('/:id', authMiddleware, rolesMiddleware('administrador'), UsuarioController.delete);

module.exports = router;