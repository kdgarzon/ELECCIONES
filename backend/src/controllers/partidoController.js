const partidoService = require('../services/partidoService');

const getAll = async (req, res, next) => {
  try {
    const partidos = await partidoService.getAll();
    res.json({ success: true, data: partidos });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const partido = await partidoService.getById(Number(req.params.id));
    res.json({ success: true, data: partido });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const partido = await partidoService.create(req.body);
    res.status(201).json({ success: true, message: 'Partido creado exitosamente', data: partido });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const partido = await partidoService.update(Number(req.params.id), req.body);
    res.json({ success: true, message: 'Partido actualizado exitosamente', data: partido });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await partidoService.remove(Number(req.params.id));
    res.json({ success: true, message: 'Partido eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };