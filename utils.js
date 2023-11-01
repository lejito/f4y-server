/*
En este archivo se define el formato de respuestas JSON.

Una respuesta contiene las siguientes propiedades.
- type (string): Puede ser "success" si la respuesta es satisfactoria, "warning" si no hubo error pero no se obtuvo la respuesta esperada,
    y "error" si ocurrió un error al intentar procesar la respuesta.

- message (string): Es un string con una explicación básica de la respuesta obtenida.

- body (object/array): Contiene un objeto (o listas de objetos) dependiendo de la respuesta dada.

- error (boolean): Es "true" o "false" dependiendo de si al procesar la respuesta hubo un error.

Adicionalmente, también se define una función que sirve para verificar si los parámetros de una petición son los requeridos.
*/

const createResponse = (type, message, body, error) => {
  return {
    type,
    message,
    body,
    error,
    time: new Date(),
  };
};

module.exports = {
  successResponse(message, body) {
    return createResponse("success", message, body, false);
  },

  warningResponse(message, body) {
    return createResponse("warning", message, body, false);
  },

  errorResponse(message, body) {
    return createResponse("error", message, body, true);
  },

  createParam(name, type, nullable) {
    return { name, type, nullable };
  },
};
