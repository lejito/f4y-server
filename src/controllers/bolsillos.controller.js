require("dotenv").config();
const axios = require("axios");
const utils = require("../../utils");
const jwtService = require("../services/jwt.service");
const cuentasService = require("../services/cuentas.service");
const bolsillosService = require("../services/bolsillos.service");
const movimientosService = require("../services/movimientos.service");
const registrosService = require("../services/registros.service");

class BolsillosController {
  constructor() { }

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
            "Ha ocurrido un error al intentar obtener la lista de bolsillos.",
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
  async crear(req, res) {
    //<1>
    try {

      //<2>
      const { nombre, saldoObjetivo } = req.body;
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
        //<8>
        const bolsillo = await bolsillosService.crear(
          cuenta.id,
          nombre,
          saldoObjetivo
        );
        //<8>
        //<9>
        if (bolsillo) {
          //<11>
          try {
            await registrosService.crear(idCuenta, "Crear bolsillo");
          }
          //<11>
          catch (error) { }

          //<12>
          bolsillo.saldo = parseFloat(bolsillo.saldo);
          bolsillo.saldoObjetivo = parseFloat(bolsillo.saldoObjetivo);
          //<12>

          //<13>
          return res.status(200).json(
            utils.successResponse("Bolsillo creado correctamente.", {
              bolsillo,
            })
          );
          //<13>
        }
        //<9>
        else {
          //<10>
          return res
            .status(200)
            .json(utils.errorResponse("No se creó el bolsillo.", null));
          //<10>
        }
      }
      //<6>
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
    //<1>
    catch (error) {
      //<14>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar crear el bolsillo.",
            null
          )
        );
      //<14>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async obtenerMovimientos(req, res) {

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
        const movimientos = await bolsillosService.obtenerMovimientos(id);
        //<8>
        //<9>
        return res
          .status(200)
          .json(
            utils.successResponse(
              "Últimos movimientos del bolsillo obtenidos correctamente.",
              { movimientos }
            )
          );
        //<9>
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
      //<10>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar obtener los últimos movimientos del bolsillo.",
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
  async actualizar(req, res) {

    //<1>
    try {
      //<2>
      const { id, nombre, saldoObjetivo } = req.body;
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
        //<8>
        const bolsilloActualizado = await bolsillosService.actualizar(
          id,
          cuenta.id,
          nombre,
          saldoObjetivo
        );
        //<8>

        //<9>
        if (bolsilloActualizado) {
          //<11>
          try {
            await registrosService.crear(idCuenta, "Actualizar bolsillo");
          } catch (error) { }
          //<11>

          //<12>
          return res.status(200).json(
            utils.successResponse("Bolsillo actualizado correctamente.", {
              bolsilloActualizado: true,
            })
          );
          //<12>

        }
        //<9>
        else {
          //<10>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "No se encontró el bolsillo a actualizar.",
                null
              )
            );
          //<10>
        }
      }
      //<6>
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
    //<1>
    catch (error) {
      //<13>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar actualizar el bolsillo.",
            null
          )
        );
      //<13>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async eliminar(req, res) {
    //<1>
    try {
      //<2>
      const { id } = req.body;
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
        //<8>
        const bolsilloEliminado = await bolsillosService.eliminar(
          id,
          cuenta.id
        );
        //<8>

        //<9>
        if (bolsilloEliminado) {
          //<11>
          try {
            await registrosService.crear(idCuenta, "Eliminar bolsillo");
          } catch (error) { }
          //<11>

          //<12>
          return res.status(200).json(
            utils.successResponse("Bolsillo eliminado correctamente.", {
              bolsilloEliminado: true,
            })
          );
          //<12>

        }
        //<9>
        else {
          //<10>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "No se pudo eliminar el bolsillo. Verifica que no haya saldo disponible en él antes de eliminarlo.",
                null
              )
            );
          //<10> 
        }
      }
      //<6> 
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
    //<1>
    catch (error) {
      //<13>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar eliminar el bolsillo.",
            null
          )
        );
      //<13>
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async cargar(req, res) {
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
        const { id, monto } = req.body;
        //<7>

        //<8>
        if (cuenta.saldo >= monto) {
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
              await movimientosService.crearTransferenciaBolsillo(
                movimiento.id,
                id,
                true
              );
            //<13>

            //<14>
            if (transferenciaExterna) {
              //<16>
              await cuentasService.restarSaldo(cuenta.id, monto);
              //<16>

              //<17>
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
              //<18>
            }
            //<14>
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
              "La identificación no corresponde a ninguna cuenta existente.",
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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   **/
  async descargar(req, res) {
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
        const { id, monto } = req.body;
        //<7>

        //<8>
        const bolsillo = await bolsillosService.buscarPorId(id);
        //<8>

        //<9>
        if (bolsillo) {
          //<11>
          if (bolsillo.saldo >= monto) {
            //<13>
            const movimiento = await movimientosService.crearMovimiento(
              cuenta.id,
              monto
            );
            //<13>

            //<14>
            if (movimiento) {
              //<16>
              const transferenciaExterna =
                await movimientosService.crearTransferenciaBolsillo(
                  movimiento.id,
                  id,
                  false
                );
              //<16>

              //<17>
              if (transferenciaExterna) {
                //<19>
                await bolsillosService.restarSaldo(id, monto);
                //<19>
                //<20>
                await cuentasService.sumarSaldo(cuenta.id, monto);
                //<20>

                //<21>
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
                //<21>

              }
              //<17>
              else {
                //<18>
                return res
                  .status(200)
                  .json(
                    utils.errorResponse(
                      "No se pudo crear la transacción.",
                      null
                    )
                  );
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
                    "No se pudo crear el movimiento para la transacción.",
                    null
                  )
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
                  "No hay saldo disponible para realizar la transacción.",
                  null
                )
              );
            //<12>
          }
        }
        //<9>
        else {
          //<11>
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "El id no corresponden con ningún bolsillo existente.",
                null
              )
            );
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
      //<22>
      return res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al intentar realizar la transacción.",
            null
          )
        );
      //<22>
    }
  }
}

module.exports = BolsillosController;
