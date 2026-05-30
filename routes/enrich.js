const { Router } = require('express');

const router = Router();

/**
 * Enrichment stub — wired for Hunter.io and Clearbit free-tier when API keys
 * are present. Without keys, the search endpoint uses the seed database.
 *
 * POST /api/enrich
 * Body: { domain: "stripe.com" }
 * Response: { company_name, contact_name, contact_title, contact_email, source }
 */
router.post('/', async (req, res) => {
  const { domain } = req.body;

  if (!domain) {
    return res.status(400).json({ error: 'domain is required' });
  }

  const HUNTER_KEY = process.env.HUNTER_API_KEY;
  const CLEARBIT_KEY = process.env.CLEARBIT_API_KEY;

  // --- Hunter.io attempt ---
  if (HUNTER_KEY) {
    try {
      const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(domain)}&api_key=${HUNTER_KEY}&limit=1`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data.data?.emails?.length) {
        const email = data.data.emails[0];
        return res.json({
          company_name: data.data.organization || domain,
          contact_name: `${email.first_name || ''} ${email.last_name || ''}`.trim(),
          contact_title: email.position || 'Unknown',
          contact_email: email.value,
          source: 'hunter.io',
        });
      }
    } catch (e) {
      console.warn('Hunter.io enrichment failed:', e.message);
    }
  }

  // --- Clearbit attempt ---
  if (CLEARBIT_KEY) {
    try {
      const url = `https://company.clearbit.com/v2/companies/find?domain=${encodeURIComponent(domain)}`;
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${CLEARBIT_KEY}` },
      });
      if (resp.ok) {
        const data = await resp.json();
        return res.json({
          company_name: data.name || domain,
          contact_name: data.site?.contact?.name || 'Unknown',
          contact_title: data.site?.contact?.title || 'Unknown',
          contact_email: data.site?.contact?.email || 'unknown@' + domain,
          source: 'clearbit',
        });
      }
    } catch (e) {
      console.warn('Clearbit enrichment failed:', e.message);
    }
  }

  // No external enrichment available
  return res.json({
    company_name: domain,
    contact_name: 'Unknown',
    contact_title: 'Unknown',
    contact_email: 'unknown@' + domain,
    source: 'none',
  });
});

module.exports = router;
