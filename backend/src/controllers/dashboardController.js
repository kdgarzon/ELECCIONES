const dashboardService = require('../services/dashboardService');

const getResumen = async (req, res, next) => {
  try {
    const resumen = await dashboardService.getResumen();
    res.json({ success: true, data: resumen });
  } catch (err) {
    next(err);
  }
};

module.exports = { getResumen };