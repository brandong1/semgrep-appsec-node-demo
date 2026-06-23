"use strict";

// Simulates session/JWT middleware. In production this would verify a real token.
function authMiddleware(req, res, next) {
  if (req.path === "/health") return next();

  const userId      = req.headers["x-demo-user-id"]      || "user-001";
  const workspaceId = req.headers["x-demo-workspace-id"] || "ws-001";
  const role        = req.headers["x-demo-role"]         || "member";

  req.user = { userId, workspaceId, role };
  next();
}

module.exports = { authMiddleware };
