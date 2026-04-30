-- SQL ini dari teman (skema resmi tim)
-- Jalankan di pgAdmin > database aeromiles > Query Tool

CREATE SCHEMA IF NOT EXISTS AEROMILES; 
SET search_path TO AEROMILES; 

DROP TABLE IF EXISTS REDEEM                      CASCADE;
DROP TABLE IF EXISTS TRANSFER                    CASCADE;
DROP TABLE IF EXISTS CLAIM_MISSING_MILES         CASCADE;
DROP TABLE IF EXISTS MEMBER_AWARD_MILES_PACKAGE  CASCADE;
DROP TABLE IF EXISTS AWARD_MILES_PACKAGE         CASCADE;
DROP TABLE IF EXISTS HADIAH                      CASCADE;
DROP TABLE IF EXISTS IDENTITAS                   CASCADE;
DROP TABLE IF EXISTS BANDARA                     CASCADE;
DROP TABLE IF EXISTS MITRA                       CASCADE;
DROP TABLE IF EXISTS STAF                        CASCADE;
DROP TABLE IF EXISTS MEMBER                      CASCADE;
DROP TABLE IF EXISTS MASKAPAI                    CASCADE;
DROP TABLE IF EXISTS TIER                        CASCADE;
DROP TABLE IF EXISTS PENYEDIA                    CASCADE;
DROP TABLE IF EXISTS PENGGUNA                    CASCADE;

CREATE TABLE PENGGUNA (
    email           VARCHAR(100)    PRIMARY KEY,
    password        VARCHAR(255)    NOT NULL,
    salutation      VARCHAR(10)     NOT NULL CHECK (salutation IN ('Mr.', 'Mrs.', 'Ms.', 'Dr.')),
    first_mid_name  VARCHAR(100)    NOT NULL,
    last_name       VARCHAR(100)    NOT NULL,
    country_code    VARCHAR(5)      NOT NULL,
    mobile_number   VARCHAR(20)     NOT NULL,
    tanggal_lahir   DATE            NOT NULL,
    kewarganegaraan VARCHAR(50)     NOT NULL
);

CREATE TABLE TIER (
    id_tier                     VARCHAR(10)     PRIMARY KEY,
    nama                        VARCHAR(50)     NOT NULL,
    minimal_frekuensi_terbang   INT             NOT NULL,
    minimal_tier_miles          INT             NOT NULL
);

CREATE TABLE PENYEDIA (
    id  SERIAL  PRIMARY KEY
);

CREATE TABLE MASKAPAI (
    kode_maskapai   VARCHAR(10)     PRIMARY KEY,
    nama_maskapai   VARCHAR(100)    NOT NULL,
    id_penyedia     INT             NOT NULL REFERENCES PENYEDIA(id)
);

CREATE TABLE MEMBER (
    email               VARCHAR(100)    PRIMARY KEY REFERENCES PENGGUNA(email),
    nomor_member        VARCHAR(20)     NOT NULL UNIQUE,
    tanggal_bergabung   DATE            NOT NULL,
    id_tier             VARCHAR(10)     NOT NULL REFERENCES TIER(id_tier)
);

CREATE TABLE STAF (
    email           VARCHAR(100)    PRIMARY KEY REFERENCES PENGGUNA(email),
    id_staf         VARCHAR(20)     NOT NULL UNIQUE,
    kode_maskapai   VARCHAR(10)     NOT NULL REFERENCES MASKAPAI(kode_maskapai)
);

CREATE TABLE MITRA (
    email_mitra         VARCHAR(100)    PRIMARY KEY,
    id_penyedia         INT             NOT NULL UNIQUE REFERENCES PENYEDIA(id) ON DELETE CASCADE,
    nama_mitra          VARCHAR(100)    NOT NULL,
    tanggal_kerja_sama  DATE            NOT NULL
);

CREATE TABLE IDENTITAS (
    nomor           VARCHAR(50)     PRIMARY KEY,
    email_member    VARCHAR(100)    NOT NULL REFERENCES MEMBER(email) ON DELETE CASCADE,
    tanggal_habis   DATE            NOT NULL,
    tanggal_terbit  DATE            NOT NULL,
    negara_penerbit VARCHAR(50)     NOT NULL,
    jenis           VARCHAR(30)     NOT NULL CHECK (jenis IN ('Paspor', 'KTP', 'SIM'))
);

