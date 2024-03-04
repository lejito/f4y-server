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
      //<1>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
        //<3>
        const movimientos = await movimientosService.obtenerUltimos(idCuenta);
        return res
          .status(200)
          .json(
            utils.successResponse(
              "Últimos movimientos obtenidos correctamente.",
              { movimientos }
            )
          );
        //<3>
      } 
      //<2>
      else {
        //<4>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<4>
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
      //<1>
      const secret = req.headers.authorization;
      //<1>

      //<2>
      if (secret === process.env.SECRETQUYNE) {
        //<3>
        const { entidadOrigen, cuentaOrigen, cuentaDestino, monto } = req.body;
        const tipoIdentificacion = cuentaDestino.substring(0, 2);
        const numeroIdentificacion = cuentaDestino.substring(2);
        const cuenta = await cuentasService.buscarPorIdentificacion(
          tipoIdentificacion,
          numeroIdentificacion
        );
        //<3>
        
        //<5>
        if (cuenta) {
          //<6>
          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            monto
          );
          //<6>

          //<8>
          if (movimiento) {
            //<9>
            const transferenciaExterna =
              await movimientosService.crearTransferenciaExterna(
                movimiento.id,
                entidadOrigen,
                cuentaOrigen,
                true
              );
            //<9>

            //<11>
            if (transferenciaExterna) {
              //<12>
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
              //<12>
            } 
            //<11>
            else {
              //<13>
              return res
                .status(200)
                .json(
                  utils.errorResponse("No se pudo crear la transacción.", null)
                );
              //<13>
            }
          } 
          //<8>
          else {
            //<10>
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se pudo crear el movimiento para la transacción.",
                  null
                )
              );
            //<10>
          }
        } 
        //<5>
        else {
          //<7>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "La identificación no corresponde a ninguna cuenta existente.",
                null
              )
            );
          //<7>
        }
      } 
      //<2>
      else {
        //<4>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La autorización para realizar la transacción es inválida.",
              null
            )
          );
        //<4>
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
      //<1>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
        //<3>
        const { entidadDestino, cuentaDestino, monto } = req.body;
        //<3>

        //<5>
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

          //<6>
          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            monto
          );
          //<6>

          //<8>
          if (movimiento) {
            //<9>
            const transferenciaExterna =
              await movimientosService.crearTransferenciaExterna(
                movimiento.id,
                entidadDestino,
                cuentaDestino,
                false
              );
            //<9>

            //<11>
            if (transferenciaExterna) {
              //<12>
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
              //<12>
            } 
            //<11>
            else {
              //<13>
              return res
                .status(200)
                .json(
                  utils.errorResponse("No se pudo crear la transacción.", null)
                );
              //<13>
            }
          }
          //<8> 
          else {
            //<10>
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se pudo crear el movimiento para la transacción.",
                  null
                )
              );
            //<10>
          }
        } 
        //<5>
        else {
          //<7>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "No hay saldo disponible para realizar la transacción.",
                null
              )
            );
          //<7>
        }
      } 
      //<2>
      else {
        //<4>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<4>
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
