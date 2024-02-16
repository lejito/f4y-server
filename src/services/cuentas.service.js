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

  async buscarPorId(id) {
    const cuentaEncontrada = await Cuenta.findByPk(id);
    return cuentaEncontrada;
  },

  async buscarPorIdentificacion(tipoIdentificacion, numeroIdentificacion) {
    const cuentaEncontrada = await Cuenta.findOne({
      where: {
        tipoIdentificacion,
        numeroIdentificacion,
      },
    });
    return cuentaEncontrada;
  },

  async buscarPorCorreo(correo) {
    const cuentaEncontrada = await Cuenta.findOne({
      where: { correo },
    });
    return cuentaEncontrada;
  },

  async actualizarIdentificacion(id, tipoIdentificacion, numeroIdentificacion) {
    const [affectedCount] = await Cuenta.update(
      { tipoIdentificacion, numeroIdentificacion },
      { where: { id } }
    );
    return affectedCount > 0;
  },

  async actualizarNombre(
    id,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido
  ) {
    const [affectedCount] = await Cuenta.update(
      { primerNombre, segundoNombre, primerApellido, segundoApellido },
      { where: { id } }
    );
    return affectedCount > 0;
  },

  async actualizarFechaNacimiento(id, fechaNacimiento) {
    const [affectedCount] = await Cuenta.update(
      { fechaNacimiento },
      { where: { id } }
    );
    return affectedCount > 0;
  },

  async actualizarCorreo(id, correo) {
    const [affectedCount] = await Cuenta.update({ correo }, { where: { id } });
    return affectedCount > 0;
  },

  async actualizarClave(id, clave) {
    const [affectedCount] = await Cuenta.update({ clave }, { where: { id } });
    return affectedCount > 0;
  },

  async sumarSaldo(id, monto) {
    const cuenta = await this.buscarPorId(id);
    cuenta.increment("saldo", { by: monto });
  },

  async restarSaldo(id, monto) {
    const cuenta = await this.buscarPorId(id);
    cuenta.decrement("saldo", { by: monto });
  },
};
