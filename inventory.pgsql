/*
### STORES PROCEDURES
*/
-- DROP FUNCTION proc_erase_all_inventory()
CREATE OR REPLACE FUNCTION proc_erase_all_inventory()
  RETURNS BOOLEAN AS
$body$
BEGIN
    DELETE FROM almacen_inventoryBrand;
    DELETE FROM almacen_inventario;
    RETURN true;
  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      RETURN FALSE;
END;
$body$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE OR REPLACE FUNCTION proc_erase_all_balance()
  RETURNS BOOLEAN AS
$$
BEGIN
DELETE FROM almacen_balance;
RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
  ROLLBACK;
  RETURN FALSE;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;

-- DROP TRIGGER tr_register_new_balance ON almacen_inventorybrand;

-- FUNCTION ADD ITEMS ON TABLE MATERIALS
CREATE OR REPLACE FUNCTION proc_verify_insert_materials()
  RETURNS TRIGGER AS
$BODY$
BEGIN
  IF EXISTS(SELECT * FROM home_materiale WHERE materiales_id LIKE NEW.materiales_id) THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_valid_exists_material
BEFORE INSERT ON home_materiale
FOR EACH ROW EXECUTE PROCEDURE proc_verify_insert_materials();

-- FUNCTION INCREMENT STOCK WHEN INSERT TABLE INVENTORYBRAND
CREATE OR REPLACE FUNCTION PROC_input_inventory_after_inventorybrand()
  RETURNS trigger AS
$BODY$
DECLARE
  _stock double precision := 0;
  _stkold DOUBLE PRECISION := 0;
  raw RECORD;
BEGIN
    _stock := NEW.stock;
    IF EXISTS( SELECT * FROM almacen_inventario WHERE materiales_id LIKE NEW.materials_id) THEN
      IF TG_OP = 'INSERT' THEN
        _stock := (SELECT SUM(stock) FROM almacen_inventoryBrand WHERE materials_id LIKE NEW.materials_id);
        UPDATE almacen_inventario SET stock = ROUND(_stock::NUMERIC, 2)
        WHERE materiales_id LIKE NEW.materials_id;
      ELSIF TG_OP = 'UPDATE' THEN
        _stkold := (NEW.stock - OLD.stock);
        -- RAISE INFO 'NEW VAL %', NEW.stock;
        -- RAISE INFO 'OLD VAL %', OLD.stock;
        IF (NEW.stock < OLD.stock) THEN
          -- RAISE INFO 'DECREASE UPDATE';
          -- RAISE INFO 'DECREASE VAL %', _stkold;
          UPDATE almacen_inventario SET stock = ROUND((stock - (@_stkold))::NUMERIC, 2)
          WHERE materiales_id LIKE NEW.materials_id;
        ELSE
          -- RAISE INFO 'INCREASE UPDATE';
          UPDATE almacen_inventario SET stock = ROUND((stock + _stkold)::NUMERIC, 2)
          WHERE materiales_id LIKE NEW.materials_id;
        END IF;
      END IF;
    ELSE
      INSERT INTO almacen_inventario (materiales_id,almacen_id,precompra,preventa,stkmin,stock,stkpendiente,stkdevuelto,periodo,ingreso,spptag,flag)
      VALUES (NEW.materials_id,'AL01',0,0,0,_stock,0,0,to_char(now(),'YYYY'),now(),false,true);
    END IF;
    --COMMIT;
    RETURN NEW;
    EXCEPTION
    WHEN OTHERS THEN
      RAISE INFO 'EXCEPTION ERROR %', SQLERRM;
      ROLLBACK;
      RETURN NULL;
END;
$BODY$
LANGUAGE 'plpgsql' VOLATILE
COST 100;

CREATE TRIGGER TR_balance_inventario
AFTER INSERT OR UPDATE ON almacen_inventoryBrand
FOR EACH ROW EXECUTE PROCEDURE PROC_input_inventory_after_inventorybrand();

/* BLOCK TRIGGER REGISTER DECREATE INVENTORYBRAND WHEN REGISTER GUIDE REMISION */
CREATE OR REPLACE FUNCTION proc_decrease_inventorybrand_and_detorder()
  RETURNS trigger AS
$BODY$
DECLARE
  _stk DOUBLE PRECISION := 0;
  _shop DOUBLE PRECISION := 0;
  _tag CHAR := '0';
  v_error_stack text;
