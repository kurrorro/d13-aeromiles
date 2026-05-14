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
    email           VARCHAR(100)     PRIMARY KEY REFERENCES PENGGUNA(email),
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

INSERT INTO TIER (id_tier, nama, minimal_frekuensi_terbang, minimal_tier_miles) VALUES
('T001', 'Blue',      0,      0),
('T002', 'Silver',    10,     25000),
('T003', 'Gold',      25,     50000),
('T004', 'Platinum',  50,     100000);

INSERT INTO PENYEDIA DEFAULT VALUES;
INSERT INTO PENYEDIA DEFAULT VALUES;
INSERT INTO PENYEDIA DEFAULT VALUES;
INSERT INTO PENYEDIA DEFAULT VALUES; 
INSERT INTO PENYEDIA DEFAULT VALUES;
INSERT INTO PENYEDIA DEFAULT VALUES;
INSERT INTO PENYEDIA DEFAULT VALUES; 
INSERT INTO PENYEDIA DEFAULT VALUES; 
INSERT INTO PENYEDIA DEFAULT VALUES;
INSERT INTO PENYEDIA DEFAULT VALUES;

INSERT INTO MASKAPAI (kode_maskapai, nama_maskapai, id_penyedia) VALUES
('GA',  'Garuda Indonesia',     1),
('JT',  'Lion Air',             2),
('QG',  'Citilink',             3),
('ID',  'Batik Air',            4),
('QZ',  'AirAsia Indonesia',    5);

