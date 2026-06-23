#!/usr/bin/env bash
# PR-03: SQL Injection — task search by status
set -euo pipefail

BRANCH="demo/pr-03-sql-injection"
git checkout main && git pull --ff-only
git checkout -b "$BRANCH"

cat > src/routes/task-search.js << 'EOF'
"use strict";

// DEMO FILE — intentionally vulnerable. DO NOT deploy to production.

const { Router } = require("express");
const { db } = require("../db");
const router = Router();

// Search tasks by status.
// VULNERABLE: req.query.status interpolated directly into SQL string.
router.get("/tasks/search", async (req, res) => {
  const status = req.query.status;
  const sql = `select * from tasks where status = '${status}'`;
  const results = await db.rawQuery(sql);
  res.json(results);
});

module.exports = router;
EOF

cat >> src/app.js << 'EOF'

const taskSearchRouter = require("./routes/task-search");
app.use("/", taskSearchRouter);
EOF

git add src/routes/task-search.js src/app.js
git commit -m "Add task search by status"
echo "✅  Branch ready: $BRANCH"
echo "Next: git push -u origin $BRANCH"
