/*
# TRIGGER RECURSOS HUMANAS 2016-12-28 08:48:14
*/
-- FUNCTION TRIGGERs
-- CALCULATION HOURS EXTRA
CREATE OR REPLACE FUNCTION proc_calculatehourextra()
    RETURNS TRIGGER AS
$BODY$
DECLARE
    inbreak NUMERIC(2, 1) := 0;
    break TIME;
    ndate DATE;
    diff TIME;
    thours NUMERIC(3, 1) := 0;
    config RECORD;
    firsttime TIME;
    secondtime TIME;
    fvalid BOOLEAN := FALSE;
BEGIN
    IF NEW.hourin NOTNULL AND NEW.hourout NOTNULL THEN
        -- CALCULATION HOUR BREAK
        IF NEW.hourinbreak NOTNULL AND NEW.houroutbreak NOTNULL THEN
            break := (NEW.houroutbreak - NEW.hourinbreak);
            inbreak := EXTRACT('hour' FROM break)::NUMERIC;
            RAISE WARNING 'HERE IF DISCOUNT HOUR BREAK';
            IF inbreak <= 0 THEN
                inbreak := 1;
            END IF; 
        END IF;
        -- GET DATA CONFIGURATION
        SELECT INTO config * FROM home_employeesettings ORDER BY register DESC LIMIT 1 OFFSET 0;
        -- EVALUATE IF HOUR OUT IS FOR NEXT DAY
        IF NEW.hourout < NEW.hourin THEN
            ndate := (NEW.asisstance::DATE + 1);
            diff := ((ndate::CHAR || ' ' || NEW.hourout::CHAR):: TIMESTAMP - (NEW.asisstance::CHAR || ' ' || NEW.hourin::CHAR)::TIMESTAMP);
        ELSE
            diff := (NEW.hourout::TIME - NEW.hourin::TIME);
        END IF;
        -- DISCOUNT HOUR BREAK
        IF inbreak > 0 AND diff >= config.totalhour THEN
            diff := (diff - (to_char(inbreak, '00":00:00"'))::TIME);
        END IF;
        -- thours := EXTRACT('hour' from diff)::NUMERIC;
        IF diff::TIME >= config.starthourextratwo::TIME THEN
        	RAISE WARNING 'INSIDE HOURS SECONDTIME EXTRA';
            secondtime := (diff - config.starthourextratwo::TIME);
            NEW.hextsecond := (EXTRACT('hour' FROM secondtime))::NUMERIC;
            RAISE WARNING 'ADDITIONAL SECONDTIME % %', secondtime, NEW.hextsecond;
            -- HERE VERIFY MINUTES ROUND IF MINUTES GREAT VAL ROUND
            -- IF THEN
            -- END IF;
            firsttime := (config.starthourextratwo::TIME - config.starthourextra::TIME);
            NEW.hextfirst := (EXTRACT('hour' FROM firsttime))::NUMERIC;
            RAISE WARNING 'ADDITIONAL FIRSTTIME % %', firsttime, NEW.hextfirst;
            diff := (config.totalhour);
            fvalid := TRUE;
        ELSE
            NEW.hextsecond := 0;
        END IF;
        IF NOT fvalid THEN
            IF diff::TIME >= config.starthourextra::TIME AND diff::TIME < config.starthourextratwo::TIME THEN
                RAISE WARNING 'INSIDE HOURS FIRST EXTRA';
                firsttime := (diff - config.starthourextra::TIME);
                NEW.hextfirst := (EXTRACT('hour' FROM firsttime))::NUMERIC;
                diff := (config.totalhour);
            ELSE
                NEW.hextfirst := 0;
            END IF;
        END IF;
        thours := ((EXTRACT('hour' from diff))::NUMERIC + (EXTRACT('minutes' from diff) / 60)::NUMERIC);
        RAISE WARNING 'HERE twork %', thours;
        NEW.hwork := thours;
        -- RAISE WARNING '[AUDIT.IF_MODIFIED_FUNC] - Other action occurred: %, at %',TG_OP,now();
        RETURN NEW;
        -- REQUERIMENTS
        -- INITIALIZE WITH NEXT PARAMETERS
        -- HOUR IN := '08:00:00'
        -- HOUR IN BREAK := '13:00:00'
        -- HOUR OUT BREAK := '14:00:00'
        -- HOUR OUT := '17:30:00'
        -- IF HOUR OUT EXISTS HOUR EXTRA
        -- HOUR OUT := '20:00:00'
    ELSE
        ROLLBACK;
        RETURN NULL;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'ERROR SQLEXCEPTION %', SQLERRM;
        ROLLBACK;
        RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;
