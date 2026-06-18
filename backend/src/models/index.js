const Partido = require('./Partido');
const Candidato = require('./Candidato');
const Voto = require('./Voto');

// Un partido tiene muchos candidatos
Partido.hasMany(Candidato, { foreignKey: 'id_partido', as: 'candidatos' });
Candidato.belongsTo(Partido, { foreignKey: 'id_partido', as: 'partido' });

// Un candidato puede recibir muchos votos
Candidato.hasMany(Voto, { foreignKey: 'id_candidato', as: 'votos' });
Voto.belongsTo(Candidato, { foreignKey: 'id_candidato', as: 'candidato' });

module.exports = { Partido, Candidato, Voto };