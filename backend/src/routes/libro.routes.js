const express = require('express');
const router = express.Router();
const LibroController = require('../controllers/libro.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

/**
 * @swagger
 * tags:
 *   name: Libros
 *   description: Gestión del catálogo de libros
 */

/**
 * @swagger
 * /api/libros:
 *   get:
 *     summary: Obtener todos los libros
 *     tags: [Libros]
 *     security:
 *       - authId: []
 *     responses:
 *       200:
 *         description: Lista de libros con sus categorías
 *       401:
 *         description: No autorizado
 */
router.get('/',       authMiddleware, LibroController.getAll);

/**
 * @swagger
 * /api/libros/{id}:
 *   get:
 *     summary: Obtener un libro por ID
 *     tags: [Libros]
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
 *         description: Libro encontrado
 *       404:
 *         description: Libro no encontrado
 */
router.get('/:id',    authMiddleware, LibroController.getById);

/**
 * @swagger
 * /api/libros:
 *   post:
 *     summary: Crear un libro
 *     tags: [Libros]
 *     security:
 *       - authId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - autor
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               imagen_portada:
 *                 type: string
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Libro creado correctamente
 *       400:
 *         description: Datos incorrectos
 *       403:
 *         description: No tienes permisos
 */
router.post('/',      authMiddleware, rolesMiddleware('administrador'), LibroController.create);

/**
 * @swagger
 * /api/libros/{id}:
 *   patch:
 *     summary: Actualizar un libro
 *     tags: [Libros]
 *     security:
 *       - authId: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               autor:
 *                 type: string
 *               isbn:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               imagen_portada:
 *                 type: string
 *               categorias:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Libro actualizado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Libro no encontrado
 */
router.patch('/:id',  authMiddleware, rolesMiddleware('administrador'), LibroController.update);

/**
 * @swagger
 * /api/libros/{id}:
 *   delete:
 *     summary: Eliminar un libro
 *     tags: [Libros]
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
 *         description: Libro eliminado
 *       403:
 *         description: No tienes permisos
 */
router.delete('/:id', authMiddleware, rolesMiddleware('administrador'), LibroController.delete);

module.exports = router;