require("dotenv").config();
const utils = require("../../utils");
const jwtService = require("../services/jwt.service");
const cuentasService = require("../services/cuentas.service");
const cdtsService = require("../services/cdts.service");
const movimientosService = require("../services/movimientos.service");

class CDTsController {
  constructor() { }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async calcular(req, res) {
    try {
      //<1>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
        //<3>
        const { inversion, duracion, fechaInicio } = req.body;

        const cdt = cdtsService.calcularNuevo(inversion, duracion, fechaInicio);

        return res.status(200).json(
          utils.successResponse("Cálculo de CDT realizado correctamente.", {
            cdt,
          })
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
            "Ha ocurrido un error al intentar obtener la lista de CDTs.",
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
  async obtener(req, res) {
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
        const { id } = req.body;
        //<7>

        //<8>
        const cdt = await cdtsService.obtener(id, cuenta.id);
        //<8>

        //<9>
        if (cdt) {
          //<11>
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);

          return res.status(200).json(
            utils.successResponse("CDT obtenido correctamente.", {
              cdt: { ...cdt.dataValues, ...calculos },
            })
          );
          //<11>
        }
        //<9>
        else {
          //<10>
          return res
            .status(200)
            .json(utils.errorResponse("No se encontró el CDT.", null));
          //<10>
        }
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
      //<12>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener el CDT.",
            null
          )
        );
      //<12>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async crear(req, res) {
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
        const { inversion, duracion, fechaInicio } = req.body;
        //<7>
        //<8>
        const { interes, retencion, fechaFin } = cdtsService.calcularNuevo(
          inversion,
          duracion,
          fechaInicio
        );
        //<8>

        //<9>
        const cdt = await cdtsService.crear(
          cuenta.id,
          inversion,
          interes,
          retencion,
          duracion,
          fechaInicio,
          fechaFin
        );
        //<9>


        //<10>
        if (cdt) {
          //<12>
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);
          //<12>

          //<13>
          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            cdt.inversion
          );
          //<13>

          //<14>
          await movimientosService.crearTransferenciaCDT(
            movimiento.id,
            cdt.id,
            "inversion"
          );
          //<14>

          //<15>
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
          //<15>

        }
        //<10>
        else {
          //<11>
          return res
            .status(200)
            .json(utils.errorResponse("No se creó el CDT.", null));
          //<11>
        }
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
      //<16>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar crear el CDT.",
            null
          )
        );
      //<16> 
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async liquidar(req, res) {
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
        const { id } = req.body;
        //<7>

        //<8>
        const cdt = await cdtsService.obtener(id, cuenta.id);
        //<8>

        //<9>
        if (cdt) {
          //<11>
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);
          //<11>

          //<12>
          if (
            !(calculos.estado == "liquidado" || calculos.estado == "cancelado")
          ) {
            //<14>
            if (calculos.estado == "finalizado") {
              //<16>
              const cdtLiquidado = await cdtsService.liquidar(id, cuenta.id);
              //<16>

              //<17> 
              if (cdtLiquidado) {
                //<19>
                const movimiento = await movimientosService.crearMovimiento(
                  cuenta.id,
                  calculos.montoDevolucion
                );
                //<19>

                //<20>
                await movimientosService.crearTransferenciaCDT(
                  movimiento.id,
                  cdt.id,
                  "liquidacion"
                );
                //<20>

                //<21>
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
                //<21>

              }
              //<17>
              else {
                //<18>
                return res
                  .status(200)
                  .json(utils.errorResponse("No se liquidó el CDT.", null));
                //<18>
              }
            }
            //<14>
            else {
              //<15>
              return res
                .status(200)
                .json(
                  utils.errorResponse(
                    "El CDT no se puede liquidar antes de la fecha de finalización.",
                    null
                  )
                );
              //<15>
            }
          }
          //<12>
          else {
            //<13>
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "El CDT ya ha sido liquidado o cancelado.",
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
              utils.errorResponse("No se encontró el CDT a liquidar.", null)
            );
          //<10>
        }
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
      //<22>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar liquidar el CDT.",
            null
          )
        );
      //<22>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async cancelar(req, res) {
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
        const { id } = req.body;
        //<7>

        //<8>
        const cdt = await cdtsService.obtener(id, cuenta.id);
        //<8>

        //<9>
        if (cdt) {
          //<11>
          cdt.inversion = parseFloat(cdt.inversion);
          cdt.interes = parseFloat(cdt.interes);
          cdt.retencion = parseFloat(cdt.retencion);
          const calculos = cdtsService.calcularExistente(cdt);
          //<11>

          //<12>
          if (
            !(calculos.estado == "liquidado" || calculos.estado == "cancelado")
          ) {
            //<14>
            if (calculos.estado == "apertura") {
              //<16>
              const cdtCancelado = await cdtsService.cancelar(id, cuenta.id);
              //<16>

              //<17>
              if (cdtCancelado) {
                //<19>
                const movimiento = await movimientosService.crearMovimiento(
                  cuenta.id,
                  cdt.inversion
                );
                //<19>

                //<20>
                await movimientosService.crearTransferenciaCDT(
                  movimiento.id,
                  cdt.id,
                  "cancelacion"
                );
                //<20>

                //<21>
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
                //<21>
              }
              //<17>
              else {
                //<18>
                return res
                  .status(200)
                  .json(utils.errorResponse("No se cancelar el CDT.", null));

                //<18>
              }
            }
            //<14>
            else {
              //<15>
              return res
                .status(200)
                .json(
                  utils.errorResponse(
                    "El CDT no se puede cancelar después de más de 5 días de la apertura.",
                    null
                  )
                );
              //<15>
            }
          }
          //<12>
          else {
            //<13>
            return res
              .status(200)
              .json(
                utils.errorResponse(
                  "El CDT ya ha sido liquidado o cancelado.",
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
              utils.errorResponse("No se encontró el CDT a cancelar.", null)
            );
          //<10>
        }
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
      //<22>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar cancelar el CDT.",
            null
          )
        );
      //<22>
    }
  }
}

module.exports = CDTsController;
