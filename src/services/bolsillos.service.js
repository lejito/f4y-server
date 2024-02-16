const { QueryTypes } = require("sequelize");
const sequelize = require("../../db");
const Bolsillo = require("../models/Bolsillo");

module.exports = {
  async obtener(cuenta) {
    const bolsillos = await Bolsillo.findAll({
      where: { cuenta, eliminado: false },
      order: [["id", "ASC"]],
    });
    return bolsillos;
  },

  async crear(cuenta, nombre, saldoObjetivo) {
    const bolsillo = await Bolsillo.create({
      cuenta,
      nombre,
      saldoObjetivo,
    });
    return bolsillo;
  },

  async obtenerMovimientos(idBolsillo) {
    let movimientos = await sequelize.query(
      `
      SELECT * FROM (
        SELECT
        mov.id AS id,
        'carga-bolsillo'::VARCHAR(30) AS tipo,
        mov.fecha AS fecha,
        mov.monto AS monto
        FROM movimientos mov
        INNER JOIN transferencias_bolsillos tbo ON tbo.movimiento = mov.id
        WHERE tbo.bolsillo = :idBolsillo::INT AND tbo.carga = TRUE
        
        UNION ALL
        
        SELECT
        mov.id AS id,
        'descarga-bolsillo'::VARCHAR(30) AS tipo,
        mov.fecha AS fecha,
        mov.monto * -1 AS monto
        FROM movimientos mov
        INNER JOIN transferencias_bolsillos tbo ON tbo.movimiento = mov.id
        WHERE tbo.bolsillo = :idBolsillo::INT AND tbo.carga = FALSE
      ) movimientos
      ORDER BY movimientos.fecha DESC
      LIMIT 30;
    `,
      { replacements: { idBolsillo }, type: QueryTypes.SELECT }
    );
    movimientos = movimientos.map((movimiento) => {
      return {
        ...movimiento,
        monto: parseFloat(movimiento.monto),
      };
    });
    return movimientos;
  },

  async actualizar(id, cuenta, nombre, saldoObjetivo) {
    const [affectedCount] = await Bolsillo.update(
      { nombre, saldoObjetivo },
      { where: { id, cuenta } }
    );
    return affectedCount > 0;
  },

  async eliminar(id, cuenta) {
    const [affectedCount] = await Bolsillo.update(
      { eliminado: true },
      { where: { id, cuenta, saldo: 0 } }
    );
    return affectedCount > 0;
  },

  async buscarPorId(id) {
    const bolsillo = await Bolsillo.findByPk(id);
    return bolsillo;
  },

  async sumarSaldo(id, monto) {
    const bolsillo = await this.buscarPorId(id);
    bolsillo.increment("saldo", { by: monto });
  },

  async restarSaldo(id, monto) {
    const bolsillo = await this.buscarPorId(id);
    bolsillo.decrement("saldo", { by: monto });
  },
};
