const { Router } = require('express');
const { searchLeads } = require('../db/leads');

const router = Router();

// --- keyword extraction ---
// Strips common stopwords from the ICP description, returns meaningful tokens.
function extractKeywords(icp) {
  const stopwords = new Set([
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they',
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'from', 'by', 'about', 'as', 'into', 'through', 'during',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'can', 'shall', 'this', 'that', 'these', 'those', 'am', 'no', 'not',
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also',
    'such', 'if', 'then', 'else', 'when', 'where', 'why', 'how', 'all',
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'which', 'who',
    'company', 'companies', 'find', 'looking', 'need', 'want', 'like',
    'b2b', 'b2c', 'customer', 'profile',
  ]);

  return icp
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')   // strip punctuation
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter(w => !stopwords.has(w));
}

// POST /api/leads/search
router.post('/search', async (req, res) => {
  try {
    const { icp } = req.body;

    if (!icp || typeof icp !== 'string' || icp.trim().length < 5) {
      return res.status(400).json({ error: 'ICP description must be at least 5 characters.' });
    }

    const keywords = extractKeywords(icp);
    const leads = await searchLeads(keywords, 5);

    // Format for the frontend
    const formatted = leads.map(l => ({
      company_name: l.company_name,
      website: l.website,
      industry: l.industry,
      location: l.location,
      contact_name: l.contact_name,
      contact_title: l.contact_title,
      contact_email: l.contact_email,
      enrichment_source: l.enrichment_source,
    }));

    return res.json({ leads: formatted, keywords_used: keywords });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
