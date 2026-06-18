const { body } = require('express-validator');

const createVotoRules = [
  body('id_candidato')
    .notEmpty().withMessage('El candidato es obligatorio')
    .isInt({ min: 1 }).withMessage('El id_candidato debe ser un número entero positivo'),
  body('id_partido')
    .notEmpty().withMessage('El partido es obligatorio')
    .isInt({ min: 1 }).withMessage('El id_partido debe ser un número entero positivo'),
];

module.exports = { createVotoRules };