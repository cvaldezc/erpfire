BEGIN;

-- CREATE FUNCTION "sp_boleta2$$1043_1043_1043" ----------------
CREATE OR REPLACE FUNCTION public.sp_boleta2(b_opcion CHARACTER VARYING, b_cod CHARACTER VARYING, b_per CHARACTER VARYING)
 RETURNS SETOF boleta_cabprinc
 LANGUAGE plpgsql
AS $function$
BEGIN
 IF B_OPCION = 'per' THEN
	return query SELECT * FROM boleta_cabprinc
	WHERE periodo=B_COD;
 END IF;
 IF B_OPCION = 'dni' THEN
	return query SELECT * FROM boleta_cabprinc
	WHERE idcabpr=B_COD;	
 END IF;
 IF B_OPCION = 'nomb' THEN
	return query SELECT * FROM boleta_cabprinc
	WHERE nombres LIKE '%'||B_COD||'%';
 END IF;
 IF B_OPCION = 'pernom' THEN
	return query SELECT * FROM boleta_cabprinc
	WHERE periodo=B_PER AND nombres LIKE '%'||B_COD||'%';
 END IF;
END;
$function$;
-- -------------------------------------------------------------
-- CREATE FUNCTION "sp_changerateexchangeproject$$1043_1043_701" 
CREATE OR REPLACE FUNCTION public.sp_changerateexchangeproject(CHARACTER VARYING, CHARACTER VARYING, DOUBLE PRECISION)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  x operations_metproject%ROWTYPE;
BEGIN
  FOR x IN SELECT * FROM operations_metproject WHERE proyecto_id LIKE $1 AND sector_id LIKE $1 LOOP
    RAISE NOTICE 'edad sorteada: %', x;
    UPDATE operations_metproject SET precio = (x.precio * $3), sales = (x.sales * $3) WHERE proyecto_id LIKE $1 AND subproyecto_id LIKE $2 AND sector_id LIKE $3 AND materiales_id LIKE x.materiales_id;
  END LOOP;
END;
$function$;
-- CREATE FUNCTION "sp_almacen_registerperiod$$1042_1042_1042" -
CREATE OR REPLACE FUNCTION public.sp_almacen_registerperiod(CHARACTER, CHARACTER, CHARACTER)
 RETURNS BOOLEAN
 LANGUAGE plpgsql
AS $function$
DECLARE count INTEGER;
DECLARE sts BOOLEAN;
BEGIN
-- Delete inventory of this period
DELETE FROM almacen_inventario WHERE periodo LIKE to_char(now(),'YYYY');
-- Performing INSERT SELECT FROM home_materiale
INSERT INTO almacen_inventario(materiales_id, almacen_id, precompra, preventa, stkmin, stock, 
stkpendiente, stkdevuelto, periodo, ingreso, compra_id, spptag, flag)
SELECT materiales_id, COALESCE($1,''), precompra, preventa, stkmin, stock, stkpendiente, stkdevuelto, to_char(now(),'YYYY'), ingreso, compra_id, spptag, flag FROM almacen_inventario
WHERE periodo LIKE $2 AND almacen_id LIKE $3;
-- Verify if realized the insert.
count := (SELECT COUNT(*) FROM almacen_inventario WHERE periodo = to_char(now(),'YYYY') LIMIT 10 );
IF count > 0 THEN
    sts := TRUE;
ELSE
    sts := FALSE;
END IF;
RETURN sts;
END; 
$function$;
-- -------------------------------------------------------------
COMMIT;
