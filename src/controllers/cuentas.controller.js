const utils = require("../../utils");
const cuentasService = require("../services/cuentas.service");
const registrosService = require("../services/registros.service");
const bcryptService = require("../services/bcrypt.service");
const jwtService = require("../services/jwt.service");

class CuentasController {
  constructor() {}

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
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

      const cuentaExistente1 = await cuentasService.buscarPorIdentificacion(
        tipoIdentificacion,
        numeroIdentificacion
      );
      const cuentaExistente2 = await cuentasService.buscarPorCorreo(correo);

      if (!cuentaExistente1 && !cuentaExistente2) {
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

        cuenta.clave = undefined;
        delete cuenta.clave;

        return res.status(200).json(
          utils.successResponse("Cuenta creada correctamente.", {
            idCuenta: cuenta.id,
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación y/o el correo ya pertenecen a una cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async iniciarsesion(req, res) {
    try {
      const { tipoIdentificacion, numeroIdentificacion, clave } = req.body;

      const cuenta = await cuentasService.buscarPorIdentificacion(
        tipoIdentificacion,
        numeroIdentificacion
      );

      if (cuenta) {
        const claveCorrecta = await bcryptService.verificarClave(
          clave,
          cuenta.clave
        );

        if (claveCorrecta) {
          const token = jwtService.crearToken(cuenta.id);

          try {
            await registrosService.crear(cuenta.id, "Iniciar sesión");
          } catch (error) {}

          return res
            .status(200)
            .json(
              utils.successResponse("Sesión iniciada correctamente.", { token })
            );
        } else {
          return res
            .status(200)
            .json(utils.errorResponse("La clave no es válida.", null));
        }
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación no pertenece a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar iniciar sesión.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async cerrarSesion(req, res) {
    try {
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      try {
        await registrosService.crear(idCuenta, "Cerrar sesión");
      } catch (error) {}

      return res
        .status(200)
        .json(utils.successResponse("Sesión cerrada correctamente.", null));
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar iniciar sesión.",
            null
          )
        );
    }
  }
}
module.exports = CuentasController;
