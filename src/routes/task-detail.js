"use strict";

const { Router } = require("express");
const { db } = require("../db");
const router = Router();

// Shareable task detail endpoint — the target of "View task" links in email
// notifications. The link recipient is an authenticated user; we still scope
// the lookup to their workspace so a known/guessable task ID can't be used to
// read tasks belonging to another workspace (IDOR / broken object-level auth).
router.get("/share/tasks/:id", async (req, res) => {
  const { workspaceId } = req.user;
  const task = await db.getTaskForWorkspace(req.params.id, workspaceId);
  if (!task) return res.status(404).json({ error: "Not found" });
  res.json(task);
});

module.exports = router;
