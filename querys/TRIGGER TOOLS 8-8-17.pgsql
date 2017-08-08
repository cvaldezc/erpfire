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
------------------ -----------------------------------------------
-- UPDATE FUNCITION 2017-08-08 08:41:21 @Juan Julcapari
------------------------------------------------------------------
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

  IF tipo='MT' THEN
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
    IF tipo='MT' THEN
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
  LANGUAGE plpgsql VOLATILE;

CREATE TRIGGER change_stdetcompra_trigger
AFTER INSERT ON almacen_detingresohe
FOR EACH ROW
EXECUTE PROCEDURE proc_change_status_detcompra_op()
-- ENDBLOCK UPDATE
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
----UPDATE INVENTARIO---
--------------------------------------------------------------------------------
--- UPDATE 2017-08-08 08:42:51 @Juan Julcapari
--------------------------------------------------------------------------------
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
  IF _tipo = 'MT' THEN
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
     SELECT INTO _invbrand * FROM almacen_inventarioherra WHERE herramienta_id = NEW.herramienta_id;
     IF FOUND THEN
     -- update old
       _stock := ROUND((_invbrand.cantalmacen + NEW.cantidad)::NUMERIC, 2);
       UPDATE almacen_inventarioherra SET cantalmacen = _stock
       WHERE herramienta_id = NEW.herramienta_id;
     END IF;
  END IF;
RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;
-------------------------------------------------------------------------------
-- ENDBLOCK
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
-- DELETE NEED before run trigger
delete from almacen_detguiaherramienta;
delete from almacen_detguiaherramienta;
delete from almacen_movinventario;
delete from almacen_inventarioherra;
delete from almacen_detdevherramienta;
-------------------------------------------------------------------------------
-------------------------------------------------------------------------------
-- INSERT ADD FUNCTIONS 2017-08-08 08:45:48 @cvaldezch
-------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_guiaherra(IN _codguia character varying)
  RETURNS TABLE(salidmonth text, motivoguia text, codguia character varying, codproy character varying, saliday text, salidyear text, comentguia character varying, transpruc character varying, transname character varying, placa character varying, marcatransp character varying, incripcond character varying, numlicencia character varying, apegenerado character varying, namegenerado character varying, estadoguia character varying, nameproy character varying, ruccliente character varying, direcproy character varying, rsocialcliente character varying, distritoproy character varying, provinciaproy character varying, departproy character varying) AS
$BODY$
DECLARE
 _codproy char(7);
BEGIN
    _codproy=(SELECT proyecto_id FROM almacen_guiaherramienta WHERE guia_id=_codguia);
    IF _codproy <> '' THEN
	return query
	select
	   CASE to_char(gh.fechsalida, 'MM')
		WHEN '01'  THEN 'ENERO'
		WHEN '02' THEN 'FEBRERO'
		WHEN '03' THEN 'MARZO'
		WHEN '04' THEN 'ABRIL'
		WHEN '05' THEN 'MAYO'
		WHEN '06' THEN 'JUNIO'
		WHEN '07' THEN 'JULIO'
		WHEN '08' THEN 'AGOSTO'
		WHEN '09' THEN 'SEPTIEMBRE'
		WHEN '10' THEN 'OCTUBRE'
		WHEN '11' THEN 'NOVIEMBRE'
		WHEN '12' THEN 'DICIEMBRE'
	   END as salidmonth,
	   CASE gh.motivo
		WHEN 'AL' THEN 'ALMACEN'
		ELSE 'TRASLADO'
		END as motivoguia,
	gh.guia_id as codguia,
	gh.proyecto_id as codproy,
	to_char(gh.fechsalida, 'dd') as saliday,
	to_char(gh.fechsalida,'YY') as salidyear,
	gh.comentario as comentguia,
	trans.traruc_id as transpruc,
	trans.tranom as transname,
	tr.nropla_id as placa,
	tr.marca as marcatransp,
	cond.coninscription as incripcond,
	cond.conlic as numlicencia,
	emp.lastname as apegenerado,
	emp.firstname as namegenerado,
	gh.estado as estadoguia,
	proy.nompro as nameproy,
	proy.ruccliente_id as ruccliente,
	proy.direccion as direcproy,
	cli.razonsocial as rsocialcliente,
	dist.distnom as distritoproy,
	prov.pronom as provinciaproy,
	dep.depnom as departproy
	from almacen_guiaherramienta gh
	inner join home_transportista trans
	on gh.traruc_id = trans.traruc_id
	inner join home_transporte tr
	on gh.nropla_id = tr.nropla_id
	inner join home_conductore cond
	on gh.condni_id = cond.condni_id
	inner join home_employee emp
	on emp.empdni_id=gh.empdni_id
	inner join ventas_proyecto proy
	on gh.proyecto_id = proy.proyecto_id
	inner join home_cliente cli
	on proy.ruccliente_id = cli.ruccliente_id
	inner join home_distrito dist
	on dist.distrito_id = proy.distrito_id
	inner join home_provincia prov
	on prov.provincia_id = proy.provincia_id
	inner join home_departamento dep
	on dep.departamento_id = proy.departamento_id
	where gh.guia_id = _codguia;

    ELSE
	return query
	select
	   CASE to_char(gh.fechsalida, 'MM')
		WHEN '01'  THEN 'ENERO'
		WHEN '02' THEN 'FEBRERO'
		WHEN '03' THEN 'MARZO'
		WHEN '04' THEN 'ABRIL'
		WHEN '05' THEN 'MAYO'
		WHEN '06' THEN 'JUNIO'
		WHEN '07' THEN 'JULIO'
		WHEN '08' THEN 'AGOSTO'
		WHEN '09' THEN 'SEPTIEMBRE'
		WHEN '10' THEN 'OCTUBRE'
		WHEN '11' THEN 'NOVIEMBRE'
		WHEN '12' THEN 'DICIEMBRE'
		END as salidmonth,
	   CASE gh.motivo
		WHEN 'AL' THEN 'ALMACEN'
		ELSE 'TRASLADO'
		END as motivoguia,
	gh.guia_id as codguia,
	gh.proyecto_id as codproy,
	to_char(gh.fechsalida, 'dd') as saliday,
	to_char(gh.fechsalida,'YY') as salidyear,
	gh.comentario as comentguia,
	trans.traruc_id as transpruc,
	trans.tranom as transname,
	tr.nropla_id as placa,
	tr.marca as marcatransp,
	cond.coninscription as incripcond,
	cond.conlic as numlicencia,
	emp.lastname as apegenerado,
	emp.firstname as namegenerado,
	gh.estado as estadoguia,
	''::varchar,''::varchar,''::varchar,''::varchar,''::varchar,''::varchar,''::varchar
	from almacen_guiaherramienta gh
	inner join home_transportista trans
	on gh.traruc_id = trans.traruc_id
	inner join home_transporte tr
	on gh.nropla_id = tr.nropla_id
	inner join home_conductore cond
	on gh.condni_id = cond.condni_id
	inner join home_employee emp
	on emp.empdni_id=gh.empdni_id
	where gh.guia_id = _codguia;
    END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;
