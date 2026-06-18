const { Voto, Candidato, Partido } = require('../models');
const { fn, col, literal } = require('sequelize');

const findAll = async () => {
  return Voto.findAll({
    include: [
      { model: Candidato, as: 'candidato', attributes: ['id', 'nombre', 'apellido', 'documento'] },
      { model: Partido, as: 'partido', attributes: ['id', 'nombre', 'sigla'] },
    ],
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
    include: [
      {
        model: Candidato,
        as: 'candidato',
        attributes: ['id', 'nombre', 'apellido', 'documento'],
        include: [{ model: Partido, as: 'partido', attributes: ['nombre', 'sigla'] }],
      },
    ],
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
  return Voto.findAll({
    attributes: [
      'id_partido',
      [fn('COUNT', col('Voto.id')), 'total_votos'],
    ],
    include: [
      {
        model: Partido,
        as: 'partido',
        attributes: ['id', 'nombre', 'sigla'],
      },
    ],
    group: [
      'id_partido',
      'partido.id',
      'partido.nombre',
      'partido.sigla',
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