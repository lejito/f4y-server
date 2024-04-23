//Imports
const cuentasService = require("../../src/services/cuentas.service");
const superTest = require("supertest");
const { app, server } = require("../../index");
let { test, describe, expect } = require("@jest/globals");

//Instance of the API
const api = superTest(app);

//Mocks
jest.mock("../../src/services/cuentas.service");
jest.mock("../../db");

//fixtures and helpers

afterAll(() => {
  server.close();
});
beforeEach(() => {
  cuentasService.buscarPorIdentificacion.mockReset();
  cuentasService.buscarPorCorreo.mockReset();
  cuentasService.crear.mockReset();
});

function setCreateMocks(existeIdentificacion, existeCorreo, nuevaCuenta) {
  cuentasService.buscarPorIdentificacion.mockResolvedValueOnce(
    existeIdentificacion
  );
  cuentasService.buscarPorCorreo.mockResolvedValueOnce(existeCorreo);
  cuentasService.crear.mockResolvedValueOnce(nuevaCuenta);
}
/**
 * @param {{tipoIdentificacion:boolean,primerNombre:boolean, segundoNombre:boolean, primerApellido:boolean, segundoApellido:boolean, fechaNacimiento:boolean, correo:boolean, numeroIdentificacion:boolean, clave:boolean }} datosNecesarios
 * cada campo es un booleano que indica si se quiere que el campo exista en el mock de la cuenta que se retorna.
 **/
function generateMockCuenta(datosNecesarios) {
  const completeMock = {
    tipoIdentificacion: "CC",
    primerNombre: "Test",
    segundoNombre: "Test",
    primerApellido: "Test",
    segundoApellido: "Test",
    fechaNacimiento: "1999-12-12",
    correo: "test@test.com",
    numeroIdentificacion: "1001025610",
    clave: "testPassword",
  };
  let returnMock = new Map();
  Object.keys(datosNecesarios).forEach((key) => {
    if (datosNecesarios[key]) {
      returnMock.set(key, completeMock[key]);
    }
  });

  return Object.fromEntries(returnMock.entries());
}
//Tests
describe("Pruebas para crear cuenta", () => {
  describe("Con datos correctos ", () => {
    test("Todos los campos completos", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        numeroIdentificacion: true,
        primerApellido: true,
        primerNombre: true,
        segundoApellido: true,
        segundoNombre: true,
        tipoIdentificacion: true,
      });
      setCreateMocks(false, false, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT
      expect(result.status).toBe(200);
      expect(cuentasService.crear).toHaveBeenCalledTimes(1);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(1);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(1);
      expect(result.body.type).toBe("success");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "Cuenta creada correctamente. Ya puedes iniciar sesión."
      );
    });

    test("Sin segundo nombre ni segundo apellido", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        numeroIdentificacion: true,
        primerApellido: true,
        primerNombre: true,
        segundoApellido: false,
        segundoNombre: false,
        tipoIdentificacion: true,
      });
      setCreateMocks(false, false, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT
      expect(result.status).toBe(200);
      expect(cuentasService.crear).toHaveBeenCalledTimes(1);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(1);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(1);
      expect(result.body.type).toBe("success");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "Cuenta creada correctamente. Ya puedes iniciar sesión."
      );
    });
  });

  describe("Con datos incorrectos", () => {
    test("Sin numero de identificacion", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        primerApellido: true,
        primerNombre: true,
        segundoApellido: true,
        segundoNombre: true,
        tipoIdentificacion: false,
      });
      setCreateMocks(false, false, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT

      expect(result.status).toBe(400);
      expect(cuentasService.crear).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(0);
      expect(result.body.type).toBe("error");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "Los parámetros proporcionados no son los suficientes, no son del tipo válido o son nulos."
      );
    });
    test("Sin numero de identificacion", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        primerApellido: true,
        primerNombre: true,
        segundoApellido: true,
        segundoNombre: true,
        tipoIdentificacion: true,
        numeroIdentificacion: false,
      });
      setCreateMocks(false, false, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT
      expect(result.status).toBe(400);
      expect(cuentasService.crear).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(0);
      expect(result.body.type).toBe("error");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "Los parámetros proporcionados no son los suficientes, no son del tipo válido o son nulos."
      );
    });
    test("Sin primer nombre", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        numeroIdentificacion: true,
        primerApellido: true,
        segundoApellido: true,
        primerNombre: false,
        segundoNombre: true,
        tipoIdentificacion: true,
      });
      setCreateMocks(false, false, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT
      expect(result.status).toBe(400);
      expect(cuentasService.crear).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(0);
      expect(result.body.type).toBe("error");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "Los parámetros proporcionados no son los suficientes, no son del tipo válido o son nulos."
      );
    });
    test("Sin primer apellido", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        numeroIdentificacion: true,
        primerApellido: false,
        segundoApellido: true,
        primerNombre: true,
        segundoNombre: true,
        tipoIdentificacion: true,
      });
      setCreateMocks(false, false, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT
      expect(result.status).toBe(400);
      expect(cuentasService.crear).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(0);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(0);
      expect(result.body.type).toBe("error");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "Los parámetros proporcionados no son los suficientes, no son del tipo válido o son nulos."
      );
    });
  });
  describe("Con datos ya registrados", () => {
    test("Con correo ya registrado", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        numeroIdentificacion: true,
        primerApellido: true,
        primerNombre: true,
        segundoApellido: true,
        segundoNombre: true,
        tipoIdentificacion: true,
      });

      setCreateMocks(false, true, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT
      expect(result.status).toBe(200);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(1);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(1);
      expect(cuentasService.crear).toHaveBeenCalledTimes(0);
      expect(result.body.type).toBe("error");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "La identificación y/o el correo ya pertenecen a una cuenta existente."
      );
    });

    test("Con identificacion ya registrada", async () => {
      // ARRANGE
      const nuevaCuenta = generateMockCuenta({
        clave: true,
        correo: true,
        fechaNacimiento: true,
        numeroIdentificacion: true,
        primerApellido: true,
        primerNombre: true,
        segundoApellido: true,
        segundoNombre: true,
        tipoIdentificacion: true,
      });

      setCreateMocks(true, false, nuevaCuenta);

      // ACT
      let result = await api.post("/api/cuentas/crear").send(nuevaCuenta);

      // ASSERT
      expect(result.status).toBe(200);
      expect(cuentasService.buscarPorIdentificacion).toHaveBeenCalledTimes(1);
      expect(cuentasService.buscarPorCorreo).toHaveBeenCalledTimes(1);
      expect(cuentasService.crear).toHaveBeenCalledTimes(0);
      expect(result.body.type).toBe("error");
      expect(result.body).toHaveProperty("message");
      expect(result.body.message).toBe(
        "La identificación y/o el correo ya pertenecen a una cuenta existente."
      );
    });
  });
});
