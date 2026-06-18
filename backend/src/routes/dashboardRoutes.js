const router = require('express').Router();
const controller = require('../controllers/dashboardController');

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Obtener resumen del dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Totales de partidos, candidatos y votos
 */
router.get('/', controller.getResumen);

module.exports = router;