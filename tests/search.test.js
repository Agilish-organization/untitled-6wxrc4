const { describe, it } = require('node:test');
const assert = require('node:assert');

// ----- Keyword extraction (inlined from routes/leads.js for testability) -----
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
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .filter(w => !stopwords.has(w));
}

// ----- Tests -----
describe('extractKeywords', () => {
  it('extracts meaningful keywords from an ICP description', () => {
    const result = extractKeywords('B2B SaaS companies in fintech with 50-200 employees');
    assert.ok(result.includes('saas'));
    assert.ok(result.includes('fintech'));
    assert.ok(result.includes('employees'));
    assert.ok(result.includes('50-200'));
    assert.ok(!result.includes('the'));
    assert.ok(!result.includes('with'));
    assert.ok(!result.includes('b2b'));
  });

  it('filters out stopwords like "company" and "find"', () => {
    const result = extractKeywords('find companies that do design tools');
    assert.ok(result.includes('design'));
    assert.ok(result.includes('tools'));
    assert.ok(!result.includes('find'));
    assert.ok(!result.includes('companies'));
    assert.ok(!result.includes('that'));
  });

  it('strips punctuation but keeps hyphens in compound words', () => {
    const result = extractKeywords('Fintech! SaaS? developer-tools, etc.');
    assert.ok(result.includes('fintech'));
    assert.ok(result.includes('saas'));
    // Hyphens are kept in the regex, so "developer-tools" stays as one token
    assert.ok(result.includes('developer-tools'), `got: ${JSON.stringify(result)}`);
  });

  it('filters words <= 2 characters', () => {
    const result = extractKeywords('AI SaaS in SF for VP');
    assert.ok(result.includes('saas'));
    assert.ok(!result.includes('ai'));
    assert.ok(!result.includes('sf'));
    assert.ok(!result.includes('vp'));
    assert.ok(!result.includes('in'));
    assert.ok(!result.includes('for'));
  });

  it('returns empty array for short/generic input', () => {
    const result = extractKeywords('I need a');
    assert.deepStrictEqual(result, []);
  });

  it('handles mixed case and whitespace', () => {
    const result = extractKeywords('   FinTech   SaaS   ');
    assert.deepStrictEqual(result, ['fintech', 'saas']);
  });
});

describe('app module exports', () => {
  it('server.js exports the app', () => {
    const app = require('../server');
    assert.ok(typeof app === 'function' || typeof app.use === 'function');
  });
});
