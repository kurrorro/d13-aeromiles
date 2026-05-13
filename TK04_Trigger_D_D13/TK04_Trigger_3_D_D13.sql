SET search_path TO AEROMILES;

CREATE OR REPLACE FUNCTION validate_and_sync_miles_on_reward_transaction()
RETURNS TRIGGER AS $$
DECLARE
    v_miles_per_package INT;
    v_miles_hadiah INT;
    v_nama_hadiah VARCHAR(100);
    v_valid_start DATE;
    v_program_end DATE;
    v_current_award_miles INT;
BEGIN

    IF (TG_TABLE_NAME = 'redeem') THEN
        
        SELECT nama, miles, valid_start_date, program_end 
        INTO v_nama_hadiah, v_miles_hadiah, v_valid_start, v_program_end
        FROM HADIAH 
        WHERE kode_hadiah = NEW.kode_hadiah;

        SELECT award_miles INTO v_current_award_miles 
        FROM MEMBER 
        WHERE email = NEW.email_member;

        IF (v_current_award_miles < v_miles_hadiah) THEN
            RAISE EXCEPTION 'ERROR: Saldo award miles tidak mencukupi. Dibutuhkan % miles, saldo Anda: % miles.', 
                v_miles_hadiah, v_current_award_miles;
        END IF;

        IF (CURRENT_DATE < v_valid_start OR CURRENT_DATE > v_program_end) THEN
            RAISE EXCEPTION 'ERROR: Hadiah "%" tidak tersedia pada periode ini.', v_nama_hadiah;
        END IF;

        UPDATE MEMBER 
        SET award_miles = award_miles - v_miles_hadiah
        WHERE email = NEW.email_member;

        RAISE NOTICE 'SUKSES: Redeem hadiah "%" berhasil. Award miles Anda berkurang % miles.', 
            v_nama_hadiah, v_miles_hadiah;

    ELSIF (TG_TABLE_NAME = 'member_award_miles_package') THEN

        SELECT jumlah_award_miles INTO v_miles_per_package 
        FROM AWARD_MILES_PACKAGE 
        WHERE id = NEW.id_award_miles_package;
        UPDATE MEMBER 
        SET award_miles = award_miles + v_miles_per_package,
            total_miles = total_miles + v_miles_per_package
        WHERE email = NEW.email_member;
        
        -- Notifikasi Sukses
        RAISE NOTICE 'SUKSES: Pembelian package berhasil. Award miles dan total miles Anda bertambah % miles.', 
            v_miles_per_package;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validate_redeem_reward ON REDEEM;
CREATE TRIGGER trg_validate_redeem_reward
BEFORE INSERT ON REDEEM
FOR EACH ROW
EXECUTE FUNCTION validate_and_sync_miles_on_reward_transaction();

DROP TRIGGER IF EXISTS trg_sync_miles_on_package_purchase ON MEMBER_AWARD_MILES_PACKAGE;
CREATE TRIGGER trg_sync_miles_on_package_purchase
AFTER INSERT ON MEMBER_AWARD_MILES_PACKAGE
FOR EACH ROW
EXECUTE FUNCTION validate_and_sync_miles_on_reward_transaction();
