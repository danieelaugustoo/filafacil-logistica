const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const PRIORIDADES = ["baixa", "media", "alta"];

const Coleta = sequelize.define(
  "Coleta",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cliente: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    pacotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    prioridade: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { isIn: [PRIORIDADES] },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendente",
      validate: { notEmpty: true },
    },
  },
  {
    tableName: "coletas",
    createdAt: "createdAt",
    updatedAt: false,
  },
);

Coleta.PRIORIDADES = PRIORIDADES;

module.exports = Coleta;
