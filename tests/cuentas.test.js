const superTest = require("supertest");
const { app, server } = require("../index");
const { Sequelize } = require("sequelize");
const sequelize = require("../db");
const api = superTest(app);
const { crearToken } = require("../src/services/jwt.service");

describe("Pruebas para el endpoint de inicio de sesión", () => {
  test("Con datos incorrectos", async () => {

    // ARRANGE

    const newLocal_1 = {
      tipoIdentificacion: "CC",
      numeroIdentificacion: "123456789",
      clave: "testPassword",
    };

    // ACT
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .send(newLocal_1)
      .expect(200)
      .expect("Content-Type", /json/)
    
    // ASSERT
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(
          "La identificación no pertenece a ninguna cuenta existente."
        );
      });
  });

  test("Con tipo y numero de identificacion correcta pero contraseña incorrecta ", async () => {

    // ARRANGE

    const newLocal = {
      tipoIdentificacion: "CC",
      numeroIdentificacion: "1001025610",
      clave: "wrongPassword",
    };

    // ACT
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .send(newLocal)
      .expect(200)
      .expect("Content-Type", /json/)
    
    // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("error");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("La clave no es válida.");
      });
  });
  test("Con datos correctos ", async () => {

    // ARRANGE

    const newLocal_1 = {
      tipoIdentificacion: "CC",
      numeroIdentificacion: "1001025610",
      clave: "123abcDEF-",
    };

    // ACT
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .send(newLocal_1)
      .expect(200)
      .expect("Content-Type", /json/)
    
    // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("success");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Sesión iniciada correctamente.");
        expect(res.body.body).toHaveProperty("token");
      });
  });
  test("Sin pasar datos ", async () => {
    
    // ARRANGE
    const newLocal = {
      tipoIdentificacion: "",
      numeroIdentificacion: "",
      clave: "",
    };

    // ACT
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .send(newLocal)
      .expect(400)
      .expect("Content-Type", /json/)

    // ASSERT
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.type).toBe("error");
        expect(res.body.message).toBe(
          "Ha ocurrido un error al intentar iniciar sesión."
        );
      });
  });
  test("Iniciar sesión sin pasar objeto en la request", async () => {

    // ARRANGE

    // ACT
    const response = await api.post("/api/cuentas/iniciar-sesion").expect(400);

    // ASSERT
  });
});

describe("Pruebas para el endpoint obtener Identificacion", () => {
  test("sin token", async () => {

    // ARRANGE

    // ACT
    const response = await api
      .get("/api/cuentas/obtener-identificacion")
      .expect(401)
      .expect("Content-Type", /json/)

    // ASSERT
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(
          "Acceso denegado: autenticación no proporcionada."
        );
      });
  });

  test("con token incorrecto", async () => {

    // ARRANGE
    const newLocal = "Bearer wrongToken";

    // ACT
    const response = await api
      .get("/api/cuentas/obtener-identificacion")
      .set("Authorization", newLocal)
      .expect(401)

    // ASSERT
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(
          "Acceso denegado: autenticación inválida o expirada."
        );
      });
  });

  test("con token correcto", async () => {

    // ARRANGE
    const token = crearToken(1);

    // ACT
    const response = await api
      .get("/api/cuentas/obtener-identificacion")
      .set("Authorization", token)
      .expect(200)
    
    // ASSERT
      .expect((res) => {
        expect(res.body.type).toBe("success");

        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Identificación obtenida correctamente.");
        expect(res.body).toHaveProperty("body");
        expect(res.body.body).toHaveProperty("cuenta");
        expect(res.body.body.cuenta.tipoIdentificacion).toBe("CC");
        expect(res.body.body.cuenta.numeroIdentificacion).toBe("1001025610");
      });
  });
});
afterAll(() => {
  sequelize.close();
  server.close();
});
