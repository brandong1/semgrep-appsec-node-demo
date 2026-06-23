#!/usr/bin/env bash
# PR-05: Secrets + SSRF — webhook delivery endpoint
set -euo pipefail

BRANCH="demo/pr-05-secrets-ssrf"
git checkout main && git pull --ff-only
git checkout -b "$BRANCH"

cat > src/routes/webhooks.js << 'EOF'
"use strict";

// DEMO FILE — intentionally vulnerable. DO NOT deploy to production.

const { Router } = require("express");
const fetch = require("node-fetch");
const router = Router();

// DEMO-ONLY FAKE KEY — not a valid credential. Present to demonstrate secrets detection.
const WEBHOOK_SIGNING_KEY = "whsec_demo_0000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Delivers a webhook payload to a user-configured URL.
// VULNERABLE 1 (Secrets): hardcoded signing key above.
// VULNERABLE 2 (SSRF): req.body.url passed directly to fetch — no allowlist check.
router.post("/webhooks/deliver", async (req, res) => {
  const { url, payload } = req.body;
  if (!url) return res.status(400).json({ error: "url required" });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": WEBHOOK_SIGNING_KEY,
      },
      body: JSON.stringify(payload),
    });
    res.json({ delivered: true, status: response.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
EOF

cat >> src/app.js << 'EOF'

const webhooksRouter = require("./routes/webhooks");
app.use("/", webhooksRouter);
EOF

git add src/routes/webhooks.js src/app.js
git commit -m "Add webhook delivery endpoint"
echo "✅  Branch ready: $BRANCH"
echo "Next: git push -u origin $BRANCH"
