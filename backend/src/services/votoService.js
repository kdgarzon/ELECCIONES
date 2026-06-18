const votoRepository = require('../repositories/votoRepository');
const candidatoRepository = require('../repositories/candidatoRepository');
const { AppError } = require('../middlewares/errorHandler');

const getAll = async () => {
  return votoRepository.findAll();
};

const create = async (data) => {
  const candidato = await candidatoRepository.findById(data.id_candidato);
  if (!candidato) { throw new AppError('El candidato especificado no existe', 404); }

  // El partido se deriva del candidato: no se acepta ni se almacena
  // id_partido en el body — la fuente de verdad es candidatos.id_partido
  return votoRepository.create({
    id_candidato: candidato.id,
    fecha_voto: new Date(),
  });
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