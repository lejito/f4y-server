const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Cuenta = require("./Cuenta");

const Movimiento = sequelize.define(
  "Movimiento",
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
    monto: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false,
      validate: {
        min: 1,
      },
      field: "monto",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha",
    },
  },
  {
    tableName: "movimientos",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

module.exports = Movimiento;
