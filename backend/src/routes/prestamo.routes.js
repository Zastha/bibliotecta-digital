const express = require('express');
const router = express.Router();
const PrestamoController = require('../controllers/prestamo.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

/**
 * @swagger
 * tags:
 *   name: Prestamos
 *   description: Gestión de préstamos de libros
 */

/**
 * @swagger
 * /api/prestamos:
 *   get:
 *     summary: Obtener todos los préstamos
 *     tags: [Prestamos]
 *     security:
 *       - authId: []
 *     responses:
 *       200:
 *         description: Lista de préstamos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos
 */
router.get('/', authMiddleware, rolesMiddleware('administrador'), PrestamoController.getAll);

/**
 * @swagger
 * /api/prestamos/activos:
 *   get:
 *     summary: Obtener préstamos activos
 *     tags: [Prestamos]
 *     security:
 *       - authId: []
 *     responses:
 *       200:
 *         description: Lista de préstamos activos
 *       403:
 *         description: No tienes permisos
 */
router.get('/activos', authMiddleware, rolesMiddleware('administrador'), PrestamoController.getActivos);

/**
 * @swagger
 * /api/prestamos/vencer:
 *   get:
 *     summary: Obtener préstamos próximos a vencer
 *     tags: [Prestamos]
 *     security:
 *       - authId: []
 *     parameters:
 *       - in: query
 *         name: dias
 *         schema:
 *           type: integer
 *         description: Número de días para considerar próximo a vencer (default 3)
 *     responses:
 *       200:
 *         description: Lista de préstamos próximos a vencer
 *       403:
 *         description: No tienes permisos
 */
router.get('/vencer', authMiddleware, rolesMiddleware('administrador'), PrestamoController.getProximosAVencer);

/**
 * @swagger
 * /api/prestamos/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener préstamos de un usuario
 *     tags: [Prestamos]
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
 *         description: Lista de préstamos del usuario
 *       401:
 *         description: No autorizado
 */
router.get('/usuario/:usuarioId', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), PrestamoController.getByUsuario);

/**
 * @swagger
 * /api/prestamos:
 *   post:
 *     summary: Solicitar un préstamo
 *     tags: [Prestamos]
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
 *               diasPrestamo:
 *                 type: integer
 *                 default: 14
 *     responses:
 *       201:
 *         description: Préstamo creado correctamente
 *       400:
 *         description: No hay licencias disponibles o datos incorrectos
 *       403:
 *         description: No tienes permisos
 */
router.post('/', authMiddleware, rolesMiddleware('alumno', 'maestro'), PrestamoController.create);

/**
 * @swagger
 * /api/prestamos/{id}/devolver:
 *   patch:
 *     summary: Devolver un préstamo
 *     tags: [Prestamos]
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
 *         description: Préstamo devuelto correctamente
 *       404:
 *         description: Préstamo no encontrado
 */
router.patch('/:id/devolver', authMiddleware, rolesMiddleware('alumno', 'maestro', 'administrador'), PrestamoController.devolver);

module.exports = router;