INSERT INTO PENGGUNA (email, password, salutation, first_mid_name, last_name, country_code, mobile_number, tanggal_lahir, kewarganegaraan) VALUES
('alice.johnson@email.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Alice',            'Johnson',      '+62',  '81234567801', '1990-05-15', 'Indonesia'),
('budi.santoso@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Budi',             'Santoso',      '+62',  '81234567802', '1985-08-22', 'Indonesia'),
('carol.williams@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mrs.', 'Carol',            'Williams',     '+62',  '81234567803', '1992-03-10', 'Indonesia'),
('david.brown@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'David',            'Brown',        '+65',  '91234567804', '1988-11-30', 'Singapore'),
('eva.davis@email.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Eva',              'Davis',        '+62',  '81234567805', '1995-07-04', 'Indonesia'),
('fajar.pratama@email.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Fajar',            'Pratama',      '+62',  '81234567806', '1991-02-18', 'Indonesia'),
('gita.lestari@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Gita',             'Lestari',      '+62',  '81234567807', '1993-09-25', 'Indonesia'),
('hendra.wijaya@email.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Hendra',           'Wijaya',       '+62',  '81234567808', '1987-12-01', 'Indonesia'),
('indah.permata@email.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Indah',            'Permata',      '+62',  '81234567809', '1994-04-14', 'Indonesia'),
('joko.susilo@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Joko',             'Susilo',       '+62',  '81234567810', '1982-06-30', 'Indonesia'),
('kartini.dewi@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Kartini',          'Dewi',         '+62',  '81234567811', '1996-01-21', 'Indonesia'),
('lukman.hakim@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Lukman',           'Hakim',        '+62',  '81234567812', '1989-03-07', 'Indonesia'),
('maya.sari@email.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Maya',             'Sari',         '+62',  '81234567813', '1997-10-19', 'Indonesia'),
('nanda.putra@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Nanda',            'Putra',        '+62',  '81234567814', '1986-07-11', 'Indonesia'),
('olivia.tan@email.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Olivia',           'Tan',          '+65',  '91234567815', '1993-12-28', 'Singapore'),
('pandu.wicaksono@email.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Pandu',            'Wicaksono',    '+62',  '81234567816', '1990-08-03', 'Indonesia'),
('qisthi.rahmah@email.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Qisthi',           'Rahmah',       '+62',  '81234567817', '1998-05-17', 'Indonesia'),
('reza.firmansyah@email.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Reza',             'Firmansyah',   '+62',  '81234567818', '1984-11-09', 'Indonesia'),
('sari.dewi@email.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Sari',             'Dewi',         '+62',  '81234567819', '1991-06-22', 'Indonesia'),
('tono.hartono@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Tono',             'Hartono',      '+62',  '81234567820', '1983-02-14', 'Indonesia'),
('udin.saputra@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Udin',             'Saputra',      '+62',  '81234567821', '1995-09-08', 'Indonesia'),
('vina.kusuma@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Vina',             'Kusuma',       '+62',  '81234567822', '1992-04-30', 'Indonesia'),
('wahyu.nugroho@email.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Wahyu',            'Nugroho',      '+62',  '81234567823', '1988-01-16', 'Indonesia'),
('xena.putri@email.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Xena',             'Putri',        '+62',  '81234567824', '1999-07-05', 'Indonesia'),
('yoga.pratama@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Yoga',             'Pratama',      '+62',  '81234567825', '1994-03-23', 'Indonesia'),
('zara.amelia@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Zara',             'Amelia',       '+62',  '81234567826', '1997-11-12', 'Indonesia'),
('andre.halim@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Andre',            'Halim',        '+62',  '81234567827', '1986-08-27', 'Indonesia'),
('bella.safitri@email.com',     '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Bella',            'Safitri',      '+62',  '81234567828', '1993-05-04', 'Indonesia'),
('candra.utama@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Candra',           'Utama',        '+62',  '81234567829', '1990-12-18', 'Indonesia'),
('dini.rahayu@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Dini',             'Rahayu',       '+62',  '81234567830', '1996-02-09', 'Indonesia'),
('eko.suryanto@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Eko',              'Suryanto',     '+62',  '81234567831', '1981-10-31', 'Indonesia'),
('fina.kurniawati@email.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Fina',             'Kurniawati',   '+62',  '81234567832', '1994-06-15', 'Indonesia'),
('guntur.perdana@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Guntur',           'Perdana',      '+62',  '81234567833', '1987-04-02', 'Indonesia'),
('hani.astuti@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Hani',             'Astuti',       '+62',  '81234567834', '1998-09-20', 'Indonesia'),
('ivan.christian@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Ivan',             'Christian',    '+62',  '81234567835', '1985-01-07', 'Indonesia'),
('julia.sekarsari@email.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Julia',            'Sekarsari',    '+62',  '81234567836', '1992-07-24', 'Indonesia'),
('kevin.lim@email.com',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Kevin',            'Lim',          '+60',  '121234567837','1989-03-13', 'Malaysia'),
('linda.wulandari@email.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Linda',            'Wulandari',    '+62',  '81234567838', '1995-11-26', 'Indonesia'),
('mario.setiawan@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Mario',            'Setiawan',     '+62',  '81234567839', '1983-08-10', 'Indonesia'),
('nina.anggraini@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Nina',             'Anggraini',    '+62',  '81234567840', '1997-05-29', 'Indonesia'),
('oscar.manurung@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Oscar',            'Manurung',     '+62',  '81234567841', '1991-02-04', 'Indonesia'),
('putri.maharani@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Putri',            'Maharani',     '+62',  '81234567842', '1996-09-17', 'Indonesia'),
('qodir.rahman@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Qodir',            'Rahman',       '+62',  '81234567843', '1984-06-06', 'Indonesia'),
('rina.melati@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Rina',             'Melati',       '+62',  '81234567844', '1993-01-23', 'Indonesia'),
('surya.hermawan@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Surya',            'Hermawan',     '+62',  '81234567845', '1988-04-08', 'Indonesia'),
('tika.pradana@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Tika',             'Pradana',      '+62',  '81234567846', '1999-12-01', 'Indonesia'),
('ujang.sopyan@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Ujang',            'Sopyan',       '+62',  '81234567847', '1980-07-19', 'Indonesia'),
('vera.chandra@email.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Vera',             'Chandra',      '+62',  '81234567848', '1994-10-15', 'Indonesia'),
('wibowo.purnomo@email.com',    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Wibowo',           'Purnomo',      '+62',  '81234567849', '1982-03-28', 'Indonesia'),
('yuni.astuti@email.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Yuni',             'Astuti',       '+62',  '81234567850', '1997-08-14', 'Indonesia'),
('agus.budi@garuda.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Agus',             'Budi',         '+62',  '82111111101', '1980-01-15', 'Indonesia'),
('siti.rahayu@garuda.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Siti',             'Rahayu',       '+62',  '82111111102', '1983-04-22', 'Indonesia'),
('bambang.s@lionair.com',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Bambang',          'Sukirno',      '+62',  '82111111103', '1978-09-10', 'Indonesia'),
('dewi.indah@lionair.com',      '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Dewi',             'Indah',        '+62',  '82111111104', '1985-06-30', 'Indonesia'),
('erik.santoso@citilink.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Erik',             'Santoso',      '+62',  '82111111105', '1982-11-05', 'Indonesia'),
('fitri.nurhayati@citilink.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Fitri',            'Nurhayati',    '+62',  '82111111106', '1987-02-18', 'Indonesia'),
('galih.prabowo@batikair.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Galih',            'Prabowo',      '+62',  '82111111107', '1984-07-23', 'Indonesia'),
('hesti.w@batikair.com',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Hesti',            'Wulandari',    '+62',  '82111111108', '1990-03-14', 'Indonesia'),
('irfan.maulana@airasia.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Mr.',  'Irfan',            'Maulana',      '+62',  '82111111109', '1986-10-07', 'Indonesia'),
('jasmine.putri@airasia.com',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ms.',  'Jasmine',          'Putri',        '+62',  '82111111110', '1991-05-29', 'Indonesia');

INSERT INTO MEMBER (email, nomor_member, tanggal_bergabung, id_tier) VALUES
('alice.johnson@email.com',     'M0001', '2022-01-15', 'T001'),
('budi.santoso@email.com',      'M0002', '2022-02-20', 'T001'),
('carol.williams@email.com',    'M0003', '2022-03-05', 'T001'),
('david.brown@email.com',       'M0004', '2022-04-10', 'T001'),
('eva.davis@email.com',         'M0005', '2022-05-22', 'T001'),
('fajar.pratama@email.com',     'M0006', '2022-06-01', 'T001'),
('gita.lestari@email.com',      'M0007', '2022-07-14', 'T001'),
('hendra.wijaya@email.com',     'M0008', '2022-08-09', 'T001'),
('indah.permata@email.com',     'M0009', '2022-09-03', 'T001'),
('joko.susilo@email.com',       'M0010', '2022-10-18', 'T001'),
('kartini.dewi@email.com',      'M0011', '2022-11-25', 'T001'),
('lukman.hakim@email.com',      'M0012', '2022-12-07', 'T001'),
('maya.sari@email.com',         'M0013', '2023-01-19', 'T001'),
('nanda.putra@email.com',       'M0014', '2023-02-28', 'T001'),
('olivia.tan@email.com',        'M0015', '2023-03-15', 'T001'),
('pandu.wicaksono@email.com',   'M0016', '2023-04-22', 'T001'),
('qisthi.rahmah@email.com',     'M0017', '2023-05-11', 'T001'),
('reza.firmansyah@email.com',   'M0018', '2023-06-30', 'T001'),
('sari.dewi@email.com',         'M0019', '2023-07-04', 'T001'),
('tono.hartono@email.com',      'M0020', '2023-08-17', 'T001'),
('udin.saputra@email.com',      'M0021', '2021-01-10', 'T002'),
('vina.kusuma@email.com',       'M0022', '2021-02-14', 'T002'),
('wahyu.nugroho@email.com',     'M0023', '2021-03-20', 'T002'),
('xena.putri@email.com',        'M0024', '2021-04-08', 'T002'),
('yoga.pratama@email.com',      'M0025', '2021-05-16', 'T002'),
('zara.amelia@email.com',       'M0026', '2021-06-29', 'T002'),
('andre.halim@email.com',       'M0027', '2021-07-03', 'T002'),
('bella.safitri@email.com',     'M0028', '2021-08-21', 'T002'),
('candra.utama@email.com',      'M0029', '2021-09-12', 'T002'),
('dini.rahayu@email.com',       'M0030', '2021-10-05', 'T002'),
('eko.suryanto@email.com',      'M0031', '2021-11-18', 'T002'),
('fina.kurniawati@email.com',   'M0032', '2021-12-26', 'T002'),
('guntur.perdana@email.com',    'M0033', '2022-01-31', 'T002'),
('hani.astuti@email.com',       'M0034', '2022-02-07', 'T002'),
('ivan.christian@email.com',    'M0035', '2022-03-13', 'T002'),
('julia.sekarsari@email.com',   'M0036', '2020-01-05', 'T003'),
('kevin.lim@email.com',         'M0037', '2020-03-17', 'T003'),
('linda.wulandari@email.com',   'M0038', '2020-05-22', 'T003'),
('mario.setiawan@email.com',    'M0039', '2020-07-08', 'T003'),
('nina.anggraini@email.com',    'M0040', '2020-09-14', 'T003'),
('oscar.manurung@email.com',    'M0041', '2020-11-01', 'T003'),
('putri.maharani@email.com',    'M0042', '2021-01-20', 'T003'),
('qodir.rahman@email.com',      'M0043', '2021-03-09', 'T003'),
('rina.melati@email.com',       'M0044', '2021-05-27', 'T003'),
('surya.hermawan@email.com',    'M0045', '2021-07-16', 'T003'),
('tika.pradana@email.com',      'M0046', '2019-06-01', 'T004'),
('ujang.sopyan@email.com',      'M0047', '2019-08-11', 'T004'),
('vera.chandra@email.com',      'M0048', '2019-10-25', 'T004'),
('wibowo.purnomo@email.com',    'M0049', '2019-12-30', 'T004'),
('yuni.astuti@email.com',       'M0050', '2020-02-19', 'T004');

INSERT INTO STAF (email, id_staf, kode_maskapai) VALUES
('agus.budi@garuda.com',        'S0001', 'GA'),
('siti.rahayu@garuda.com',      'S0002', 'GA'),
('bambang.s@lionair.com',       'S0003', 'JT'),
('dewi.indah@lionair.com',      'S0004', 'JT'),
('erik.santoso@citilink.com',   'S0005', 'QG'),
('fitri.nurhayati@citilink.com','S0006', 'QG'),
('galih.prabowo@batikair.com',  'S0007', 'ID'),
('hesti.w@batikair.com',        'S0008', 'ID'),
('irfan.maulana@airasia.com',   'S0009', 'QZ'),
('jasmine.putri@airasia.com',   'S0010', 'QZ');

INSERT INTO MITRA (email_mitra, id_penyedia, nama_mitra, tanggal_kerja_sama) VALUES
('partner@hotelsantika.com',    6,  'Hotel Santika',                '2023-01-01'),
('partner@grandhyatt.com',      7,  'Grand Hyatt Jakarta',          '2023-06-15'),
('partner@restosederhana.com',  8,  'Restoran Padang Sederhana',    '2024-01-10'),
('partner@transrental.com',     9,  'Trans Rental Car',             '2024-03-20'),
('partner@plazaindonesia.com',  10, 'Plaza Indonesia',              '2024-07-01');

INSERT INTO IDENTITAS (nomor, email_member, tanggal_habis, tanggal_terbit, negara_penerbit, jenis) VALUES
('A1234567',        'alice.johnson@email.com',  '2030-01-15', '2020-01-15', 'Indonesia', 'Paspor'),
('3171234567890001','alice.johnson@email.com',  '2027-05-15', '2022-05-15', 'Indonesia', 'KTP'),
('3172345678901234','budi.santoso@email.com',   '2026-08-22', '2021-08-22', 'Indonesia', 'KTP'),
('SIM001234567',    'budi.santoso@email.com',   '2025-12-31', '2021-12-31', 'Indonesia', 'SIM'),
('B9876543',        'carol.williams@email.com', '2028-03-10', '2018-03-10', 'Indonesia', 'Paspor'),
('SG12345678',      'david.brown@email.com',    '2029-11-30', '2019-11-30', 'Singapore', 'Paspor'),
('3173456789012345','eva.davis@email.com',       '2027-07-04', '2022-07-04', 'Indonesia', 'KTP'),
('C1122334',        'eva.davis@email.com',       '2031-07-04', '2021-07-04', 'Indonesia', 'Paspor'),
('3174567890123456','fajar.pratama@email.com',  '2026-02-18', '2021-02-18', 'Indonesia', 'KTP'),
('D2233445',        'gita.lestari@email.com',   '2029-09-25', '2019-09-25', 'Indonesia', 'Paspor'),
('SIM002345678',    'gita.lestari@email.com',   '2026-03-15', '2022-03-15', 'Indonesia', 'SIM'),
('3175678901234567','hendra.wijaya@email.com',  '2025-12-01', '2020-12-01', 'Indonesia', 'KTP'),
('E3344556',        'indah.permata@email.com',  '2030-04-14', '2020-04-14', 'Indonesia', 'Paspor'),
('3176789012345678','joko.susilo@email.com',    '2026-06-30', '2021-06-30', 'Indonesia', 'KTP'),
('SIM003456789',    'joko.susilo@email.com',    '2025-06-30', '2021-06-30', 'Indonesia', 'SIM'),
('F4455667',        'tika.pradana@email.com',   '2032-12-01', '2022-12-01', 'Indonesia', 'Paspor'),
('3177890123456789','ujang.sopyan@email.com',   '2028-07-19', '2023-07-19', 'Indonesia', 'KTP'),
('G5566778',        'vera.chandra@email.com',   '2031-10-15', '2021-10-15', 'Indonesia', 'Paspor'),
('3178901234567890','vera.chandra@email.com',   '2027-10-15', '2022-10-15', 'Indonesia', 'KTP'),
('3179012345678901','wibowo.purnomo@email.com', '2027-03-28', '2022-03-28', 'Indonesia', 'KTP'),
('SIM004567890',    'wibowo.purnomo@email.com', '2026-03-28', '2022-03-28', 'Indonesia', 'SIM'),
('H6677889',        'yuni.astuti@email.com',    '2030-08-14', '2020-08-14', 'Indonesia', 'Paspor'),
('3180123456789012','julia.sekarsari@email.com','2026-01-05', '2021-01-05', 'Indonesia', 'KTP'),
('MY98765432',      'kevin.lim@email.com',      '2028-03-13', '2018-03-13', 'Malaysia',  'Paspor'),
('3181234567890123','linda.wulandari@email.com','2027-11-26', '2022-11-26', 'Indonesia', 'KTP'),
('I7788990',        'linda.wulandari@email.com','2029-11-26', '2019-11-26', 'Indonesia', 'Paspor'),
('3182345678901234','mario.setiawan@email.com', '2028-08-10', '2023-08-10', 'Indonesia', 'KTP'),
('SIM005678901',    'nina.anggraini@email.com', '2026-05-29', '2022-05-29', 'Indonesia', 'SIM'),
('SG87654321',      'olivia.tan@email.com',     '2030-12-28', '2020-12-28', 'Singapore', 'Paspor'),
('3183456789012345','surya.hermawan@email.com', '2026-04-08', '2021-04-08', 'Indonesia', 'KTP');

INSERT INTO AWARD_MILES_PACKAGE (id, harga_paket, jumlah_award_miles) VALUES
('AMP-001',  150000.00,   1000),
('AMP-002',  275000.00,   2000),
('AMP-003',  500000.00,   4000),
('AMP-004',  900000.00,   8000),
('AMP-005', 1500000.00,  15000);

INSERT INTO BANDARA (iata_code, nama, kota, negara) VALUES
('CGK', 'Soekarno-Hatta International Airport',         'Tangerang',    'Indonesia'),
('DPS', 'Ngurah Rai International Airport',             'Denpasar',     'Indonesia'),
('SUB', 'Juanda International Airport',                 'Surabaya',     'Indonesia'),
('KNO', 'Kualanamu International Airport',              'Medan',        'Indonesia'),
('UPG', 'Sultan Hasanuddin International Airport',      'Makassar',     'Indonesia'),
('BPN', 'Sultan Aji Muhammad Sulaiman Airport',         'Balikpapan',   'Indonesia'),
('JOG', 'Adisutjipto International Airport',            'Yogyakarta',   'Indonesia'),
('PLM', 'Sultan Mahmud Badaruddin II Airport',          'Palembang',    'Indonesia'),
('SIN', 'Singapore Changi Airport',                     'Singapore',    'Singapore'),
('KUL', 'Kuala Lumpur International Airport',           'Kuala Lumpur', 'Malaysia'),
('BKK', 'Suvarnabhumi Airport',                         'Bangkok',      'Thailand'),
('HKG', 'Hong Kong International Airport',              'Hong Kong',    'China'),
('NRT', 'Narita International Airport',                 'Tokyo',        'Japan'),
('SYD', 'Sydney Kingsford Smith Airport',               'Sydney',       'Australia'),
('DXB', 'Dubai International Airport',                  'Dubai',        'UAE');

INSERT INTO CLAIM_MISSING_MILES (email_member, email_staf, maskapai, bandara_asal, bandara_tujuan, tanggal_penerbangan, flight_number, nomor_tiket, kelas_kabin, pnr, status_penerimaan, timestamp) VALUES
('alice.johnson@email.com',     'agus.budi@garuda.com',         'GA', 'CGK', 'DPS', '2025-01-10', 'GA401',  'TKT20250101', 'Economy',  'ABC1001', 'Disetujui', '2025-01-15 10:00:00'),
('alice.johnson@email.com',     NULL,                           'GA', 'DPS', 'CGK', '2025-03-20', 'GA402',  'TKT20250302', 'Business', 'ABC1002', 'Menunggu',  '2025-03-22 14:30:00'),
('budi.santoso@email.com',      'siti.rahayu@garuda.com',       'GA', 'CGK', 'SUB', '2025-01-05', 'GA501',  'TKT20250103', 'Economy',  'DEF1001', 'Ditolak',   '2025-01-08 09:00:00'),
('budi.santoso@email.com',      NULL,                           'JT', 'CGK', 'UPG', '2025-04-01', 'JT201',  'TKT20250404', 'Economy',  'DEF1002', 'Menunggu',  '2025-04-03 11:00:00'),
('carol.williams@email.com',    'bambang.s@lionair.com',        'JT', 'SUB', 'CGK', '2025-02-14', 'JT301',  'TKT20250205', 'Economy',  'GHI1001', 'Disetujui', '2025-02-16 08:30:00'),
('david.brown@email.com',       'dewi.indah@lionair.com',       'JT', 'SIN', 'CGK', '2025-02-28', 'JT401',  'TKT20250206', 'First',    'JKL1001', 'Disetujui', '2025-03-01 10:00:00'),
('eva.davis@email.com',         NULL,                           'QG', 'CGK', 'BPN', '2025-03-05', 'QG101',  'TKT20250307', 'Economy',  'MNO1001', 'Menunggu',  '2025-03-07 13:00:00'),
('fajar.pratama@email.com',     'erik.santoso@citilink.com',    'QG', 'DPS', 'CGK', '2025-01-18', 'QG201',  'TKT20250108', 'Economy',  'PQR1001', 'Disetujui', '2025-01-20 15:00:00'),
('gita.lestari@email.com',      NULL,                           'ID', 'CGK', 'KNO', '2025-04-10', 'ID101',  'TKT20250409', 'Business', 'STU1001', 'Menunggu',  '2025-04-12 09:30:00'),
('hendra.wijaya@email.com',     'galih.prabowo@batikair.com',   'ID', 'UPG', 'CGK', '2025-02-22', 'ID201',  'TKT20250210', 'Economy',  'VWX1001', 'Disetujui', '2025-02-24 11:00:00'),
('tika.pradana@email.com',      'agus.budi@garuda.com',         'GA', 'CGK', 'NRT', '2025-01-25', 'GA601',  'TKT20250111', 'Business', 'YZA1001', 'Disetujui', '2025-01-27 16:00:00'),
('ujang.sopyan@email.com',      NULL,                           'QZ', 'KUL', 'CGK', '2025-03-15', 'QZ101',  'TKT20250312', 'Economy',  'BCD1001', 'Menunggu',  '2025-03-17 08:00:00'),
('vera.chandra@email.com',      'irfan.maulana@airasia.com',    'QZ', 'CGK', 'BKK', '2025-02-08', 'QZ201',  'TKT20250213', 'Economy',  'EFG1001', 'Disetujui', '2025-02-10 14:00:00'),
('wibowo.purnomo@email.com',    'jasmine.putri@airasia.com',    'QZ', 'SIN', 'DPS', '2025-01-30', 'QZ301',  'TKT20250114', 'First',    'HIJ1001', 'Ditolak',   '2025-02-01 10:30:00'),
('yuni.astuti@email.com',       NULL,                           'GA', 'CGK', 'SYD', '2025-04-05', 'GA701',  'TKT20250415', 'Economy',  'KLM1001', 'Menunggu',  '2025-04-07 12:00:00'),
('julia.sekarsari@email.com',   'siti.rahayu@garuda.com',       'GA', 'JOG', 'CGK', '2025-03-12', 'GA801',  'TKT20250316', 'Economy',  'NOP1001', 'Disetujui', '2025-03-14 09:00:00'),
('kevin.lim@email.com',         NULL,                           'JT', 'KUL', 'SUB', '2025-04-20', 'JT501',  'TKT20250417', 'Business', 'QRS1001', 'Menunggu',  '2025-04-22 11:30:00'),
('linda.wulandari@email.com',   'dewi.indah@lionair.com',       'JT', 'CGK', 'PLM', '2025-02-05', 'JT601',  'TKT20250218', 'Economy',  'TUV1001', 'Disetujui', '2025-02-07 13:30:00'),
('mario.setiawan@email.com',    NULL,                           'ID', 'CGK', 'DPS', '2025-03-28', 'ID301',  'TKT20250319', 'Economy',  'WXY1001', 'Menunggu',  '2025-03-30 10:00:00'),
('nina.anggraini@email.com',    'fitri.nurhayati@citilink.com', 'QG', 'CGK', 'JOG', '2025-01-14', 'QG301',  'TKT20250120', 'Economy',  'ZAB1001', 'Ditolak',   '2025-01-16 15:00:00');

INSERT INTO TRANSFER (email_member_1, email_member_2, timestamp, jumlah, catatan) VALUES
('tika.pradana@email.com',      'alice.johnson@email.com',  '2025-02-01 10:00:00',  2000, 'Transfer untuk teman'),
('ujang.sopyan@email.com',      'budi.santoso@email.com',   '2025-02-05 11:30:00',  1500, 'Berbagi miles'),
('vera.chandra@email.com',      'carol.williams@email.com', '2025-02-10 09:00:00',  1000, 'Hadiah ulang tahun'),
('wibowo.purnomo@email.com',    'david.brown@email.com',    '2025-02-15 14:00:00',  3000, 'Kiriman keluarga'),
('yuni.astuti@email.com',       'eva.davis@email.com',      '2025-02-20 16:00:00',  500,  NULL),
('tika.pradana@email.com',      'fajar.pratama@email.com',  '2025-03-01 08:30:00',  2500, 'Bantu naik tier'),
('julia.sekarsari@email.com',   'gita.lestari@email.com',   '2025-03-05 10:00:00',  1200, NULL),
('kevin.lim@email.com',         'hendra.wijaya@email.com',  '2025-03-10 13:00:00',  800,  'Transfer lintas negara'),
('linda.wulandari@email.com',   'indah.permata@email.com',  '2025-03-15 15:30:00',  600,  'Terimakasih'),
('mario.setiawan@email.com',    'joko.susilo@email.com',    '2025-03-20 09:30:00',  1800, NULL),
('vera.chandra@email.com',      'kartini.dewi@email.com',   '2025-04-01 11:00:00',  750,  'Untuk perjalanan'),
('wibowo.purnomo@email.com',    'lukman.hakim@email.com',   '2025-04-05 14:30:00',  1000, NULL),
('ujang.sopyan@email.com',      'maya.sari@email.com',      '2025-04-10 16:00:00',  2000, 'Kiriman rutin'),
('yuni.astuti@email.com',       'nanda.putra@email.com',    '2025-04-15 10:00:00',  500,  NULL),
('tika.pradana@email.com',      'olivia.tan@email.com',     '2025-04-20 12:00:00',  3000, 'Miles liburan bersama');

INSERT INTO HADIAH (kode_hadiah, nama, miles, deskripsi, valid_start_date, program_end, id_penyedia) VALUES
('RWD-001', 'Diskon Menginap 20%',          5000,   'Diskon 20% untuk menginap di Hotel Santika seluruh Indonesia',         '2025-01-01', '2025-12-31', 6),
('RWD-002', 'Free Breakfast 2 Pax',         3000,   'Sarapan gratis untuk 2 orang di Hotel Santika',                        '2025-01-01', '2025-12-31', 6),
('RWD-003', 'Voucher Makan Rp 150.000',     2000,   'Voucher makan siang/malam di Restoran Padang Sederhana',               '2025-01-01', '2025-06-30', 8),
('RWD-004', 'Upgrade Kabin Gratis',         10000,  'Upgrade ke Business Class untuk 1 penerbangan Garuda Indonesia',       '2025-03-01', '2025-12-31', 1),
('RWD-005', 'VIP Lounge Access CGK',        4000,   'Akses VIP Lounge di Bandara Soekarno-Hatta',                          '2025-01-01', '2025-12-31', 1),
('RWD-006', 'Diskon Rental Mobil 30%',      3500,   'Diskon 30% sewa kendaraan di Trans Rental Car seluruh Indonesia',      '2025-02-01', '2025-12-31', 9),
('RWD-007', 'Shopping Voucher Rp 300.000',  7000,   'Voucher belanja di Plaza Indonesia Jakarta',                           '2025-01-15', '2025-09-30', 10),
('RWD-008', 'Extra Bagasi 10kg',            2500,   'Tambahan bagasi 10kg untuk 1 penerbangan Garuda Indonesia',            '2025-01-01', '2025-12-31', 1),
('RWD-009', 'Free Night Grand Hyatt',       20000,  'Menginap gratis 1 malam di Grand Hyatt Jakarta (Superior Room)',       '2025-04-01', '2025-12-31', 7),
('RWD-010', 'Priority Check-in',            1500,   'Priority check-in dan boarding untuk penerbangan Lion Air',            '2025-01-01', '2025-06-30', 2);

INSERT INTO MEMBER_AWARD_MILES_PACKAGE (id_award_miles_package, email_member, timestamp) VALUES
('AMP-001', 'alice.johnson@email.com',      '2025-01-20 10:00:00'),
('AMP-002', 'alice.johnson@email.com',      '2025-02-10 11:00:00'),
('AMP-001', 'budi.santoso@email.com',       '2025-01-25 14:00:00'),
('AMP-003', 'carol.williams@email.com',     '2025-02-05 09:00:00'),
('AMP-004', 'david.brown@email.com',        '2025-02-20 15:00:00'),
('AMP-002', 'eva.davis@email.com',          '2025-03-01 10:30:00'),
('AMP-001', 'fajar.pratama@email.com',      '2025-03-05 13:00:00'),
('AMP-005', 'tika.pradana@email.com',       '2025-01-10 09:00:00'),
('AMP-003', 'ujang.sopyan@email.com',       '2025-01-28 14:30:00'),
('AMP-004', 'vera.chandra@email.com',       '2025-02-14 11:00:00'),
('AMP-002', 'wibowo.purnomo@email.com',     '2025-03-10 16:00:00'),
('AMP-005', 'yuni.astuti@email.com',        '2025-03-20 10:00:00'),
('AMP-001', 'julia.sekarsari@email.com',    '2025-02-01 09:30:00'),
('AMP-003', 'kevin.lim@email.com',          '2025-02-15 14:00:00'),
('AMP-002', 'linda.wulandari@email.com',    '2025-03-08 11:30:00'),
('AMP-004', 'mario.setiawan@email.com',     '2025-03-25 15:00:00'),
('AMP-001', 'nina.anggraini@email.com',     '2025-04-02 10:00:00'),
('AMP-005', 'tika.pradana@email.com',       '2025-04-05 09:00:00'),
('AMP-002', 'ujang.sopyan@email.com',       '2025-04-10 14:00:00'),
('AMP-003', 'vera.chandra@email.com',       '2025-04-15 13:30:00');

INSERT INTO REDEEM (email_member, kode_hadiah, timestamp) VALUES
('tika.pradana@email.com',      'RWD-009', '2025-04-10 10:00:00'),
('tika.pradana@email.com',      'RWD-004', '2025-04-15 14:00:00'),
('ujang.sopyan@email.com',      'RWD-001', '2025-02-01 11:00:00'),
('ujang.sopyan@email.com',      'RWD-006', '2025-03-10 09:00:00'),
('vera.chandra@email.com',      'RWD-005', '2025-02-20 10:30:00'),
('vera.chandra@email.com',      'RWD-007', '2025-03-25 15:00:00'),
('wibowo.purnomo@email.com',    'RWD-002', '2025-03-05 13:00:00'),
('wibowo.purnomo@email.com',    'RWD-008', '2025-04-01 16:00:00'),
('yuni.astuti@email.com',       'RWD-004', '2025-03-15 11:30:00'),
('yuni.astuti@email.com',       'RWD-005', '2025-04-20 10:00:00'),
('julia.sekarsari@email.com',   'RWD-003', '2025-02-10 09:30:00'),
('julia.sekarsari@email.com',   'RWD-010', '2025-03-01 14:00:00'),
('kevin.lim@email.com',         'RWD-001', '2025-02-25 11:00:00'),
('linda.wulandari@email.com',   'RWD-008', '2025-03-12 13:00:00'),
('mario.setiawan@email.com',    'RWD-006', '2025-04-05 16:30:00'),
('nina.anggraini@email.com',    'RWD-003', '2025-04-08 10:00:00'),
('alice.johnson@email.com',     'RWD-010', '2025-02-05 09:00:00'),
('budi.santoso@email.com',      'RWD-002', '2025-03-20 14:30:00'),
('carol.williams@email.com',    'RWD-007', '2025-04-12 11:00:00'),
('david.brown@email.com',       'RWD-009', '2025-04-18 15:00:00');