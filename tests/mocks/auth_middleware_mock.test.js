//Imports
const { verificarToken } = require("../../src/services/jwt.service");
const superTest = require("supertest");
const { app, server } = require("../../index");
let { test, describe, expect } = require("@jest/globals");

//Mock
jest.mock("../../src/services/jwt.service");

//functions
afterAll(() => {
  server.close();
});
beforeEach(() => {
  verificarToken.mockReset();
});

//Instance of the API
const api = superTest(app);
//Test
//Como estamos probando un middleware, no importa la ruta, solo debe enviar una solicitud a cualquier ruta que use el middleware.
describe("Pruebas para Auth Middleware ", () => {
  test("Debería devolver un error 401 si no se envía un token", async () => {
    // Arrange
    verificarToken.mockReturnValue({
      idCuenta: 1,
    });
    // Act
    const response = await api.get("/api/cuentas/obtener-saldo");

    // Assert
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      "Acceso denegado: autenticación no proporcionada."
    );
  });

  test("Debería devolver un error 401 si el token es inválido", async () => {
    // Arrange
    verificarToken.mockImplementation(() => {
      throw new Error("Token inválido");
    });
    let auth = { Authorization: "Bearer token" };

    // Act
    const response = await api.get("/api/cuentas/obtener-saldo").set(auth);

    // Assert
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe(
      "Acceso denegado: autenticación inválida o expirada."
    );
  });
});
