// Configuración de router
var express = require("express");
var appRouter = express.Router();

// Importar rutas
const cuentasRouter = require("./cuentas.router");
const movimientosRouter = require("./movimientos.router");
const bolsillosRouter = require("./bolsillos.router");
const cdtsRouter = require("./cdts.router");

// Usar rutas
appRouter.use("/cuentas", cuentasRouter);
appRouter.use("/movimientos", movimientosRouter);
appRouter.use("/bolsillos", bolsillosRouter);
appRouter.use("/cdts", cdtsRouter);

module.exports = appRouter;
