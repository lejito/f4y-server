const { where } = require("sequelize");
const Cuenta = require("../models/Cuenta");

module.exports = {
  async crear(
    tipoIdentificacion,
    numeroIdentificacion,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    fechaNacimiento,
    correo,
    clave
  ) {
    const cuentaCreada = await Cuenta.create({
      tipoIdentificacion,
      numeroIdentificacion,
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      fechaNacimiento,
      correo,
      clave,
    });

    return cuentaCreada;
  },

  async buscar(tipoIdentificacion, numeroIdentificacion) {
    const cuentaEncontrada = await Cuenta.findOne({
      where: {
        tipoIdentificacion,
        numeroIdentificacion,
      },
    });

    return cuentaEncontrada;
  },

  async buscar(correo) {
    const cuentaEncontrada = await Cuenta.findOne({
      where: { correo },
    });

    return cuentaEncontrada;
  },
};
