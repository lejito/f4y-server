const { DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Cuenta = require("./Cuenta");

const CDT = sequelize.define(
  "CDT",
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
    inversion: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false,
      validate: {
        min: 1,
      },
      field: "inversion",
    },
    interes: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: null,
      validate: {
        min: 0,
      },
      field: "interes",
    },
    retencion: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
      field: "retencion",
    },
    duracion: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        min: 1,
      },
      field: "duracion",
    },
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fecha_inicio",
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fecha_fin",
    },
    liquidado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "liquidado",
    },
    cancelado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "cancelado",
    },
  },
  {
    tableName: "cdts",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

module.exports = CDT;
