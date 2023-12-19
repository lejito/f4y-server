# F4Y

F4Y (Fin4Youth) es una aplicación web que simula un sistema financiero que ofrece servicios de ahorro y crédito, destinado inicialmente para jóvenes de entre 18 y 28 años en Colombia. Permite a los usuarios ahorrar su dinero por medio de una cuenta de ahorros, separar y aprovisionar su dinero usando bolsillos, y también ofrece una forma de hacer inversiones seguras con CDTs (Certificados de Depósito a Término).

<p align="center">
  <img width="300" src="https://github.com/lejito/f4y-server/assets/88862376/c221fcf2-00f9-4450-889e-31dd7e7cf5e4">
</p>

Fin4Youth sale de "Finance For Youth" que en español significa "Finanzas para jóvenes". La aplicación fue desarrollada por **[Alejandro Córdoba Ríos](https://github.com/lejito)**.

## F4Y Server

Este repositorio contiene el código de la aplicación backend y API (desarrollado con **NodeJS** y **ExpressJS**), al igual que los scripts de creación de modelos y estructuras (y backup) de la base de datos de **PostgreSQL**. Adicionalmente, se cuenta con una conexión a otro proyecto (backend y API) desarrollado también por **[Alejandro Córdoba Ríos](https://github.com/lejito)** que consiste en una aplicación bancaria: [QuyneApp](https://github.com/lejito/QuyneAppWebServer).

### Modelo de datos
![Fin4Youth_ModeloDatos](https://github.com/lejito/f4y-server/assets/88862376/24211365-1d3d-4b0a-9ca4-f13734061990)

### Variables de entorno requeridas
```env
PORT=3000 #Puerto de ejecución del servidor
DBHOST=localhost #Host de la base de datos
DBPORT=5432 #Puerto del servidor de la base de datos
DBUSER=postgres #Usuario de la base de datos habilitado
DBPASSWORD=1234567a #Contraseña del usuario de la base de datos
DBNAME=f4ydb #Nombre de la base de datos
SECRETJWT=CorazonDeLaRecorazoneria #Clave secreta para la librería JSON Web Token
URLQUYNE=https://quyneappwebserver-140x-dev.fl0.io/api #URL de la API de la app QuyneApp
SECRETQUYNE=TodoPorLaGestionDeLaConfiguracion #Clave secreta de conexión con la API de QuyneApp
```
