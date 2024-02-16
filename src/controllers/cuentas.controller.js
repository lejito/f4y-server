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
          utils.successResponse(
            "Cuenta creada correctamente. Ya puedes iniciar sesión.",
            {
              idCuenta: cuenta.id,
            }
          )
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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async verificarSesion(req, res) {
    try {
      const token = req.headers.authorization;

      jwtService.verificarToken(token);
      return res.status(200).json(
        utils.successResponse("La autenticación de sesión es válida.", {
          sesionValida: true,
        })
      );
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "La sesión no es válida y/o ha ocurrido un error al validarla.",
            { sesionValida: false }
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerIdentificacion(req, res) {
    try {
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        return res.status(200).json(
          utils.successResponse("Identificación obtenida correctamente.", {
            cuenta: {
              tipoIdentificacion: cuenta.tipoIdentificacion,
              numeroIdentificacion: cuenta.numeroIdentificacion,
            },
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener la identificación.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerNombre(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        return res.status(200).json(
          utils.successResponse("Nombre obtenido correctamente.", {
            cuenta: {
              primerNombre: cuenta.primerNombre,
              segundoNombre: cuenta.segundoNombre,
              primerApellido: cuenta.primerApellido,
              segundoApellido: cuenta.segundoApellido,
            },
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el nombre.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerFechaNacimiento(req, res) {
    try {
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        return res.status(200).json(
          utils.successResponse("Fecha de nacimiento obtenida correctamente.", {
            cuenta: {
              fechaNacimiento: cuenta.fechaNacimiento,
            },
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener la fecha de nacimiento.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerCorreo(req, res) {
    try {
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        return res.status(200).json(
          utils.successResponse("Correo electrónico obtenido correctamente.", {
            cuenta: {
              correo: cuenta.correo,
            },
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el correo electrónico.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarIdentificacion(req, res) {
    try {
      const { tipoIdentificacion, numeroIdentificacion } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuentaActualizada = await cuentasService.actualizarIdentificacion(
        idCuenta,
        tipoIdentificacion,
        numeroIdentificacion
      );

      if (cuentaActualizada) {
        try {
          await registrosService.crear(idCuenta, "Actualizar identificación");
        } catch (error) {}

        return res.status(200).json(
          utils.successResponse("Identificación actualizada correctamente.", {
            cuentaActualizada: true,
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar la identificación.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarNombre(req, res) {
    try {
      const { primerNombre, segundoNombre, primerApellido, segundoApellido } =
        req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuentaActualizada = await cuentasService.actualizarNombre(
        idCuenta,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido
      );

      if (cuentaActualizada) {
        try {
          await registrosService.crear(idCuenta, "Actualizar nombre");
        } catch (error) {}

        return res.status(200).json(
          utils.successResponse("Nombre actualizado correctamente.", {
            cuentaActualizada: true,
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar el nombre.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarFechaNacimiento(req, res) {
    try {
      const { fechaNacimiento } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuentaActualizada = await cuentasService.actualizarFechaNacimiento(
        idCuenta,
        fechaNacimiento
      );

      if (cuentaActualizada) {
        try {
          await registrosService.crear(
            idCuenta,
            "Actualizar fecha de nacimiento"
          );
        } catch (error) {}

        return res.status(200).json(
          utils.successResponse(
            "Fecha de nacimiento actualizada correctamente.",
            {
              cuentaActualizada: true,
            }
          )
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar la fecha de nacimiento.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarCorreo(req, res) {
    try {
      const { correo } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuentaActualizada = await cuentasService.actualizarCorreo(
        idCuenta,
        correo
      );

      if (cuentaActualizada) {
        try {
          await registrosService.crear(
            idCuenta,
            "Actualizar correo electrónico"
          );
        } catch (error) {}

        return res.status(200).json(
          utils.successResponse(
            "Correo electrónico actualizado correctamente.",
            {
              cuentaActualizada: true,
            }
          )
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar el correo electrónico.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarClave(req, res) {
    try {
      const { claveActual, clave } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const claveCorrecta = await bcryptService.verificarClave(
          claveActual,
          cuenta.clave
        );

        if (claveCorrecta) {
          const cuentaActualizada = await cuentasService.actualizarClave(
            idCuenta,
            await bcryptService.encriptarClave(clave)
          );

          if (cuentaActualizada) {
            try {
              await registrosService.crear(idCuenta, "Actualizar contraseña");
            } catch (error) {}

            return res.status(200).json(
              utils.successResponse("Contraseña actualizada correctamente.", {
                cuentaActualizada: true,
              })
            );
          } else {
            return res
              .status(200)
              .json(
                utils.errorResponse("No se actualizó la contraseña.", null)
              );
          }
        } else {
          return res
            .status(200)
            .json(utils.errorResponse("La clave actual no es correcta.", null));
        }
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar la contraseña.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerSaldo(req, res) {
    try {
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        return res.status(200).json(
          utils.successResponse("Saldo obtenido correctamente.", {
            saldo: parseFloat(cuenta.saldo),
          })
        );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el saldo.",
            null
          )
        );
    }
  }
}

module.exports = CuentasController;
