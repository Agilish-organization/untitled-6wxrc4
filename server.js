require('dotenv').config();

const express = require('express');
const path = require('path');

const leadsRouter = require('./routes/leads');
const enrichRouter = require('./routes/enrich');

const app = express();
const PORT = process.env.PORT || 3000;

// --- middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- routes ---
app.use('/api/leads', leadsRouter);
app.use('/api/enrich', enrichRouter);

// --- SPA fallback ---
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- start (only in dev; tests manage their own lifecycle) ---
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Lead Search MVP running on http://localhost:${PORT}`);
  });
}

module.exports = app;
