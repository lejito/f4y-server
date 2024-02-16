const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Movimiento = require("./Movimiento");
const Bolsillo = require("./Bolsillo");

const TransferenciaBolsillo = sequelize.define(
  "TransferenciaBolsillo",
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
    bolsillo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Bolsillo,
        key: "id",
      },
      field: "bolsillo",
    },
    carga: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "carga",
    },
  },
  {
    tableName: "transferencias_bolsillos",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

module.exports = TransferenciaBolsillo;
