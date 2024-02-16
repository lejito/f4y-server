const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Movimiento = require("./Movimiento");
const CDT = require("./CDT");

const TransferenciasCDT = sequelize.define(
  "TransferenciasCDT",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    movimiento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Movimiento,
        key: "id",
      },
      field: "movimiento",
    },
    cdt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: CDT,
        key: "id",
      },
      field: "cdt",
    },
    tipo: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        isIn: [["inversion", "liquidacion", "cancelacion"]],
      },
      field: "tipo",
    },
  },
  {
    tableName: "transferencias_cdts",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

module.exports = TransferenciasCDT;