-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------
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
    SELECT INTO config * FROM home_employeesettings ORDER BY register DESC LIMIT 1 OFFSET 0;
    -- sum hour total for day for day
    FOR xa IN 
        SELECT * FROM rrhh_assistance WHERE employee_id = NEW.employee_id AND assistance = NEW.assistance
    LOOP
        -- OBTAIN SUM HOUR BREAK
        IF (EXTRACT('hour' FROM xa.hourinbreak) + (EXTRACT('minutes' FROM xa.houroutbreak) / 60)) > 0 THEN
            IF xa.hourinbreak NOTNULL AND xa.houroutbreak NOTNULL THEN
                break:= (xa.houroutbreak::TIME - xa.hourinbreak::TIME);
            END IF;
        ELSE
            break := '00:00:00'::TIME;
        END IF;
        -- OBTAIN SUM HOUR WORKED
        IF (xa.hourin NOTNULL AND xa.hourout NOTNULL) THEN
            -- hourstart := ARRAY_APPEND(hourstart, xa.hourin);
            IF NEW.hourout < NEW.hourin THEN
                ndate := (NEW.asisstance::DATE + 1);
                diff := ((ndate::CHAR || ' ' || NEW.hourout::CHAR):: TIMESTAMP - (NEW.asisstance::CHAR || ' ' || NEW.hourin::CHAR)::TIMESTAMP);
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
        tdelay := (ex.hourin::TIME - types.starthour::TIME);
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
    RAISE WARNING 'NAME OF DAY %', to_char(NEW.assistance::DATE, 'day');
    IF to_char(NEW.assistance::DATE, 'day')::CHAR(7) = 'saturday'::CHAR(7) THEN
        lack := (EXTRACT('hour' FROM (types.outsaturday::TIME - types.starthour::TIME))::NUMERIC + (EXTRACT('minutes' FROM (types.outsaturday::TIME - types.starthour::TIME))/60)::NUMERIC);
        RAISE WARNING 'TOTAL HOURS % AND HOURS LACK %', thours, lack;
        IF thours < lack THEN
            lack := (lack - thours);
        ELSE
            lack := 0;
        END IF;
    ELSE
        lack := ((EXTRACT('hour' FROM config.totalhour)::NUMERIC + (EXTRACT('minutes' FROM config.totalhour)/60)::NUMERIC));
        IF thours < lack THEN
            lack := (lack - thours);
        ELSE
            lack := 0;
        END IF;
    END IF;
    -- here is perform update or insert
    SELECT INTO balance * FROM rrhh_balanceassistance WHERE employee_id = NEW.employee_id AND assistance::DATE = NEW.assistance::DATE;
    IF FOUND THEN
        UPDATE rrhh_balanceassistance SET hextfirst = ft, hextsecond = st, hwork = thours, hdelay = delay, hlack = lack WHERE employee_id = NEW.employee_id AND assistance = NEW.assistance;
    ELSE
        INSERT INTO rrhh_balanceassistance(employee_id, assistance, hextfirst, hextsecond, hwork, hdelay, flag, hlack) VALUES(NEW.employee_id, NEW.assistance, ft, st, thours, delay, TRUE, lack);
    END IF;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'ERROR SQLEXCEPTION %', SQLERRM;
        ROLLBACK;
        RETURN NULL;
END;
$BODY$
LANGUAGE plpgsql VOLATILE
COST 100;



-- EXECUTE TRIGGERs
DROP TRIGGER calc_hours_works ON rrhh_assistance;
DROP FUNCTION proc_calculatehourextra();
CREATE TRIGGER calc_hours_works
BEFORE INSERT OR UPDATE ON rrhh_assistance
FOR EACH ROW EXECUTE PROCEDURE proc_calculatehourextra();
----------------------------------------------------------
DROP TRIGGER ext_hours_balance ON rrhh_assistance;
DROP FUNCTION balance_hours_assistance_fn();
CREATE TRIGGER ext_hours_balance
AFTER INSERT OR UPDATE ON rrhh_assistance
FOR EACH ROW EXECUTE PROCEDURE balance_hours_assistance_fn();

/* TEST TIMEs */
-- SELECT DATE '2016-12-28' + DATE '2016-12-31';
-- SELECT EXTRACT('hour' from '17:30:00'::TIME - '08:00:00'::TIME);
-- SELECT ('05:00:00'::TIME - '22:30:00'::TIME);
-- SELECT ('2016-12-23 05:00:00'::TIMESTAMP - '2016-12-22 20:30:00'::TIMESTAMP);
