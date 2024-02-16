const express = require("express");
const BolsillosController = require("../controllers/bolsillos.controller");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const utils = require("../../utils");

const bolsillosRouter = express.Router();

const ID = utils.createParam("id", "number", false);
const NOMBRE = utils.createParam("nombre", "string", false);
const SALDO_OBJETIVO = utils.createParam("saldoObjetivo", "number", true);
const MONTO = utils.createParam("monto", "number", false);

const _bolsillosController = new BolsillosController();

bolsillosRouter.get("/obtener", [authMiddleware], _bolsillosController.obtener);

bolsillosRouter.post(
  "/crear",
  [authMiddleware, validatorMiddleware([NOMBRE, SALDO_OBJETIVO])],
  _bolsillosController.crear
);

bolsillosRouter.post(
  "/obtener-movimientos",
  [authMiddleware, validatorMiddleware([ID])],
  _bolsillosController.obtenerMovimientos
);

bolsillosRouter.put(
  "/actualizar",
  [authMiddleware, validatorMiddleware([ID, NOMBRE, SALDO_OBJETIVO])],
  _bolsillosController.actualizar
);

bolsillosRouter.delete(
  "/eliminar",
  [authMiddleware, validatorMiddleware([ID])],
  _bolsillosController.eliminar
);

bolsillosRouter.post(
  "/cargar",
  [authMiddleware, validatorMiddleware([ID, MONTO])],
  _bolsillosController.cargar
);

bolsillosRouter.post(
  "/descargar",
  [authMiddleware, validatorMiddleware([ID, MONTO])],
  _bolsillosController.descargar
);

module.exports = bolsillosRouter;
