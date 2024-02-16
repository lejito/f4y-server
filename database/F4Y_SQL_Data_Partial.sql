INSERT INTO transferencias_externas (movimiento, entidad, cuenta, carga) VALUES (1, 'quyne', '3011442274', TRUE) RETURNING id;  --id 1
INSERT INTO movimientos (cuenta, monto) VALUES (26, 500000) RETURNING id; --id 1
INSERT INTO movimientos (cuenta, monto) VALUES (26, 300000) RETURNING id; --id 2
INSERT INTO transferencias_externas (movimiento, entidad, cuenta, carga) VALUES (2, 'quyne', '3011442274', TRUE) RETURNING id; --id 2
INSERT INTO movimientos (cuenta, monto) VALUES (26, 200000) RETURNING id; --id 3
INSERT INTO transferencias_externas (movimiento, entidad, cuenta, carga) VALUES (3, 'quyne', '3011442274', TRUE) RETURNING id; --id 3

INSERT INTO bolsillos (cuenta, nombre, saldo_objetivo) VALUES (26, 'Ahorros 2024', 2500000) RETURNING id; --id 1
INSERT INTO bolsillos (cuenta, nombre, saldo_objetivo) VALUES (26, 'Universidad', 10000000) RETURNING id; --id 2
INSERT INTO bolsillos (cuenta, nombre, saldo_objetivo) VALUES (26, 'Emergencias', NULL) RETURNING id; --id 3
INSERT INTO movimientos (cuenta, monto) VALUES (26, 500000) RETURNING id; --id 4
INSERT INTO transferencias_bolsillos (movimiento, bolsillo, carga) VALUES (4, 1, TRUE) RETURNING id; --id 1
INSERT INTO movimientos (cuenta, monto) VALUES (26, 200000) RETURNING id; --id 5
INSERT INTO transferencias_bolsillos (movimiento, bolsillo, carga) VALUES (5, 1, TRUE) RETURNING id; --id 2
INSERT INTO movimientos (cuenta, monto) VALUES (26, 2000000) RETURNING id; --id 6
INSERT INTO transferencias_bolsillos (movimiento, bolsillo, carga) VALUES (6, 2, TRUE) RETURNING id; --id 3
INSERT INTO movimientos (cuenta, monto) VALUES (26, 750000) RETURNING id; --id 7
INSERT INTO transferencias_bolsillos (movimiento, bolsillo, carga) VALUES (7, 3, TRUE) RETURNING id; --id 4
INSERT INTO movimientos (cuenta, monto) VALUES (26, 22569.99) RETURNING id; --id 8
INSERT INTO transferencias_bolsillos (movimiento, bolsillo, carga) VALUES (8, 3, FALSE) RETURNING id; --id 5

INSERT INTO cdts (cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin) VALUES (26, 500000, 12.25, 4, 90, '2023-05-14', '2023-08-12') RETURNING id; --id 1
INSERT INTO movimientos (cuenta, monto, fecha) VALUES (26, 500000, '2023-05-14 14:25:30.744484') RETURNING id; --id 9
INSERT INTO transferencias_cdts (movimiento, cdt, tipo) VALUES (9, 1, 'inversion') RETURNING id; --id 1
INSERT INTO movimientos (cuenta, monto, fecha) VALUES (26, 500000, '2023-08-12 22:32:40.067295') RETURNING id; --id 10
INSERT INTO transferencias_cdts (movimiento, cdt, tipo) VALUES (10, 1, 'liquidacion') RETURNING id; --id 2
UPDATE cdts SET liquidado = TRUE WHERE id = 1;
INSERT INTO cdts (cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin) VALUES (26, 700000, 12.25, 4, 30, '2023-06-15', '2023-07-15') RETURNING id; --id 2
INSERT INTO movimientos (cuenta, monto, fecha) VALUES (26, 700000, '2023-06-15 15:18:23.755094') RETURNING id; --id 11
INSERT INTO transferencias_cdts (movimiento, cdt, tipo) VALUES (11, 2, 'inversion') RETURNING id; --id 3
INSERT INTO movimientos (cuenta, monto, fecha) VALUES (26, 700000, '2023-06-17 11:01:53.345672') RETURNING id; --id 12
INSERT INTO transferencias_cdts (movimiento, cdt, tipo) VALUES (12, 2, 'cancelacion') RETURNING id; --id 4
UPDATE cdts SET cancelado = TRUE WHERE id = 2;
INSERT INTO cdts (cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin) VALUES (26, 10000000, 12.25, 4, 360, '2022-11-15', '2023-11-10') RETURNING id; --id 3
INSERT INTO movimientos (cuenta, monto, fecha) VALUES (26, 10000000, '2022-11-15 16:48:40.524983') RETURNING id; --id 13
INSERT INTO transferencias_cdts (movimiento, cdt, tipo) VALUES (13, 3, 'inversion') RETURNING id; --id 5
INSERT INTO cdts (cuenta, inversion, interes, retencion, duracion, fecha_inicio, fecha_fin) VALUES (26, 5000000, 12.25, 4, 180, '2023-10-03', '2024-03-31') RETURNING id; --id 4
INSERT INTO movimientos (cuenta, monto, fecha) VALUES (26, 5000000, '2023-10-03 20:14:45.380407') RETURNING id; --id 14
INSERT INTO transferencias_cdts (movimiento, cdt, tipo) VALUES (14, 4, 'inversion') RETURNING id; --id 6