-- Update role Rayhan dari secretary menjadi approver
UPDATE himatif.users 
SET role = 'approver', 
    updated_at = CURRENT_TIMESTAMP 
WHERE email = 'rayhan@mail.com';

-- Verifikasi perubahan
SELECT id, employee_id, full_name, email, role, tenant_name, is_active 
FROM himatif.users 
WHERE email = 'rayhan@mail.com';
