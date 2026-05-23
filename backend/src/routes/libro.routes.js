const express = require('express');
const router = express.Router();
const LibroController = require('../controllers/libro.controller');

router.get('/', LibroController.getAll);
router.get('/:id', LibroController.getById);
router.post('/', LibroController.create);
router.put('/:id', LibroController.update);
router.delete('/:id', LibroController.delete);

module.exports = router;