-- Update Divisi, Departemen, dan Jabatan sesuai struktur organisasi

-- Hapus data lama jika ada
TRUNCATE TABLE himatif.positions CASCADE;
TRUNCATE TABLE himatif.departments CASCADE;
TRUNCATE TABLE himatif.divisions CASCADE;

-- Insert Divisi
INSERT INTO himatif.divisions (name, code, is_active) VALUES
('Divisi Internal', 'DI', true),
('Divisi Eksternal', 'DE', true),
('Divisi Akademik dan Profesi', 'DAP', true),
('Divisi Ekonomi dan Bisnis', 'DEB', true),
('Divisi Administrasi dan Kesekretariatan', 'DAK', true);

-- Insert Departemen untuk Divisi Internal
INSERT INTO himatif.departments (name, code, division_id, is_active)
SELECT 
    'Departemen Pengembangan Organisasi', 'DPO', id, true 
FROM himatif.divisions WHERE code = 'DI'
UNION ALL
SELECT 
    'Departemen Kaderisasi', 'DK', id, true 
FROM himatif.divisions WHERE code = 'DI'
UNION ALL
SELECT 
    'Departemen Hubungan Internal', 'DHI', id, true 
FROM himatif.divisions WHERE code = 'DI';

-- Insert Departemen untuk Divisi Eksternal
INSERT INTO himatif.departments (name, code, division_id, is_active)
SELECT 
    'Departemen Hubungan Eksternal', 'DHE', id, true 
FROM himatif.divisions WHERE code = 'DE'
UNION ALL
SELECT 
    'Departemen Sosial', 'DS', id, true 
FROM himatif.divisions WHERE code = 'DE'
UNION ALL
SELECT 
    'Departemen Media', 'DM', id, true 
FROM himatif.divisions WHERE code = 'DE'
UNION ALL
SELECT 
    'Departemen Informasi', 'DI', id, true 
FROM himatif.divisions WHERE code = 'DE';

-- Insert Departemen untuk Divisi Akademik dan Profesi
INSERT INTO himatif.departments (name, code, division_id, is_active)
SELECT 
    'Departemen Kelimuan', 'DKL', id, true 
FROM himatif.divisions WHERE code = 'DAP'
UNION ALL
SELECT 
    'Departemen Keprofesian', 'DKP', id, true 
FROM himatif.divisions WHERE code = 'DAP'
UNION ALL
SELECT 
    'Departemen Pengembangan Teknologi & Informasi', 'DPTI', id, true 
FROM himatif.divisions WHERE code = 'DAP'
UNION ALL
SELECT 
    'Departemen Minat Bakat', 'DMB', id, true 
FROM himatif.divisions WHERE code = 'DAP'
UNION ALL
SELECT 
    'Departemen Keuangan', 'DKU', id, true 
FROM himatif.divisions WHERE code = 'DAP'
UNION ALL
SELECT 
    'Departemen Kewirausahaan', 'DKW', id, true 
FROM himatif.divisions WHERE code = 'DAP';

-- Insert Jabatan
INSERT INTO himatif.positions (name, level, description, is_active) VALUES
('Ketua', 'Struktural - Tingkat 1', 'Ketua organisasi', true),
('Wakil Ketua', 'Struktural - Tingkat 1', 'Wakil ketua organisasi', true),
('Ketua Divisi', 'Struktural - Tingkat 2', 'Kepala divisi', true),
('Ketua Departemen', 'Struktural - Tingkat 3', 'Kepala departemen', true),
('Anggota', 'Non-Struktural', 'Anggota organisasi', true);

-- Tampilkan hasil
SELECT 'Divisi' as tabel, COUNT(*) as jumlah FROM himatif.divisions
UNION ALL
SELECT 'Departemen', COUNT(*) FROM himatif.departments
UNION ALL
SELECT 'Jabatan', COUNT(*) FROM himatif.positions;

-- Tampilkan detail divisi dengan jumlah departemen
SELECT 
    d.name as divisi,
    d.code as kode_divisi,
    COUNT(dep.id) as jumlah_departemen
FROM himatif.divisions d
LEFT JOIN himatif.departments dep ON dep.division_id = d.id
GROUP BY d.id, d.name, d.code
ORDER BY d.name;

-- Tampilkan semua departemen dengan divisinya
SELECT 
    div.name as divisi,
    dep.name as departemen,
    dep.code as kode_departemen
FROM himatif.departments dep
JOIN himatif.divisions div ON dep.division_id = div.id
ORDER BY div.name, dep.name;

-- Tampilkan semua jabatan
SELECT name, level, description FROM himatif.positions ORDER BY 
    CASE 
        WHEN name = 'Ketua' THEN 1
        WHEN name = 'Wakil Ketua' THEN 2
        WHEN name = 'Ketua Divisi' THEN 3
        WHEN name = 'Ketua Departemen' THEN 4
        WHEN name = 'Anggota' THEN 5
        ELSE 6
    END;
