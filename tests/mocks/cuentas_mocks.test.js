//Imports
const cuentasService = require("../../src/services/cuentas.service");
const { verificarToken } = require("../../src/services/jwt.service");
const superTest = require("supertest");
const { app, server } = require("../../index");
let { test, describe, expect } = require("@jest/globals");

//Mocks
jest.mock("../../src/services/cuentas.service");
jest.mock("../../db");
jest.mock("../../src/services/jwt.service");
jest.mock("../../src/services/registros.service.js");
//Instance of the API
const api = superTest(app);
//functions

afterAll(() => {
  server.close();
});
beforeEach(() => {
  cuentasService.buscarPorIdentificacion.mockReset();
  cuentasService.buscarPorCorreo.mockReset();
  cuentasService.crear.mockReset();
  cuentasService.buscarPorId.mockReset();
  verificarToken.mockReset();
  cuentasService.actualizarFechaNacimiento.mockReset();
  cuentasService.actualizarCorreo.mockReset();
});

function setCrearCuentaMocks(existeIdentificacion, existeCorreo, nuevaCuenta) {
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
      setCrearCuentaMocks(false, false, nuevaCuenta);

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
      setCrearCuentaMocks(false, false, nuevaCuenta);

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
      setCrearCuentaMocks(false, false, nuevaCuenta);

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
      setCrearCuentaMocks(false, false, nuevaCuenta);

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
      setCrearCuentaMocks(false, false, nuevaCuenta);

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
      setCrearCuentaMocks(false, false, nuevaCuenta);

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

      setCrearCuentaMocks(false, true, nuevaCuenta);

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

      setCrearCuentaMocks(true, false, nuevaCuenta);

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

describe("Pruebas para obtener nombre", () => {
  test("Con token con Id correcto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.buscarPorId.mockResolvedValueOnce({
      primerNombre: "Test",
      primerApellido: "Test",
    });
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api.get("/api/cuentas/obtener-nombre").set(auth);

    // ASSERT
    expect(result.status).toBe(200);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    expect(result.body.type).toBe("success");
    expect(result.body.body.cuenta).toStrictEqual({
      primerNombre: "Test",
      primerApellido: "Test",
    });
  });

  test("Sin token", async () => {
    // ARRANGE

    // ACT
    let result = await api.get("/api/cuentas/obtener-nombre");

    // ASSERT
    expect(result.status).toBe(401);
  });

  test("Con token con Id incorrecto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 0 });
    cuentasService.buscarPorId.mockResolvedValueOnce(null);
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api.get("/api/cuentas/obtener-nombre").set(auth);

    // ASSERT
    expect(result.status).toBe(200);
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(result.body.type).toBe("error");
    expect(result.body).toHaveProperty("message");
    expect(result.body.message).toBe(
      "El id no corresponde a ninguna cuenta existente."
    );
  });

  test("Con error durante el proceso", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.buscarPorId.mockRejectedValueOnce(new Error("Error"));
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api.get("/api/cuentas/obtener-nombre").set(auth);

    // ASSERT
    expect(result.status).toBe(500);
  });
});

describe("Pruebas para obtener fecha de nacimiento", () => {
  test("Con token con Id correcto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.buscarPorId.mockResolvedValueOnce({
      fechaNacimiento: "1999-12-12",
    });
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api
      .get("/api/cuentas/obtener-fecha-nacimiento")
      .set(auth);

    // ASSERT
    expect(result.status).toBe(200);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    expect(result.body.type).toBe("success");
    expect(result.body.body.cuenta).toStrictEqual({
      fechaNacimiento: "1999-12-12",
    });
  });

  test("Sin token", async () => {
    // ARRANGE

    // ACT
    let result = await api.get("/api/cuentas/obtener-fecha-nacimiento");

    // ASSERT
    expect(result.status).toBe(401);
  });

  test("Con token con Id incorrecto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 0 });
    cuentasService.buscarPorId.mockResolvedValueOnce(null);
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api
      .get("/api/cuentas/obtener-fecha-nacimiento")
      .set(auth);

    // ASSERT
    expect(result.status).toBe(200);
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(result.body.type).toBe("error");
    expect(result.body).toHaveProperty("message");
    expect(result.body.message).toBe(
      "El id no corresponde a ninguna cuenta existente."
    );
  });

  test("Con error durante el proceso", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.buscarPorId.mockRejectedValueOnce(new Error("Error"));
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api
      .get("/api/cuentas/obtener-fecha-nacimiento")
      .set(auth);

    // ASSERT
    expect(result.status).toBe(500);
  });
});

