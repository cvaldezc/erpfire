CREATE OR REPLACE FUNCTION proc_change_stguiaherramienta()
  RETURNS trigger AS
$BODY$
DECLARE
  _catrue INTEGER := 0;
  _cadetnguia INTEGER := 0;
  _status CHAR(7) := '';
BEGIN
  _catrue := (SELECT COUNT(*) FROM almacen_detguiaherramienta WHERE guia_id = NEW.guia_id AND flagdev = True);
  _cadetnguia := (SELECT COUNT(*) FROM almacen_detguiaherramienta WHERE guia_id = NEW.guia_id);
  CASE
    WHEN _catrue = _cadetnguia THEN _status := 'DEVCOMP';
    WHEN _catrue < _cadetnguia THEN _status := 'GE';
  END CASE;
  UPDATE almacen_guiaherramienta SET estado = _status WHERE guia_id = NEW.guia_id;
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER change_stguiaherramienta_trigger
AFTER UPDATE ON almacen_detguiaherramienta
FOR EACH ROW
EXECUTE PROCEDURE proc_change_stguiaherramienta();
----------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION proc_change_stdetguiahe()
  RETURNS trigger AS
$BODY$
BEGIN
  NEW.flagdev := CASE WHEN NEW.cantidad = NEW.cantdev THEN 'TRUE'
			WHEN NEW.cantidad != NEW.cantdev THEN 'FALSE'
  END;

RETURN NEW;
END $BODY$
  LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER change_stdetguiahe_trigger
BEFORE INSERT OR UPDATE ON almacen_detguiaherramienta
FOR EACH ROW
EXECUTE PROCEDURE proc_change_stdetguiahe();
----------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------
------UPDATE DETCOMPRA(CANTIDAD Y FLAG) AND COMPRA(STATUS)-------
CREATE OR REPLACE FUNCTION proc_change_status_detcompra_op()
  RETURNS trigger AS
$BODY$
DECLARE
  reg RECORD;
  quantity NUMERIC;
  qconvert NUMERIC := 0;
  tag CHAR;
  buy varchar(10);
  tipo varchar(2);
  complete INTEGER:=0;
  total INTEGER:=0;
  _status CHAR(2) := '';
BEGIN
  tipo = (SELECT co.tipoing FROM almacen_notaingresohe c
	   INNER JOIN almacen_detingresohe det
	   ON c.ingresohe_id=det.ingresohe_id
	   INNER JOIN logistica_compra co
	   ON c.compra_id=co.compra_id
	   WHERE c.ingresohe_id=NEW.ingresohe_id LIMIT 1);

  IF tipo='MA' THEN
     buy := (SELECT purchase_id FROM almacen_noteingress WHERE ingress_id = NEW.ingress_id LIMIT 1);
     SELECT INTO reg * FROM logistica_detcompra WHERE compra_id = buy AND materiales_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id;
     qconvert := (NEW.quantity  / NEW.convertto);
  ELSE
     buy := (SELECT compra_id FROM almacen_notaingresohe WHERE ingresohe_id = NEW.ingresohe_id LIMIT 1);
     SELECT INTO reg * FROM logistica_detcompra WHERE compra_id = buy AND materiales_id = NEW.herramienta_id AND brand_id = NEW.marca_id;
     qconvert := (NEW.cantidad  / NEW.convertto);
  END IF;

  IF FOUND THEN
    -- 2016-11-28 08:44:58 Change by implement fields convert in detcompra for not throw exception
    quantity := ROUND((reg.cantidad - qconvert)::NUMERIC, 2);
    CASE WHEN quantity = 0 THEN tag := '2';
          WHEN (quantity >= 0.1) AND (quantity < reg.cantstatic) THEN tag := '1';
          WHEN (quantity = reg.cantstatic) THEN tag := '0';
    END CASE;
    IF quantity < 0 THEN
      quantity := 0;
    END IF;
    IF tipo='MA' THEN
       UPDATE logistica_detcompra SET flag = tag, cantidad = quantity
       WHERE compra_id = buy AND materiales_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id;
    ELSE
       UPDATE logistica_detcompra SET flag = tag, cantidad = quantity
       WHERE compra_id = buy AND materiales_id = NEW.herramienta_id AND brand_id = NEW.marca_id;
    END IF;

    -- update compra(status)
    complete := (SELECT COUNT(*) FROM logistica_detcompra WHERE compra_id = buy AND flag = '2');
    total := (SELECT COUNT(*) FROM logistica_detcompra WHERE compra_id = buy);
    CASE
       WHEN complete = total THEN _status := 'CO';
       WHEN complete < total THEN _status := 'IN';
       ELSE _status := 'PE';
    END CASE;
    UPDATE logistica_compra SET status = _status WHERE compra_id = buy;
    --
  END IF;
  RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE

CREATE TRIGGER change_stdetcompra_trigger
AFTER INSERT ON almacen_detingresohe
FOR EACH ROW
EXECUTE PROCEDURE proc_change_status_detcompra_op()
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
----UPDATE INVENTARIO---
CREATE OR REPLACE FUNCTION proc_add_inventariohe_detnoteingress_op()
  RETURNS trigger AS
$BODY$
DECLARE
  _stock DOUBLE PRECISION := 0;
  _invbrand RECORD;
  _tipo VARCHAR(2);
