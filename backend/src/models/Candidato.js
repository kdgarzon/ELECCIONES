const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidato = sequelize.define(
  'Candidato',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true, len: [2, 100] },
    },
    apellido: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true, len: [2, 100] },
    },
    documento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: { notEmpty: true },
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    id_partido: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'candidatos',
    timestamps: true,
    underscored: true,
  }
);

module.exports = Candidato;