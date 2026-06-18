const { body } = require('express-validator');

const createCandidatoRules = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('documento')
    .trim()
    .notEmpty().withMessage('El documento es obligatorio')
    .isLength({ min: 5, max: 20 }).withMessage('El documento debe tener entre 5 y 20 caracteres'),
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('El correo no tiene un formato válido')
    .normalizeEmail(),
  body('id_partido')
    .notEmpty().withMessage('El partido es obligatorio')
    .isInt({ min: 1 }).withMessage('El id_partido debe ser un número entero positivo'),
];

const updateCandidatoRules = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('apellido')
    .optional()
    .trim()
    .notEmpty().withMessage('El apellido no puede estar vacío')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  body('documento')
    .optional()
    .trim()
    .notEmpty().withMessage('El documento no puede estar vacío'),
  body('correo')
    .optional()
    .trim()
    .isEmail().withMessage('El correo no tiene un formato válido')
    .normalizeEmail(),
  body('id_partido')
    .optional()
    .isInt({ min: 1 }).withMessage('El id_partido debe ser un número entero positivo'),
];

module.exports = { createCandidatoRules, updateCandidatoRules };