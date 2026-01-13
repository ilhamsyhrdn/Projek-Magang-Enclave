// lib/db.ts
import { Pool } from 'pg';

// Konfigurasi pool utama untuk database
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

// Fungsi untuk mendapatkan koneksi dengan schema tenant tertentu
export async function getTenantConnection(tenantName: string) {
  const client = await pool.connect();
  
  try {
    // Validasi tenant name untuk menghindari SQL injection
    const sanitizedTenant = tenantName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    // Set search_path ke schema tenant
    await client.query(`SET search_path TO ${sanitizedTenant}, public`);
    
    return client;
  } catch (error) {
    client.release();
    throw error;
  }
}

// Fungsi untuk query dengan tenant context
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

// Fungsi untuk membuat schema tenant baru
export async function createTenantSchema(tenantName: string) {
  const client = await pool.connect();
  const sanitizedTenant = tenantName.toLowerCase().replace(/[^a-z0-9_]/g, '');
  
  try {
    await client.query('BEGIN');
    
    // Buat schema baru
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${sanitizedTenant}`);
    
    // Set search_path ke schema baru
    await client.query(`SET search_path TO ${sanitizedTenant}, public`);
    
    // Buat semua tabel untuk tenant baru (copy struktur dari himatif)
    await client.query(`
      CREATE TABLE ${sanitizedTenant}.divisions (
        "id" SERIAL PRIMARY KEY,
        "name" varchar,
        "code" varchar,
        "address" text,
        "phone" varchar,
        "description" text,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.departments (
        "id" SERIAL PRIMARY KEY,
        "name" varchar,
        "code" varchar,
        "division_id" int,
        "description" text,
        "address" text,
        "phone" varchar,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.positions (
        "id" SERIAL PRIMARY KEY,
        "name" varchar,
        "level" int,
        "description" text,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.users (
        "id" SERIAL PRIMARY KEY,
        "employee_id" varchar,
        "full_name" varchar,
        "email" varchar UNIQUE,
        "password_hash" varchar,
        "phone" varchar,
        "address" text,
        "division_id" int,
        "department_id" int,
        "position_id" int,
        "role" varchar,
        "tenant_name" varchar,
        "is_active" boolean DEFAULT true,
        "last_login" timestamp,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.categories (
        "id" SERIAL PRIMARY KEY,
        "name" varchar,
        "code" varchar,
        "description" text,
        "module_type" varchar,
        "division_id" int,
        "department_id" int,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.incoming_mails (
        "id" SERIAL PRIMARY KEY,
        "mail_number" varchar,
        "mail_date" date,
        "mail_path" varchar,
        "sender_name" varchar,
        "sender_address" text,
        "sender_organization" varchar,
        "subject" text,
        "priority" varchar,
        "notes" text,
        "status" varchar,
        "received_by" int,
        "received_date" timestamp,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.dispositions (
        "id" SERIAL PRIMARY KEY,
        "incoming_mail_id" int,
        "from_user_id" int,
        "to_user_id" int,
        "to_division_id" int,
        "to_department_id" int,
        "instruction" text,
        "notes" text,
        "due_date" DATE,
        "priority" varchar,
        "status" varchar,
        "completed_at" timestamp,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.disposition_history (
        "id" SERIAL PRIMARY KEY,
        "disposition_id" int,
        "action" varchar,
        "action_by" int,
        "notes" text,
        "created_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_templates (
        "id" SERIAL PRIMARY KEY,
        "name" varchar,
        "category_id" int,
        "division_id" int,
        "description" text,
        "content" text,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_config_levels (
        "id" SERIAL PRIMARY KEY,
        "template_id" int,
        "user_id" int,
        "division_id" int,
        "department_id" int,
        "level_order" INT,
        "action_type" varchar,
        "is_required" BOOLEAN,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_mails (
        "id" SERIAL PRIMARY KEY,
        "mail_number" varchar,
        "template_id" int,
        "category_id" int,
        "subject" text,
        "recipient_name" varchar,
        "recipient_address" text,
        "recipient_organization" varchar,
        "priority" varchar,
        "mail_path" varchar,
        "status" varchar,
        "current_approval_level" INT,
        "sent_date" DATE,
        "notes" text,
        "created_by" int,
        "updated_by" int,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.outgoing_approval_flows (
        "id" SERIAL PRIMARY KEY,
        "outgoing_mail_id" int,
        "approver_id" int,
        "level_order" INT,
        "action" varchar,
        "notes" text,
        "approved_at" timestamp,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.memo_templates (
        "id" SERIAL PRIMARY KEY,
        "name" varchar,
        "category_id" int,
        "division_id" int,
        "description" text,
        "content" text,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.memo_config_levels (
        "id" SERIAL PRIMARY KEY,
        "template_id" int,
        "user_id" int,
        "division_id" int,
        "department_id" int,
        "level_order" INT,
        "action_type" varchar,
        "is_required" BOOLEAN,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.memos (
        "id" SERIAL PRIMARY KEY,
        "memo_number" varchar,
        "template_id" int,
        "category_id" int,
        "subject" text,
        "content" text,
        "to_division_id" int,
        "to_department_id" int,
        "to_users" int,
        "priority" varchar,
        "mail_path" varchar,
        "status" varchar,
        "current_approval_level" INT,
        "generated_by" int,
        "generated_at" timestamp,
        "effective_date" DATE,
        "notes" text,
        "created_by" int,
        "updated_by" int,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.memo_approval_flows (
        "id" SERIAL PRIMARY KEY,
        "memo_id" int,
        "approver_id" int,
        "level_order" INT,
        "action" varchar,
        "notes" text,
        "approved_at" timestamp,
        "created_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.notulensi_templates (
        "id" SERIAL PRIMARY KEY,
        "name" varchar,
        "category_id" int,
        "division_id" int,
        "description" text,
        "content" text,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.notulensi (
        "id" SERIAL PRIMARY KEY,
        "notulensi_number" varchar,
        "template_id" int,
        "category_id" int,
        "meeting_title" varchar,
        "meeting_date" timestamp,
        "meeting_location" varchar,
        "meeting_agenda" text,
        "content" text,
        "chairman_id" int,
        "secretary_id" int,
        "attachment_url" text,
        "status" varchar,
        "completed_at" timestamp,
        "notes" text,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now()),
        "created_by" int,
        "updated_by" int
      );

      CREATE TABLE ${sanitizedTenant}.meeting_participants (
        "id" SERIAL PRIMARY KEY,
        "notulensi_id" int,
        "user_id" int,
        "division_id" int,
        "department_id" int,
        "role" varchar,
        "attendance_status" varchar,
        "notes" text,
        "created_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.participant_notes (
        "id" SERIAL PRIMARY KEY,
        "notulensi_id" int,
        "user_id" int,
        "notes" text,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );

      CREATE TABLE ${sanitizedTenant}.archived_documents (
        "id" SERIAL PRIMARY KEY,
        "document_id" int,
        "document_type" varchar,
        "document_number" varchar,
        "title" varchar,
        "content" text,
        "category" varchar,
        "division_id" int,
        "department_id" int,
        "document_date" DATE,
        "archived_date" DATE,
        "file_url" text,
        "archived_by" int,
        "created_at" timestamp DEFAULT (now()),
        "updated_at" timestamp DEFAULT (now())
      );
    `);
    
    // Tambahkan foreign keys
    await client.query(`
      ALTER TABLE ${sanitizedTenant}.departments ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.users ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.users ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id");
      ALTER TABLE ${sanitizedTenant}.users ADD FOREIGN KEY ("position_id") REFERENCES ${sanitizedTenant}.positions ("id");
      ALTER TABLE ${sanitizedTenant}.categories ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.categories ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id");
      ALTER TABLE ${sanitizedTenant}.incoming_mails ADD FOREIGN KEY ("received_by") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("incoming_mail_id") REFERENCES ${sanitizedTenant}.incoming_mails ("id");
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("from_user_id") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("to_user_id") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("to_division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.dispositions ADD FOREIGN KEY ("to_department_id") REFERENCES ${sanitizedTenant}.departments ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_templates ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_templates ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.outgoing_templates ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("created_by") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_mails ADD FOREIGN KEY ("updated_by") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_approval_flows ADD FOREIGN KEY ("outgoing_mail_id") REFERENCES ${sanitizedTenant}.outgoing_mails ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_approval_flows ADD FOREIGN KEY ("approver_id") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.outgoing_templates ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("user_id") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.outgoing_config_levels ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id");
      ALTER TABLE ${sanitizedTenant}.memo_templates ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id");
      ALTER TABLE ${sanitizedTenant}.memo_templates ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.memo_templates ("id");
      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id");
      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("created_by") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.memos ADD FOREIGN KEY ("updated_by") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.memo_approval_flows ADD FOREIGN KEY ("memo_id") REFERENCES ${sanitizedTenant}.memos ("id");
      ALTER TABLE ${sanitizedTenant}.memo_approval_flows ADD FOREIGN KEY ("approver_id") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.notulensi_templates ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id");
      ALTER TABLE ${sanitizedTenant}.notulensi_templates ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("template_id") REFERENCES ${sanitizedTenant}.notulensi_templates ("id");
      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("category_id") REFERENCES ${sanitizedTenant}.categories ("id");
      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("created_by") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.notulensi ADD FOREIGN KEY ("updated_by") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("notulensi_id") REFERENCES ${sanitizedTenant}.notulensi ("id");
      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("user_id") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.meeting_participants ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id");
      ALTER TABLE ${sanitizedTenant}.participant_notes ADD FOREIGN KEY ("notulensi_id") REFERENCES ${sanitizedTenant}.notulensi ("id");
      ALTER TABLE ${sanitizedTenant}.participant_notes ADD FOREIGN KEY ("user_id") REFERENCES ${sanitizedTenant}.users ("id");
      ALTER TABLE ${sanitizedTenant}.archived_documents ADD FOREIGN KEY ("division_id") REFERENCES ${sanitizedTenant}.divisions ("id");
      ALTER TABLE ${sanitizedTenant}.archived_documents ADD FOREIGN KEY ("department_id") REFERENCES ${sanitizedTenant}.departments ("id");
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