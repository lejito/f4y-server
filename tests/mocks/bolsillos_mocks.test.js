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
beforeEach(() => {
  cuentasService.buscarPorId.mockReset();
  movimientosService.crearMovimiento.mockReset();
  movimientosService.crearTransferenciaBolsillo.mockReset();
  // verificarToken.mockReset();

})

function setCargarBolsillo(idCuenta, id, saldoCuenta, saldoCarga, crearTransferencia) {
  verificarToken.mockReturnValue({ idCuenta: idCuenta });
  cuentasService.buscarPorId.mockResolvedValueOnce({
    id: id,
    saldo: saldoCuenta,
  });
  movimientosService.crearMovimiento.mockResolvedValueOnce({
    id: id,
    monto: saldoCarga,
  });
  movimientosService.crearTransferenciaBolsillo.mockResolvedValueOnce(crearTransferencia);
}
function setDescargarBolsillo(idCuenta, id, saldoBolsillo, saldoDescarga, crearTransferencia) {
  verificarToken.mockReturnValue({ idCuenta: idCuenta });
  cuentasService.buscarPorId.mockResolvedValueOnce({
    id: id,
  });
  bolsillosService.buscarPorId.mockResolvedValueOnce({
    id: id,
    saldo: saldoBolsillo
  })
  movimientosService.crearMovimiento.mockResolvedValueOnce({
    id: id,
    monto: saldoDescarga,
  });
  movimientosService.crearTransferenciaBolsillo.mockResolvedValueOnce(crearTransferencia);
}
function setObtenerBolsillos(idCuenta) {
  verificarToken.mockReturnValue({ idCuenta: idCuenta });
  if (idCuenta) {
    cuentasService.buscarPorId.mockResolvedValueOnce({
      id: idCuenta,
    });
  } else {
    cuentasService.buscarPorId.mockResolvedValueOnce(idCuenta)
  }
  bolsillosService.obtener.mockResolvedValueOnce([
    bolsillo1 = {
      saldo: 100,
      saldoObjetivo: 1000
    }, 
    bolsillo2 ={
      saldo:200,
      saldoObjetivo:1000
    }
  ])
}

describe("Pruebas para el endpoint de carga", () => {
  test("Carga con saldo suficiente", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };
    const carga = {
      id: 1,
      monto: 100,
    };

    setCargarBolsillo(1, 1, 200, 100, true);

    //ACT

    const res = await api.post("/api/bolsillos/cargar").send(carga).set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Transacción realizada correctamente.");
    expect(res.body.type).toBe("success");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
  test("Cargar sin saldo suficiente", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };
    const carga = {
      id: 1,
      monto: 1000,
    };

    setCargarBolsillo(1, 1, 200, 1000, true);

    //ACT

    const res = await api.post("/api/bolsillos/cargar").send(carga).set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("No hay saldo disponible para realizar la transacción.");
    expect(res.body.type).toBe("error");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
  test("Cargar con identificacion de bolsillo incorrecta", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };
    const carga = {
      id: 1,
      monto: 100,
    };

    setCargarBolsillo(1, 1, 200, 100, false);

    //ACT

    const res = await api.post("/api/bolsillos/cargar").send(carga).set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("No se pudo crear la transacción.");
    expect(res.body.type).toBe("error");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
});
describe("Pruebas para el endpoint de descarga", () => {
  test("Descargar monto inferior al saldo del bolsillo", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };
    const descarga = {
      id: 1,
      monto: 100,
    };

    setDescargarBolsillo(1, 1, 200, 100, true);

    //ACT

    const res = await api.post("/api/bolsillos/descargar").send(descarga).set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toBe("Transacción realizada correctamente.");
    expect(res.body.type).toBe("success");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
  test("Descargar monto superior al saldo del bolsillo", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };
    const descarga = {
      id: 1,
      monto: 1000,
    };

    setDescargarBolsillo(1, 1, 200, 1000, true);

    //ACT

    const res = await api.post("/api/bolsillos/descargar").send(descarga).set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toBe("No hay saldo disponible para realizar la transacción.");
    expect(res.body.type).toBe("error");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
  test("Descargar con identificación de bolsillo incorrecta", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };
    const descarga = {
      id: 1,
      monto: 100,
    };

    setDescargarBolsillo(1, 1, 200, 100, false);

    //ACT

    const res = await api.post("/api/bolsillos/descargar").send(descarga).set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toBe("No se pudo crear la transacción.");
    expect(res.body.type).toBe("error");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
});
describe("Pruebas para el endpoint de obtener", () => {
  test("Obtener bolsillos de una cuenta existente", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };


    setObtenerBolsillos(1);

    //ACT

    const res = await api.get("/api/bolsillos/obtener").set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toBe("Lista de bolsillos obtenida correctamente.");
    expect(res.body.type).toBe("success");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
  test("Obtener bolsillos de una cuenta inexistente", async () => {
    //ARRANGE
    const auth = {
      authorization: "token_de_prueba",
    };


    setObtenerBolsillos(false);

    //ACT

    const res = await api.get("/api/bolsillos/obtener").set(auth);

    //ASSERT

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");

    expect(res.body.message).toBe("La identificación no corresponde a ninguna cuenta existente.");
    expect(res.body.type).toBe("error");
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
  });
});