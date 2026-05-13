CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION cek_duplikasi_email()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM PENGGUNA 
        WHERE LOWER(email) = LOWER(NEW.email)
    ) THEN
        RAISE EXCEPTION 'ERROR: Email "%" sudah terdaftar, silakan gunakan email lain.', NEW.email;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cek_duplikasi_email
BEFORE INSERT ON PENGGUNA
FOR EACH ROW
EXECUTE FUNCTION cek_duplikasi_email();

CREATE OR REPLACE FUNCTION verifikasi_login(p_email VARCHAR, p_password VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    is_valid BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM PENGGUNA
        WHERE LOWER(email) = LOWER(p_email)
          AND password = crypt(p_password, password)
    ) INTO is_valid;

    IF NOT is_valid THEN
        RAISE EXCEPTION 'Email atau password salah, silakan coba lagi.';
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
