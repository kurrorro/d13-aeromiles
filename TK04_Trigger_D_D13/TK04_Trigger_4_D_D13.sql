SET search_path TO AEROMILES;

CREATE OR REPLACE FUNCTION check_duplicate_claim()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM CLAIM_MISSING_MILES 
        WHERE flight_number = NEW.flight_number 
          AND tanggal_penerbangan = NEW.tanggal_penerbangan 
          AND nomor_tiket = NEW.nomor_tiket 
          AND email_member = NEW.email_member
    ) THEN
        RAISE EXCEPTION 'ERROR: Klaim untuk penerbangan "%" pada tanggal "%" dengan nomor tiket "%" sudah pernah diajukan sebelumnya.', 
            NEW.flight_number, NEW.tanggal_penerbangan, NEW.nomor_tiket;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_check_duplicate_claim ON CLAIM_MISSING_MILES;
CREATE TRIGGER tr_check_duplicate_claim
BEFORE INSERT ON CLAIM_MISSING_MILES
FOR EACH ROW
EXECUTE FUNCTION check_duplicate_claim();

CREATE OR REPLACE FUNCTION update_member_tier()
RETURNS TRIGGER AS $$
DECLARE
    current_freq INT;
    new_tier_id VARCHAR(10);
    new_tier_nama VARCHAR(50);
    old_tier_nama VARCHAR(50);
BEGIN
    SELECT COUNT(*) INTO current_freq
    FROM CLAIM_MISSING_MILES
    WHERE email_member = NEW.email 
      AND status_penerimaan = 'Disetujui';

    SELECT id_tier, nama INTO new_tier_id, new_tier_nama
    FROM TIER
    WHERE NEW.total_miles >= minimal_tier_miles
      AND current_freq >= minimal_frekuensi_terbang
    ORDER BY minimal_tier_miles DESC, minimal_frekuensi_terbang DESC
    LIMIT 1;

    IF (NEW.id_tier IS DISTINCT FROM new_tier_id) THEN
        SELECT nama INTO old_tier_nama FROM TIER WHERE id_tier = OLD.id_tier;
        
        NEW.id_tier := new_tier_id;
        
        RAISE NOTICE 'SUKSES: Tier Member "%" telah diperbarui dari "%" menjadi "%" berdasarkan total miles yang dimiliki.', 
            NEW.email, old_tier_nama, new_tier_nama;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_member_tier ON MEMBER;
CREATE TRIGGER tr_update_member_tier
BEFORE UPDATE OF total_miles ON MEMBER
FOR EACH ROW
EXECUTE FUNCTION update_member_tier();