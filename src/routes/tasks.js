"use strict";
const { Router } = require("express");
const { db } = require("../db");
const router = Router();

// GET /tasks/:id — workspace-scoped. You can only read tasks in your workspace.
router.get("/:id", async (req, res) => {
  const { workspaceId } = req.user;
  const task = await db.getTaskForWorkspace(req.params.id, workspaceId);
  if (!task) return res.status(404).json({ error: "Not found" });
  res.json(task);
});

module.exports = router;
