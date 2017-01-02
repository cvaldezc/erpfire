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
    thours TIME;
BEGIN
    FOR xa IN 
        SELECT * FROM rrhh_assistance WHERE employee_id = NEW.employee_id AND assistance = NEW.assistance
    LOOP
        -- OBTAIN SUM HOUR BREAK
        IF (EXTRACT('hour' FROM xa.hourinbreak) + (EXTRACT('minutes' FROM xa.houroutbreak) / 60)) > 0 THEN
            IF xa.hourinbreak NOTNULL AND xa.houroutbreak NOTNULL THEN
                break:= (xa.hourout::TIME - xa.hourinbreak::TIME);
            END IF;
        ELSE
            break := 0;
        END IF;
        -- OBTAIN SUM HOUR WORKED
        IF (xa.houtin NOTNULL AND xa.hourout NOTNULL) THEN
            IF NEW.hourout < NEW.hourin THEN
                ndate := (NEW.asisstance::DATE + 1);
                diff := ((ndate::CHAR || ' ' || NEW.hourout::CHAR):: TIMESTAMP - (NEW.asisstance::CHAR || ' ' || NEW.hourin::CHAR)::TIMESTAMP);
            ELSE
                diff := (NEW.hourout::TIME - NEW.hourin::TIME);
            END IF;
        END IF;
    END LOOP;
    SELECT INTO config * FROM home_employeesettings ORDER BY register DESC LIMIT 1 OFFSET 0;
    SELECT INTO balance * FROM rrhh_balanceassistance WHERE assistance = NEW.employee_id AND assistancce = NEW.assistance;
    IF FOUND THEN
    ELSE
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



-- EXECUTE TRIGGERs
CREATE TRIGGER calc_hours_works
BEFORE INSERT OR UPDATE ON rrhh_assistance
FOR EACH ROW EXECUTE PROCEDURE proc_calculatehourextra();
/* TEST TIMEs */
-- SELECT DATE '2016-12-28' + DATE '2016-12-31';
-- SELECT EXTRACT('hour' from '17:30:00'::TIME - '08:00:00'::TIME);
-- SELECT ('05:00:00'::TIME - '22:30:00'::TIME);
-- SELECT ('2016-12-23 05:00:00'::TIMESTAMP - '2016-12-22 20:30:00'::TIMESTAMP);