CREATE TABLE AWARD_MILES_PACKAGE (
    id                  VARCHAR(20)     PRIMARY KEY,
    harga_paket         DECIMAL(15,2)   NOT NULL,
    jumlah_award_miles  INT             NOT NULL
);

CREATE TABLE MEMBER_AWARD_MILES_PACKAGE (
    id_award_miles_package  VARCHAR(20)     NOT NULL REFERENCES AWARD_MILES_PACKAGE(id),
    email_member            VARCHAR(100)    NOT NULL REFERENCES MEMBER(email) ON DELETE CASCADE,
    timestamp               TIMESTAMP       NOT NULL,
    PRIMARY KEY (id_award_miles_package, email_member, timestamp)
);

CREATE TABLE BANDARA (
    iata_code   CHAR(3)         PRIMARY KEY,
    nama        VARCHAR(100)    NOT NULL,
    kota        VARCHAR(100)    NOT NULL,
    negara      VARCHAR(100)    NOT NULL
);

CREATE TABLE CLAIM_MISSING_MILES (
    id                      SERIAL          PRIMARY KEY,
    email_member            VARCHAR(100)    NOT NULL REFERENCES MEMBER(email) ON DELETE CASCADE,
    email_staf              VARCHAR(100)    REFERENCES STAF(email),
    maskapai                VARCHAR(10)     NOT NULL REFERENCES MASKAPAI(kode_maskapai),
    bandara_asal            CHAR(3)         NOT NULL REFERENCES BANDARA(iata_code),
    bandara_tujuan          CHAR(3)         NOT NULL REFERENCES BANDARA(iata_code),
    tanggal_penerbangan     DATE            NOT NULL,
    flight_number           VARCHAR(10)     NOT NULL,
    nomor_tiket             VARCHAR(20)     NOT NULL,
    kelas_kabin             VARCHAR(20)     NOT NULL CHECK (kelas_kabin IN ('Economy', 'Business', 'First')),
    pnr                     VARCHAR(10)     NOT NULL,
    status_penerimaan       VARCHAR(20)     NOT NULL DEFAULT 'Menunggu' CHECK (status_penerimaan IN ('Menunggu', 'Disetujui', 'Ditolak')),
    timestamp               TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (email_member, flight_number, tanggal_penerbangan, nomor_tiket)
);

CREATE TABLE TRANSFER (
    email_member_1  VARCHAR(100)    NOT NULL REFERENCES MEMBER(email) ON DELETE CASCADE,
    email_member_2  VARCHAR(100)    NOT NULL REFERENCES MEMBER(email) ON DELETE CASCADE,
    timestamp       TIMESTAMP       NOT NULL,
    jumlah          INT             NOT NULL,
    catatan         VARCHAR(255),
    PRIMARY KEY (email_member_1, email_member_2, timestamp),
    CHECK (email_member_1 <> email_member_2)
);

CREATE TABLE HADIAH (
    kode_hadiah         VARCHAR(20)     PRIMARY KEY,
    nama                VARCHAR(100)    NOT NULL,
    miles               INT             NOT NULL,
    deskripsi           TEXT,
    valid_start_date    DATE            NOT NULL,
    program_end         DATE            NOT NULL,
    id_penyedia         INT             NOT NULL REFERENCES PENYEDIA(id) ON DELETE CASCADE
);

CREATE TABLE REDEEM (
    email_member    VARCHAR(100)    NOT NULL REFERENCES MEMBER(email) ON DELETE CASCADE,
    kode_hadiah     VARCHAR(20)     NOT NULL REFERENCES HADIAH(kode_hadiah),
    timestamp       TIMESTAMP       NOT NULL,
    PRIMARY KEY (email_member, kode_hadiah, timestamp)
);

-- Data dummy lengkap ada di file SQL temanmu
-- (sudah include TIER, PENYEDIA, MASKAPAI, PENGGUNA, MEMBER, STAF, BANDARA, dst.)
