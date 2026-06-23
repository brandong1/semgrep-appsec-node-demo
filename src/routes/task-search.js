"use strict";

const { Router } = require("express");
const { db } = require("../db");
const router = Router();

// Search tasks by status, scoped to the caller's workspace.
// Uses parameterized placeholders (?) so user input is never interpolated
// into the query string — prevents SQL injection.
router.get("/tasks/search", async (req, res) => {
  const { workspaceId } = req.user;
  const status = req.query.status;
  const results = await db.query(
    "select * from tasks where workspace_id = ? and status = ?",
    [workspaceId, status]
  );
  res.json(results);
});

module.exports = router;
