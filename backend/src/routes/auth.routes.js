const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Verificación de identidad y compatibilidad con JWT
 */

/**
 * @swagger
 * /api/auth/verificar:
 *   post:
 *     summary: Verificar un JWT o auth-id y devolver el usuario asociado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *       - authId: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT opcional si no se envía en Authorization
 *               auth_id:
 *                 type: string
 *                 description: Identificador legado compatible con el flujo actual
 *     responses:
 *       200:
 *         description: Usuario verificado correctamente
 *       401:
 *         description: Credenciales no válidas o ausentes
 *       500:
 *         description: Error interno o configuración JWT incompleta
 */
router.post('/verificar', authMiddleware, AuthController.verificar);

module.exports = router;