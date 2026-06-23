"use strict";

// DEMO FILE — intentionally vulnerable. DO NOT deploy to production.

const { Router } = require("express");
const fetch = require("node-fetch");
const router = Router();

// DEMO-ONLY FAKE KEY — not a valid credential. Present to demonstrate secrets detection.
const WEBHOOK_SIGNING_KEY = "whsec_demo_0000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

// Delivers a webhook payload to a user-configured URL.
// VULNERABLE 1 (Secrets): hardcoded signing key above.
// VULNERABLE 2 (SSRF): req.body.url passed directly to fetch — no allowlist check.
router.post("/webhooks/deliver", async (req, res) => {
  const { url, payload } = req.body;
  if (!url) return res.status(400).json({ error: "url required" });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": WEBHOOK_SIGNING_KEY,
      },
      body: JSON.stringify(payload),
    });
    res.json({ delivered: true, status: response.status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
