const { body } = require('express-validator');

const createPartidoRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('sigla')
    .trim()
    .notEmpty().withMessage('La sigla es obligatoria')
    .isLength({ min: 1, max: 20 }).withMessage('La sigla debe tener entre 1 y 20 caracteres'),
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres'),
];

const updatePartidoRules = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('sigla')
    .optional()
    .trim()
    .notEmpty().withMessage('La sigla no puede estar vacía')
    .isLength({ min: 1, max: 20 }).withMessage('La sigla debe tener entre 1 y 20 caracteres'),
  body('descripcion')
    .optional()
    .trim()
    .notEmpty().withMessage('La descripción no puede estar vacía'),
];

module.exports = { createPartidoRules, updatePartidoRules };