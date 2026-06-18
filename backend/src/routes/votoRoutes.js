const router = require('express').Router();
const controller = require('../controllers/votoController');
const { createVotoRules } = require('../validations/votoValidations');
const { validate } = require('../middlewares/validate');

/**
 * @swagger
 * /api/votos:
 *   get:
 *     summary: Obtener todos los votos
 *     tags: [Votos]
 *     responses:
 *       200:
 *         description: Lista de votos con candidato y partido
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/votos/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de votos
 *     tags: [Votos]
 *     responses:
 *       200:
 *         description: Estadísticas totales, por candidato y por partido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     total_votos: { type: integer }
 *                     por_candidato: { type: array }
 *                     por_partido: { type: array }
 */
router.get('/estadisticas', controller.getEstadisticas);

/**
 * @swagger
 * /api/votos:
 *   post:
 *     summary: Registrar un nuevo voto
 *     tags: [Votos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_candidato]
 *             properties:
 *               id_candidato: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Voto registrado exitosamente
 *       404:
 *         description: Candidato no encontrado
 */
router.post('/', createVotoRules, validate, controller.create);

module.exports = router;