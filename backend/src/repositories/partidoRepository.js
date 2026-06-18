const { Partido, Candidato } = require('../models');

const findAll = async () => {
  return Partido.findAll({
    include: [{ model: Candidato, as: 'candidatos', attributes: ['id', 'nombre', 'apellido'] }],
    order: [['created_at', 'DESC']],
  });
};

const findById = async (id) => {
  return Partido.findByPk(id, {
    include: [{ model: Candidato, as: 'candidatos' }],
  });
};

const findByNombre = async (nombre) => {
  return Partido.findOne({ where: { nombre } });
};

const findBySigla = async (sigla) => {
  return Partido.findOne({ where: { sigla } });
};

const create = async (data) => {
  return Partido.create(data);
};

const update = async (id, data) => {
  const [affectedRows] = await Partido.update(data, { where: { id } });
  if (affectedRows === 0) { return null; }
  return findById(id);
};

const remove = async (id) => {
  return Partido.destroy({ where: { id } });
};

const count = async () => {
  return Partido.count();
};

module.exports = { findAll, findById, findByNombre, findBySigla, create, update, remove, count };