BEGIN
  -- DECREASE TABLE INVENTORYBRAND 
  SELECT stock into _stk FROM almacen_inventorybrand WHERE materials_id LIKE NEW.materiales_id AND brand_id LIKE NEW.brand_id AND model_id LIKE NEW.model_id;
  IF (_stk IS NOT NULL) THEN
    _stk := (_stk - NEW.cantguide);
    if _stk < 0 THEN
      _stk := 0;
    END IF;
    UPDATE almacen_inventorybrand SET stock = ROUND(_stk::NUMERIC, 2)
    WHERE materials_id LIKE NEW.materiales_id AND brand_id LIKE NEW.brand_id AND model_id LIKE NEW.model_id;
  END IF;
  -- DECREASE TABLE DETPEDIDO
  SELECT cantshop INTO _shop FROM almacen_detpedido WHERE pedido_id LIKE NEW.order_id AND materiales_id LIKE NEW.materiales_id AND brand_id LIKE NEW.obrand_id AND model_id LIKE NEW.omodel_id;
  IF (_shop IS NOT NULL) THEN
    _shop := (_shop - NEW.cantguide);
    IF _shop < 0 THEN
      _shop := 0;
    END IF;
    IF _shop = 0::DOUBLE PRECISION THEN
      _tag := '2';
    ELSIF _shop > 0::DOUBLE PRECISION THEN
      _tag := '1';
    END IF;
    UPDATE almacen_detpedido SET cantshop = ROUND(_shop::NUMERIC, 2), cantguide = ROUND((cantguide + NEW.cantguide)::NUMERIC, 2), tag = _tag::CHAR
    WHERE pedido_id LIKE NEW.order_id AND materiales_id LIKE NEW.materiales_id AND brand_id LIKE NEW.obrand_id AND model_id LIKE NEW.omodel_id;
    RAISE INFO 'THE UPDATE DETPEDIDO';
  END IF;
  --PERFORM proc_register_in_balance(NEW.materiales_id, NEW.brand_id, NEW.model_id, NEW.cantguide, '-');
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- GET STACKED DIAGNOSTICS v_error_stack = PG_EXCEPTION_CONTEXT;
    -- RAISE WARNING 'The stack trace of the error is: "%"', v_error_stack;
    RAISE INFO 'EXCEPTION ERROR % %', SQLERRM, SQLSTATE;
    ROLLBACK;
    RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_discount_on_inventorybrand_detpedido
AFTER INSERT ON almacen_detguiaremision
FOR EACH ROW EXECUTE PROCEDURE proc_decrease_inventorybrand_and_detorder();


CREATE OR REPLACE FUNCTION proc_change_status_order()
  RETURNS TRIGGER AS
$$
DECLARE
  complete integer;
  _status CHAR(2):= '';
  total integer;
BEGIN
  total := (SELECT count(pedido_id) FROM almacen_detpedido WHERE pedido_id LIKE NEW.pedido_id);
  complete := (SELECT count(pedido_id) FROM almacen_detpedido WHERE pedido_id LIKE NEW.pedido_id AND tag LIKE '2');
  IF (total = complete) THEN
    _status := 'CO';
  ELSIF (complete > 0 AND total > complete) THEN
    _status := 'IN';
  ELSE
    _status := 'AP';
  END IF;
  UPDATE almacen_pedido SET status = _status WHERE pedido_id = NEW.pedido_id;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE INFO 'EXCEPTION ERROR % %', SQLERRM, SQLSTATE;
    ROLLBACK;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_change_status_order
AFTER UPDATE ON almacen_detpedido
FOR EACH ROW EXECUTE PROCEDURE proc_change_status_order();


-- FUNCTION FOR REGISTER DISCOUNT REGISTER GUIDE
CREATE OR REPLACE FUNCTION proc_register_in_balance()
  RETURNS TRIGGER AS
$$
DECLARE
  _stk INTEGER := 0;
  valid RECORD;
  stkold numeric(8,2);
  _balance numeric(8,2) := 0;
