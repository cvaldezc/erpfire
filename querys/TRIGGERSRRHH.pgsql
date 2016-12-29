/*
# TRIGGER RECURSOS HUMANAS 2016-12-28 08:48:14
*/
-- FUNCTION TRIGGERs
-- CALCULATION HOURS EXTRA
CREATE OR REPLACE FUNCTION proc_calculatehourextra
    RETURNS TRIGGER AS
$BODY$
DECLARE
    inbreak NUMMERIC(2, 1) := 0;
    break TIME;
    ndate DATE;
    diff TIME;
    thours NUMERIC(3, 1) := 0;
    config RECORD;
    first TIME;
    second TIME:
BEGIN
    IF NEW.hourin NOTNULL AND NEW.hourout NOTNULL THEN
        -- CALCULATION HOUR BREAK
        IF NEW.hourinbreak NOTNULL AND NEW.houroutbreak NOTNULL THEN
            break := (NEW.houroutbreak - NEW hourinbreak);
            inbreak := EXTRACT('hour' FROM break);
            IF inbreak <= 0 THEN
                inbreak := 1;
            END IF; 
        END IF;
        -- EVALUATE IF HOUR OUT IS FOR NEXT DAY
        IF NEW.hourout < NEW.hourin THEN
            ndate := (NEW.asisstance::DATE + 1);
            diff := ((ndate::CHAR || ' ' || NEW.hourout::CHAR):: TIMESTAMP - (NEW.asisstance::CHAR || ' ' || NEW.hourin::CHAR)::TIMESTAMP);
        ELSE
            diff := (NEW.hourout::TIME - NEW.hourin::TIME);
        END IF;
        -- DISCOUNT HOUR BREAK
        IF inbreak > 0 THEN
            diff := (diff - (to_char(inbreak, '00":00:00"'))::TIME);
        END IF;
        -- GET DATA CONFIGURATION
        SELECT INTO config * FROM home_employeesettings ORDER BY register DESC LIMIT 1 OFFSET 0;
        -- thours := EXTRACT('hour' from diff)::NUMERIC;
        IF diff >= config.starthourextratwo THEN
            second := (diff - config.starthourextratwo);
            NEW.hextsecond := (EXTRACT('hour' FROM second))::NUMERIC;
            -- HERE VERIFY MINUTES ROUND IF MINUTES GREAT VAL ROUND
            -- IF THEN
            -- END IF;
            first := (config.starthourextratwo - config.starthourxtra);
            NEW.hextfirst := (EXTRACT('hour' FROM first))::NUMERIC
        ELSE
            NEW.hextsecond := 0;
        END IF;
        IF diff >= config.starthourextra and diff < config.starthourextratwo THEN
            first := (diff - config.starthourextra);
            NEW.hextfirst := (EXTRACT('hour' FROM first))::NUMERIC
        END IF;
        NEW.hwork := (EXTRACT('hour' from diff)) + (EXTRACT('minutes' from diff) / 60);
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
        RAISE INFO 'ERROR SQLEXCEPTION %', SQLERRM;
        ROLLBACK;
        RETURN NULL;
END;
$BODY$
LANGUAGE PLPGSQL VOLATILE
COST 100;

-- EXECUTE TRIGGERs

/* TEST TIMEs */
-- SELECT DATE '2016-12-28' + DATE '2016-12-31';
-- SELECT EXTRACT('hour' from '17:30:00'::TIME - '08:00:00'::TIME);
-- SELECT ('05:00:00'::TIME - '22:30:00'::TIME);
-- SELECT ('2016-12-23 05:00:00'::TIMESTAMP - '2016-12-22 20:30:00'::TIMESTAMP);