import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'eoffice_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function getTenantConnection(tenantName: string) {
  const client = await pool.connect();
  
  try {
    const sanitizedTenant = tenantName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    await client.query(`SET search_path TO ${sanitizedTenant}, public`);
    
    return client;
  } catch (error) {
    client.release();
    throw error;
  }
}

export async function queryWithTenant<T = any>(
  tenantName: string,
  text: string,
  params?: any[]
): Promise<T[]> {
  const client = await getTenantConnection(tenantName);
  
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
}

export async function createTenantSchema(tenantName: string) {
  const client = await pool.connect();
  const sanitizedTenant = tenantName.toLowerCase().replace(/[^a-z0-9_]/g, '');
  
  try {
    await client.query('BEGIN');
    
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${sanitizedTenant}`);
    
    await client.query(`SET search_path TO ${sanitizedTenant}, public`);
    
    await client.query(`
      CREATE TABLE ${sanitizedTenant}.divisions (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "code" VARCHAR(50) NOT NULL UNIQUE,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.departments (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "code" VARCHAR(50) NOT NULL UNIQUE,
        "division_id" INTEGER NOT NULL,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.positions (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "level" VARCHAR(50),
        "description" TEXT,
        "is_active" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.users (
        "id" SERIAL PRIMARY KEY,
        "employee_id" VARCHAR(50) NOT NULL UNIQUE,
        "full_name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "division_id" INTEGER,
        "department_id" INTEGER,
        "position_id" INTEGER,
        "role" VARCHAR(50) NOT NULL,
        "tenant_name" VARCHAR(100) NOT NULL,
        "reset_token" VARCHAR(10),
        "reset_token_expiry" TIMESTAMP,
        "is_active" BOOLEAN DEFAULT true,
        "last_login" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.categories (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "code" VARCHAR(50) NOT NULL UNIQUE,
        "description" TEXT,
        "module_type" VARCHAR(50) NOT NULL,
        "division_id" INTEGER,
        "department_id" INTEGER,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.incoming_mails (
        "id" SERIAL PRIMARY KEY,
        "mail_number" VARCHAR(100) NOT NULL UNIQUE,
        "mail_date" DATE NOT NULL,
        "mail_path" VARCHAR(500),
        "sender_name" VARCHAR(255) NOT NULL,
        "sender_address" TEXT,
        "sender_organization" VARCHAR(255),
        "subject" TEXT NOT NULL,
        "priority" VARCHAR(20) DEFAULT 'normal',
        "notes" TEXT,
        "status" VARCHAR(50) DEFAULT 'received',
        "received_by" INTEGER NOT NULL,
        "received_date" TIMESTAMPTZ NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.dispositions (
        "id" SERIAL PRIMARY KEY,
        "incoming_mail_id" INTEGER NOT NULL,
        "from_user_id" INTEGER NOT NULL,
        "to_user_id" INTEGER,
        "to_division_id" INTEGER,
        "to_department_id" INTEGER,
        "instruction" TEXT NOT NULL,
        "notes" TEXT,
        "due_date" DATE,
        "priority" VARCHAR(20) DEFAULT 'normal',
        "status" VARCHAR(50) DEFAULT 'pending',
        "completed_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.disposition_history (
        "id" SERIAL PRIMARY KEY,
        "disposition_id" INTEGER NOT NULL,
        "action" VARCHAR(100) NOT NULL,
        "action_by" INTEGER NOT NULL,
        "notes" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_templates (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "category_id" INTEGER NOT NULL,
        "division_id" INTEGER,
        "description" TEXT,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_config_levels (
        "id" SERIAL PRIMARY KEY,
        "template_id" INTEGER NOT NULL,
        "user_id" INTEGER,
        "division_id" INTEGER,
        "department_id" INTEGER,
        "level_order" INTEGER NOT NULL,
        "action_type" VARCHAR(50) NOT NULL,
        "is_required" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_mails (
        "id" SERIAL PRIMARY KEY,
        "mail_number" VARCHAR(100) UNIQUE,
        "template_id" INTEGER,
        "category_id" INTEGER NOT NULL,
        "subject" TEXT NOT NULL,
        "recipient_name" VARCHAR(255) NOT NULL,
        "recipient_address" TEXT,
        "recipient_organization" VARCHAR(255),
        "priority" VARCHAR(20) DEFAULT 'normal',
        "mail_path" VARCHAR(500),
        "status" VARCHAR(50) DEFAULT 'draft',
        "current_approval_level" INTEGER DEFAULT 0,
        "sent_date" DATE,
        "notes" TEXT,
        "is_read" BOOLEAN DEFAULT false,
        "created_by" INTEGER NOT NULL,
        "updated_by" INTEGER,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_approval_flows (
        "id" SERIAL PRIMARY KEY,
        "outgoing_mail_id" INTEGER NOT NULL,
        "approver_id" INTEGER NOT NULL,
        "level_order" INTEGER NOT NULL,
        "action" VARCHAR(50) DEFAULT 'pending',
        "notes" TEXT,
        "approved_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.memo_templates (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "category_id" INTEGER NOT NULL,
        "division_id" INTEGER,
        "description" TEXT,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.memo_config_levels (
        "id" SERIAL PRIMARY KEY,
        "template_id" INTEGER NOT NULL,
        "user_id" INTEGER,
        "division_id" INTEGER,
        "department_id" INTEGER,
        "level_order" INTEGER NOT NULL,
        "action_type" VARCHAR(50) NOT NULL,
        "is_required" BOOLEAN DEFAULT true,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.memos (
        "id" SERIAL PRIMARY KEY,
        "memo_number" VARCHAR(100) UNIQUE,
        "template_id" INTEGER,
        "category_id" INTEGER NOT NULL,
        "subject" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "to_division_id" INTEGER,
        "to_department_id" INTEGER,
        "to_users" INTEGER[],
        "priority" VARCHAR(20) DEFAULT 'normal',
        "mail_path" VARCHAR(500),
        "status" VARCHAR(50) DEFAULT 'draft',
        "current_approval_level" INTEGER DEFAULT 0,
        "generated_by" INTEGER,
        "generated_at" TIMESTAMPTZ,
        "effective_date" DATE,
        "notes" TEXT,
        "created_by" INTEGER NOT NULL,
        "updated_by" INTEGER,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.memo_approval_flows (
        "id" SERIAL PRIMARY KEY,
        "memo_id" INTEGER NOT NULL,
        "approver_id" INTEGER NOT NULL,
        "level_order" INTEGER NOT NULL,
        "action" VARCHAR(50) DEFAULT 'pending',
        "notes" TEXT,
        "approved_at" TIMESTAMPTZ,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.notulensi_templates (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "category_id" INTEGER NOT NULL,
        "division_id" INTEGER,
        "description" TEXT,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.notulensi (
        "id" SERIAL PRIMARY KEY,
        "notulensi_number" VARCHAR(100) UNIQUE,
        "template_id" INTEGER,
        "category_id" INTEGER NOT NULL,
        "meeting_title" VARCHAR(255) NOT NULL,
        "meeting_date" TIMESTAMPTZ NOT NULL,
        "meeting_location" VARCHAR(255),
        "meeting_agenda" TEXT,
        "content" TEXT NOT NULL,
        "chairman_id" INTEGER,
        "secretary_id" INTEGER,
        "attachment_url" VARCHAR(500),
        "status" VARCHAR(50) DEFAULT 'draft',
        "completed_at" TIMESTAMPTZ,
        "notes" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "created_by" INTEGER NOT NULL,
        "updated_by" INTEGER
      );

      CREATE TABLE ${sanitizedTenant}.meeting_participants (
        "id" SERIAL PRIMARY KEY,
        "notulensi_id" INTEGER NOT NULL,
        "user_id" INTEGER,
        "division_id" INTEGER,
        "department_id" INTEGER,
        "role" VARCHAR(50),
        "attendance_status" VARCHAR(20) DEFAULT 'invited',
        "notes" TEXT,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.participant_notes (
        "id" SERIAL PRIMARY KEY,
        "notulensi_id" INTEGER NOT NULL,
        "user_id" INTEGER NOT NULL,
        "notes" TEXT NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE ${sanitizedTenant}.archived_documents (
        "id" SERIAL PRIMARY KEY,
        "document_id" INTEGER NOT NULL,
        "document_type" VARCHAR(50) NOT NULL,
        "document_number" VARCHAR(100) NOT NULL,
        "title" VARCHAR(500) NOT NULL,
        "content" TEXT,
        "category" VARCHAR(100),
        "division_id" INTEGER,
        "department_id" INTEGER,
        "document_date" DATE NOT NULL,
        "archived_date" DATE DEFAULT CURRENT_DATE,
        "file_url" VARCHAR(500),
        "archived_by" INTEGER NOT NULL,
        "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Tambahkan foreign keys
    await client.query(`
      ALTER TABLE ${sanitizedTenant}.departments ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE RESTRICT;

      ALTER TABLE ${sanitizedTenant}.users ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.users ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.users ADD FOREIGN KEY ("position_id") REFERENCES ${sanitizedTenant}.positions ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.categories ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.categories ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.incoming_mails ADD FOREIGN KEY ("received_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;

      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("incoming_mail_id") REFERENCES ${sanitizedTenant}.incoming_mails ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("from_user_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("to_user_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("to_division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("to_department_id") REFERENCES ${sanitizedTenant}.departments ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.disposition_history ADD FOREIGN KEY ("disposition_id") REFERENCES ${sanitizedTenant}.dispositions ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.disposition_history ADD FOREIGN KEY ("action_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;

      ALTER TABLE ${sanitizedTenant}.outgoing_templates ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.outgoing_templates ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.outgoing_templates ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("created_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("updated_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.outgoing_approval_flows ADD FOREIGN KEY ("outgoing_mail_id") REFERENCES ${sanitizedTenant}.outgoing_mails ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.outgoing_approval_flows ADD FOREIGN KEY ("approver_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;

      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.outgoing_templates ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("user_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.memo_templates ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.memo_templates ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.memo_templates ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("created_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("updated_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.memo_approval_flows ADD FOREIGN KEY ("memo_id") REFERENCES ${sanitizedTenant}.memos ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.memo_approval_flows ADD FOREIGN KEY ("approver_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;

      ALTER TABLE ${sanitizedTenant}.memo_config_levels ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.memo_templates ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.memo_config_levels ADD FOREIGN KEY ("user_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.memo_config_levels ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.memo_config_levels ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.notulensi_templates ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.notulensi_templates ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.notulensi_templates ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("created_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;
      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("updated_by") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("notulensi_id") REFERENCES ${sanitizedTenant}.notulensi ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("user_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id") ON DELETE SET NULL;

      ALTER TABLE ${sanitizedTenant}.participant_notes ADD FOREIGN KEY ("notulensi_id") REFERENCES ${sanitizedTenant}.notulensi ("id") ON DELETE CASCADE;
      ALTER TABLE ${sanitizedTenant}.participant_notes ADD FOREIGN KEY ("user_id") REFERENCES ${sanitizedTenant}.users ("id") ON DELETE RESTRICT;

      ALTER TABLE ${sanitizedTenant}.archived_documents ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id") ON DELETE SET NULL;
      ALTER TABLE ${sanitizedTenant}.archived_documents ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id") ON DELETE SET NULL;
    `);

    await client.query(`
      CREATE INDEX idx_users_email ON ${sanitizedTenant}.users(email);
      CREATE INDEX idx_users_employee_id ON ${sanitizedTenant}.users(employee_id);
      CREATE INDEX idx_incoming_mails_mail_number ON ${sanitizedTenant}.incoming_mails(mail_number);
      CREATE INDEX idx_incoming_mails_status ON ${sanitizedTenant}.incoming_mails(status);
      CREATE INDEX idx_dispositions_status ON ${sanitizedTenant}.dispositions(status);
      CREATE INDEX idx_outgoing_mails_status ON ${sanitizedTenant}.outgoing_mails(status);
      CREATE INDEX idx_memos_status ON ${sanitizedTenant}.memos(status);
      CREATE INDEX idx_archived_documents_type ON ${sanitizedTenant}.archived_documents(document_type);
      CREATE INDEX idx_archived_documents_date ON ${sanitizedTenant}.archived_documents(archived_date);
      CREATE INDEX IF NOT EXISTS idx_users_reset_token ON ${sanitizedTenant}.users(reset_token);
    `);
    
    await client.query('COMMIT');
    
    console.log(`Schema ${sanitizedTenant} berhasil dibuat`);
    return sanitizedTenant;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;