BEGIN
  -- VERIFY ITEMS EXISTS
  IF EXISTS(SELECT * FROM almacen_balance WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id) THEN
    SELECT INTO valid * FROM almacen_balance WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id AND extract(year FROM register) = extract(year FROM current_date)AND extract(month FROM register) = extract(month FROM current_date);
    IF FOUND THEN
    -- BALANCE IN MONTH CURRENT
      UPDATE almacen_balance SET balance = NEW.stock WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id  AND extract(year FROM register) = extract(year FROM current_date) AND extract(month FROM register) = extract(month FROM current_date);
    ELSE
    -- BALANCE IN MONTH NOT EXISTS
      SELECT balance::numeric INTO stkold FROM almacen_balance WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id AND register < current_date ORDER BY register DESC LIMIT 1;
      INSERT INTO almacen_balance (materials_id, storage_id, register, brand_id, model_id, balance) VALUES(NEW.materials_id, 'AL01', now(), NEW.brand_id, NEW.model_id, stkold);
      UPDATE almacen_balance SET balance = ROUND(NEW.stock::NUMERIC, 2) WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id  AND extract(year FROM register) = extract(year FROM current_date) AND extract(month FROM register) = extract(month FROM current_date);
    END IF;
  ELSE
    -- SELECT stock INTO _stk FROM almacen_inventorybrand WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id;
    -- insert new register item
    -- IF FOUND THEN
    -- UPDATE almacen_balance SET balance = NEW.stock WHERE materials_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id  AND extract(year FROM register) = extract(year FROM current_date) AND extract(month FROM register) = extract(month FROM current_date);
    -- ELSE
    INSERT INTO almacen_balance (materials_id, storage_id, register, brand_id, model_id, balance) VALUES(NEW.materials_id, 'AL01', now(), NEW.brand_id, NEW.model_id, ROUND(NEW.stock::NUMERIC, 2));
    -- END IF;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE INFO 'EXCEPTION ERROR %', SQLERRM;
    ROLLBACK;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_register_update_balance
AFTER UPDATE OR INSERT ON almacen_inventorybrand
FOR EACH ROW EXECUTE PROCEDURE proc_register_in_balance();


/* BLOCK NIPLE GUIDE REMISION */
CREATE OR REPLACE FUNCTION proc_decrease_change_status_nip_order()
  RETURNS trigger AS
$BODY$
DECLARE
  _quantity INTEGER := 0;
  _tag CHAR := '';
BEGIN
  SELECT cantshop INTO _quantity FROM almacen_niple WHERE id=NEW.related AND pedido_id LIKE NEW.order_id;
  IF FOUND THEN
    _quantity := ROUND((_quantity - NEW.cantguide)::NUMERIC, 2);
    IF _quantity < 0 THEN
      _quantity := 0;
    END IF;
    IF _quantity = 0 THEN
      _tag := '2';
    ELSIF _quantity > 0 THEN
      _tag := '1';
    END IF;
    UPDATE almacen_niple SET cantshop = _quantity, cantguide=ROUND((cantguide + NEW.cantguide)::NUMERIC, 2), tag = _tag WHERE id=NEW.related AND pedido_id LIKE NEW.order_id;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE INFO 'EXCEPTION ERROR %', SQLERRM;
    ROLLBACK;
    RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_change_status_nipple_order
AFTER INSERT ON almacen_nipleguiaremision
FOR EACH ROW EXECUTE PROCEDURE proc_decrease_change_status_nip_order();


-- CREATE TRIGGER FOR INGRESS NOTE
CREATE OR REPLACE FUNCTION proc_add_inventorybrand_detnoteingress()
  RETURNS TRIGGER AS
$$
DECLARE
  _stock DOUBLE PRECISION := 0;
  _invbrand RECORD;
BEGIN
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
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE INFO 'EXCEPTION ERROR %', SQLERRM;
    ROLLBACK;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_add_invetorybrand_noteingress
AFTER INSERT ON almacen_detingress
FOR EACH ROW EXECUTE PROCEDURE proc_add_inventorybrand_detnoteingress();



/**/
CREATE OR REPLACE FUNCTION proc_change_status_detcompra()
  RETURNS TRIGGER AS
$$
DECLARE
  reg RECORD;
  quantity DOUBLE PRECISION;
  tag CHAR;
  buy varchar(10);
BEGIN
  buy := (SELECT purchase_id FROM almacen_noteingress WHERE ingress_id = NEW.ingress_id LIMIT 1);
  SELECT INTO reg * FROM logistica_detcompra WHERE compra_id = buy AND materiales_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id;
  IF FOUND THEN
    quantity = ROUND((reg.cantidad - NEW.quantity)::NUMERIC, 2);
    CASE WHEN quantity = 0 THEN tag := '2';
          WHEN (quantity >= 0.1) AND (quantity < reg.cantstatic) THEN tag := '1';
          WHEN (quantity = reg.cantstatic) THEN tag := '0';
    END CASE;
    IF quantity < 0 THEN
      quantity := 0;
    END IF;
    UPDATE logistica_detcompra SET flag = tag, cantidad = quantity
    WHERE compra_id = buy AND materiales_id = NEW.materials_id AND brand_id = NEW.brand_id AND model_id = NEW.model_id;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
  ROLLBACK;
  RETURN NULL;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_change_status_detcompra
BEFORE INSERT ON almacen_detingress
FOR EACH ROW EXECUTE PROCEDURE proc_change_status_detcompra();


