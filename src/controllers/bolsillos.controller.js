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
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
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
      const { nombre, saldoObjetivo } = req.body;

      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const bolsillo = await bolsillosService.crear(
          cuenta.id,
          nombre,
          saldoObjetivo
        );

        if (bolsillo) {
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
        } else {
          return res
            .status(200)
            .json(utils.errorResponse("No se creó el bolsillo.", null));
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
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
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
      const { id, nombre, saldoObjetivo } = req.body;

      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const bolsilloActualizado = await bolsillosService.actualizar(
          id,
          cuenta.id,
          nombre,
          saldoObjetivo
        );

        if (bolsilloActualizado) {
          try {
            await registrosService.crear(idCuenta, "Actualizar bolsillo");
          } catch (error) {}

          return res.status(200).json(
            utils.successResponse("Bolsillo actualizado correctamente.", {
              bolsilloActualizado: true,
            })
          );
        } else {
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "No se encontró el bolsillo a actualizar.",
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
      const { id } = req.body;

      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const bolsilloEliminado = await bolsillosService.eliminar(
          id,
          cuenta.id
        );

        if (bolsilloEliminado) {
          try {
            await registrosService.crear(idCuenta, "Eliminar bolsillo");
          } catch (error) {}

          return res.status(200).json(
            utils.successResponse("Bolsillo eliminado correctamente.", {
              bolsilloEliminado: true,
            })
          );
        } else {
          return res
            .status(200)
            .json(
              utils.errorResponse(
                "No se pudo eliminar el bolsillo. Verifica que no haya saldo disponible en él antes de eliminarlo.",
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
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { id, monto } = req.body;

        if (cuenta.saldo >= monto) {
          const movimiento = await movimientosService.crearMovimiento(
            cuenta.id,
            monto
          );

          if (movimiento) {
            const transferenciaExterna =
              await movimientosService.crearTransferenciaBolsillo(
                movimiento.id,
                id,
                true
              );

            if (transferenciaExterna) {
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
      const token = req.headers.authorization;
      const { idCuenta } = jwtService.verificarToken(token);
      const cuenta = await cuentasService.buscarPorId(idCuenta);

      if (cuenta) {
        const { id, monto } = req.body;

        const bolsillo = await bolsillosService.buscarPorId(id);

        if (bolsillo) {
          if (bolsillo.saldo >= monto) {
            const movimiento = await movimientosService.crearMovimiento(
              cuenta.id,
              monto
            );

            if (movimiento) {
              const transferenciaExterna =
                await movimientosService.crearTransferenciaBolsillo(
                  movimiento.id,
                  id,
                  false
                );

              if (transferenciaExterna) {
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
              } else {
                return res
                  .status(200)
                  .json(
                    utils.errorResponse(
                      "No se pudo crear la transacción.",
                      null
                    )
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
                "El id no corresponden con ningún bolsillo existente.",
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
