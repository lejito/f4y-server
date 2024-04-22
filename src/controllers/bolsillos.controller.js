require("dotenv").config();
const axios = require("axios");
const utils = require("../../utils");
const jwtService = require("../services/jwt.service");
const cuentasService = require("../services/cuentas.service");
const bolsillosService = require("../services/bolsillos.service");
const movimientosService = require("../services/movimientos.service");
const registrosService = require("../services/registros.service");

class BolsillosController {
  constructor() {}

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtener(req, res) {
    try {
      //<1>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>
      //<2>
      if (cuenta) {
        //<3>
        const bolsillos = (await bolsillosService.obtener(cuenta.id)).map(
          (bolsillo) => {
            bolsillo.saldo = parseFloat(bolsillo.saldo);
            bolsillo.saldoObjetivo = parseFloat(bolsillo.saldoObjetivo);
            return bolsillo;
          }
        );

        return res
          .status(200)
          .json(
            utils.successResponse(
              "Lista de bolsillos obtenida correctamente.",
              { bolsillos }
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
            "Ha ocurrido un error al intentar obtener la lista de bolsillos.",
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
      //<1>
      const { nombre, saldoObjetivo } = req.body;

      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
        //<3>
        const bolsillo = await bolsillosService.crear(
          cuenta.id,
          nombre,
          saldoObjetivo
        );
        //<3>
        //<5>
        if (bolsillo) {
          //<6>
          try {
            await registrosService.crear(idCuenta, "Crear bolsillo");
          } catch (error) {}
          bolsillo.saldo = parseFloat(bolsillo.saldo);
          bolsillo.saldoObjetivo = parseFloat(bolsillo.saldoObjetivo);

          return res.status(200).json(
            utils.successResponse("Bolsillo creado correctamente.", {
              bolsillo,
            })
          );
          //<6>
        } 
        //<5>
        else {
          //<7>
          return res
            .status(200)
            .json(utils.errorResponse("No se creó el bolsillo.", null));
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
            "Ha ocurrido un error al intentar crear el bolsillo.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerMovimientos(req, res) {
    try {
      //<1>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
      //<3>
        const { id } = req.body;
        const movimientos = await bolsillosService.obtenerMovimientos(id);
        return res
          .status(200)
          .json(
            utils.successResponse(
              "Últimos movimientos del bolsillo obtenidos correctamente.",
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
            "Ha ocurrido un error al intentar obtener los últimos movimientos del bolsillo.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async actualizar(req, res) {
    try {
      //<1>
      const { id, nombre, saldoObjetivo } = req.body;

      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
        //<3>
        const bolsilloActualizado = await bolsillosService.actualizar(
          id,
          cuenta.id,
          nombre,
          saldoObjetivo
        );
        //<3>
        
        //<5>
        if (bolsilloActualizado) {
          //<6>
          try {
            await registrosService.crear(idCuenta, "Actualizar bolsillo");
          } catch (error) {}

          return res.status(200).json(
            utils.successResponse("Bolsillo actualizado correctamente.", {
              bolsilloActualizado: true,
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
                "No se encontró el bolsillo a actualizar.",
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
            "Ha ocurrido un error al intentar actualizar el bolsillo.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async eliminar(req, res) {
    try {
      //<1>
      const { id } = req.body;

      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
        //<3>
        const bolsilloEliminado = await bolsillosService.eliminar(
          id,
          cuenta.id
        );
        //<3>

        //<5>
        if (bolsilloEliminado) {
          //<6>
          try {
            await registrosService.crear(idCuenta, "Eliminar bolsillo");
          } catch (error) {}

          return res.status(200).json(
            utils.successResponse("Bolsillo eliminado correctamente.", {
              bolsilloEliminado: true,
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
                "No se pudo eliminar el bolsillo. Verifica que no haya saldo disponible en él antes de eliminarlo.",
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
            "Ha ocurrido un error al intentar eliminar el bolsillo.",
            null
          )
        );
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async cargar(req, res) {
    try {
      //<1>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>
      
      //<2>
      if (cuenta) {
        //<3>
        const { id, monto } = req.body;
        //<3>

        //<5>
        if (cuenta.saldo >= monto) {
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
              await movimientosService.crearTransferenciaBolsillo(
                movimiento.id,
                id,
                true
              );
            //<9>

            //<11>
            if (transferenciaExterna) {
              //<12>
              await cuentasService.restarSaldo(cuenta.id, monto);
              await bolsillosService.sumarSaldo(id, monto);
              
              return res.status(200).json(
                utils.successResponse("Transacción realizada correctamente.", {
                  movimiento: {
                    id: movimiento.id,
                    tipo: "carga-bolsillo",
                    fecha: movimiento.fecha,
                    monto: parseFloat(monto),
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
  async descargar(req, res) {
    try {
      //<1>
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);
      //<1>

      //<2>
      if (cuenta) {
        //<3>
        const { id, monto } = req.body;

        const bolsillo = await bolsillosService.buscarPorId(id);
        //<3>

        //<5>
        if (bolsillo) {
          //<6>
          if (bolsillo.saldo >= monto) {
            //<8>
            const movimiento = await movimientosService.crearMovimiento(
              cuenta.id,
              monto
            );
            //<8>

            //<10>
            if (movimiento) {
              //<11>
              const transferenciaExterna =
                await movimientosService.crearTransferenciaBolsillo(
                  movimiento.id,
                  id,
                  false
                );
              //<11>

              //<13>
              if (transferenciaExterna) {
                //<14>
                await bolsillosService.restarSaldo(id, monto);
                await cuentasService.sumarSaldo(cuenta.id, monto);

                return res.status(200).json(
                  utils.successResponse(
                    "Transacción realizada correctamente.",
                    {
                      movimiento: {
                        id: movimiento.id,
                        tipo: "descarga-bolsillo",
                        fecha: movimiento.fecha,
                        monto: parseFloat(movimiento.monto),
                      },
                    }
                  )
                );
                //<14>
              } 
              //<13>
              else {
                //<15>
                return res
                  .status(200)
                  .json(
                    utils.errorResponse(
                      "No se pudo crear la transacción.",
                      null
                    )
                  );
                //<15>
              }
            } 
            //<10>
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
          //<6>
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
          //<7>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "El id no corresponden con ningún bolsillo existente.",
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
            "Ha ocurrido un error al intentar realizar la transacción.",
            null
          )
        );
    }
  }
}

module.exports = BolsillosController;
