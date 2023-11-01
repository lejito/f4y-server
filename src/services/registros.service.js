const RegistroActividad = require("../models/RegistroActividad");

module.exports = {
  async crear(idCuenta, accion) {
    const registroActividad = await RegistroActividad.create({
      cuenta: idCuenta,
      accion,
    });

    return registroActividad;
  },
};
