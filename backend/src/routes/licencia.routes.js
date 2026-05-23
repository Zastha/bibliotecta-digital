const express = require('express');
const router = express.Router();
const LicenciaController = require('../controllers/licencia.controller');

router.get('/', LicenciaController.getAll);
router.get('/libro/:libroId', LicenciaController.getByLibro);
router.post('/', LicenciaController.create);
router.delete('/:id', LicenciaController.delete);

module.exports = router;