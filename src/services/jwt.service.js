require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = {
  crearToken(idCuenta) {
    const token = jwt.sign({ idCuenta }, process.env.SECRETJWT, {
      expiresIn: "24h",
    });
    return token;
  },

  verificarToken(token) {
    const tokenDecodificado = jwt.verify(token, process.env.SECRETJWT);
    return tokenDecodificado;
  },
};
