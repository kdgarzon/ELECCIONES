const { Voto, Candidato, Partido } = require('../models');
const { fn, col, literal } = require('sequelize');

// Inclusión anidada reutilizable: candidato + su partido
const includeCandidatoConPartido = {
  model: Candidato,
  as: 'candidato',
  attributes: ['id', 'nombre', 'apellido', 'documento'],
  include: [{ model: Partido, as: 'partido', attributes: ['id', 'nombre', 'sigla'] }],
};

const findAll = async () => {
  return Voto.findAll({
    include: [includeCandidatoConPartido],
    order: [['fecha_voto', 'DESC']],
  });
};

const create = async (data) => {
  return Voto.create(data);
};

const count = async () => {
  return Voto.count();
};

const estadisticasPorCandidato = async () => {
  return Voto.findAll({
    attributes: [
      'id_candidato',
      [fn('COUNT', col('Voto.id')), 'total_votos'],
    ],
    include: [includeCandidatoConPartido],
    group: [
      'id_candidato',
      'candidato.id',
      'candidato.nombre',
      'candidato.apellido',
      'candidato.documento',
      'candidato->partido.id',
      'candidato->partido.nombre',
      'candidato->partido.sigla',
    ],
    order: [[literal('total_votos'), 'DESC']],
  });
};

const estadisticasPorPartido = async () => {
  // Agrupamos por el partido del candidato, no por un campo propio de votos
  return Voto.findAll({
    attributes: [
      [fn('COUNT', col('Voto.id')), 'total_votos'],
    ],
    include: [
      {
        model: Candidato,
        as: 'candidato',
        attributes: [],
        include: [{ model: Partido, as: 'partido', attributes: ['id', 'nombre', 'sigla'] }],
      },
    ],
    group: [
      'candidato->partido.id',
      'candidato->partido.nombre',
      'candidato->partido.sigla',
    ],
    order: [[literal('total_votos'), 'DESC']],
  });
};

module.exports = {
  findAll,
  create,
  count,
  estadisticasPorCandidato,
  estadisticasPorPartido,
};