--------------------------------------------------------------------------------
-- END BLOCK
--------------------------------------------------------------------------------
--------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION sp_guiaherradev(IN _codguiadev character varying)
  RETURNS TABLE(fechmonth text, fechday text, fechyear text, numdoc character varying, comentdev character varying, cantidadhe double precision, estadohe character varying, comenhe character varying, licencia character varying, numinscription character varying, placa character varying, marcatr character varying, ructransp character varying, nametransp character varying, namehe character varying, medhe character varying, codguia character varying, estadodet character varying, branhe character varying, unidadhe character varying, apegenerate character varying, namegenerate character varying, codproy character varying, nameproy character varying, direcproy character varying, distproy character varying, provproy character varying, dptproy character varying) AS
$BODY$
DECLARE
 _codproy char(7);
BEGIN
    _codproy=(SELECT gh.proyecto_id
	      FROM almacen_devolucionherra c
	      INNER JOIN almacen_detdevherramienta det
	      ON c.docdev_id = det.docdev_id
	      INNER JOIN almacen_guiaherramienta gh
	      ON gh.guia_id = det.guia_id
	      WHERE c.docdev_id=_codguiadev LIMIT 1);

    IF _codproy <> '' THEN
	return query
	   select
	      CASE to_char(dh.fechretorno, 'MM')
		WHEN '01'  THEN 'ENERO'
		WHEN '02' THEN 'FEBRERO'
		WHEN '03' THEN 'MARZO'
		WHEN '04' THEN 'ABRIL'
		WHEN '05' THEN 'MAYO'
		WHEN '06' THEN 'JUNIO'
		WHEN '07' THEN 'JULIO'
		WHEN '08' THEN 'AGOSTO'
		WHEN '09' THEN 'SEPTIEMBRE'
		WHEN '10' THEN 'OCTUBRE'
		WHEN '11' THEN 'NOVIEMBRE'
		WHEN '12' THEN 'DICIEMBRE'
	      END as fechmonth,

	   to_char(dh.fechretorno, 'dd') as fechday,
	   to_char(dh.fechretorno,'YY') as fechyear,
	   dh.docdev_id as numdoc,
	   dh.comentario as comentdev,
	   deth.cantidad as cantidadhe,
	   deth.estado as estadohe, --OK,REPARACION,DEBAJA
	   deth.comentario as comenhe,
	   cond.conlic as licencia,
	   cond.coninscription as numinscription,
	   tr.nropla_id as placa,
	   tr.marca as marcatr,
	   trans.traruc_id as ructransp,
	   trans.tranom as nametransp,
	   he.matnom as namehe,
	   he.matmed as medhe,
	   gh.guia_id as codguia,
	   detgh.estado as estadodet, --ALMACEN,ALQUILER,
	   br.brand as branhe,
	   un.uninom as unidadhe,
	   emp.lastname as apegenerate,
	   emp.firstname as namegenerate,
	   proy.proyecto_id as codproy,
	   proy.nompro as nameproy,
	   proy.direccion as direcproy,
	   dist.distnom as distproy,
	   prov.pronom as provproy,
	   dpt.depnom as dptproy
	   from
	   almacen_devolucionherra dh inner join
	   almacen_detdevherramienta deth on
	   dh.docdev_id = deth.docdev_id inner join
	   home_conductore cond on
	   dh.condni_id = cond.condni_id inner join
	   home_transporte tr on
	   dh.nropla_id = tr.nropla_id inner join
	   home_transportista trans on
	   dh.traruc_id = trans.traruc_id inner join
	   home_materiale he on
	   deth.herramienta_id = he.materiales_id inner join
	   almacen_guiaherramienta gh on
	   deth.guia_id = gh.guia_id inner join
	   almacen_detguiaherramienta detgh on
	   detgh.guia_id=gh.guia_id  and detgh.herramienta_id=deth.herramienta_id and detgh.brand_id=deth.brand_id inner join
	   ventas_proyecto proy on
	   gh.proyecto_id = proy.proyecto_id inner join
	   home_brand br on
	   deth.brand_id = br.brand_id inner join
	   home_unidade un on
	   he.unidad_id = un.unidad_id inner join
	   home_employee emp on
	   dh.empdni_id=emp.empdni_id inner join
	   home_distrito dist on
	   proy.distrito_id = dist.distrito_id inner join
	   home_provincia prov on
	   proy.provincia_id = prov.provincia_id inner join
	   home_departamento dpt on
	   proy.departamento_id = dpt.departamento_id
	   where dh.docdev_id = _codguiadev order by namehe;

    ELSE
	return query
	   select
	      CASE to_char(dh.fechretorno, 'MM')
		WHEN '01'  THEN 'ENERO'
		WHEN '02' THEN 'FEBRERO'
		WHEN '03' THEN 'MARZO'
		WHEN '04' THEN 'ABRIL'
		WHEN '05' THEN 'MAYO'
		WHEN '06' THEN 'JUNIO'
		WHEN '07' THEN 'JULIO'
		WHEN '08' THEN 'AGOSTO'
		WHEN '09' THEN 'SEPTIEMBRE'
		WHEN '10' THEN 'OCTUBRE'
		WHEN '11' THEN 'NOVIEMBRE'
		WHEN '12' THEN 'DICIEMBRE'
	      END as fechmonth,

	   to_char(dh.fechretorno, 'dd') as fechday,
	   to_char(dh.fechretorno,'YY') as fechyear,
	   dh.docdev_id as numdoc,
	   dh.comentario as comentdev,
	   deth.cantidad as cantidadhe,
	   deth.estado as estadohe, --OK,REPARACION,DEBAJA
	   deth.comentario as comenhe,
	   cond.conlic as licencia,
	   cond.coninscription as numinscription,
	   tr.nropla_id as placa,
	   tr.marca as marcatr,
	   trans.traruc_id as ructransp,
	   trans.tranom as nametransp,
	   he.matnom as namehe,
	   he.matmed as medhe,
	   gh.guia_id as codguia,
	   detgh.estado as estadodet, --ALMACEN,ALQUILER,
	   br.brand as branhe,
	   un.uninom as unidadhe,
	   emp.lastname as apegenerate,
	   emp.firstname as namegenerate,
	   ''::varchar,''::varchar,''::varchar,''::varchar,''::varchar,''::varchar
	   from
	   almacen_devolucionherra dh inner join
	   almacen_detdevherramienta deth on
	   dh.docdev_id = deth.docdev_id inner join
	   home_conductore cond on
	   dh.condni_id = cond.condni_id inner join
	   home_transporte tr on
	   dh.nropla_id = tr.nropla_id inner join
	   home_transportista trans on
	   dh.traruc_id = trans.traruc_id inner join
	   home_materiale he on
	   deth.herramienta_id = he.materiales_id inner join
	   almacen_guiaherramienta gh on
	   deth.guia_id = gh.guia_id inner join
	   almacen_detguiaherramienta detgh on
	   detgh.guia_id=gh.guia_id  and detgh.herramienta_id=deth.herramienta_id and detgh.brand_id=deth.brand_id inner join
	   home_brand br on
	   deth.brand_id = br.brand_id inner join
	   home_unidade un on
	   he.unidad_id = un.unidad_id inner join
	   home_employee emp on
	   dh.empdni_id=emp.empdni_id
	   where dh.docdev_id = _codguiadev order by namehe;

    END IF;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE;
--------------------------------------------------------------------------------
-- END BLOCK 2017-08-08 08:46:38
--------------------------------------------------------------------------------
