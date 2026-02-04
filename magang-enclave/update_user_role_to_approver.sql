-- Update role user jadi approver
-- sesuaikan email user
UPDATE himatif.users 
SET role = 'approver', 
    updated_at = CURRENT_TIMESTAMP 
WHERE email = 'user@mail.com';

-- cek hasil update
SELECT id, employee_id, full_name, email, role, tenant_name, is_active 
FROM himatif.users 
WHERE email = 'user@mail.com';
