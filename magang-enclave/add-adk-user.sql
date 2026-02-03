-- SQL Script untuk menambahkan user ADK ke database
-- Role: adk
-- Email: Adk@mail.com
-- Password: adk123

-- Insert user ADK ke tabel himatif.users (tanpa foreign key yang bermasalah)
INSERT INTO himatif.users (
    employee_id, 
    full_name, 
    email, 
    password_hash, 
    division_id, 
    department_id, 
    position_id, 
    role, 
    tenant_name, 
    is_active, 
    created_at, 
    updated_at
) VALUES (
    'ADK001',           -- employee_id
    'ADK User',         -- full_name
    'Adk@mail.com',     -- email
    'adk123',           -- password_hash (plaintext untuk test)
    NULL,               -- division_id (set NULL untuk avoid FK constraint)
    NULL,               -- department_id
    NULL,               -- position_id (set NULL untuk avoid FK constraint)
    'adk',              -- role
    'himatif',          -- tenant_name
    true,               -- is_active
    CURRENT_TIMESTAMP,  -- created_at
    CURRENT_TIMESTAMP   -- updated_at
);

-- Verifikasi user sudah ditambahkan
SELECT id, employee_id, full_name, email, role, tenant_name, is_active 
FROM himatif.users 
WHERE email = 'Adk@mail.com';
