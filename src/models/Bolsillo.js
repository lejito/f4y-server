const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Cuenta = require("./Cuenta");

const Bolsillo = sequelize.define(
  "Bolsillo",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    cuenta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cuenta,
        key: "id",
      },
      field: "cuenta",
    },
    nombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "nombre",
    },
    saldo: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
      field: "saldo",
    },
    saldoObjetivo: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: true,
      defaultValue: null,
      validate: {
        min: 1,
      },
      field: "saldo_objetivo",
    },
    eliminado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "eliminado",
    },
  },
  {
    tableName: "bolsillos",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

module.exports = Bolsillo;