describe("Pruebas para obtener correo", () => {
  test("Con token con Id correcto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.buscarPorId.mockResolvedValueOnce({
      correo: "test@test.com",
    });
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api.get("/api/cuentas/obtener-correo").set(auth);

    // ASSERT
    expect(result.status).toBe(200);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    expect(result.body.type).toBe("success");
    expect(result.body.body.cuenta).toStrictEqual({
      correo: "test@test.com",
    });
  });

  test("Sin token", async () => {
    // ARRANGE

    // ACT
    let result = await api.get("/api/cuentas/obtener-correo");

    // ASSERT
    expect(result.status).toBe(401);
  });

  test("Con token con Id incorrecto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 0 });
    cuentasService.buscarPorId.mockResolvedValueOnce(null);
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api.get("/api/cuentas/obtener-correo").set(auth);

    // ASSERT
    expect(result.status).toBe(200);
    expect(cuentasService.buscarPorId).toHaveBeenCalledTimes(1);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(result.body.type).toBe("error");
    expect(result.body).toHaveProperty("message");
    expect(result.body.message).toBe(
      "El id no corresponde a ninguna cuenta existente."
    );
  });

  test("Con error durante el proceso", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.buscarPorId.mockRejectedValueOnce(new Error("Error"));
    let auth = { authorization: "Bearer token" };

    // ACT
    let result = await api.get("/api/cuentas/obtener-correo").set(auth);

    // ASSERT
    expect(result.status).toBe(500);
  });
});

describe("Pruebas para actualizar fecha de nacimiento", () => {
  test("Con token con Id correcto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.actualizarFechaNacimiento.mockResolvedValueOnce(true);
    let auth = { authorization: "Bearer token" };
    let fechaNueva = { fechaNacimiento: "1999-12-12" };

    // ACT
    let result = await api
      .put("/api/cuentas/actualizar-fecha-nacimiento")
      .set(auth)
      .send(fechaNueva);

    // ASSERT
    expect(result.status).toBe(200);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(cuentasService.actualizarFechaNacimiento).toHaveBeenCalledTimes(1);
    expect(result.body.type).toBe("success");
    expect(result.body).toHaveProperty("message");
    expect(result.body.message).toBe(
      "Fecha de nacimiento actualizada correctamente."
    );
    expect(result.body.body).toStrictEqual({ cuentaActualizada: true });
  });

  test("Sin token", async () => {
    // ARRANGE

    // ACT
    let result = await api.put("/api/cuentas/actualizar-fecha-nacimiento");

    // ASSERT
    expect(result.status).toBe(401);
  });

  test("Con token con Id incorrecto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 0 });
    let auth = { authorization: "Bearer token" };
    let fechaNueva = { fechaNacimiento: "1999-12-12" };
    cuentasService.actualizarFechaNacimiento.mockResolvedValueOnce(false);
    // ACT
    let result = await api
      .put("/api/cuentas/actualizar-fecha-nacimiento")
      .set(auth)
      .send(fechaNueva);

    // ASSERT
    expect(result.status).toBe(200);
    expect(cuentasService.actualizarFechaNacimiento).toHaveBeenCalledTimes(1);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(result.body.type).toBe("error");
    expect(result.body).toHaveProperty("message");
    expect(result.body.message).toBe(
      "El id no corresponde a ninguna cuenta existente."
    );
  });
});

describe("Pruebas para actualizar correo", () => {
  test("Con token con Id correcto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 1 });
    cuentasService.actualizarCorreo.mockResolvedValueOnce(true);
    let auth = { authorization: "Bearer token" };
    let correoNuevo = { correo: "nuevoCorreo@correo.com" };

    // ACT
    let result = await api
      .put("/api/cuentas/actualizar-correo")
      .set(auth)
      .send(correoNuevo);

    // ASSERT
    expect(result.status).toBe(200);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(cuentasService.actualizarCorreo).toHaveBeenCalledTimes(1);
    expect(result.body.type).toBe("success");
    expect(result.body).toHaveProperty("message");
    expect(result.body.message).toBe(
      "Correo electrónico actualizado correctamente."
    );
    expect(result.body.body).toStrictEqual({ cuentaActualizada: true });
  });

  test("Sin token", async () => {
    // ARRANGE

    // ACT
    let result = await api.put("/api/cuentas/actualizar-correo");

    // ASSERT
    expect(result.status).toBe(401);
  });

  test("Con token con Id incorrecto", async () => {
    // ARRANGE
    verificarToken.mockReturnValue({ idCuenta: 0 });
    let auth = { authorization: "Bearer token" };
    let correoNuevo = { correo: "nuevoCorreo@correo.com" };
    cuentasService.actualizarCorreo.mockResolvedValueOnce(false);
    // ACT
    let result = await api
      .put("/api/cuentas/actualizar-correo")
      .set(auth)
      .send(correoNuevo);

    // ASSERT
    expect(result.status).toBe(200);
    expect(cuentasService.actualizarCorreo).toHaveBeenCalledTimes(1);
    expect(verificarToken).toHaveBeenCalledTimes(2);
    expect(result.body.type).toBe("error");
    expect(result.body).toHaveProperty("message");
    expect(result.body.message).toBe(
      "El id no corresponde a ninguna cuenta existente."
    );
  });
});
