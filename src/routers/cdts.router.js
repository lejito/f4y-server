const express = require("express");
const CDTsController = require("../controllers/cdts.controller");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const utils = require("../../utils");

const cdtsRouter = express.Router();

const INVERSION = utils.createParam("inversion", "number", false);
const DURACION = utils.createParam("duracion", "number", false);
const FECHA_INICIO = utils.createParam("fechaInicio", "string", false);
const ID = utils.createParam("id", "number", false);

const _cdtsController = new CDTsController();

cdtsRouter.post(
  "/calcular",
  [authMiddleware, validatorMiddleware([INVERSION, DURACION, FECHA_INICIO])],
  _cdtsController.calcular
);

cdtsRouter.get(
  "/obtener-todos",
  [authMiddleware],
  _cdtsController.obtenerTodos
);

cdtsRouter.post(
  "/obtener",
  [authMiddleware, validatorMiddleware([ID])],
  _cdtsController.obtener
);

cdtsRouter.post(
  "/crear",
  [authMiddleware, validatorMiddleware([INVERSION, DURACION, FECHA_INICIO])],
  _cdtsController.crear
);

cdtsRouter.post(
  "/liquidar",
  [authMiddleware, validatorMiddleware([ID])],
  _cdtsController.liquidar
);

cdtsRouter.post(
  "/cancelar",
  [authMiddleware, validatorMiddleware([ID])],
  _cdtsController.cancelar
);

module.exports = cdtsRouter;
