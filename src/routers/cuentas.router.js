require("dotenv").config();
const express = require("express");
const cuentasRouter = express.Router();
const cuentasController = require("../controllers/cuentas.controller");
const validatorMiddleware = require("../middlewares/validator.middleware");
const utils = require("../../utils");

const TIPO_IDENTIFICACION = utils.createParam("tipoIdentificacion", "string", false);
const NUMERO_IDENTIFICACION = utils.createParam("numeroIdentificacion", "string", false);
const PRIMER_NOMBRE = utils.createParam("primerNombre", "string", false);
const SEGUNDO_NOMBRE = utils.createParam("segundoNombre", "string", true);
const PRIMER_APELLIDO = utils.createParam("primerApellido", "string", false);
const SEGUNDO_APELLIDO = utils.createParam("segundoApellido", "string", true);
const FECHA_NACIMIENTO = utils.createParam("fechaNacimiento", "string", false);
const CORREO = utils.createParam("correo", "string", false);
const CLAVE = utils.createParam("clave", "string", false);

const _cuentasController = new cuentasController();

cuentasRouter.post(
  "/crear",
  validatorMiddleware([
    TIPO_IDENTIFICACION,
    NUMERO_IDENTIFICACION,
    PRIMER_NOMBRE,
    SEGUNDO_NOMBRE,
    PRIMER_APELLIDO,
    SEGUNDO_APELLIDO,
    FECHA_NACIMIENTO,
    CORREO,
    CLAVE,
  ]),
  _cuentasController.crear
);

module.exports = cuentasRouter;
