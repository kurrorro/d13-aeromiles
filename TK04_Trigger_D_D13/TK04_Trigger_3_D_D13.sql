SET search_path TO AEROMILES;

ALTER TABLE MEMBER ADD COLUMN IF NOT EXISTS award_miles INT DEFAULT 0;
ALTER TABLE MEMBER ADD COLUMN IF NOT EXISTS total_miles INT DEFAULT 0;

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

CREATE OR REPLACE FUNCTION update_member_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_email VARCHAR(100);
    new_miles INT;
    current_total_miles INT;
    old_tier_name VARCHAR(50);
    new_tier_id VARCHAR(10);
    new_tier_name VARCHAR(50);
    sender_award_miles INT;
BEGIN

    IF (TG_TABLE_NAME = 'claim_missing_miles') THEN
        IF (NEW.status_penerimaan = 'Disetujui' AND (OLD.status_penerimaan = 'Menunggu' OR OLD.status_penerimaan IS NULL)) THEN
            target_email := NEW.email_member;
            UPDATE MEMBER 
            SET award_miles = award_miles + 1000,
                total_miles = total_miles + 1000
            WHERE email = target_email;
            
            RAISE NOTICE 'SUKSES: Total miles Member "%" telah diperbarui. Miles ditambahkan: 1000 miles dari klaim penerbangan "%".', 
                target_email, NEW.flight_number;
        END IF;

    ELSIF (TG_TABLE_NAME = 'transfer') THEN
        -- Cek saldo pengirim
        SELECT award_miles INTO sender_award_miles FROM MEMBER WHERE email = NEW.email_member_1;
        IF (sender_award_miles < NEW.jumlah) THEN
            RAISE EXCEPTION 'ERROR: Saldo award miles tidak mencukupi. Saldo Anda saat ini: % miles, jumlah transfer: % miles.', 
                sender_award_miles, NEW.jumlah;
        END IF;

        -- Kurangi miles pengirim
        UPDATE MEMBER 
        SET award_miles = award_miles - NEW.jumlah
        WHERE email = NEW.email_member_1;
        
        -- Tambah miles penerima 
        UPDATE MEMBER 
        SET award_miles = award_miles + NEW.jumlah,
            total_miles = total_miles + NEW.jumlah
        WHERE email = NEW.email_member_2;
        
        RAISE NOTICE 'SUKSES: Transfer % miles dari "%" ke "%" berhasil dicatat.', 
            NEW.jumlah, NEW.email_member_1, NEW.email_member_2;
            
        target_email := NEW.email_member_2;

    ELSIF (TG_TABLE_NAME = 'member_award_miles_package') THEN
        SELECT jumlah_award_miles INTO new_miles 
        FROM AWARD_MILES_PACKAGE 
        WHERE id = NEW.id_award_miles_package;

        UPDATE MEMBER 
        SET award_miles = award_miles + new_miles,
            total_miles = total_miles + new_miles 
        WHERE email = NEW.email_member;
        
        RAISE NOTICE 'SUKSES: Pembelian package berhasil. Award miles dan total miles Anda bertambah % miles.', new_miles;
        
        target_email := NEW.email_member;
    END IF;

    IF target_email IS NOT NULL THEN
        SELECT t.nama INTO old_tier_name 
        FROM MEMBER m JOIN TIER t ON m.id_tier = t.id_tier 
        WHERE m.email = target_email;

        SELECT total_miles INTO current_total_miles FROM MEMBER WHERE email = target_email;

        SELECT id_tier, nama INTO new_tier_id, new_tier_name
        FROM TIER
        WHERE current_total_miles >= minimal_tier_miles
        ORDER BY minimal_tier_miles DESC
        LIMIT 1;

        IF new_tier_id IS NOT NULL AND new_tier_name <> old_tier_name THEN
            UPDATE MEMBER SET id_tier = new_tier_id WHERE email = target_email;
            RAISE NOTICE 'SUKSES: Tier Member "%" telah diperbarui dari "%" menjadi "%" berdasarkan total miles yang dimiliki.', 
                target_email, old_tier_name, new_tier_name;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_duplicate_claim ON CLAIM_MISSING_MILES;
CREATE TRIGGER trg_check_duplicate_claim
BEFORE INSERT ON CLAIM_MISSING_MILES
FOR EACH ROW
EXECUTE FUNCTION check_duplicate_claim();

DROP TRIGGER IF EXISTS trg_update_miles_claim ON CLAIM_MISSING_MILES;
CREATE TRIGGER trg_update_miles_claim
AFTER UPDATE ON CLAIM_MISSING_MILES
FOR EACH ROW
EXECUTE FUNCTION update_member_stats();

DROP TRIGGER IF EXISTS trg_update_miles_transfer ON TRANSFER;
CREATE TRIGGER trg_update_miles_transfer
BEFORE INSERT ON TRANSFER
FOR EACH ROW
EXECUTE FUNCTION update_member_stats();

DROP TRIGGER IF EXISTS trg_update_miles_package ON MEMBER_AWARD_MILES_PACKAGE;
CREATE TRIGGER trg_update_miles_package
AFTER INSERT ON MEMBER_AWARD_MILES_PACKAGE
FOR EACH ROW
EXECUTE FUNCTION update_member_stats();
