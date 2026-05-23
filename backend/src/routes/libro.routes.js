const express = require('express');
const router = express.Router();
const LibroController = require('../controllers/libro.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

router.get('/',       authMiddleware, LibroController.getAll);
router.get('/:id',    authMiddleware, LibroController.getById);
router.post('/',      authMiddleware, rolesMiddleware('administrador'), LibroController.create);
router.patch('/:id',  authMiddleware, rolesMiddleware('administrador'), LibroController.update);
router.delete('/:id', authMiddleware, rolesMiddleware('administrador'), LibroController.delete);

module.exports = router;