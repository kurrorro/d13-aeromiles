SET search_path TO AEROMILES;

CREATE OR REPLACE FUNCTION update_miles_after_claim_approval()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.status_penerimaan = 'Menunggu' AND NEW.status_penerimaan = 'Disetujui') THEN
        UPDATE MEMBER
        SET award_miles = award_miles + 1000,
            total_miles = total_miles + 1000
        WHERE email = NEW.email_member;

        RAISE NOTICE 'SUKSES: Total miles Member "%" telah diperbarui. Miles ditambahkan: 1000 miles dari klaim penerbangan "%".', 
            NEW.email_member, NEW.flight_number;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_miles_on_claim ON CLAIM_MISSING_MILES;
CREATE TRIGGER tr_update_miles_on_claim
AFTER UPDATE ON CLAIM_MISSING_MILES
FOR EACH ROW
EXECUTE FUNCTION update_miles_after_claim_approval();

CREATE OR REPLACE FUNCTION get_top_5_members()
RETURNS TABLE (
    peringkat INT,
    email VARCHAR,
    nama_lengkap TEXT,
    total_miles INT
) AS $$
BEGIN
    DECLARE
        top_email VARCHAR;
        top_miles INT;
    BEGIN
        SELECT m.email, m.total_miles INTO top_email, top_miles
        FROM MEMBER m
        ORDER BY m.total_miles DESC
        LIMIT 1;

        IF top_email IS NOT NULL THEN
            RAISE NOTICE 'SUKSES: Daftar Top 5 Member berdasarkan total miles berhasil diperbarui, dengan peringkat pertama "%" memiliki % miles.', 
                top_email, top_miles;
        END IF;
    END;

    RETURN QUERY
    SELECT 
        CAST(ROW_NUMBER() OVER (ORDER BY m.total_miles DESC) AS INT),
        m.email,
        p.first_mid_name || ' ' || p.last_name,
        m.total_miles
    FROM MEMBER m
    JOIN PENGGUNA p ON m.email = p.email
    ORDER BY m.total_miles DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;