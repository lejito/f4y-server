const superTest = require("supertest");
const { app, server } = require("../index");
const api = superTest(app);
const sequelize = require("../db");
const { crearToken } = require("../src/services/jwt.service");

describe("Pruebas para el endpoint descargar cuenta", () => {
  const token = crearToken(1);
  test("Descargar monto inferior al saldo de la cuenta", async () => {
    // Simula una cuenta con suficiente saldo
    const mockReqBody = {
      entidadDestino: "quyne",
      cuentaDestino: "313427698",
      monto: 70000,
    };

    // Envía la solicitud al endpoint
    const response = await api
      .post("/api/movimientos/descargarCuenta")
      .set("Authorization", token)
      .send(mockReqBody)
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.type).toBe("success");
        expect(res.body).toHaveProperty("message");
        // Verifica el mensaje de éxito
        expect(res.body.message).toBe("Transacción realizada correctamente.");
        // Verifica la estructura de la respuesta
      });
  });
});

afterAll(() => {
  sequelize.close();
  server.close();
});