CREATE OR REPLACE FUNCTION proc_change_status_compra()
  RETURNS TRIGGER AS
$$
DECLARE
  _complete INTEGER := 0;
  _total INTEGER := 0;
  _status CHAR(2) := '';
  _compra varchar(10);
BEGIN
  _compra := (SELECT purchase_id FROM almacen_noteingress WHERE ingress_id = NEW.ingress_id LIMIT 1);
  _complete := (SELECT COUNT(*) FROM logistica_detcompra WHERE compra_id = _compra AND flag = '2');
  _total := (SELECT COUNT(*) FROM logistica_detcompra WHERE compra_id = _compra);
  CASE
    WHEN _complete = _total THEN _status := 'CO';
    WHEN _complete < _total THEN _status := 'IN';
    ELSE _status := 'PE';
  END CASE;
  UPDATE logistica_compra SET status = _status WHERE compra_id = _compra;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE INFO 'EXCEPTION ERROR %', SQLERRM;
    ROLLBACK;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;
-- DROP TRIGGER tr_change_status_compra ON almacen_detingress;
CREATE TRIGGER tr_change_status_compra
AFTER INSERT ON almacen_detingress
FOR EACH ROW EXECUTE PROCEDURE proc_change_status_compra();
/*=============*/

-- CREATE TRIGGER FOR STORAGE NRO ORDERS IN BEDSIDE
CREATE OR REPLACE FUNCTION proc_more_order_guide_storage_orders()
  RETURNS TRIGGER AS
$$
BEGIN
  IF OLD.orders IS NULL OR OLD.orders = '' THEN
    NEW.orders := NEW.orders;
  ELSE
    NEW.orders := (OLD.orders || ',' || NEW.orders);
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;
-- DROP TRIGGER tr_more_order_guide_storage_orders ON almacen_guiaremision;
CREATE TRIGGER tr_more_order_guide_storage_orders
BEFORE UPDATE ON almacen_guiaremision
FOR EACH ROW WHEN ('GE' = NEW.status)
EXECUTE PROCEDURE proc_more_order_guide_storage_orders();


/*==========================*/
/* ANNULAR GUIDE REMISION */
CREATE OR REPLACE FUNCTION proc_annular_guide_remision()
  RETURNS trigger AS
$$
DECLARE
  x RECORD;
  oord RECORD;
  np RECORD;
  nstk RECORD;
  so RECORD;
