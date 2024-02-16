const express = require("express");
const MovimientosController = require("../controllers/movimientos.controller");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const utils = require("../../utils");

const movimientosRouter = express.Router();

const ENTIDAD_ORIGEN = utils.createParam("entidadOrigen", "string", false);
const ENTIDAD_DESTINO = utils.createParam("entidadDestino", "string", false);
const CUENTA_ORIGEN = utils.createParam("cuentaOrigen", "string", false);
const CUENTA_DESTINO = utils.createParam("cuentaDestino", "string", false);
const MONTO = utils.createParam("monto", "number", false);

const _movimientosController = new MovimientosController();

movimientosRouter.get(
  "/obtener-ultimos",
  [authMiddleware],
  _movimientosController.obtenerUltimos
);

movimientosRouter.post(
  "/cargar-cuenta",
  [validatorMiddleware([ENTIDAD_ORIGEN, CUENTA_ORIGEN, CUENTA_DESTINO, MONTO])],
  _movimientosController.cargarCuenta
);

movimientosRouter.post(
  "/descargar-cuenta",
  [
    authMiddleware,
    validatorMiddleware([ENTIDAD_DESTINO, CUENTA_DESTINO, MONTO]),
  ],
  _movimientosController.descargarCuenta
);

module.exports = movimientosRouter;
