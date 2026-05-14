CREATE OR REPLACE FUNCTION fn_sinkronisasi_miles_klaim()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status_penerimaan = 'Disetujui' AND OLD.status_penerimaan != 'Disetujui' THEN
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

CREATE OR REPLACE TRIGGER trg_sinkronisasi_miles_klaim
AFTER UPDATE ON CLAIM_MISSING_MILES
FOR EACH ROW
EXECUTE FUNCTION fn_sinkronisasi_miles_klaim();

CREATE OR REPLACE FUNCTION fn_top5_member_by_miles()
RETURNS TABLE (
    peringkat   INT,
    email       TEXT,
    nama_lengkap TEXT,
    total_miles BIGINT
) AS $$
DECLARE
    v_top_email TEXT;
    v_top_miles BIGINT;
BEGIN
    SELECT m.email, m.total_miles
    INTO v_top_email, v_top_miles
    FROM MEMBER m
    ORDER BY m.total_miles DESC
    LIMIT 1;

    RAISE NOTICE 'SUKSES: Daftar Top 5 Member berdasarkan total miles berhasil diperbarui, dengan peringkat pertama "%" memiliki % miles.',
        v_top_email, v_top_miles;

    RETURN QUERY
    SELECT
        ROW_NUMBER() OVER (ORDER BY m.total_miles DESC)::INT AS peringkat,
        m.email::TEXT,
        (p.first_mid_name || ' ' || p.last_name)::TEXT AS nama_lengkap,
        m.total_miles
    FROM MEMBER m
    JOIN PENGGUNA p ON m.email = p.email
    ORDER BY m.total_miles DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;
