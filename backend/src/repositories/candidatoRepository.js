const { Candidato, Partido, Voto } = require('../models');

const findAll = async () => {
  return Candidato.findAll({
    include: [{ model: Partido, as: 'partido', attributes: ['id', 'nombre', 'sigla'] }],
    order: [['created_at', 'DESC']],
  });
};

const findById = async (id) => {
  return Candidato.findByPk(id, {
    include: [{ model: Partido, as: 'partido' }],
  });
};

const findByDocumento = async (documento) => {
  return Candidato.findOne({ where: { documento } });
};

const findByCorreo = async (correo) => {
  return Candidato.findOne({ where: { correo } });
};

const create = async (data) => {
  return Candidato.create(data);
};

const update = async (id, data) => {
  const [affectedRows] = await Candidato.update(data, { where: { id } });
  if (affectedRows === 0) { return null; }
  return findById(id);
};

const remove = async (id) => {
  return Candidato.destroy({ where: { id } });
};

const count = async () => {
  return Candidato.count();
};

const findByPartido = async (id_partido) => {
  return Candidato.findAll({ where: { id_partido } });
};

module.exports = {
  findAll,
  findById,
  findByDocumento,
  findByCorreo,
  create,
  update,
  remove,
  count,
  findByPartido,
};