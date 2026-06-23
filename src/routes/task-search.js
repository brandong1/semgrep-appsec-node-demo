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
