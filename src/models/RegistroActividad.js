const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Cuenta = require("./Cuenta");

const RegistroActividad = sequelize.define(
  "RegistroActividad",
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
    accion: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "accion",
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha",
    },
  },
  {
    tableName: "registros_actividad",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

RegistroActividad.belongsTo(Cuenta, { foreignKey: "cuenta" });

module.exports = RegistroActividad;
