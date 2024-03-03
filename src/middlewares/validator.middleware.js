const utils = require('../../utils');

module.exports = (requiredParams) => {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   **/
  return (req, res, next) => {
    //<1>
    const missingParams = [];
    const invalidParams = [];
    const nullParams = [];
    //<1>
    //<2>
    for (const param of requiredParams) {
      //<3>
      if (!(param.name in req.body)) {
        //<4>
        missingParams.push(param);
        //<4>
      }
      //<3>
      //<5>
      else if (!param.nullable) {
        //<6>
        if (
          req.body[param.name] === null ||
          req.body[param.name] === undefined
        ) {
          //<7>
          nullParams.push(param);
          //<7>
        } 
        //<6>
        //<8>
        else if (
          !param.nullable &&
          !(typeof req.body[param.name] === param.type)
        ) {
          //<9>
          invalidParams.push(param);
          //<9>
        }
        //<8>
      }
      //<5>
    }
    //<2>
    //<10>
    if (
      missingParams.length > 0 ||
      invalidParams.length > 0 ||
      nullParams.length > 0
    ) {
      //<11>
      return res.status(400).json(
        utils.errorResponse(
          "Los parámetros proporcionados no son los suficientes, no son del tipo válido o son nulos.",
          {
            parametrosFaltantes: missingParams,
            parametrosInvalidos: invalidParams,
            parametrosNulos: nullParams,
          }
        )
      );
      //<11>
    } 
    //<10>
    else {
      return next();
    }
  };
};
