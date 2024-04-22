
const {cargar} = require("../../src/controllers/bolsillos.controller");


describe("Pruebas para el endpoint de carga", () => {
    test('Debería cargar correctamente', async () => {
        const req = {
          headers: {
            authorization: 'token_de_prueba'
          },
          body: {
            id: 'id_de_prueba',
            monto: 100
          }
        };
    
        const res = {
          status: jest.fn(() => res),
          json: jest.fn()
        };
    
        // Mock de los servicios
        const jwtService = {
          verificarToken: jest.fn(() => ({ idCuenta: 'id_de_prueba' }))
        };
    
        const cuentasService = {
          buscarPorId: jest.fn(() => ({ id: 'id_de_prueba', saldo: 200 }))
        };
    
        const movimientosService = {
          crearMovimiento: jest.fn(() => ({ id: 'id_de_prueba' })),
          crearTransferenciaBolsillo: jest.fn(() => true)
        };
    
        const bolsillosService = {
          sumarSaldo: jest.fn()
        };
    
        const utils = {
          successResponse: jest.fn((message, data) => ({ message, data })),
          errorResponse: jest.fn((message, data) => ({ message, data }))
        };
    
        // Ejecutar la función bajo prueba
        // await cargar(req, res);

    
        // Verificar que los métodos de res se hayan llamado correctamente
        // expect(res.status).toHaveBeenCalled(200);
        expect(res.json).toHaveBeenCalledWith({
          message: 'Transacción realizada correctamente.',
          data: {
            movimiento: {
              id: 'id_de_prueba',
              tipo: 'carga-bolsillo',
              fecha: expect.any(Date),
              monto: 100
            }
          }
        });
    
        // Verificar llamadas a los servicios
        expect(jwtService.verificarToken).toHaveBeenCalledWith('token_de_prueba');
        expect(cuentasService.buscarPorId).toHaveBeenCalledWith('id_de_prueba');
        expect(movimientosService.crearMovimiento).toHaveBeenCalledWith('id_de_prueba', 100);
        expect(movimientosService.crearTransferenciaBolsillo).toHaveBeenCalledWith('id_de_prueba', 'id_de_prueba', true);
        expect(bolsillosService.sumarSaldo).toHaveBeenCalledWith('id_de_prueba', 100);
      });
});