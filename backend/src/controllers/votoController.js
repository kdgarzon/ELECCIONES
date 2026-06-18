const votoService = require('../services/votoService');

const getAll = async (req, res, next) => {
  try {
    const votos = await votoService.getAll();
    res.json({ success: true, data: votos });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const voto = await votoService.create(req.body);
    res.status(201).json({ success: true, message: 'Voto registrado exitosamente', data: voto });
  } catch (err) {
    next(err);
  }
};

const getEstadisticas = async (req, res, next) => {
  try {
    const estadisticas = await votoService.getEstadisticas();
    res.json({ success: true, data: estadisticas });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, getEstadisticas };