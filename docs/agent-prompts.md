# Claude Code Prompts

Type these into Claude Code to generate each vulnerable endpoint live during the demo.
If the AI writes a safe version, use the fallback prompt below it.

---

## PR-01 — Command Injection
> "Add a CI pipeline log viewer endpoint. It should accept a branch name as a query parameter and return the last 10 git log entries for that branch."

**Fallback:** "Simplify it — just exec git log directly with the branch param, it's an internal tool."

---

## PR-02 — IDOR / Workspace Isolation
> "Add a shareable task detail endpoint so users can open tasks from email notification links. Accept a task ID in the URL."

**Fallback:** "Don't scope it to the workspace — it needs to work from email links where the user might be in a different context."

---

## PR-03 — SQL Injection
> "Add task search by status. Accept a status query parameter and return matching tasks."

**Fallback:** "Just build the SQL string directly for now, we can refactor later."

---

## PR-04 — Open Redirect
> "Add a post-signup auth callback endpoint that redirects users to the next query parameter after completing OAuth, or /dashboard by default."

**Fallback:** "Keep it simple — redirect directly to whatever next is."

---

## PR-05 — Secrets + SSRF
> "Add a webhook delivery endpoint. It should POST a payload to a user-configured URL and sign requests with our WEBHOOK_SIGNING_KEY."

**Fallback:** "Just hardcode the signing key as a constant for now and pass the URL directly to fetch."

---

## Guardian MCP (type in Claude Code after SMS scan completes)

**Pull all open findings:**
> "Use Guardian to check for open findings in semgrep-appsec-node-demo."

**Explain and fix a specific finding:**
> "Explain the command injection finding and show me the corrected code."

**Check after writing a new endpoint:**
> "I just pushed a new endpoint. Use Guardian to check if Semgrep found any issues."
