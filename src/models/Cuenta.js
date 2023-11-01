const { DataTypes } = require("sequelize");
const sequelize = require("../../db");

const Cuenta = sequelize.define(
  "Cuenta",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: "id",
    },
    tipoIdentificacion: {
      type: DataTypes.STRING(2),
      allowNull: false,
      validate: {
        isIn: [["CC", "TI", "CE", "PP"]],
      },
      field: "tipo_identificacion",
    },
    numeroIdentificacion: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: "numero_identificacion",
    },
    primerNombre: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "primer_nombre",
    },
    segundoNombre: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "segundo_nombre",
    },
    primerApellido: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "primer_apellido",
    },
    segundoApellido: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "segundo_apellido",
    },
    fechaNacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "fecha_nacimiento",
    },
    correo: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      field: "correo",
    },
    clave: {
      type: DataTypes.STRING(76),
      allowNull: true,
      field: "clave",
    },
    saldo: {
      type: DataTypes.DECIMAL(16, 2),
      allowNull: false,
      defaultValue: 0,
      field: "saldo",
    },
    saldoOculto: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "saldo_oculto",
    },
    bloqueada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "bloqueada",
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "fecha_creacion",
    },
  },
  {
    tableName: "cuentas",
    timestamps: false, // Desactiva las marcas de tiempo automáticas (createdAt, updatedAt)
  }
);

module.exports = Cuenta;
