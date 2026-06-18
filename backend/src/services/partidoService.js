const partidoRepository = require('../repositories/partidoRepository');
const { AppError } = require('../middlewares/errorHandler');

const getAll = async () => {
  const partidos = await partidoRepository.findAll();
  return partidos;
};

const getById = async (id) => {
  const partido = await partidoRepository.findById(id);
  if (!partido) { throw new AppError('Partido no encontrado', 404); }
  return partido;
};

const create = async (data) => {
  const existeNombre = await partidoRepository.findByNombre(data.nombre);
  if (existeNombre) { throw new AppError('Ya existe un partido con ese nombre', 409); }

  const existeSigla = await partidoRepository.findBySigla(data.sigla);
  if (existeSigla) { throw new AppError('Ya existe un partido con esa sigla', 409); }

  return partidoRepository.create(data);
};

const update = async (id, data) => {
  const partido = await partidoRepository.findById(id);
  if (!partido) { throw new AppError('Partido no encontrado', 404); }

  if (data.nombre && data.nombre !== partido.nombre) {
    const existeNombre = await partidoRepository.findByNombre(data.nombre);
    if (existeNombre) { throw new AppError('Ya existe un partido con ese nombre', 409); }
  }

  if (data.sigla && data.sigla !== partido.sigla) {
    const existeSigla = await partidoRepository.findBySigla(data.sigla);
    if (existeSigla) { throw new AppError('Ya existe un partido con esa sigla', 409); }
  }

  return partidoRepository.update(id, data);
};

const remove = async (id) => {
  const partido = await partidoRepository.findById(id);
  if (!partido) { throw new AppError('Partido no encontrado', 404); }

  if (partido.candidatos && partido.candidatos.length > 0) {
    throw new AppError('No se puede eliminar un partido que tiene candidatos asociados', 400);
  }

  await partidoRepository.remove(id);
  return { message: 'Partido eliminado exitosamente' };
};

module.exports = { getAll, getById, create, update, remove };