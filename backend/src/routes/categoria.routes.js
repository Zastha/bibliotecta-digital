const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoria.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

router.get('/',       authMiddleware, CategoriaController.getAll);
router.get('/:id',    authMiddleware, CategoriaController.getById);
router.post('/',      authMiddleware, rolesMiddleware('administrador'), CategoriaController.create);
router.delete('/:id', authMiddleware, rolesMiddleware('administrador'), CategoriaController.delete);

module.exports = router;