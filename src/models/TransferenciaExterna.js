const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Movimiento = require("./Movimiento");

const TransferenciaExterna = sequelize.define(
  "TransferenciaExterna",
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
    entidad: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: ["quyne"],
      },
      field: "entidad",
    },
    cuenta: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: "cuenta",
    },
    carga: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "carga",
    },
  },
  {
    tableName: "transferencias_externas",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

module.exports = TransferenciaExterna;
