const partidoRepository = require('../repositories/partidoRepository');
const candidatoRepository = require('../repositories/candidatoRepository');
const votoRepository = require('../repositories/votoRepository');

const getResumen = async () => {
  const [totalPartidos, totalCandidatos, totalVotos] = await Promise.all([
    partidoRepository.count(),
    candidatoRepository.count(),
    votoRepository.count(),
  ]);

  return { totalPartidos, totalCandidatos, totalVotos };
};

module.exports = { getResumen };