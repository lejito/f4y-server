// Configuración de router
var express = require('express');
var appRouter = express.Router();

// Importar rutas
const cuentasRouter = require('./cuentas.router');

// Usar rutas
appRouter.use('/cuentas', cuentasRouter);

module.exports = appRouter;