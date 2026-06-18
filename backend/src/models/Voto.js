const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Voto = sequelize.define(
  'Voto',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_candidato: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_voto: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'votos',
    timestamps: false,
  }
);

module.exports = Voto;