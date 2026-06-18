const router = require('express').Router();
const controller = require('../controllers/candidatoController');
const { createCandidatoRules, updateCandidatoRules } = require('../validations/candidatoValidations');
const { validate } = require('../middlewares/validate');

/**
 * @swagger
 * /api/candidatos:
 *   get:
 *     summary: Obtener todos los candidatos
 *     tags: [Candidatos]
 *     responses:
 *       200:
 *         description: Lista de candidatos con información de su partido
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/candidatos/{id}:
 *   get:
 *     summary: Obtener un candidato por ID
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Candidato encontrado
 *       404:
 *         description: Candidato no encontrado
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/candidatos:
 *   post:
 *     summary: Crear un nuevo candidato
 *     tags: [Candidatos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, apellido, documento, correo, id_partido]
 *             properties:
 *               nombre: { type: string, example: "Juan" }
 *               apellido: { type: string, example: "García" }
 *               documento: { type: string, example: "12345678" }
 *               correo: { type: string, example: "juan@email.com" }
 *               id_partido: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Candidato creado exitosamente
 *       400:
 *         description: Error de validación
 *       409:
 *         description: Documento o correo ya existe
 */
router.post('/', createCandidatoRules, validate, controller.create);

/**
 * @swagger
 * /api/candidatos/{id}:
 *   put:
 *     summary: Actualizar un candidato
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Candidato'
 *     responses:
 *       200:
 *         description: Candidato actualizado
 *       404:
 *         description: Candidato no encontrado
 */
router.put('/:id', updateCandidatoRules, validate, controller.update);

/**
 * @swagger
 * /api/candidatos/{id}:
 *   delete:
 *     summary: Eliminar un candidato
 *     tags: [Candidatos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Candidato eliminado
 *       404:
 *         description: Candidato no encontrado
 */
router.delete('/:id', controller.remove);

module.exports = router;