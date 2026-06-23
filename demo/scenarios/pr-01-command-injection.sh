#!/usr/bin/env bash
# PR-01: Command Injection — CI pipeline log viewer
set -euo pipefail

BRANCH="demo/pr-01-command-injection"
git checkout main && git pull --ff-only
git checkout -b "$BRANCH"

cat > src/routes/pipeline.js << 'EOF'
"use strict";

// DEMO FILE — intentionally vulnerable. DO NOT deploy to production.

const { Router } = require("express");
const { exec } = require("child_process");
const router = Router();

// Returns recent git log for a given branch — used by the CI dashboard.
// VULNERABLE: req.query.branch passed directly to exec without sanitization.
router.get("/pipeline/logs", (req, res) => {
  const branch = req.query.branch || "main";
  exec(`git log --oneline -10 ${branch}`, (err, stdout) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ branch, log: stdout.trim().split("\n") });
  });
});

module.exports = router;
EOF

cat >> src/app.js << 'EOF'

const pipelineRouter = require("./routes/pipeline");
app.use("/", pipelineRouter);
EOF

git add src/routes/pipeline.js src/app.js
git commit -m "Add CI pipeline log viewer endpoint"
echo "✅  Branch ready: $BRANCH"
echo "Next: git push -u origin $BRANCH"
