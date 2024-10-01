"use strict";
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;

// Cargar el módulo con la configuración de la API
const app = require("./app");
let server;
// Realizar la conexión con la base de datos PostgreSQL
const sequelize = require("./db");
try {
  sequelize.authenticate();
  server = app.listen(port, () => {
    console.log(`Servidor ejecutándose correctamente en el puerto ${port}`);
  });
} catch (error) {
  console.log("Ha ocurrido un error al intentar ejecutar el servidor:");
  console.log(error);
}

module.exports = { app, server };
