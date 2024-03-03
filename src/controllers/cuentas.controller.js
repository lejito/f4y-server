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

      const cuentaExistente1 = await cuentasService.buscarPorIdentificacion(
        tipoIdentificacion,
        numeroIdentificacion
      );
      const cuentaExistente2 = await cuentasService.buscarPorCorreo(correo);
        //<2>
        //<3>
      if (!cuentaExistente1 && !cuentaExistente2) {
        //<4>
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
        //<4>
      }
      //<3>
       
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación y/o el correo ya pertenecen a una cuenta existente.",
              null
            )
          );
      }
    } 
    // <1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const { tipoIdentificacion, numeroIdentificacion, clave } = req.body;

      const cuenta = await cuentasService.buscarPorIdentificacion(
        tipoIdentificacion,
        numeroIdentificacion
      );
        //<2>
        //<3>
      if (cuenta) {
        //<4>
        const claveCorrecta = await bcryptService.verificarClave(
          clave,
          cuenta.clave
        );
        //<4>
        //<5>
        if (claveCorrecta) {
          //<6>
          const token = jwtService.crearToken(cuenta.id);
       
          try {
            await registrosService.crear(cuenta.id, "Iniciar sesión");
          } catch (error) {}

          return res
            .status(200)
            .json(
              utils.successResponse("Sesión iniciada correctamente.", { token })
            );
          //<6>
        } 
        //<5>
        else {
          return res
            .status(200)
            .json(utils.errorResponse("La clave no es válida.", null));
        }
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación no pertenece a ninguna cuenta existente.",
              null
            )
          );
      }
    }
    //<1> 
    catch (error) {
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
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      try {
        await registrosService.crear(idCuenta, "Cerrar sesión");
      } catch (error) {}

      return res
        .status(200)
        .json(utils.successResponse("Sesión cerrada correctamente.", null));
        //<2>
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;

      jwtService.verificarToken(token);
      return res.status(200).json(
        utils.successResponse("La autenticación de sesión es válida.", {
          sesionValida: true,
        })
      );
      //<2>
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<2>
      //<3>
      if (cuenta) {
        //<4>
        return res.status(200).json(
          utils.successResponse("Identificación obtenida correctamente.", {
            cuenta: {
              tipoIdentificacion: cuenta.tipoIdentificacion,
              numeroIdentificacion: cuenta.numeroIdentificacion,
            },
          })
        );
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);
    //<2>
    //<3>
      if (cuenta) {
        //<4>
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
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<2>
      //<3>
      if (cuenta) {
        //<4>
        return res.status(200).json(
          utils.successResponse("Fecha de nacimiento obtenida correctamente.", {
            cuenta: {
              fechaNacimiento: cuenta.fechaNacimiento,
            },
          })
        );
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);
//<2>
//<3>
      if (cuenta) {
        //<4>
        return res.status(200).json(
          utils.successResponse("Correo electrónico obtenido correctamente.", {
            cuenta: {
              correo: cuenta.correo,
            },
          })
        );
        //<4>
      }
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const { tipoIdentificacion, numeroIdentificacion } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuentaActualizada = await cuentasService.actualizarIdentificacion(
        idCuenta,
        tipoIdentificacion,
        numeroIdentificacion
      );
//<2>
//<3>
      if (cuentaActualizada) {
        //<4>
        try {
          await registrosService.crear(idCuenta, "Actualizar identificación");
        } catch (error) {}

        return res.status(200).json(
          utils.successResponse("Identificación actualizada correctamente.", {
            cuentaActualizada: true,
          })
        );
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
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
      //<2>
      //<3>
      if (cuentaActualizada) {
        //<4>
        try {
          await registrosService.crear(idCuenta, "Actualizar nombre");
        } catch (error) {}

        return res.status(200).json(
          utils.successResponse("Nombre actualizado correctamente.", {
            cuentaActualizada: true,
          })
        );
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const { fechaNacimiento } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuentaActualizada = await cuentasService.actualizarFechaNacimiento(
        idCuenta,
        fechaNacimiento
      );
        //<2>
        //<3>
      if (cuentaActualizada) {
        //<4>
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
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const { correo } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuentaActualizada = await cuentasService.actualizarCorreo(
        idCuenta,
        correo
      );
        //<2>
        //<3>
      if (cuentaActualizada) {
        //<4>
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
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const { claveActual, clave } = req.body;

      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<2>
      //<3>
      if (cuenta) {
        //<4>
        const claveCorrecta = await bcryptService.verificarClave(
          claveActual,
          cuenta.clave
        );
          //<4>
          //<5>
        if (claveCorrecta) {
          //<6>
          const cuentaActualizada = await cuentasService.actualizarClave(
            idCuenta,
            await bcryptService.encriptarClave(clave)
          );
            //<6>
            //<7>
          if (cuentaActualizada) {
            //<8>
            try {
              await registrosService.crear(idCuenta, "Actualizar contraseña");
            } catch (error) {}

            return res.status(200).json(
              utils.successResponse("Contraseña actualizada correctamente.", {
                cuentaActualizada: true,
              })
            );
            //<8>
          }
          //<7>
          else {
            return res
              .status(200)
              .json(
                utils.errorResponse("No se actualizó la contraseña.", null)
              );
          }
        } 
          //<5>
        else {
          return res
            .status(200)
            .json(utils.errorResponse("La clave actual no es correcta.", null));
        }
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } 
    //<1>
    catch (error) {
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
    //<1>
    try {
      //<2>
      const token = req.headers.authorization;

      const { idCuenta } = jwtService.verificarToken(token);

      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<2>
      //<3>
      if (cuenta) {
        //<4>
        return res.status(200).json(
          utils.successResponse("Saldo obtenido correctamente.", {
            saldo: parseFloat(cuenta.saldo),
          })
        );
        //<4>
      } 
      //<3>
      else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    }
    //<1>
    catch (error) {
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
