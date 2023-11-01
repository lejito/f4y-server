require("dotenv").config();
const utils = require("../../utils");
const cuentasService = require("../services/cuentas.service");
const bcryptService = require("../services/bcrypt.service");

class CuentasController {
  constructor() {}

  /**
   *
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async crear(req, res) {
    try {
      const {
        tipoIdentificacion,
        numeroIdentificacion,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido,
        fechaNacimiento,
        correo,
        clave,
      } = req.body;

      const cuentaExistente = await cuentasService.buscar(correo);

      if (cuentaExistente === null) {
        const cuenta = await cuentasService.crear(
          tipoIdentificacion,
          numeroIdentificacion,
          primerNombre,
          segundoNombre,
          primerApellido,
          segundoApellido,
          fechaNacimiento,
          correo,
          await bcryptService.encriptarClave(clave)
        );

        return res
          .status(200)
          .json(
            utils.successResponse("Cuenta creada correctamente.", { cuenta })
          );
      } else {
        return res
          .status(400)
          .json(
            utils.errorResponse(
              "La identificación y/o el correo ya pertenecen a una cuenta existente."
            )
          );
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar crear la cuenta.",
            null
          )
        );
    }
  }
}
module.exports = CuentasController;