BEGIN
  IF OLD.orders <> NULL OR OLD.orders <> '' THEN
    RAISE INFO 'NEW VERSION';
    -- returns items of guide the orders
    FOR x IN (SELECT * FROM almacen_detguiaremision WHERE guia_id = NEW.guia_id AND flag = True)
    LOOP
      raise info 'det guide %', x;
      -- RETURN ITEM ORDERS
      SELECT INTO oord * FROM almacen_detpedido WHERE pedido_id = x.order_id AND materiales_id = x.materiales_id AND brand_id = x.obrand_id AND model_id = x.omodel_id;
      IF oord.pedido_id IS NOT NULL THEN
        UPDATE almacen_detpedido SET cantshop = ROUND((oord.cantshop + x.cantguide)::NUMERIC, 2), cantguide = ROUND((cantguide - x.cantguide)::NUMERIC, 2), tag = '1', flag = True WHERE pedido_id = x.order_id AND materiales_id = x.materiales_id AND brand_id = x.obrand_id AND model_id = x.omodel_id;
      END IF;
      -- RETURN NIPLES ORDER
      IF EXISTS(SELECT * FROM almacen_nipleguiaremision WHERE guia_id = NEW.guia_id AND materiales_id = x.materiales_id AND order_id = x.order_id) THEN
        FOR np IN (SELECT * FROM almacen_nipleguiaremision WHERE guia_id = NEW.guia_id AND materiales_id = x.materiales_id AND order_id = x.order_id)
        LOOP
          UPDATE almacen_niple SET cantshop=ROUND((cantshop+np.cantguide)::NUMERIC, 2), cantguide=ROUND((cantguide-np.cantguide)::NUMERIC, 2), tag='1' WHERE pedido_id = np.order_id AND id = np.related;
        END LOOP;
      END IF;
      -- RETURN ITEM INVENTORYBRAND
      SELECT INTO nstk * FROM almacen_inventorybrand WHERE materials_id = x.materiales_id AND brand_id = x.brand_id AND model_id = x.model_id;
      UPDATE almacen_inventorybrand set stock = ROUND((nstk.stock + x.cantguide)::NUMERIC, 2) WHERE materials_id = x.materiales_id AND brand_id = x.brand_id AND model_id = x.model_id;
      -- UPDATE STATUS DET GUIDE
      UPDATE almacen_detguiaremision SET flag = false WHERE guia_id = NEW.guia_id AND materiales_id = x.materiales_id AND id = x.id;
    END LOOP;
    -- FOR so IN (SELECT DISTINCT order_id FROM almacen_detguiaremision WHERE guia_id = NEW.guia_id AND order_id IS NOT NULL)
    -- LOOP
    --   IF EXISTS(SELECT * FROM almacen_detpedido WHERE pedido_id = so.order_id AND cantshop > 0) THEN
    --     UPDATE almacen_pedido SET status = 'IN' WHERE pedido_id = so.order_id;
    --   END IF;
    -- END LOOP;
    RAISE NOTICE 'FINISH PROCESS';
  ELSE
    RAISE INFO 'OLD VERSION';
    -- RETURNS ITEMS ORDER
    BEGIN
      FOR x IN (SELECT * FROM almacen_detguiaremision WHERE guia_id = NEW.guia_id AND flag = true)
      LOOP
        -- RAISE INFO 'DET GUIDE %', x;
        -- SELECT INTO oord * FROM almacen_detpedido WHERE pedido_id = NEW.pedido_id AND materiales_id = x.materiales_id AND brand_id = x.brand_id AND model_id = x.model_id;
        -- RAISE INFO 'DET ORDER % ', oord;
        -- IF FOUND THEN
        -- raise info 'INSIDE  IF record NOT NULL % % % %', x.brand_id, x.model_id, x.materiales_id, NEW.pedido_id;
        UPDATE almacen_detpedido SET cantshop=ROUND((cantshop + x.cantguide)::NUMERIC, 2), cantguide=ROUND((cantguide - x.cantguide)::NUMERIC, 2), tag='1', flag=true WHERE pedido_id = NEW.pedido_id AND materiales_id = x.materiales_id AND brand_id = x.brand_id AND model_id = x.model_id;
        RAISE INFO 'IS WHEN UPDATE GUIDE DET REMISIOn';
        UPDATE almacen_detguiaremision SET flag = false WHERE guia_id = NEW.guia_id AND materiales_id = x.materiales_id AND id = x.id;
        -- END IF;
        RAISE INFO 'NIP GUIDE ';
        FOR np IN (SELECT * FROM almacen_nipleguiaremision WHERE guia_id = NEW.guia_id AND materiales_id = x.materiales_id)
        LOOP
          UPDATE almacen_niple SET cantshop=ROUND((np.cantguide+cantshop)::NUMERIC, 2), cantguide=ROUND((cantguide-np.cantguide)::NUMERIC, 2), tag='1' WHERE pedido_id = NEW.pedido_id AND tipo = np.tipo AND materiales_id = np.materiales_id AND metrado = np.metrado;
          UPDATE almacen_nipleguiaremision SET flag = false WHERE id = np.id;
        END LOOP;
        RAISE INFO 'DET ORDER IU inventory ';
        -- RETURN ITEM INVENTORYBRAND
        SELECT INTO nstk * FROM almacen_inventorybrand WHERE materials_id = x.materiales_id AND brand_id = x.brand_id AND model_id = x.model_id;
        IF nstk.materials_id IS NOT NULL THEN
          UPDATE almacen_inventorybrand SET stock = ROUND((nstk.stock + x.cantguide)::NUMERIC, 2) WHERE materials_id = x.materiales_id AND brand_id = x.brand_id AND model_id = x.model_id;
        ELSE
          INSERT INTO almacen_inventorybrand(storage_id,period,materials_id,brand_id,model_id,ingress,stock,purchase,flag,sale)
          VALUES ('AL01',to_char(current_date, 'YYYY'),x.materiales_id,x.brand_id,x.model_id,now(),ROUND(x.cantguide::NUMERIC, 2),1,true,1.15);
        END IF;
      END LOOP;
    END;
    -- IF EXISTS(SELECT * FROM almacen_detpedido WHERE pedido_id = NEW.pedido_id AND cantshop > 0) THEN
    --   UPDATE almacen_pedido SET status = 'IN' WHERE pedido_id = NEW.pedido_id;
    -- END IF;
  END IF;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERROR % %', SQLERRM, SQLSTATE;
    ROLLBACK;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql VOLATILE
COST 100;

CREATE TRIGGER tr_annular_guide_remision
AFTER UPDATE ON almacen_guiaremision
FOR EACH ROW WHEN (NEW.status = 'AN')
EXECUTE PROCEDURE proc_annular_guide_remision();
/* END ANNULAR GUIDE REMISION*/