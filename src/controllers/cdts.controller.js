require("dotenv").config();
const utils = require("../../utils");
const jwtService = require("../services/jwt.service");
const cuentasService = require("../services/cuentas.service");
const cdtsService = require("../services/cdts.service");
const movimientosService = require("../services/movimientos.service");

class CDTsController {
  constructor() {}

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async calcular(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { inversion, duracion, fechaInicio } = req.body;

        const cdt = cdtsService.calcularNuevo(inversion, duracion, fechaInicio);

        return res.status(200).json(
          utils.successResponse("Cálculo de CDT realizado correctamente.", {
            cdt,
          })
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
            "Ha ocurrido un error al intentar calcular el CDT.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerTodos(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const cdts = (await cdtsService.obtenerTodos(idCuenta)).map((cdt) => {
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);
          return { ...cdt.dataValues, ...calculos };
        });

        return res.status(200).json(
          utils.successResponse("Lista de CDTs obtenida correctamente.", {
            cdts,
          })
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
            "Ha ocurrido un error al intentar obtener la lista de CDTs.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtener(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { id } = req.body;

        const cdt = await cdtsService.obtener(id, cuenta.id);

        if (cdt) {
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);

          return res.status(200).json(
            utils.successResponse("CDT obtenido correctamente.", {
              cdt: { ...cdt.dataValues, ...calculos },
            })
          );
        } else {
          return res
            .status(200)
            .json(utils.errorResponse("No se encontró el CDT.", null));
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
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el CDT.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async crear(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { inversion, duracion, fechaInicio } = req.body;
        const { interes, retencion, fechaFin } = cdtsService.calcularNuevo(
          inversion,
          duracion,
          fechaInicio
        );

        const cdt = await cdtsService.crear(
          cuenta.id,
          inversion,
          interes,
          retencion,
          duracion,
          fechaInicio,
          fechaFin
        );

        if (cdt) {
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);

          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            cdt.inversion
          );

          await movimientosService.crearTransferenciaCDT(
            movimiento.id,
            cdt.id,
            "inversion"
          );

          await cuentasService.restarSaldo(cuenta.id, cdt.inversion);

          return res.status(200).json(
            utils.successResponse("CDT creado correctamente.", {
              cdt: { ...cdt.dataValues, ...calculos },
              movimiento: {
                id: movimiento.id,
                tipo: "inversion-cdt",
                fecha: movimiento.fecha,
                monto: parseFloat(movimiento.monto),
              },
            })
          );
        } else {
          return res
            .status(200)
            .json(utils.errorResponse("No se creó el CDT.", null));
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
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar crear el CDT.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async liquidar(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { id } = req.body;

        const cdt = await cdtsService.obtener(id, cuenta.id);

        if (cdt) {
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);
          if (
            !(calculos.estado == "liquidado" || calculos.estado == "cancelado")
          ) {
            if (calculos.estado == "finalizado") {
              const cdtLiquidado = await cdtsService.liquidar(id, cuenta.id);

              if (cdtLiquidado) {
                const movimiento = await movimientosService.crearMovimiento(
                  cuenta.id,
                  calculos.montoDevolucion
                );

                await movimientosService.crearTransferenciaCDT(
                  movimiento.id,
                  cdt.id,
                  "liquidacion"
                );

                await cuentasService.sumarSaldo(
                  cuenta.id,
                  calculos.montoDevolucion
                );

                return res.status(200).json(
                  utils.successResponse("CDT liquidado correctamente.", {
                    movimiento: {
                      id: movimiento.id,
                      tipo: "liquidacion-cdt",
                      fecha: movimiento.fecha,
                      monto: parseFloat(movimiento.monto),
                    },
                  })
                );
              } else {
                return res
                  .status(200)
                  .json(utils.errorResponse("No se liquidó el CDT.", null));
              }
            } else {
              return res
                .status(200)
                .json(
                  utils.errorResponse(
                    "El CDT no se puede liquidar antes de la fecha de finalización.",
                    null
                  )
                );
            }
          } else {
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "El CDT ya ha sido liquidado o cancelado.",
                  null
                )
              );
          }
        } else {
          return res
            .status(200)
            .json(
              utils.errorResponse("No se encontró el CDT a liquidar.", null)
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
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar liquidar el CDT.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async cancelar(req, res) {
    try {
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { id } = req.body;

        const cdt = await cdtsService.obtener(id, cuenta.id);

        if (cdt) {
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);
          if (
            !(calculos.estado == "liquidado" || calculos.estado == "cancelado")
          ) {
            if (calculos.estado == "apertura") {
              const cdtCancelado = await cdtsService.cancelar(id, cuenta.id);

              if (cdtCancelado) {
                const movimiento = await movimientosService.crearMovimiento(
                  cuenta.id,
                  cdt.inversion
                );

                await movimientosService.crearTransferenciaCDT(
                  movimiento.id,
                  cdt.id,
                  "cancelacion"
                );

                await cuentasService.sumarSaldo(cuenta.id, cdt.inversion);

                return res.status(200).json(
                  utils.successResponse("CDT cancelado correctamente.", {
                    movimiento: {
                      id: movimiento.id,
                      tipo: "cancelacion-cdt",
                      fecha: movimiento.fecha,
                      monto: parseFloat(movimiento.monto),
                    },
                  })
                );
              } else {
                return res
                  .status(200)
                  .json(utils.errorResponse("No se cancelar el CDT.", null));
              }
            } else {
              return res
                .status(200)
                .json(
                  utils.errorResponse(
                    "El CDT no se puede cancelar después de más de 5 días de la apertura.",
                    null
                  )
                );
            }
          } else {
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "El CDT ya ha sido liquidado o cancelado.",
                  null
                )
              );
          }
        } else {
          return res
            .status(200)
            .json(
              utils.errorResponse("No se encontró el CDT a cancelar.", null)
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
    } catch (error) {
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar cancelar el CDT.",
            null
          )
        );
    }
  }
}

module.exports = CDTsController;
