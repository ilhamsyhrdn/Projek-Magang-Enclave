-- Create organization_structure table in each tenant schema

-- For superadmin schema
CREATE TABLE IF NOT EXISTS superadmin.organization_structure (
    id SERIAL PRIMARY KEY,
    position_id INTEGER NOT NULL REFERENCES superadmin.positions(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For himatif schema
CREATE TABLE IF NOT EXISTS himatif.organization_structure (
    id SERIAL PRIMARY KEY,
    position_id INTEGER NOT NULL REFERENCES himatif.positions(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For himatika_unpad schema
CREATE TABLE IF NOT EXISTS himatika_unpad.organization_structure (
    id SERIAL PRIMARY KEY,
    position_id INTEGER NOT NULL REFERENCES himatika_unpad.positions(id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data for himatif
INSERT INTO himatif.organization_structure (position_id, name, phone, email, is_active) VALUES
(1, 'Addres 0', '0812390582015', 'assa@gmail', true),
(2, 'lorem ipsum sit', '0812390582015', 'asas@gmail', true),
(3, 'lorem ipsum sit', '0812390582015', 'sad@gmail', true),
(4, 'lorem ipsum sit', '0812390582015', 'sdasd@gmail', true),
(5, 'lorem ipsum sit', '0812390582015', 'fads@gmail', true);

-- Note: Make sure you have positions with IDs 1-5 in your positions table
-- You can check with: SELECT id, name FROM himatif.positions ORDER BY id LIMIT 5;
