const express = require("express");
const cuentasController = require("../controllers/cuentas.controller");
const validatorMiddleware = require("../middlewares/validator.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const utils = require("../../utils");

const cuentasRouter = express.Router();

const TIPO_IDENTIFICACION = utils.createParam(
  "tipoIdentificacion",
  "string",
  false
);
const NUMERO_IDENTIFICACION = utils.createParam(
  "numeroIdentificacion",
  "string",
  false
);
const PRIMER_NOMBRE = utils.createParam("primerNombre", "string", false);
const SEGUNDO_NOMBRE = utils.createParam("segundoNombre", "string", true);
const PRIMER_APELLIDO = utils.createParam("primerApellido", "string", false);
const SEGUNDO_APELLIDO = utils.createParam("segundoApellido", "string", true);
const FECHA_NACIMIENTO = utils.createParam("fechaNacimiento", "string", false);
const CORREO = utils.createParam("correo", "string", false);
const CLAVE = utils.createParam("clave", "string", false);
const CLAVE_ACTUAL = utils.createParam("claveActual", "string", false);

const _cuentasController = new cuentasController();

cuentasRouter.post(
  "/crear",
  [
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
  ],
  _cuentasController.crear
);

cuentasRouter.post(
  "/iniciar-sesion",
  [validatorMiddleware([TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION, CLAVE])],
  _cuentasController.iniciarsesion
);

cuentasRouter.get(
  "/cerrar-sesion",
  [authMiddleware],
  _cuentasController.cerrarSesion
);

cuentasRouter.get(
  "/verificar-sesion",
  [authMiddleware],
  _cuentasController.verificarSesion
);

cuentasRouter.get(
  "/obtener-identificacion",
  [authMiddleware],
  _cuentasController.obtenerIdentificacion
);

cuentasRouter.get(
  "/obtener-nombre",
  [authMiddleware],
  _cuentasController.obtenerNombre
);

cuentasRouter.get(
  "/obtener-fecha-nacimiento",
  [authMiddleware],
  _cuentasController.obtenerFechaNacimiento
);

cuentasRouter.get(
  "/obtener-correo",
  [authMiddleware],
  _cuentasController.obtenerCorreo
);

cuentasRouter.put(
  "/actualizar-identificacion",
  [
    authMiddleware,
    validatorMiddleware([TIPO_IDENTIFICACION, NUMERO_IDENTIFICACION]),
  ],
  _cuentasController.actualizarIdentificacion
);

cuentasRouter.put(
  "/actualizar-nombre",
  [
    authMiddleware,
    validatorMiddleware([
      PRIMER_NOMBRE,
      SEGUNDO_NOMBRE,
      PRIMER_APELLIDO,
      SEGUNDO_APELLIDO,
    ]),
  ],
  _cuentasController.actualizarNombre
);

cuentasRouter.put(
  "/actualizar-fecha-nacimiento",
  [authMiddleware, validatorMiddleware([FECHA_NACIMIENTO])],
  _cuentasController.actualizarFechaNacimiento
);

cuentasRouter.put(
  "/actualizar-correo",
  [authMiddleware, validatorMiddleware([CORREO])],
  _cuentasController.actualizarCorreo
);

cuentasRouter.put(
  "/actualizar-clave",
  [authMiddleware, validatorMiddleware([CLAVE_ACTUAL, CLAVE])],
  _cuentasController.actualizarClave
);

cuentasRouter.get(
  "/obtener-saldo",
  [authMiddleware],
  _cuentasController.obtenerSaldo
);

module.exports = cuentasRouter;
