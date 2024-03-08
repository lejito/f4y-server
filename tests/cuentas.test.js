const superTest = require("supertest");
const app = require("../app");

const api = superTest(app);

describe("Pruebas para el endpoint de inicio de sesión", () => {
  test("Iniciar sesión con datos incorrectos", async () => {
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .send({
        tipoIdentificacion: "CC",
        numeroIdentificacion: "123456789",
        clave: "testPassword",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe(
          "La identificación no pertenece a ninguna cuenta existente."
        );
      });
  });

  test("Iniciar sesión con tipo y numero de identificacion correcta pero contraseña incorrecta ", async () => {
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .send({
        tipoIdentificacion: "CC",
        numeroIdentificacion: "1034576855",
        clave: "wrongPassword",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body.type).toBe("error");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("La clave no es válida.");
      });
  });
  test("Iniciar sesión con datos correctos ", async () => {
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .send({
        tipoIdentificacion: "CC",
        numeroIdentificacion: "1034576855",
        clave: "goodPassword",
      })
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Sesión iniciada correctamente.");
        expect(res.body.type).toHaveProperty("success");
        expect(res.body.body).toHaveProperty("token");
      });
  });
  test("Iniciar sesión sin pasar datos ", async () => {
    const response = await api
      .post("/api/cuentas/iniciar-sesion")
      .expect(500)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(res.body).toHaveProperty("message");
        expect(res.body.type).toBe("error");
        expect(res.body.message).toBe(
          "Ha ocurrido un error al intentar iniciar sesión."
        );
      });
  });
});
