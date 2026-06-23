# Semgrep Memories — Copy/Paste Text

Add these in Semgrep AppSec Platform → Projects → `semgrep-appsec-node-demo` → Assistant/Memories before the demo.

---

## Memory 1 — Workspace Isolation (used in PR-02)

```
For this repository, all task and project data must be scoped to req.user.workspaceId.
Use db.getTaskForWorkspace(taskId, req.user.workspaceId) instead of db.getTask(taskId).
Any route that reads task, project, or member data without workspaceId is a tenant isolation violation.
```

## Memory 2 — SQL Queries (used in PR-03)

```
For this repository, never use string interpolation or concatenation in SQL.
Use db.query(sql, params) with a parameter array.
For workspace-scoped tables (tasks, projects, members), always include workspace_id = ?
as the first condition. Example:
db.query("select * from tasks where workspace_id = ? and status = ?", [req.user.workspaceId, status])
```

## Memory 3 — Redirects (used in PR-04)

```
For this repository, use safeRedirect(res, url, fallback) for all redirects that accept
a user-controlled destination. Never pass req.query.next or any user input directly to res.redirect().
safeRedirect is defined in src/helpers/index.js and validates against an approved host allowlist.
```

## Memory 4 — Outbound Requests / Webhooks (used in PR-05)

```
For this repository, all outbound HTTP requests must call assertAllowedWebhookUrl(url)
from src/helpers/index.js before fetch, axios, or http calls.
Never pass req.body.url or any user-supplied URL directly to a fetch client.
```

## Memory 5 — Secrets (used in PR-05)

```
Never hardcode API keys, signing secrets, or tokens in source code.
Use process.env.VARIABLE_NAME. Document all required env vars in .env.example.
```
