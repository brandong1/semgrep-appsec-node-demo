"use strict";
const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  const { userId, workspaceId, role } = req.user;
  res.json({ userId, workspaceId, role });
});

module.exports = router;
