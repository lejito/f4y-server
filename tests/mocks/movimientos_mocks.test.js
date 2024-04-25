//Imports
const { verificarToken } = require("../../src/services/jwt.service");
const movimientosService = require("../../src/services/movimientos.service");
const cuentasService = require("../../src/services/cuentas.service");
const superTest = require("supertest");

const { app, server } = require("../../index");

let { test, describe, expect } = require("@jest/globals");

//Mocks
jest.mock("../../src/services/cuentas.service");
jest.mock("../../src/services/jwt.service");
jest.mock("../../src/services/movimientos.service");
jest.mock("../../db");

//Instance of the API
const api = superTest(app);
//fixtures and helpers

afterAll(() => {
  server.close();
});

function setCargarCuenta(idCuenta, saldoCuenta, idMovimiento) {
    verificarToken.mockReturnValue({ idCuenta: idCuenta });
    cuentasService.buscarPorId.mockResolvedValueOnce({
        id: idCuenta,
        saldo: saldoCuenta,
      });
    movimientosService.crearMovimiento.mockResolvedValueOnce({
        id: idMovimiento,
        fecha: "2024-25-04",
        monto: 100
    });
    movimientosService.crearTransferenciaExterna.mockResolvedValueOnce(true);
    
}

describe("Pruebas para el endpoint de descargar cuenta", () => {
    test("Descarga con datos correctos", async () => {
      //ARRANGE
      const auth = {
        authorization: "token_de_prueba",
      };
      const carga = {
        entidadDestino: '1',
        cuentaDestino:'2',
        monto: 100,
      };
  
      setCargarCuenta(1,200,1);
  
      //ACT
  
      const res = await api.post("/api/movimientos/descargar-cuenta").send(carga).set(auth);
  
      //ASSERT
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Transacción realizada correctamente.");
      expect(res.body.type).toBe("success");
      expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    });
});