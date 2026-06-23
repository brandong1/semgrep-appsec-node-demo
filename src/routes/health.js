"use strict";
const { Router } = require("express");
const router = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok", service: "semgrep-appsec-node-demo" });
});

module.exports = router;