BEGIN
  _tipo = (SELECT co.tipoing FROM almacen_notaingresohe c
	   INNER JOIN almacen_detingresohe det
	   ON c.ingresohe_id=det.ingresohe_id
	   INNER JOIN logistica_compra co
	   ON c.compra_id=co.compra_id
	   WHERE c.ingresohe_id=NEW.ingresohe_id LIMIT 1);
  IF _tipo = 'MA' THEN
     SELECT INTO _invbrand * FROM almacen_inventorybrand WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id;
     IF FOUND THEN
     -- update old
       _stock := ROUND((_invbrand.stock + NEW.quantity)::NUMERIC, 2);
       UPDATE almacen_inventorybrand SET stock = _stock, purchase = NEW.purchase, sale = NEW.purchase
       WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id;
     ELSE
     -- insert new
       INSERT INTO almacen_inventorybrand(storage_id, period, materials_id, brand_id, model_id, ingress, stock, purchase, sale, flag)
       VALUES('AL01', TO_CHAR(current_date, 'YYYY'), NEW.materials_id, NEW.brand_id, NEW.model_id, now(), ROUND(NEW.quantity::NUMERIC, 2), NEW.purchase, NEW.sales, true);
     END IF;

  ELSE
     SELECT INTO _invbrand * FROM almacen_inventarioherra WHERE herramienta_id = NEW.herramienta_id AND marca_id = NEW.marca_id;
     IF FOUND THEN
     -- update old
       _stock := ROUND((_invbrand.cantalmacen + NEW.cantidad)::NUMERIC, 2);
       UPDATE almacen_inventarioherra SET cantalmacen = _stock
       WHERE herramienta_id = NEW.herramienta_id AND marca_id = NEW.marca_id;
     END IF;
  END IF;
RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE

CREATE TRIGGER change_inventariohe_trigger
AFTER INSERT
ON almacen_detingresohe
FOR EACH ROW
EXECUTE PROCEDURE proc_add_inventariohe_detnoteingress_op();
-----------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------
------DELETE NOTA >> UPDATE DETCOMPRA,COMPRA E INVENTARIOHERRA-----
CREATE OR REPLACE FUNCTION proc_change_status_notaingresohe_op()
  RETURNS trigger AS
$BODY$
DECLARE
  x RECORD;
  _quantity NUMERIC;
  _tag CHAR;
  _estado varchar(2);
  _cantco NUMERIC :=0;
  _cantst NUMERIC :=0;
  _stock NUMERIC :=0;
  _sttotal NUMERIC:=0;
  _total NUMERIC :=0;
  _compra varchar(10);
  _complete INTEGER:=0;
  _totalreg INTEGER:=0;
  _status CHAR(2) :='';
BEGIN
     _estado :=(SELECT estado FROM almacen_notaingresohe WHERE ingresohe_id=NEW.ingresohe_id);
     IF _estado = 'AN' THEN
	_compra :=(SELECT compra_id FROM almacen_notaingresohe WHERE ingresohe_id=NEW.ingresohe_id);
	FOR x IN (SELECT * FROM almacen_detingresohe WHERE ingresohe_id = NEW.ingresohe_id)
	LOOP
	   --get data detcompra
	   _cantco=(SELECT cantidad FROM logistica_detcompra
	           WHERE compra_id=_compra AND materiales_id=x.herramienta_id AND brand_id=x.marca_id);
	   _cantst=(SELECT cantstatic FROM logistica_detcompra
	           WHERE compra_id=_compra AND materiales_id=x.herramienta_id AND brand_id=x.marca_id);

	   _quantity := ROUND((x.cantidad / x.convertto)::NUMERIC, 2);
	   _total:=ROUND((_cantco + _quantity)::NUMERIC,2);
	   ----------------------
	   --get data inventarioherra
	   _stock=(SELECT cantalmacen FROM almacen_inventarioherra
	           WHERE herramienta_id=x.herramienta_id AND marca_id=x.marca_id);
	   _sttotal:=ROUND((_stock - x.cantidad)::NUMERIC,2);
	   --------------------------
	   CASE WHEN _total = 0 THEN _tag := '2';
              WHEN (_total >= 0.1) AND (_total < _cantst) THEN _tag := '1';
              ELSE _tag := '0';
           END CASE;

	   UPDATE logistica_detcompra set cantidad=_total,flag=_tag
           WHERE compra_id=_compra AND materiales_id=x.herramienta_id AND brand_id=x.marca_id;

           UPDATE almacen_inventarioherra set cantalmacen=_sttotal
           WHERE herramienta_id=x.herramienta_id AND marca_id=x.marca_id;
	END LOOP;

	--update compra
	_complete := (SELECT COUNT(*) FROM logistica_detcompra WHERE compra_id = _compra AND flag = '2');
        _totalreg := (SELECT COUNT(*) FROM logistica_detcompra WHERE compra_id = _compra);
        CASE
           WHEN _complete = _totalreg THEN _status := 'CO';
           WHEN _complete < _totalreg THEN _status := 'IN';
           ELSE _status := 'PE';
        END CASE;
        UPDATE logistica_compra SET status = _status WHERE compra_id = _compra;
        ------------------
     END IF;
     RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER change_stnotaingresohe_trigger
AFTER  UPDATE ON almacen_notaingresohe
FOR EACH ROW
EXECUTE PROCEDURE proc_change_status_notaingresohe_op();
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
-- DELETE NEED
delete from almacen_detguiaherramienta;
delete from almacen_detguiaherramienta;
delete from almacen_movinventario;
delete from almacen_inventarioherra;
delete from almacen_detdevherramienta;
