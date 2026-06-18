const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Partido = sequelize.define(
  'Partido',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, len: [2, 100] },
    },
    sigla: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true, len: [1, 20] },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },
  },
  {
    tableName: 'partidos',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Partido;