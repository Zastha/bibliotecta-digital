const express = require('express');
const router = express.Router();
const LicenciaController = require('../controllers/licencia.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

/**
 * @swagger
 * tags:
 *   name: Licencias
 *   description: Gestión de licencias de libros
 */

/**
 * @swagger
 * /api/licencias:
 *   get:
 *     summary: Obtener todas las licencias
 *     tags: [Licencias]
 *     security:
 *       - authId: []
 *     responses:
 *       200:
 *         description: Lista de licencias
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos
 */
router.get('/', authMiddleware, rolesMiddleware('administrador'), LicenciaController.getAll);

/**
 * @swagger
 * /api/licencias/libro/{libroId}:
 *   get:
 *     summary: Obtener licencias por libro
 *     tags: [Licencias]
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
 *         description: Lista de licencias del libro
 *       403:
 *         description: No tienes permisos
 */
router.get('/libro/:libroId', authMiddleware, rolesMiddleware('administrador'), LicenciaController.getByLibro);

/**
 * @swagger
 * /api/licencias:
 *   post:
 *     summary: Crear una licencia para un libro
 *     tags: [Licencias]
 *     security:
 *       - authId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - libroId
 *             properties:
 *               libroId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Licencia creada correctamente
 *       400:
 *         description: Datos incorrectos
 *       403:
 *         description: No tienes permisos
 */
router.post('/', authMiddleware, rolesMiddleware('administrador'), LicenciaController.create);

/**
 * @swagger
 * /api/licencias/{id}:
 *   delete:
 *     summary: Eliminar una licencia
 *     tags: [Licencias]
 *     security:
 *       - authId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Licencia eliminada
 *       403:
 *         description: No tienes permisos
 */
router.delete('/:id', authMiddleware, rolesMiddleware('administrador'), LicenciaController.delete);

module.exports = router;