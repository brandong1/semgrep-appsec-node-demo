#!/usr/bin/env bash
# PR-02: IDOR — task detail via shareable link, no workspace scoping
set -euo pipefail

BRANCH="demo/pr-02-idor-task"
git checkout main && git pull --ff-only
git checkout -b "$BRANCH"

cat > src/routes/shared-task.js << 'EOF'
"use strict";

// DEMO FILE — intentionally vulnerable. DO NOT deploy to production.

const { Router } = require("express");
const { db } = require("../db");
const router = Router();

// Returns a task by ID for shareable links (e.g. email notifications).
// VULNERABLE: db.getTask() has no workspace scoping — any authenticated user
// can read any task from any workspace.
router.get("/tasks/shared/:id", async (req, res) => {
  const task = await db.getTask(req.params.id);
  if (!task) return res.status(404).json({ error: "Not found" });
  res.json(task);
});

module.exports = router;
EOF

cat >> src/app.js << 'EOF'

const sharedTaskRouter = require("./routes/shared-task");
app.use("/", sharedTaskRouter);
EOF

git add src/routes/shared-task.js src/app.js
git commit -m "Add shareable task detail endpoint"
echo "✅  Branch ready: $BRANCH"
echo "Next: git push -u origin $BRANCH"
