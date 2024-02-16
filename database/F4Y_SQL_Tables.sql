--
-- CREACIÓN DE TABLAS
--
CREATE TABLE cuentas(
  id SERIAL NOT NULL,
  tipo_identificacion VARCHAR(2) NOT NULL,
  numero_identificacion VARCHAR(10) NOT NULL,
  primer_nombre VARCHAR(20) NOT NULL,
  segundo_nombre VARCHAR(20) NULL,
  primer_apellido VARCHAR(20) NOT NULL,
  segundo_apellido VARCHAR(20) NULL,
  fecha_nacimiento DATE NOT NULL,
  correo VARCHAR(120) NOT NULL,
  clave VARCHAR(76) NOT NULL,
  saldo DECIMAL(16, 2) NOT NULL DEFAULT 0,
  bloqueada BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cuentas_pk PRIMARY KEY (id),
  CONSTRAINT cuentas_ck_tipo_identificacion CHECK (tipo_identificacion IN ('CC', 'TI', 'CE', 'PP')),
  CONSTRAINT cuentas_uq_identificacion UNIQUE (tipo_identificacion, numero_identificacion),
  CONSTRAINT cuentas_uq_correo UNIQUE (correo),
  CONSTRAINT cuentas_ck_saldo CHECK (saldo >= 0)
);

CREATE TABLE registros_actividad(
  id SERIAL NOT NULL,
  cuenta INT NOT NULL,
  accion VARCHAR(50) NOT NULL,
  fecha TIMESTAMP NOT NULL,
  CONSTRAINT registros_actividad_pk PRIMARY KEY (id)
);

CREATE TABLE movimientos(
  id SERIAL NOT NULL,
  cuenta INT NOT NULL,
  monto DECIMAL(16, 2) NOT NULL,
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT movimientos_pk PRIMARY KEY (id),
  CONSTRAINT movimientos_ck_monto CHECK (monto > 0)
);

CREATE TABLE transferencias_externas(
  id SERIAL NOT NULL,
  movimiento INT NOT NULL,
  entidad VARCHAR(20) NOT NULL,
  cuenta VARCHAR(15) NOT NULL,
  carga BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT transferencias_externas_pk PRIMARY KEY (id)
);

CREATE TABLE bolsillos(
  id SERIAL NOT NULL,
  cuenta INT NOT NULL,
  nombre VARCHAR(20) NOT NULL,
  saldo DECIMAL(16, 2) NOT NULL DEFAULT 0,
  saldo_objetivo DECIMAL(16, 2) NULL,
  eliminado BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT bolsillos_pk PRIMARY KEY (id),
  CONSTRAINT bolsillos_ck_saldo CHECK (saldo >= 0),
  CONSTRAINT bolsillos_ck_saldo_objetivo CHECK (saldo_objetivo > 0)
);

CREATE TABLE transferencias_bolsillos(
  id SERIAL NOT NULL,
  movimiento INT NOT NULL,
  bolsillo INT NOT NULL,
  carga BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT transferencias_bolsillos_pk PRIMARY KEY (id)
);

CREATE TABLE cdts(
  id SERIAL NOT NULL,
  cuenta INT NOT NULL,
  inversion DECIMAL(16, 2) NOT NULL,
  interes DECIMAL(5, 2) NOT NULL,
  retencion DECIMAL(5, 2) NOT NULL,
  duracion SMALLINT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  liquidado BOOLEAN NOT NULL DEFAULT FALSE,
  cancelado BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT cdts_pk PRIMARY KEY (id),
  CONSTRAINT cdts_ck_inversion CHECK (inversion > 0),
  CONSTRAINT cdts_ck_interes CHECK (interes >= 0),
  CONSTRAINT cdts_ck_retencion CHECK (
    retencion >= 0
    AND retencion <= 100
  ),
  CONSTRAINT cdts_ck_duracion CHECK (duracion > 0)
);

CREATE TABLE transferencias_cdts(
  id SERIAL NOT NULL,
  movimiento INT NOT NULL,
  cdt INT NOT NULL,
  tipo VARCHAR(15) NOT NULL,
  CONSTRAINT transferencias_cdts_pk PRIMARY KEY (id),
  CONSTRAINT transferencias_cdts_ck_tipo CHECK (tipo IN ('inversion', 'liquidacion', 'cancelacion'))
);

--
-- RELACIONES ENTRE TABLAS
--
ALTER TABLE
  registros_actividad
ADD
  CONSTRAINT registros_actividad_fk_cuenta FOREIGN KEY (cuenta) REFERENCES cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  movimientos
ADD
  CONSTRAINT movimientos_fk_cuenta FOREIGN KEY (cuenta) REFERENCES cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  transferencias_externas
ADD
  CONSTRAINT transferencias_externas_fk_movimiento FOREIGN KEY (movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  bolsillos
ADD
  CONSTRAINT bolsillos_fk_cuenta FOREIGN KEY (cuenta) REFERENCES cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  transferencias_bolsillos
ADD
  CONSTRAINT transferencias_bolsillos_fk_movimiento FOREIGN KEY (movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  transferencias_bolsillos
ADD
  CONSTRAINT transferencias_bolsillos_fk_bolsillo FOREIGN KEY (bolsillo) REFERENCES bolsillos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  cdts
ADD
  CONSTRAINT cdts_fk_cuenta FOREIGN KEY (cuenta) REFERENCES cuentas(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  transferencias_cdts
ADD
  CONSTRAINT transferencias_cdts_fk_movimiento FOREIGN KEY (movimiento) REFERENCES movimientos(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE
  transferencias_cdts
ADD
  CONSTRAINT transferencias_cdts_fk_cdt FOREIGN KEY (cdt) REFERENCES cdts(id) ON UPDATE RESTRICT ON DELETE RESTRICT;