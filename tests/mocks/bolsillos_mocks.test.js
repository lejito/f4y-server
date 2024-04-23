//Imports
const { verificarToken } = require("../../src/services/jwt.service");
const bolsillosService = require("../../src/services/bolsillos.service");
const movimientosService = require("../../src/services/movimientos.service");
const cuentasService = require("../../src/services/cuentas.service");
const superTest = require("supertest");

const { app, server } = require("../../index");

let { test, describe, expect } = require("@jest/globals");

//Mocks
jest.mock("../../src/services/cuentas.service");
jest.mock("../../src/services/jwt.service");
jest.mock("../../src/services/bolsillos.service");
jest.mock("../../src/services/movimientos.service");
jest.mock("../../db");

//Instance of the API
const api = superTest(app);
//fixtures and helpers

afterAll(() => {
  server.close();
});

describe("Pruebas para el endpoint de carga", () => {
  test("Debería cargar correctamente", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };
    const carga = {
      id: 1,
      monto: 100,
    };

    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.buscarPorId.mockResolvedValueOnce({
      id: 1,
      saldo: 200,
    });
    movimientosService.crearMovimiento.mockResolvedValueOnce({
      id: 1,
      monto: 100,
    });
    movimientosService.crearTransferenciaBolsillo.mockResolvedValueOnce(true);

    //ACT

    const res = await api.post("/api/bolsillos/cargar").send(carga).set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Transacción realizada correctamente.");
    expect(res.body.type).toBe("success");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
});
