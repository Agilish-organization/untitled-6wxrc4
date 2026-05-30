const { query } = require('./index');

/**
 * Search leads by matching keywords extracted from the ICP against
 * industry, company_name, contact_title, and location fields.
 * Returns up to `limit` results ordered by relevance score.
 */
async function searchLeads(keywords, limit = 5) {
  if (!keywords.length) {
    const rows = await query('SELECT * FROM leads ORDER BY RANDOM() LIMIT $1', [limit]);
    return rows;
  }

  // Build a tsvector-style match using ILIKE for simplicity (no extension required)
  const clauses = keywords.map((_, i) =>
    `(industry ILIKE $${i + 1} OR company_name ILIKE $${i + 1} OR contact_title ILIKE $${i + 1} OR location ILIKE $${i + 1})`
  );
  const params = keywords.map(k => `%${k}%`);

  const sql = `
    SELECT *,
      (${clauses.map((c, i) => `CASE WHEN ${clauses[i]} THEN 1 ELSE 0 END`).join(' + ')}) AS score
    FROM leads
    WHERE ${clauses.join(' OR ')}
    ORDER BY score DESC
    LIMIT $${keywords.length + 1}
  `;

  params.push(limit);
  return query(sql, params);
}

/** Count total leads in the seed table */
async function countLeads() {
  const rows = await query('SELECT COUNT(*) as cnt FROM leads');
  return parseInt(rows[0].cnt, 10);
}

module.exports = { searchLeads, countLeads };
