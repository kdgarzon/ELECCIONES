const candidatoRepository = require('../repositories/candidatoRepository');
const partidoRepository = require('../repositories/partidoRepository');
const { AppError } = require('../middlewares/errorHandler');

const getAll = async () => {
  return candidatoRepository.findAll();
};

const getById = async (id) => {
  const candidato = await candidatoRepository.findById(id);
  if (!candidato) { throw new AppError('Candidato no encontrado', 404); }
  return candidato;
};

const create = async (data) => {
  const partido = await partidoRepository.findById(data.id_partido);
  if (!partido) { throw new AppError('El partido especificado no existe', 404); }

  const existeDocumento = await candidatoRepository.findByDocumento(data.documento);
  if (existeDocumento) { throw new AppError('Ya existe un candidato con ese documento', 409); }

  const existeCorreo = await candidatoRepository.findByCorreo(data.correo);
  if (existeCorreo) { throw new AppError('Ya existe un candidato con ese correo', 409); }

  return candidatoRepository.create(data);
};

const update = async (id, data) => {
  const candidato = await candidatoRepository.findById(id);
  if (!candidato) { throw new AppError('Candidato no encontrado', 404); }

  if (data.id_partido) {
    const partido = await partidoRepository.findById(data.id_partido);
    if (!partido) { throw new AppError('El partido especificado no existe', 404); }
  }

  if (data.documento && data.documento !== candidato.documento) {
    const existeDocumento = await candidatoRepository.findByDocumento(data.documento);
    if (existeDocumento) { throw new AppError('Ya existe un candidato con ese documento', 409); }
  }

  if (data.correo && data.correo !== candidato.correo) {
    const existeCorreo = await candidatoRepository.findByCorreo(data.correo);
    if (existeCorreo) { throw new AppError('Ya existe un candidato con ese correo', 409); }
  }

  return candidatoRepository.update(id, data);
};

const remove = async (id) => {
  const candidato = await candidatoRepository.findById(id);
  if (!candidato) { throw new AppError('Candidato no encontrado', 404); }

  await candidatoRepository.remove(id);
  return { message: 'Candidato eliminado exitosamente' };
};

module.exports = { getAll, getById, create, update, remove };