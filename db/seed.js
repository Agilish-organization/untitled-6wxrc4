/**
 * Seed the leads table with demo data so the prototype works out of the box
 * without any third-party API keys.
 *
 * Run: node db/seed.js
 */
require('dotenv').config();
const { pool } = require('./index');

const leads = [
  {
    company_name: 'Stripe',
    website: 'https://stripe.com',
    industry: 'Fintech',
    location: 'San Francisco, CA',
    contact_name: 'Emily Chen',
    contact_title: 'VP Engineering',
    contact_email: 'emily@stripe.com',
  },
  {
    company_name: 'Notion',
    website: 'https://notion.so',
    industry: 'SaaS / Productivity',
    location: 'San Francisco, CA',
    contact_name: 'James Park',
    contact_title: 'Head of Growth',
    contact_email: 'james@notion.so',
  },
  {
    company_name: 'Vercel',
    website: 'https://vercel.com',
    industry: 'SaaS / Developer Tools',
    location: 'San Francisco, CA',
    contact_name: 'Sarah Lee',
    contact_title: 'CTO',
    contact_email: 'sarah@vercel.com',
  },
  {
    company_name: 'Figma',
    website: 'https://figma.com',
    industry: 'SaaS / Design Tools',
    location: 'San Francisco, CA',
    contact_name: 'David Kim',
    contact_title: 'Director of Engineering',
    contact_email: 'dkim@figma.com',
  },
  {
    company_name: 'Ramp',
    website: 'https://ramp.com',
    industry: 'Fintech',
    location: 'New York, NY',
    contact_name: 'Amara Okafor',
    contact_title: 'Head of Engineering',
    contact_email: 'amara@ramp.com',
  },
  {
    company_name: 'Datadog',
    website: 'https://datadoghq.com',
    industry: 'SaaS / Observability',
    location: 'New York, NY',
    contact_name: 'Rachel Torres',
    contact_title: 'VP Engineering',
    contact_email: 'rachel@datadoghq.com',
  },
  {
    company_name: 'Linear',
    website: 'https://linear.app',
    industry: 'SaaS / Developer Tools',
    location: 'San Francisco, CA',
    contact_name: 'Alex Wong',
    contact_title: 'Engineering Manager',
    contact_email: 'alex@linear.app',
  },
  {
    company_name: 'Canva',
    website: 'https://canva.com',
    industry: 'SaaS / Design Tools',
    location: 'Sydney, Australia',
    contact_name: 'Priya Sharma',
    contact_title: 'Head of Product',
    contact_email: 'priya@canva.com',
  },
  {
    company_name: 'Airtable',
    website: 'https://airtable.com',
    industry: 'SaaS / Productivity',
    location: 'San Francisco, CA',
    contact_name: 'Marcus Johnson',
    contact_title: 'VP of Sales',
    contact_email: 'marcus@airtable.com',
  },
  {
    company_name: 'Plaid',
    website: 'https://plaid.com',
    industry: 'Fintech',
    location: 'San Francisco, CA',
    contact_name: 'Lena Park',
    contact_title: 'CTO',
    contact_email: 'lena@plaid.com',
  },
  {
    company_name: 'Supabase',
    website: 'https://supabase.com',
    industry: 'SaaS / Developer Tools',
    location: 'Remote',
    contact_name: 'Tom Chen',
    contact_title: 'Developer Relations Lead',
    contact_email: 'tom@supabase.com',
  },
  {
    company_name: 'Retool',
    website: 'https://retool.com',
    industry: 'SaaS / Developer Tools',
    location: 'San Francisco, CA',
    contact_name: 'Julia Martinez',
    contact_title: 'Head of Engineering',
    contact_email: 'julia@retool.com',
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Run migration
    const fs = require('fs');
    const path = require('path');
    const migration = fs.readFileSync(
      path.join(__dirname, '..', 'migrations', '1717025000_create_leads.sql'),
      'utf-8'
    );
    await client.query(migration);

    // Clear existing
    await client.query('DELETE FROM leads');

    // Insert all
    for (const lead of leads) {
      await client.query(
        `INSERT INTO leads (company_name, website, industry, location, contact_name, contact_title, contact_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [lead.company_name, lead.website, lead.industry, lead.location, lead.contact_name, lead.contact_title, lead.contact_email]
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${leads.length} leads.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
