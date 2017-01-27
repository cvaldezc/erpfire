CREATE OR REPLACE FUNCTION balance_hours_assistance_fn()
    RETURNS TRIGGER AS
$BODY$
DECLARE
    xa rrhh_assistance;
    balance RECORD;
    config RECORD;
    ndate DATE;
    break TIME;
    diff TIME;
    thours NUMERIC := 0; 
    ex RECORD;
    types RECORD;
    tdelay TIME;
    delay NUMERIC;
    fvalid BOOLEAN := FALSE;
    -- hours extra
    secondtime TIME;
    firsttime TIME;
    st NUMERIC;
    ft NUMERIC;
    lack NUMERIC;
    xhfs TIME;
    xhts TIME;
BEGIN
    RAISE WARNING 'NEW RECORD %', NEW;
    SELECT INTO config * FROM home_employeesettings ORDER BY register DESC LIMIT 1 OFFSET 0;
    RAISE WARNING 'ROW CONFIG %', config;
    -- sum hour total for day for day
    FOR xa IN 
        SELECT * FROM rrhh_assistance WHERE employee_id = NEW.employee_id AND assistance = NEW.assistance
    LOOP
        RAISE WARNING 'ROW ASSISTANCE %', xa;
        -- OBTAIN SUM HOUR BREAK
        IF xa.hourinbreak NOTNULL AND xa.houroutbreak NOTNULL THEN
            IF EXTRACT('hour' FROM xa.hourinbreak)::INT > 0 OR (EXTRACT('hour' FROM xa.houroutbreak))::INT > 0 THEN
                break:= (xa.houroutbreak::TIME - xa.hourinbreak::TIME);
            ELSE
                break := '00:00:00'::TIME;
            END IF;
        ELSE
            break := '00:00:00'::TIME;
        END IF;
        -- OBTAIN SUM HOUR WORKED
        IF (xa.hourin NOTNULL AND xa.hourout NOTNULL) THEN
            -- hourstart := ARRAY_APPEND(hourstart, xa.hourin);
            IF NEW.hourout < NEW.hourin THEN
                ndate := (NEW.assistance::DATE + 1);
                diff := ((ndate::CHAR(10) || ' ' || NEW.hourout::CHAR(5))::TIMESTAMP - (NEW.assistance::CHAR(10) || ' ' || NEW.hourin::CHAR(5))::TIMESTAMP);
            ELSE
                diff := (NEW.hourout::TIME - NEW.hourin::TIME);
            END IF;
            thours := (thours + (EXTRACT('hour' FROM diff)::NUMERIC) + (EXTRACT('minutes' FROM diff) / 60));
        END IF;
    END LOOP;
    -- end block sun total for day
    RAISE WARNING 'VIEW TOTAL HOURS %', thours;
    -- this is for get hour ingress for determinate if have delay (tardanza)
    SELECT INTO ex * FROM rrhh_assistance WHERE employee_id = NEW.employee_id AND assistance::DATE = NEW.assistance::DATE ORDER BY hourin ASC LIMIT 1 OFFSET 0;
    IF FOUND THEN
        RAISE WARNING 'VALUES EX  %', ex;
        RAISE WARNING 'INSIDE TYPES % %', ex.types_id, config.codeproject;
        IF ex.types_id::CHAR(4) = config.codeproject::CHAR(4) THEN
            RAISE WARNING 'INSIDE TYPES EQUAL';
            SELECT INTO types * FROM ventas_proyecto WHERE proyecto_id = ex.project_id;
            xhfs := types.shxsaturday;
            xhts := types.shxsaturdayt;
        ELSE
            RAISE WARNING 'INSIDE TYPES DIFERENT';
            SELECT INTO types * FROM rrhh_typesemployee WHERE types_id = ex.types_id;
            xhfs := config.shxsaturday;
            xhts := config.shxsaturdayt;
        END IF;
        RAISE WARNING 'SHOW TYPES %', types;
        IF ex.hourin::TIME > types.starthour::TIME THEN
            tdelay := (ex.hourin::TIME - types.starthour::TIME);
        ELSE
            tdelay := '00:00:00'::TIME;
        END IF;
        RAISE WARNING 'TDELAY % % %', tdelay, ex.hourin, types.starthour;
        RAISE WARNING 'DELAY HOUR %', EXTRACT('hour' FROM tdelay);
        RAISE WARNING 'DELAY MINUTES %', EXTRACT('minutes' FROM tdelay);
        delay := (EXTRACT('hour' FROM tdelay)::NUMERIC + (EXTRACT('minutes' FROM tdelay)/60)::NUMERIC);
    END IF;
    -- end block get delay for day
    RAISE WARNING 'EXIT TYPES';
    -- discount hour break if only have employee to work yo M - F if have break
    IF EXTRACT('hour' FROM break)::NUMERIC > 0 THEN
        RAISE WARNING 'HERE DISCOUNT HOUR BREAK';
        thours := (thours - EXTRACT('hour' FROM break)::NUMERIC);
    END IF;
    -- end block discount break
    RAISE WARNING 'INSIDE HOURS EXTRA';
    -- HERE SET CONDITIONAL
    -- hour extra for day
    IF (to_char(NEW.assistance::DATE, 'day')::CHAR(7) = 'saturday'::CHAR(7)) THEN
         -- EXTRACT HOURS EXTRAS if day is saturday
        IF (to_char(thours, '00":00:00"'))::TIME >= xhts::TIME THEN
            RAISE WARNING 'INSIDE HOURS SECONDTIME EXTRA';
            secondtime := ((to_char(thours, '00":00:00"'))::TIME - xhts::TIME);
            st := (EXTRACT('hour' FROM secondtime))::NUMERIC;
            RAISE WARNING 'ADDITIONAL SECONDTIME % %', secondtime, st;
            -- HERE VERIFY MINUTES ROUND IF MINUTES GREAT VAL ROUND 
            -- IF THEN
            -- END IF;
            firsttime := (xhts::TIME - xhfs::TIME);
            ft := (EXTRACT('hour' FROM firsttime))::NUMERIC;
            RAISE WARNING 'ADDITIONAL FIRSTTIME % %', firsttime, ft;
            thours := (EXTRACT('hour' FROM (types.outsaturday::TIME - types.starthour::TIME))::NUMERIC + EXTRACT('minutes' FROM (types.outsaturday::TIME - types.starthour::TIME)/60)::NUMERIC);
            fvalid := TRUE;
        ELSE
            st := 0;
        END IF;
    ELSE
        -- another day week
        -- EXTRACT HOURS EXTRAS
        IF (to_char(thours, '00":00:00"'))::TIME >= config.starthourextratwo::TIME THEN
            RAISE WARNING 'INSIDE HOURS SECONDTIME EXTRA';
            secondtime := ((to_char(thours, '00":00:00"'))::TIME - config.starthourextratwo::TIME);
            st := (EXTRACT('hour' FROM secondtime))::NUMERIC;
            RAISE WARNING 'ADDITIONAL SECONDTIME % %', secondtime, st;
            -- HERE VERIFY MINUTES ROUND IF MINUTES GREAT VAL ROUND 
            -- IF THEN
            -- END IF;
            firsttime := (config.starthourextratwo::TIME - config.starthourextra::TIME);
            ft := (EXTRACT('hour' FROM firsttime))::NUMERIC;
            RAISE WARNING 'ADDITIONAL FIRSTTIME % %', firsttime, ft;
            thours := (EXTRACT('hour' FROM config.totalhour)::NUMERIC + (EXTRACT('minutes' FROM config.totalhour)/60)::NUMERIC);
            fvalid := TRUE;
        ELSE
            st := 0;
        END IF;
    END IF;
    -- END BLOCK CONDITIONAL
    IF NOT fvalid THEN
        IF (to_char(NEW.assistance::DATE, 'day')::CHAR(7) = 'saturday'::CHAR(7)) THEN
            IF (to_char(thours, '00":00:00"'))::TIME >= xhfs::TIME AND (to_char(thours, '00":00:00"'))::TIME < xhts::TIME THEN
                RAISE WARNING 'INSIDE HOURS FIRST EXTRA';
                firsttime := ((to_char(thours, '00":00:00"'))::TIME - xhfs::TIME);
                ft := (EXTRACT('hour' FROM firsttime))::NUMERIC;
                thours := (EXTRACT('hour' FROM (types.outsaturday::TIME - types.starthour::TIME))::NUMERIC + EXTRACT('minutes' FROM (types.outsaturday::TIME - types.starthour::TIME)/60)::NUMERIC);
            ELSE
                ft := 0;
            END IF;
        ELSE
            IF (to_char(thours, '00":00:00"'))::TIME >= config.starthourextra::TIME AND (to_char(thours, '00":00:00"'))::TIME < config.starthourextratwo::TIME THEN
                RAISE WARNING 'INSIDE HOURS FIRST EXTRA';
                firsttime := ((to_char(thours, '00":00:00"'))::TIME - config.starthourextra::TIME);
                ft := (EXTRACT('hour' FROM firsttime))::NUMERIC;
                thours := (EXTRACT('hour' FROM config.totalhour)::NUMERIC + (EXTRACT('minutes' FROM config.totalhour)/60)::NUMERIC);
            ELSE
                ft := 0;
            END IF;
        END IF;
    END IF;
    RAISE WARNING 'NAME OF DAY %, %', to_char(NEW.assistance::DATE, 'day'), NEW.assistance;
    IF to_char(NEW.assistance::DATE, 'day')::CHAR(7) = 'saturday'::CHAR(7) THEN
        lack := (EXTRACT('hour' FROM (types.outsaturday::TIME - types.starthour::TIME))::NUMERIC + (EXTRACT('minutes' FROM (types.outsaturday::TIME - types.starthour::TIME))/60)::NUMERIC);
        RAISE WARNING 'TOTAL HOURS % AND HOURS LACK %', thours, lack;
        IF thours < lack THEN
            lack := (lack - thours);
        ELSE
            lack := 0;
        END IF;
    ELSE
        RAISE WARNING 'CALC LACK IN TOTAL HOURS WITH 8 HOUR';
        lack := ((EXTRACT('hour' FROM config.totalhour)::NUMERIC + (EXTRACT('minutes' FROM config.totalhour)/60)::NUMERIC));
        IF thours < lack THEN
            lack := (lack - thours);
        ELSE
            lack := 0;
        END IF;
    END IF;
    RAISE WARNING 'CALC LACk (LACK - THOURS) % %', lack, thours;
    -- here is perform update or insert
    SELECT INTO balance * FROM rrhh_balanceassistance WHERE employee_id = NEW.employee_id AND assistance::DATE = NEW.assistance::DATE;
    RAISE WARNING 'FOUND balance exists or not';
    IF FOUND THEN
        UPDATE rrhh_balanceassistance SET hextfirst = ft, hextsecond = st, hwork = thours, hdelay = delay, hlack = lack WHERE employee_id = NEW.employee_id AND assistance = NEW.assistance;
        RAISE WARNING 'FINISH UPDATE TABLE BALANCE';
    ELSE
        INSERT INTO rrhh_balanceassistance(employee_id, assistance, hextfirst, hextsecond, hwork, hdelay, flag, hlack) VALUES(NEW.employee_id, NEW.assistance, ft, st, thours, delay, TRUE, lack);
        RAISE WARNING 'FINISH INSERT TABLE BALANCE';
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN others THEN
        RAISE EXCEPTION 'ERROR SQLEXCEPTION %', SQLERRM;
        ROLLBACK;
        RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;


-- EXECUTE TRIGGERs
DROP TRIGGER ext_hours_balance ON rrhh_assistance;
DROP FUNCTION balance_hours_assistance_fn();
CREATE TRIGGER ext_hours_balance
AFTER INSERT OR UPDATE ON rrhh_assistance
FOR EACH ROW EXECUTE PROCEDURE balance_hours_assistance_fn();
