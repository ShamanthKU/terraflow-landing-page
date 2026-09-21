/**
 * TerraFlow — Supabase Schema Bootstrap
 *
 * Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from environment.
 * Run with: node scripts/bootstrap_schema.js
 *
 * Requires: npm install pg
 * Set env vars first (or use a .env.local file loaded via dotenv).
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local if present
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
} catch { /* dotenv optional */ }

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  console.error('   Copy .env.example → .env.local and fill in your credentials.');
  process.exit(1);
}

const sql = fs.readFileSync(path.resolve(__dirname, 'supabase_schema.sql'), 'utf8');

// Parse host from URL (e.g. https://xyz.supabase.co → xyz.supabase.co)
const projectRef = SUPABASE_URL.replace('https://', '').split('.')[0];

const client = new Client({
  host: `aws-0-ap-south-1.pooler.supabase.com`,
  port: 5432,
  database: 'postgres',
  user: `postgres.${projectRef}`,
  password: SERVICE_ROLE_KEY,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
});

async function runSchema() {
  try {
    await client.connect();
    console.log('\n✅ Connected to Supabase PostgreSQL!\n');
    await client.query(sql);
    console.log('✅ Schema applied successfully!');

    const result = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('waitlist_users', 'contact_inquiries', 'waitlist_analytics')
      ORDER BY table_name;
    `);
    console.log('\n📋 Confirmed tables:');
    result.rows.forEach(r => console.log(`  • ${r.table_name} (${r.table_type})`));
    console.log('\n🎉 TerraFlow database is ready!\n');
  } catch (err) {
    console.error('\n❌ Schema error:', err.message);
    console.error('   Tip: You can also run scripts/supabase_schema.sql directly in the Supabase SQL Editor.');
  } finally {
    await client.end();
  }
}

runSchema();
