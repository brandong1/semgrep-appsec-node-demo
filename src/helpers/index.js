"use strict";

const ALLOWED_HOSTS    = ["app.example.com", "accounts.example.com"];
const ALLOWED_WEBHOOK_PREFIXES = ["https://hooks.example.com/", "https://integrations.example.com/"];

// Safe redirect — validates destination against an approved host allowlist.
function safeRedirect(res, url, fallback = "/dashboard") {
  try {
    const parsed = new URL(url, "https://app.example.com");
    if (ALLOWED_HOSTS.includes(parsed.hostname)) {
      return res.redirect(parsed.toString());
    }
  } catch (_) {
    if (typeof url === "string" && url.startsWith("/")) {
      return res.redirect(url);
    }
  }
  return res.redirect(fallback);
}

// SSRF guard — ensures outbound webhook targets are on the approved list.
function assertAllowedWebhookUrl(url) {
  const allowed = ALLOWED_WEBHOOK_PREFIXES.some((prefix) => url.startsWith(prefix));
  if (!allowed) {
    throw new Error(`Webhook delivery to disallowed URL blocked: ${url}`);
  }
}

module.exports = { safeRedirect, assertAllowedWebhookUrl };
