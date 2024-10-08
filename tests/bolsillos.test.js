const superTest = require("supertest");
const { app, server } = require("../index");
const api = superTest(app);
const sequelize = require("../db");
const { crearToken } = require("../src/services/jwt.service");



const token = crearToken(1);
describe("Pruebas para el endpoint de carga", () => {
  test("Cargar con saldo suficiente", async () => {

    // ARRANGE
    // Simula una cuenta con suficiente saldo
    const mockReqBody = {
      id: 5,
      monto: 1000 // Monto menor o igual al saldo de la cuenta
    };

    // ACT
    // Envía la solicitud al endpoint
    const response = await api
      .post("/api/bolsillos/cargar")
      .set("Authorization", token)
      .send(mockReqBody)
      .expect(200)
      .expect("Content-Type", /json/)

      // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("success");
        expect(res.body).toHaveProperty("message");
        // Verifica el mensaje de éxito
        expect(res.body.message).toBe("Transacción realizada correctamente.");
        // Verifica la estructura de la respuesta
        expect(res.body.body).toHaveProperty("movimiento");
      });
  });

  
  test("Cargar sin saldo suficiente", async () => {

    // ARRANGE
    // Simula una cuenta con saldo insuficiente
    const mockReqBody = {
      id: 5,
      monto: 2000000000000000000 // Monto mayor al saldo de la cuenta
    };

    // ACT
    // Envía la solicitud al endpoint
    const response = await api
      .post("/api/bolsillos/cargar")
      .set("Authorization", token)
      .send(mockReqBody)
      .expect(200)
      .expect("Content-Type", /json/)

    // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("error");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("No hay saldo disponible para realizar la transacción.");
      });
  });

  test("Cargar con identificación de bolsillo incorrecta", async () => {
    
    // ARRANGE
    // Simula una cuenta inexistente
    const mockReqBody = {
      id: 10,
      monto: 1000
    };

    // ACT
    // Envía la solicitud al endpoint
    const response = await api
      .post("/api/bolsillos/cargar")
      .set("Authorization", token)
      .send(mockReqBody)
      .expect(500)
      .expect("Content-Type", /json/)

    // ASSERT
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.type).toBe("error");
        expect(res.body.message).toBe(
          "Ha ocurrido un error al intentar realizar la transacción."
        );
      });
  });

});
describe("Pruebas para el endpoint de descarga", () => {
  test("Descargar monto inferior al saldo del bolsillo", async () => {

    // ARRANGE
    // Simula una cuenta con suficiente saldo
    const mockReqBody = {
      id: 6, // Id del bolsillo
      monto: 1000 // Monto menor o igual al saldo del bolsillo
    };

    // ACT
    // Envía la solicitud al endpoint
    const response = await api
      .post("/api/bolsillos/descargar")
      .set("Authorization", token)
      .send(mockReqBody)
      .expect(200)
      .expect("Content-Type", /json/)

    // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("success");
        expect(res.body).toHaveProperty("message");
        // Verifica el mensaje de éxito
        expect(res.body.message).toBe("Transacción realizada correctamente.");
        // Verifica la estructura de la respuesta
        expect(res.body.body).toHaveProperty("movimiento");
      });
  });


  test("Descargar monto superior al saldo del bolsillo", async () => {

    // ARRANGE
    // Simula una cuenta con saldo insuficiente
    const mockReqBody = {
      id: 6,
      monto: 2000000 // Monto mayor al saldo de la cuenta
    };

    // ACT
    // Envía la solicitud al endpoint
    const response = await api
      .post("/api/bolsillos/descargar")
      .set("Authorization", token)
      .send(mockReqBody)
      .expect(200)
      .expect("Content-Type", /json/)

    // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("error");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("No hay saldo disponible para realizar la transacción.");
      });
  });

  test("Descargar con identificación de bolsillo incorrecta", async () => {

    // ARRANGE
    // Simula una cuenta inexistente
    const mockReqBody = {
      id: 10,
      monto: 1000
    };

    // ACT
    // Envía la solicitud al endpoint
    const response = await api
      .post("/api/bolsillos/descargar")
      .set("Authorization", token)
      .send(mockReqBody)
      .expect(200)
      .expect("Content-Type", /json/)
    
    // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("error");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("El id no corresponden con ningún bolsillo existente.");
      });
  });

});
afterAll(() => {
  sequelize.close();
  server.close();
}); 