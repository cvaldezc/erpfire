------------------------------------------------------------------------------
-- @Juan Julcapari 2017-07-17 12:54:27
------------------------------------------------------------------------------
-- alter storage guide materials niples
CREATE OR REPLACE FUNCTION proc_suma_cantdetguiadevmat()
  RETURNS trigger AS
$BODY$
DECLARE
  _cant DOUBLE PRECISION :=0;
  _cantfinal DOUBLE PRECISION := 0;
  _cantdevmat DOUBLE PRECISION := 0;
BEGIN

  _cant := (SELECT cantidad FROM almacen_detguiadevmat WHERE guiadevmat_id = NEW.guiadevmat_id and material_id=NEW.material_id and marca_id=NEW.marca_id and model_id=NEW.model_id);

  IF EXISTS (SELECT guiadevmat_id, material_id,marca_id,model_id FROM almacen_detguiadevmat WHERE guiadevmat_id = NEW.guiadevmat_id and material_id=NEW.material_id and marca_id=NEW.marca_id and model_id=NEW.model_id) THEN
	_cantfinal := _cant + ((NEW.metrado/100)*NEW.cantidad);
	UPDATE almacen_detguiadevmat SET cantidad = _cantfinal WHERE guiadevmat_id = NEW.guiadevmat_id and material_id=NEW.material_id and marca_id=NEW.marca_id and model_id=NEW.model_id;
  ELSE
	_cantdevmat := (NEW.metrado/100)*NEW.cantidad;
	INSERT INTO almacen_detguiadevmat(guiadevmat_id,material_id,marca_id,model_id,cantidad,motivo,comentario,guia_id) values (NEW.guiadevmat_id,NEW.material_id,NEW.marca_id,NEW.model_id,_cantdevmat,'','',NEW.guia_id);
  END IF;
  RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql VOLATILE

CREATE TRIGGER suma_cantdetguiadevmat_trigger
AFTER INSERT OR UPDATE ON almacen_guiadevmatniple
FOR EACH ROW
EXECUTE PROCEDURE proc_suma_cantdetguiadevmat()
-- /* endblock */
------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION proc_change_stdsmetrado()
  RETURNS trigger AS
$BODY$
BEGIN
  NEW.stcantdev:= CASE WHEN NEW.quantity = NEW.cantdev THEN 'TRUE'
		       WHEN NEW.quantity != NEW.cantdev THEN 'FALSE'
  END;

RETURN NEW;
END $BODY$
  LANGUAGE plpgsql VOLATILE

CREATE TRIGGER change_stdsmetrado_trigger
BEFORE UPDATE ON operations_dsmetrado
FOR EACH ROW
EXECUTE PROCEDURE proc_change_stdsmetrado()
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION proc_change_stopernipple()
  RETURNS trigger AS
$BODY$
BEGIN
  NEW.stcantenvnip:= CASE WHEN NEW.cantenvnip = '0' THEN '0'
			  WHEN NEW.cantenvnip < NEW.cantidad and NEW.cantenvnip !='0' THEN '1'
			  WHEN NEW.cantenvnip = NEW.cantidad THEN '2'
  END;
RETURN NEW;
END $BODY$
  LANGUAGE plpgsql VOLATILE

CREATE TRIGGER change_stopernipple_trigger
BEFORE UPDATE ON operations_nipple
FOR EACH ROW
EXECUTE PROCEDURE proc_change_stopernipple()
----------------------------------------------------------------------------------
---------------------------------------------
CREATE OR REPLACE FUNCTION proc_change_stdevmatdetniple()
  RETURNS trigger AS
$BODY$
BEGIN
  NEW.flagcenvdevmat := CASE WHEN NEW.cantidad = NEW.cenvdevmat THEN 'TRUE'
			     WHEN NEW.cantidad != NEW.cenvdevmat THEN 'FALSE'
  END;

RETURN NEW;
END $BODY$
  LANGUAGE plpgsql VOLATILE

CREATE TRIGGER change_stdevmatdetniple_trigger
BEFORE UPDATE ON almacen_niple
FOR EACH ROW
EXECUTE PROCEDURE proc_change_stdevmatdetniple()
------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION proc_change_stdevdetgrem()
  RETURNS trigger AS
$BODY$
BEGIN
  NEW.stcantdev := CASE WHEN NEW.cantguide = NEW.cantdev THEN 'TRUE'
			WHEN NEW.cantguide != NEW.cantdev THEN 'FALSE'
  END;

RETURN NEW;
END $BODY$
  LANGUAGE plpgsql VOLATILE

CREATE TRIGGER change_stdevdetgrem_trigger
BEFORE UPDATE ON almacen_detguiaremision
FOR EACH ROW
EXECUTE PROCEDURE proc_change_stdevdetgrem()
----------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION proc_delete_detguiadevmat()
  RETURNS trigger AS
$BODY$
DECLARE

BEGIN
  DELETE FROM almacen_detguiadevmat WHERE cantidad=0;

  RETURN null;
END;
$BODY$
LANGUAGE plpgsql VOLATILE

CREATE TRIGGER del_detguiadevmat_trigger
AFTER UPDATE ON almacen_detguiadevmat
FOR EACH ROW
EXECUTE PROCEDURE proc_delete_detguiadevmat()
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION proc_delete_guiadevmat()
  RETURNS trigger AS
$BODY$
DECLARE
  _cantrow INTEGER := 0;
  _status char(2):='';
BEGIN
  _cantrow := (SELECT COUNT(*) FROM almacen_detguiadevmat WHERE guiadevmat_id = OLD.guiadevmat_id);
  CASE
    WHEN _cantrow = 0 THEN _status :='AN';
    WHEN _cantrow > 0 THEN _status :='PE';
  END CASE;
  UPDATE almacen_guiadevmat SET estado = _status WHERE guiadevmat_id = OLD.guiadevmat_id;
  RETURN OLD;
END;
$BODY$
 LANGUAGE plpgsql VOLATILE

CREATE TRIGGER del_guiadevmat_trigger
AFTER DELETE ON almacen_detguiadevmat
FOR EACH ROW
EXECUTE PROCEDURE proc_delete_guiadevmat()