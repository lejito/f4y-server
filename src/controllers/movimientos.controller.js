require("dotenv").config();
const axios = require("axios");
const utils = require("../../utils");
const jwtService = require("../services/jwt.service");
const cuentasService = require("../services/cuentas.service");
const movimientosService = require("../services/movimientos.service");

class MovimientosController {
  constructor() { }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerUltimos(req, res) {
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
        //<7>
        const movimientos = await movimientosService.obtenerUltimos(idCuenta);
        return res
          .status(200)
          .json(
            utils.successResponse(
              "Últimos movimientos obtenidos correctamente.",
              { movimientos }
            )
          );
        //<7>
      }
      //<5>
      else {
        //<6>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "La identificación no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<6>
      }
    }
    //<1>
    catch (error) {
      //<8>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener los últimos movimientos.",
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
  async cargarCuenta(req, res) {
    //<1>
    try {
      //<2>
      const secret = req.headers.authorization;
      //<2>

      //<3>
      if (secret === process.env.SECRETQUYNE) {
        //<5>
        const { entidadOrigen, cuentaOrigen, cuentaDestino, monto } = req.body;
        //<5>
        //<6>
        const tipoIdentificacion = cuentaDestino.substring(0, 2);
        //<6>
        //<7>
        const numeroIdentificacion = cuentaDestino.substring(2);
        //<7>
        //<8>
        const cuenta = await cuentasService.buscarPorIdentificacion(
          tipoIdentificacion,
          numeroIdentificacion
        );
        //<8>


        //<9>
        if (cuenta) {
          //<11>
          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            monto
          );
          //<11>

          //<12>
          if (movimiento) {
            //<14>
            const transferenciaExterna =
              await movimientosService.crearTransferenciaExterna(
                movimiento.id,
                entidadOrigen,
                cuentaOrigen,
                true
              );
            //<14>

            //<15>
            if (transferenciaExterna) {
              //<17>
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
              //<17>
            }
            //<15>
            else {
              //<16>
              return res
                .status(200)
                .json(
                  utils.errorResponse("No se pudo crear la transacción.", null)
                );
              //<16>
            }
          }
          //<12>
          else {
            //<13>
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se pudo crear el movimiento para la transacción.",
                  null
                )
              );
            //<13>
          }
        }
        //<9>
        else {
          //<10>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "La identificación no corresponde a ninguna cuenta existente.",
                null
              )
            );
          //<10>
        }
      }
      //<3>
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
    }
    //<1>
    catch (error) {
      //<18>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar realizar la transacción.",
            null
          )
        );
      //<18>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async descargarCuenta(req, res) {
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
        //<7>
        const { entidadDestino, cuentaDestino, monto } = req.body;
        //<7>

        //<8>
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

          //<10>
          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            monto
          );
          //<10>

          //<11>
          if (movimiento) {
            //<13>
            const transferenciaExterna =
              await movimientosService.crearTransferenciaExterna(
                movimiento.id,
                entidadDestino,
                cuentaDestino,
                false
              );
            //<13>

            //<14>
            if (transferenciaExterna) {
              //<16>
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
              //<16>
            }
            //<14>
            else {
              //<15>
              return res
                .status(200)
                .json(
                  utils.errorResponse("No se pudo crear la transacción.", null)
                );
              //<15>
            }
          }
          //<11> 
          else {
            //<12>
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "No se pudo crear el movimiento para la transacción.",
                  null
                )
              );
            //<12>
          }
        }
        //<8>
        else {
          //<9>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "No hay saldo disponible para realizar la transacción.",
                null
              )
            );
          //<9>
        }
      }
      //<5>
      else {
        //<6>
        return res
          .status(200)
          .json(
            utils.errorResponse(
              "El id no corresponde a ninguna cuenta existente.",
              null
            )
          );
        //<6>
      }
    }
    //<1>
    catch (error) {
      //<19>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar realizar la transacción.",
            null
          )
        );
      //<19>
    }
  }
}

module.exports = MovimientosController;
