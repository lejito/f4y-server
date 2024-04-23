const utils = require("../../utils");
const cuentasService = require("../services/cuentas.service");
const registrosService = require("../services/registros.service");
const bcryptService = require("../services/bcrypt.service");
const jwtService = require("../services/jwt.service");

class CuentasController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async crear(req, res) {
    // <1>
    try {
      //<2>
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
      //<2>
      //<3>
      const cuentaExistente1 = await cuentasService.buscarPorIdentificacion(
        tipoIdentificacion,
        numeroIdentificacion
      );
      //<3>
      //<4>
      const cuentaExistente2 = await cuentasService.buscarPorCorreo(correo);
      //<4>
      //<5>
      if (!cuentaExistente1 && !cuentaExistente2) {
        //<6>
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
        //<6>
        //<7>
        cuenta.clave = undefined;
        delete cuenta.clave;
        //<7>
        //<8>
        return res.status(200).json(
          utils.successResponse(
            "Cuenta creada correctamente. Ya puedes iniciar sesión.",
            {
              idCuenta: cuenta.id,
            }
          )
        );
        //<8>
      }
      //<5>
      else {
        //<9>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación y/o el correo ya pertenecen a una cuenta existente.",
              null
            )
          );
        //<9>
      }
    } catch (error) {
      // <1>
      // <10>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar crear la cuenta.",
            null
          )
        );
      // <10>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async iniciarsesion(req, res) {
    //<1>
    try {
      //<2>
      const { tipoIdentificacion, numeroIdentificacion, clave } = req.body;
      //<2>
      //<3>

      const cuenta = await cuentasService.buscarPorIdentificacion(
        tipoIdentificacion,
        numeroIdentificacion
      );

      //<3>
      //<4>
      if (cuenta) {
        //<5>
        const claveCorrecta = await bcryptService.verificarClave(
          clave,
          cuenta.clave
        );
        //<5>
        //<6>
        if (claveCorrecta) {
          //<7>
          const token = jwtService.crearToken(cuenta.id);
          //<7>
          //<8>
          try {
            await registrosService.crear(cuenta.id, "Iniciar sesión");
          } catch (error) {}
          //<8>
          //<9>
          return res
            .status(200)
            .json(
              utils.successResponse("Sesión iniciada correctamente.", { token })
            );
          //<9>
        }
        // <6>
        else {
          //<10>
          return res
            .status(200)
            .json(utils.errorResponse("La clave no es válida.", null));
          //<10>
        }
      }
      //<4>
      else {
        //<11>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación no pertenece a ninguna cuenta existente.",
              null
            )
          );
        //<11>
      }
    } catch (error) {
      //<1>
      // <12>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar iniciar sesión.",
            null
          )
        );
      // <12>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async cerrarSesion(req, res) {
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      //<2>
      //<3>
      const { idCuenta } = jwtService.verificarToken(token);
      //<3>
      //<4>
      try {
        await registrosService.crear(idCuenta, "Cerrar sesión");
      } catch (error) {}
      //<4>
      //<5>
      return res
        .status(200)
        .json(utils.successResponse("Sesión cerrada correctamente.", null));
      //<5>
    } catch (error) {
      //<1>
      // <6>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar iniciar sesión.",
            null
          )
        );
      // <6>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async verificarSesion(req, res) {
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      //<2>
      //<3>
      jwtService.verificarToken(token);
      //<3>
      //<4>
      return res.status(200).json(
        utils.successResponse("La autenticación de sesión es válida.", {
          sesionValida: true,
        })
        //<4>
      );
      //<2>
    } catch (error) {
      //<1>
      // <5>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "La sesión no es válida y/o ha ocurrido un error al validarla.",
            { sesionValida: false }
          )
        );
      // <5>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerIdentificacion(req, res) {
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      //<2>
      //<3>
      const { idCuenta } = jwtService.verificarToken(token);
      //<3>
      //<4>
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<4>
      //<5>
      if (cuenta) {
        //<6>
        return res.status(200).json(
          utils.successResponse("Identificación obtenida correctamente.", {
            cuenta: {
              tipoIdentificacion: cuenta.tipoIdentificacion,
              numeroIdentificacion: cuenta.numeroIdentificacion,
            },
          })
        );
        // <6>
      }
      //<5>
      else {
        //<7>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<7>
      }
    } catch (error) {
      //<1>
      // <8>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener la identificación.",
            null
          )
        );
      // <8>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerNombre(req, res) {
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      //<2>
      //<3>
      const { idCuenta } = jwtService.verificarToken(token);
      //<3>
      //<4>
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<4>
      //<5>
      if (cuenta) {
        //<6>
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
        //<6>
      }
      //<5>
      else {
        //<7>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<7>
      }
    } catch (error) {
      //<1>
      // <8>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el nombre.",
            null
          )
        );
      //<8>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerFechaNacimiento(req, res) {
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      //<2>
      //<3>
      const { idCuenta } = jwtService.verificarToken(token);
      //<3>
      //<4>
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<4>
      //<5>
      if (cuenta) {
        // <6>
        return res.status(200).json(
          utils.successResponse("Fecha de nacimiento obtenida correctamente.", {
            cuenta: {
              fechaNacimiento: cuenta.fechaNacimiento,
            },
          })
        );
        //<6>
      }
      //<5>
      else {
        //<7>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<7>
      }
    } catch (error) {
      //<1>
      // <8>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener la fecha de nacimiento.",
            null
          )
        );
      // <8>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerCorreo(req, res) {
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      //<2>
      //<3>
      const { idCuenta } = jwtService.verificarToken(token);
      //<3>
      //<4>
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<4>
      //<5>
      if (cuenta) {
        //<6>
        return res.status(200).json(
          utils.successResponse("Correo electrónico obtenido correctamente.", {
            cuenta: {
              correo: cuenta.correo,
            },
          })
        );
        //<6>
      }
      //<5>
      else {
        //<7>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<7>
      }
    } catch (error) {
      //<1>
      //<8>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el correo electrónico.",
            null
          )
        );
      //<8>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarIdentificacion(req, res) {
    //<1>
    try {
      //<2>
      const { tipoIdentificacion, numeroIdentificacion } = req.body;
      //<2>
      //<3>
      const token = req.headers.authorization;
      //<3>
      //<4>
      const { idCuenta } = jwtService.verificarToken(token);
      //<4>
      //<5>
      const cuentaActualizada = await cuentasService.actualizarIdentificacion(
        idCuenta,
        tipoIdentificacion,
        numeroIdentificacion
      );
      //<5>
      //<6>
      if (cuentaActualizada) {
        //<7>
        try {
          await registrosService.crear(idCuenta, "Actualizar identificación");
        } catch (error) {}
        //<7>
        //<8>
        return res.status(200).json(
          utils.successResponse("Identificación actualizada correctamente.", {
            cuentaActualizada: true,
          })
        );
        //<8>
      }
      //<6>
      else {
        //<9>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<9>
      }
    } catch (error) {
      //<1>
      //<10>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar la identificación.",
            null
          )
        );
      //<10>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarNombre(req, res) {
    //<1>
    try {
      //<2>
      const { primerNombre, segundoNombre, primerApellido, segundoApellido } =
        req.body;
      //<2>
      //<3>
      const token = req.headers.authorization;
      //<3>
      //<4>
      const { idCuenta } = jwtService.verificarToken(token);
      //<4>
      //<5>
      const cuentaActualizada = await cuentasService.actualizarNombre(
        idCuenta,
        primerNombre,
        segundoNombre,
        primerApellido,
        segundoApellido
      );
      //<5>
      //<6>
      if (cuentaActualizada) {
        //<7>
        try {
          await registrosService.crear(idCuenta, "Actualizar nombre");
        } catch (error) {}
        //<7>
        //<8>
        return res.status(200).json(
          utils.successResponse("Nombre actualizado correctamente.", {
            cuentaActualizada: true,
          })
        );
        //<8>
      }
      //<6>
      else {
        //<9>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<9>
      }
    } catch (error) {
      //<1>
      //<10>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar el nombre.",
            null
          )
        );
      //<10>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarFechaNacimiento(req, res) {
    //<1>
    try {
      //<2>
      const { fechaNacimiento } = req.body;
      //<2>
      //<3>
      const token = req.headers.authorization;
      //<3>
      //<4>
      const { idCuenta } = jwtService.verificarToken(token);
      //<4>
      //<5>
      const cuentaActualizada = await cuentasService.actualizarFechaNacimiento(
        idCuenta,
        fechaNacimiento
      );
      //<5>
      //<6>
      if (cuentaActualizada) {
        //<7>
        try {
          await registrosService.crear(
            idCuenta,
            "Actualizar fecha de nacimiento"
          );
        } catch (error) {}
        //<7>
        //<8>
        return res.status(200).json(
          utils.successResponse(
            "Fecha de nacimiento actualizada correctamente.",
            {
              cuentaActualizada: true,
            }
          )
        );
        //<8>
      }
      //<6>
      else {
        //<9>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<9>
      }
    } catch (error) {
      //<1>
      //<10>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar la fecha de nacimiento.",
            null
          )
        );
      //<10>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarCorreo(req, res) {
    //<1>
    try {
      //<2>
      const { correo } = req.body;
      //<2>
      //<3>
      const token = req.headers.authorization;
      //<3>
      //<4>
      const { idCuenta } = jwtService.verificarToken(token);
      //<4>
      //<5>
      const cuentaActualizada = await cuentasService.actualizarCorreo(
        idCuenta,
        correo
      );
      //<5>
      //<6>
      if (cuentaActualizada) {
        //<7>
        try {
          await registrosService.crear(
            idCuenta,
            "Actualizar correo electrónico"
          );
        } catch (error) {}
        //<7>
        //<8>
        return res.status(200).json(
          utils.successResponse(
            "Correo electrónico actualizado correctamente.",
            {
              cuentaActualizada: true,
            }
          )
        );
        //<8>
      }
      //<6>
      else {
        //<9>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<9>
      }
    } catch (error) {
      //<1>
      //<10>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar el correo electrónico.",
            null
          )
        );
      //<10>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizarClave(req, res) {
    //<1>
    try {
      //<2>
      const { claveActual, clave } = req.body;
      //<2>
      //<3>
      const token = req.headers.authorization;
      //<3>
      //<4>
      const { idCuenta } = jwtService.verificarToken(token);
      //<4>
      //<5>
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<5>
      //<6>
      if (cuenta) {
        //<7>
        const claveCorrecta = await bcryptService.verificarClave(
          claveActual,
          cuenta.clave
        );
        //<7>
        // <8>
        if (claveCorrecta) {
          //<9>
          const cuentaActualizada = await cuentasService.actualizarClave(
            idCuenta,
            await bcryptService.encriptarClave(clave)
          );
          //<9>
          //<10>
          if (cuentaActualizada) {
            //<11>
            try {
              await registrosService.crear(idCuenta, "Actualizar contraseña");
            } catch (error) {}
            //<11>
            //<12>
            return res.status(200).json(
              utils.successResponse("Contraseña actualizada correctamente.", {
                cuentaActualizada: true,
              })
              //<12>
            );
          }
          //<10>
          else {
            //13
            return res
              .status(200)
              .json(
                utils.errorResponse("No se actualizó la contraseña.", null)
              );
            //13
          }
        }
        //<8>
        else {
          // <14>
          return res
            .status(200)
            .json(utils.errorResponse("La clave actual no es correcta.", null));
          // <14>
        }
      }
      // <6>
      else {
        // <15>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        // <15>
      }
    } catch (error) {
      //<1>
      // <16>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar la contraseña.",
            null
          )
        );
      // <16>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerSaldo(req, res) {
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      //<2>
      //<3>
      const { idCuenta } = jwtService.verificarToken(token);
      //<3>
      //<4>
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<4>
      //<5>
      if (cuenta) {
        //<6>
        return res.status(200).json(
          utils.successResponse("Saldo obtenido correctamente.", {
            saldo: parseFloat(cuenta.saldo),
          })
        );
        //<6>
      }
      // <5>
      else {
        //<7>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<7>
      }
    } catch (error) {
      //<1>
      // <8>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el saldo.",
            null
          )
        );
      // <8>
    }
  }
}

module.exports = CuentasController;
