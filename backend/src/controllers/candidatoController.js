const candidatoService = require('../services/candidatoService');

const getAll = async (req, res, next) => {
  try {
    const candidatos = await candidatoService.getAll();
    res.json({ success: true, data: candidatos });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const candidato = await candidatoService.getById(Number(req.params.id));
    res.json({ success: true, data: candidato });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const candidato = await candidatoService.create(req.body);
    res.status(201).json({ success: true, message: 'Candidato creado exitosamente', data: candidato });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const candidato = await candidatoService.update(Number(req.params.id), req.body);
    res.json({ success: true, message: 'Candidato actualizado exitosamente', data: candidato });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await candidatoService.remove(Number(req.params.id));
    res.json({ success: true, message: 'Candidato eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById, create, update, remove };