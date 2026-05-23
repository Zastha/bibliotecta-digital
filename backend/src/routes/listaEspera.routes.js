const express = require('express');
const router = express.Router();
const ListaEsperaController = require('../controllers/listaEspera.controller');

router.get('/',                    ListaEsperaController.getAll);
router.get('/libro/:libroId',      ListaEsperaController.getByLibro);
router.get('/usuario/:usuarioId',  ListaEsperaController.getByUsuario);
router.post('/',                   ListaEsperaController.create);
router.patch('/desactivar',        ListaEsperaController.desactivar);

module.exports = router;