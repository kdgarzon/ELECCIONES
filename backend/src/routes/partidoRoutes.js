const router = require('express').Router();
const controller = require('../controllers/partidoController');
const { createPartidoRules, updatePartidoRules } = require('../validations/partidoValidations');
const { validate } = require('../middlewares/validate');

/**
 * @swagger
 * /api/partidos:
 *   get:
 *     summary: Obtener todos los partidos
 *     tags: [Partidos]
 *     responses:
 *       200:
 *         description: Lista de partidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Partido'
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/partidos/{id}:
 *   get:
 *     summary: Obtener un partido por ID
 *     tags: [Partidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Partido encontrado
 *       404:
 *         description: Partido no encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/partidos:
 *   post:
 *     summary: Crear un nuevo partido
 *     tags: [Partidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, sigla, descripcion]
 *             properties:
 *               nombre: { type: string, example: "Partido Democrático" }
 *               sigla: { type: string, example: "PD" }
 *               descripcion: { type: string, example: "Partido político de centro izquierda" }
 *     responses:
 *       201:
 *         description: Partido creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Nombre o sigla ya existe
 */
router.post('/', createPartidoRules, validate, controller.create);

/**
 * @swagger
 * /api/partidos/{id}:
 *   put:
 *     summary: Actualizar un partido
 *     tags: [Partidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partido'
 *     responses:
 *       200:
 *         description: Partido actualizado
 *       404:
 *         description: Partido no encontrado
 */
router.put('/:id', updatePartidoRules, validate, controller.update);

/**
 * @swagger
 * /api/partidos/{id}:
 *   delete:
 *     summary: Eliminar un partido
 *     tags: [Partidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Partido eliminado
 *       400:
 *         description: No se puede eliminar (tiene candidatos)
 *       404:
 *         description: Partido no encontrado
 */
router.delete('/:id', controller.remove);

module.exports = router;