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
beforeEach(() => {
    cuentasService.buscarPorId.mockReset();
    movimientosService.crearMovimiento.mockReset();
    movimientosService.crearTransferenciaBolsillo.mockReset();
    verificarToken.mockReset();

})
function setCargarCuenta(idCuenta, saldoCuenta, idMovimiento, descarga) {
    verificarToken.mockReturnValue({ idCuenta: idCuenta });
    if (idCuenta) {
        cuentasService.buscarPorId.mockResolvedValueOnce({
            id: idCuenta,
            saldo: saldoCuenta,
        });
    } else {
        cuentasService.buscarPorId.mockResolvedValueOnce(false)
    }
    cuentasService.buscarPorId.mockResolvedValueOnce({
        id: idCuenta,
        saldo: saldoCuenta,
    });
    movimientosService.crearMovimiento.mockResolvedValueOnce({
        id: idMovimiento,
        fecha: "2024-25-04",
        monto: 100
    });
    movimientosService.crearTransferenciaExterna.mockResolvedValueOnce(descarga);

}
function setObtenerUltimos(idCuenta) {
    verificarToken.mockReturnValue({ idCuenta: idCuenta });
    if (idCuenta) {
        cuentasService.buscarPorId.mockResolvedValueOnce({
            id: idCuenta,
        });
    } else {
        cuentasService.buscarPorId.mockResolvedValueOnce(false)
    }
}
describe("Pruebas para el endpoint de descargar cuenta", () => {
    test("Descarga con datos correctos", async () => {
        //ARRANGE
        const auth = {
            authorization: "token_de_prueba",
        };
        const descarga = {
            entidadDestino: '1',
            cuentaDestino: '2',
            monto: 100,
        };

        setCargarCuenta(1, 200, 1, true);

        //ACT

        const res = await api.post("/api/movimientos/descargar-cuenta").send(descarga).set(auth);

        //ASSERT

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Transacción realizada correctamente.");
        expect(res.body.type).toBe("success");
        expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    });
    test("Descarga con datos incorrectos", async () => {
        //ARRANGE
        const auth = {
            authorization: "token_de_prueba",
        };
        const descarga = {
            entidadDestino: '1',
            cuentaDestino: '2',
            monto: 100,
        };

        setCargarCuenta(1, 200, 1, false);

        //ACT

        const res = await api.post("/api/movimientos/descargar-cuenta").send(descarga).set(auth);

        //ASSERT

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("No se pudo crear la transacción.");
        expect(res.body.type).toBe("error");
        expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    });
    test("Descarga con saldo insuficiente", async () => {
        //ARRANGE
        const auth = {
            authorization: "token_de_prueba",
        };
        const descarga = {
            entidadDestino: '1',
            cuentaDestino: '2',
            monto: 1000,
        };

        setCargarCuenta(1, 200, 1, true);

        //ACT

        const res = await api.post("/api/movimientos/descargar-cuenta").send(descarga).set(auth);

        //ASSERT

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("No hay saldo disponible para realizar la transacción.");
        expect(res.body.type).toBe("error");
        expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    });
    test("Descarga con id de cuenta inexistente", async () => {
        //ARRANGE
        const auth = {
            authorization: "token_de_prueba",
        };
        const descarga = {
            entidadDestino: '1',
            cuentaDestino: '2',
            monto: 100,
        };

        setCargarCuenta(false, 200, 1, true);

        //ACT

        const res = await api.post("/api/movimientos/descargar-cuenta").send(descarga).set(auth);

        //ASSERT

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("El id no corresponde a ninguna cuenta existente.");
        expect(res.body.type).toBe("error");
        expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    });
});
describe("Pruebas para el endpoint de obtener ultimos", () => {
    test("Ultimos movimientos con id de cuenta correcto", async () => {
        //ARRANGE
        const auth = {
            authorization: "token_de_prueba",
        };
    

        setObtenerUltimos(1);

        //ACT

        const res = await api.get("/api/movimientos/obtener-ultimos").set(auth);

        //ASSERT

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Últimos movimientos obtenidos correctamente.");
        expect(res.body.type).toBe("success");
        expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    });
    test("Ultimos movimientos con id de cuenta incorrecto", async () => {
        //ARRANGE
        const auth = {
            authorization: "token_de_prueba",
        };
    

        setObtenerUltimos(false);

        //ACT

        const res = await api.get("/api/movimientos/obtener-ultimos").set(auth);

        //ASSERT

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("La identificación no corresponde a ninguna cuenta existente.");
        expect(res.body.type).toBe("error");
        expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    });
});