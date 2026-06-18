const votoRepository = require('../repositories/votoRepository');
const candidatoRepository = require('../repositories/candidatoRepository');
const { AppError } = require('../middlewares/errorHandler');

const getAll = async () => {
  return votoRepository.findAll();
};

const create = async (data) => {
  const candidato = await candidatoRepository.findById(data.id_candidato);
  if (!candidato) { throw new AppError('El candidato especificado no existe', 404); }

  // Validar que el partido del voto coincida con el partido del candidato
  if (candidato.id_partido !== data.id_partido) {
    throw new AppError('El partido del voto no coincide con el partido del candidato', 400);
  }

  const votoData = {
    id_candidato: data.id_candidato,
    id_partido: candidato.id_partido,
    fecha_voto: new Date(),
  };

  return votoRepository.create(votoData);
};

const getEstadisticas = async () => {
  const [porCandidato, porPartido, totalVotos] = await Promise.all([
    votoRepository.estadisticasPorCandidato(),
    votoRepository.estadisticasPorPartido(),
    votoRepository.count(),
  ]);

  return {
    total_votos: totalVotos,
    por_candidato: porCandidato,
    por_partido: porPartido,
  };
};

module.exports = { getAll, create, getEstadisticas };