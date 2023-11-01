const utils = require("../../utils");
const jwtService = require("../services/jwt.service");

module.exports =
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   **/
  async (req, res, next) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        res
          .status(401)
          .json(
            utils.errorResponse(
              "Acceso denegado: autenticación no proporcionada.",
              null
            )
          );
      } else {
        try {
          jwtService.verificarToken(token);
          next();
        } catch (error) {
          res
            .status(401)
            .json(
              utils.errorResponse(
                "Acceso denegado: autenticación inválida o expirada.",
                null
              )
            );
        }
      }
    } catch (error) {
      res
        .status(500)
        .json(
          utils.errorResponse(
            "Ha ocurrido un error al verificar la autenticación del usuario.",
            null
          )
        );
    }
  };
