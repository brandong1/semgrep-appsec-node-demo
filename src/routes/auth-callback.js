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
