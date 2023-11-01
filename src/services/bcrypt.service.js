const bcrypt = require("bcrypt");

module.exports = {
  async encriptarClave(clave) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(clave, salt);
    return hash;
  },
};
