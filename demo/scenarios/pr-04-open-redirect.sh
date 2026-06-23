#!/usr/bin/env bash
# PR-04: Open Redirect — post-signup OAuth callback
set -euo pipefail

BRANCH="demo/pr-04-open-redirect"
git checkout main && git pull --ff-only
git checkout -b "$BRANCH"

cat > src/routes/auth-callback.js << 'EOF'
"use strict";

// DEMO FILE — intentionally vulnerable. DO NOT deploy to production.

const { Router } = require("express");
const router = Router();

// Handles post-signup and OAuth callback redirects.
// VULNERABLE: req.query.next passed directly to res.redirect — open redirect.
router.get("/auth/callback", (req, res) => {
  const next = req.query.next || "/dashboard";
  res.redirect(next);
});

module.exports = router;
EOF

cat >> src/app.js << 'EOF'

const authCallbackRouter = require("./routes/auth-callback");
app.use("/", authCallbackRouter);
EOF

git add src/routes/auth-callback.js src/app.js
git commit -m "Add post-signup auth callback redirect"
echo "✅  Branch ready: $BRANCH"
echo "Next: git push -u origin $BRANCH"
