const express = require('express');
const router = express.Router();
const ListaEsperaController = require('../controllers/listaEspera.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

/**
 * @swagger
 * tags:
 *   name: Lista de Espera
 *   description: Gestión de la lista de espera de libros
 */

/**
 * @swagger
 * /api/lista-espera:
 *   get:
 *     summary: Obtener toda la lista de espera
 *     tags: [Lista de Espera]
 *     security:
 *       - authId: []
 *     responses:
 *       200:
 *         description: Lista de espera completa
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos
 */
router.get('/', authMiddleware, rolesMiddleware('administrador'), ListaEsperaController.getAll);

/**
 * @swagger
 * /api/lista-espera/libro/{libroId}:
 *   get:
 *     summary: Obtener lista de espera por libro
 *     tags: [Lista de Espera]
 *     security:
 *       - authId: []
 *     parameters:
 *       - in: path
 *         name: libroId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de espera del libro
 *       403:
 *         description: No tienes permisos
 */
router.get('/libro/:libroId', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), ListaEsperaController.getByLibro);

/**
 * @swagger
 * /api/lista-espera/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener lista de espera de un usuario
 *     tags: [Lista de Espera]
 *     security:
 *       - authId: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de espera del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/usuario/:usuarioId', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), ListaEsperaController.getByUsuario);

/**
 * @swagger
 * /api/lista-espera:
 *   post:
 *     summary: Unirse a la lista de espera
 *     tags: [Lista de Espera]
 *     security:
 *       - authId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - libroId
 *             properties:
 *               usuarioId:
 *                 type: string
 *               libroId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario agregado a la lista de espera
 *       400:
 *         description: Ya está en lista de espera o hay licencias disponibles
 *       403:
 *         description: No tienes permisos
 */
router.post('/', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), ListaEsperaController.create);

/**
 * @swagger
 * /api/lista-espera/desactivar:
 *   patch:
 *     summary: Salir de la lista de espera
 *     tags: [Lista de Espera]
 *     security:
 *       - authId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuarioId
 *               - libroId
 *             properties:
 *               usuarioId:
 *                 type: string
 *               libroId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario removido de la lista de espera
 *       404:
 *         description: No se encontró la entrada
 */
router.patch('/desactivar', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), ListaEsperaController.desactivar);

module.exports = router;