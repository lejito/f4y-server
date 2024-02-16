require("dotenv").config();
const axios = require("axios");
const utils = require("../../utils");
const jwtService = require("../services/jwt.service");
const cuentasService = require("../services/cuentas.service");
const movimientosService = require("../services/movimientos.service");

class MovimientosController {
  constructor() {}

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerUltimos(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const movimientos = await movimientosService.obtenerUltimos(idCuenta);
        return res
          .status(200)
          .json(
            utils.successResponse(
              "Últimos movimientos obtenidos correctamente.",
              { movimientos }
            )
          );
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación no corresponde a ninguna cuenta existente.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener los últimos movimientos.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async cargarCuenta(req, res) {
    try {
      const secret = req.headers.authorization;

      if (secret === process.env.SECRETQUYNE) {
        const { entidadOrigen, cuentaOrigen, cuentaDestino, monto } = req.body;
        const tipoIdentificacion = cuentaDestino.substring(0, 2);
        const numeroIdentificacion = cuentaDestino.substring(2);
        const cuenta = await cuentasService.buscarPorIdentificacion(
          tipoIdentificacion,
          numeroIdentificacion
        );

        if (cuenta) {
          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            monto
          );

          if (movimiento) {
            const transferenciaExterna =
              await movimientosService.crearTransferenciaExterna(
                movimiento.id,
                entidadOrigen,
                cuentaOrigen,
                true
              );

            if (transferenciaExterna) {
              await cuentasService.sumarSaldo(cuenta.id, monto);

              return res.status(200).json(
                utils.successResponse("Transacción realizada correctamente.", {
                  movimiento: {
                    id: movimiento.id,
                    tipo: "carga-cuenta",
                    fecha: movimiento.fecha,
                    monto: movimiento.monto,
                  },
                })
              );
            } else {
              return res
                .status(200)
                .json(
                  utils.errorResponse("No se pudo crear la transacción.", null)
                );
            }
          } else {
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se pudo crear el movimiento para la transacción.",
                  null
                )
              );
          }
        } else {
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "La identificación no corresponde a ninguna cuenta existente.",
                null
              )
            );
        }
      } else {
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La autorización para realizar la transacción es inválida.",
              null
            )
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar realizar la transacción.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async descargarCuenta(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { entidadDestino, cuentaDestino, monto } = req.body;

        if (cuenta.saldo >= monto) {
          // if (entidadDestino == "quyne") {
          //   const { data } = await axios.post(
          //     `${process.env.URLQUYNE}/movimientos/realizar-transferencia-externa-carga`,
          //     {
          //       numeroTelefono: cuentaDestino,
          //       entidadDestino: "F4Y",
          //       cuentaDestino:
          //         cuenta.tipoIdentificacion + cuenta.numeroIdentificacion,
          //       monto,
          //     },
          //     { headers: { Authorization: process.env.SECRETQUYNE } }
          //   );

          //   if (data.type != "success") {
          //     return res
          //       .status(200)
          //       .json(
          //         utils.errorResponse(
          //           "La cuenta especificada no corresponde con ninguna cuenta de QuyneApp.",
          //           null
          //         )
          //       );
          //   }
          // }

          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            monto
          );

          if (movimiento) {
            const transferenciaExterna =
              await movimientosService.crearTransferenciaExterna(
                movimiento.id,
                entidadDestino,
                cuentaDestino,
                false
              );

            if (transferenciaExterna) {
              await cuentasService.restarSaldo(cuenta.id, monto);

              return res.status(200).json(
                utils.successResponse("Transacción realizada correctamente.", {
                  movimiento: {
                    id: movimiento.id,
                    tipo: "carga-cuenta",
                    fecha: movimiento.fecha,
                    monto: parseFloat(movimiento.monto),
                  },
                })
              );
            } else {
              return res
                .status(200)
                .json(
                  utils.errorResponse("No se pudo crear la transacción.", null)
                );
            }
          } else {
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se pudo crear el movimiento para la transacción.",
                  null
                )
              );
          }
        } else {
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "No hay saldo disponible para realizar la transacción.",
                null
              )
            );
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
            "Ha ocurrido un error al intentar realizar la transacción.",
            null
          )
        );
    }
  }
}

module.exports = MovimientosController;
