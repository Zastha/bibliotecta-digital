const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rolesMiddleware = require('../middleware/roles.middleware');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - authId: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tienes permisos
 */
router.get('/', authMiddleware, rolesMiddleware('administrador'), UsuarioController.getAll);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
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
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', authMiddleware, rolesMiddleware('administrador'), UsuarioController.getById);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un usuario
 *     tags: [Usuarios]
 *     security:
 *       - authId: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auth_id
 *               - nombre
 *               - email
 *               - rol
 *             properties:
 *               auth_id:
 *                 type: string
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [alumno, maestro, administrador]
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Datos incorrectos o usuario duplicado
 *       403:
 *         description: No tienes permisos
 */
router.post('/', authMiddleware, rolesMiddleware('administrador'), UsuarioController.create);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Actualizar un usuario
 *     tags: [Usuarios]
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
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [alumno, maestro, administrador]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       403:
 *         description: No tienes permisos
 *       404:
 *         description: Usuario no encontrado
 */
router.patch('/:id', authMiddleware, rolesMiddleware('administrador'), UsuarioController.update);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
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
 *         description: Usuario eliminado
 *       403:
 *         description: No tienes permisos
 */
router.delete('/:id', authMiddleware, rolesMiddleware('administrador'), UsuarioController.delete);

module.exports = router;