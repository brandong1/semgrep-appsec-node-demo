# Demo Flow — Semgrep + Claude Code

**Time:** 20–25 minutes  
**Audience:** Developers  
**Tools:** Claude Code, Terminal, GitHub, Semgrep AppSec Platform

---

## Introduction

> "I want to show you what your security workflow looks like when you're using Claude Code — and Semgrep is running alongside it.
>
> Here's what I'm going to demo:
>
> **Semgrep Managed Scans** — when you open a PR, Semgrep scans it automatically. No workflow file, no token, no semgrep command. The PR is the trigger. Findings come back in the PR comment and in Semgrep AppSec Platform.
>
> **Multimodal** — instead of a generic CWE description, you get an AI explanation of the finding in the context of your actual code.
>
> **Memories** — you can teach Semgrep how your team fixes things. Not a generic recommendation — the exact function, the exact pattern, specific to this repo. Every future finding gets that guidance baked in.
>
> **Suggested Fix** — the fix shows up right in the PR comment. One click to apply.
>
> **Autofix PR** — Semgrep opens a separate draft PR with the fix already written. You review it, not write it.
>
> **Guardian in Claude Code** — after Semgrep scans, you can ask Claude Code to pull the findings into your conversation. You don't have to leave your coding session to see what Semgrep found or get help fixing it.
>
> Real app, real vulnerable code, real PRs. Let's go."

---

## Before You Start

Have open:
- **Claude Code** desktop app, `semgrep-appsec-node-demo` directory open
- **Terminal** in `~/Desktop/semgrep-appsec-node-demo`
- **GitHub** PR list for `semgrep-appsec-node-demo` (no open PRs)
- **Semgrep AppSec Platform** → Projects → `semgrep-appsec-node-demo` → Findings

---

## Scenario 1 — Command Injection (5 min)

*Claude Code writes a CI log viewer. SMS catches command injection. Guardian pulls the finding into the conversation.*

### Step 1 — Ask Claude Code to write the endpoint

In Claude Code:
> "Add a CI pipeline log viewer endpoint. It should accept a branch name as a query parameter and return the last 10 git log entries for that branch."

Or use the script:
```bash
git checkout main && git pull
bash demo/scenarios/pr-01-command-injection.sh
```

**Talk track:**
> "I asked Claude Code to write a CI log viewer — internal tool, nothing fancy. Here's what it wrote."

Show `src/routes/pipeline.js`. Point to the `exec()` call with `${branch}` interpolated directly.

> "exec with a user-supplied query parameter. If I call `/pipeline/logs?branch=main; cat /etc/passwd`, that second command runs. Claude Code wrote this in seconds and it looks completely reasonable — it works, it's clean, it's wrong."

### Step 2 — Push and open the PR

```bash
git push -u origin demo/pr-01-command-injection
gh pr create \
  --title "Add CI pipeline log viewer" \
  --body "Returns recent git log for a branch. Used by the CI dashboard."
```

**Talk track:**
> "PR is open. I haven't run semgrep. Watch the status checks."

### Step 3 — Show SMS firing

*(Wait 2–3 min. Refresh the PR.)*

**Talk track:**
> "Semgrep Managed Scans picked it up automatically. The finding is right here — file, line, rule ID. It's also in Semgrep AppSec Platform."

Navigate to Semgrep AppSec Platform → Findings. Click the finding. Show the Multimodal explanation.

> "Multimodal explains it in plain language, in the context of this specific endpoint. Not a textbook definition — an explanation of what this code does and why it's exploitable."

### Step 4 — Pull into Claude Code via Guardian

In Claude Code:
> "Use Guardian to check for open findings in semgrep-appsec-node-demo."

**Talk track:**
> "Now you don't need to keep a browser tab open to Semgrep. You ask Claude Code — Guardian pulls the findings right into your conversation."

Follow up:
> "Explain the command injection finding and show me the fix."

> "Claude Code now has the finding and can write the corrected code — in the same session where it wrote the original. You never left Claude Code."

---

## Scenario 2 — Workspace Isolation / IDOR (4 min)

*Claude Code writes a shareable task link endpoint. No workspace scoping. Memory shapes the fix.*

**Pre-check:** Confirm the workspace isolation Memory is set.

### Step 1 — Ask Claude Code

In Claude Code:
> "Add a shareable task detail endpoint so users can open tasks from email notification links. Accept a task ID in the URL."

Or scripted:
```bash
git checkout main && git pull
bash demo/scenarios/pr-02-idor-task.sh
git push -u origin demo/pr-02-idor-task
gh pr create \
  --title "Add shareable task detail endpoint" \
  --body "Lets users open tasks directly from email notifications."
```

**Talk track:**
> "Shareable task links — totally reasonable feature. Claude Code uses `db.getTask(id)`. No workspace check. Any authenticated user in any workspace can read any task. That's a tenant isolation violation."

### Step 2 — Show the Memory-shaped Suggested Fix

Once the SMS finding appears:

> "Look at the Multimodal explanation. It doesn't say 'consider adding an authorization check.' It says: use `db.getTaskForWorkspace(taskId, req.user.workspaceId)`. That's the exact function in this codebase — because of the Memory we set for this repo."

> "Memories turn a generic IDOR finding into a repo-specific fix recommendation. Every developer on your team gets the same guidance, specific to how your codebase is structured."

---

## Scenario 3 — SQL Injection + Customize Fix (4 min)

*Claude Code writes task search with string interpolation. Customize Fix creates a Memory live.*

### Step 1 — Ask Claude Code

In Claude Code:
> "Add task search by status. Accept a status query parameter and return matching tasks."

Or scripted:
```bash
git checkout main && git pull
bash demo/scenarios/pr-03-sql-injection.sh
git push -u origin demo/pr-03-sql-injection
gh pr create \
  --title "Add task search by status" \
  --body "Filter tasks by open/closed status."
```

**Talk track:**
> "Task search. Claude Code builds the SQL with a template literal — `select * from tasks where status = '${status}'`. SMS catches it."

### Step 2 — Use Customize Fix to create a Memory live

In Semgrep AppSec Platform, open the SQL injection finding:

1. **Fix** → **Customize Fix**
2. Write the corrected pattern:
   ```javascript
   db.query("select * from tasks where workspace_id = ? and status = ?", [req.user.workspaceId, status])
   ```
3. Description: *"Use db.query with params. Always scope to workspace_id as the first condition."*
4. **Save**

**Talk track:**
> "Customize Fix lets me encode exactly how your team fixes SQL — parameterized queries, always workspace-scoped. Once I save this, it's a Memory. The next time Claude Code writes a string-interpolated query and someone opens a PR, the Suggested Fix will already know to use this pattern. You set it once, it applies to the whole team."

---

## Scenario 4 — Suggested Fix + Autofix PR (5 min)

*Open redirect caught by SMS. Suggested Fix in the PR. Autofix PR opened by Semgrep.*

### Step 1 — Ask Claude Code

In Claude Code:
> "Add a post-signup auth callback endpoint that redirects users to the next query parameter after OAuth, or /dashboard by default."

Or scripted:
```bash
git checkout main && git pull
bash demo/scenarios/pr-04-open-redirect.sh
git push -u origin demo/pr-04-open-redirect
gh pr create \
  --title "Add post-signup auth callback redirect" \
  --body "Redirects users after completing OAuth signup flow."
```

**Talk track:**
> "OAuth callback redirect. Claude Code writes `res.redirect(req.query.next)`. The `|| '/dashboard'` default doesn't protect you — an attacker sends `next=https://evil.example.com` in a phishing link, your user logs in, gets redirected off-site. SMS catches it."

### Step 2 — Show Suggested Fix in the PR comment

> "The PR comment includes a Suggested Fix: use `safeRedirect(res, req.query.next, '/dashboard')`. That's the helper already in this codebase — Semgrep knows about it from the Memory we set. One click to apply."

### Step 3 — Open the Autofix PR

In Semgrep AppSec Platform → open the finding → **Fix** dropdown → **Open Autofix PR**

> "Autofix PR goes one step further. Semgrep opens a separate draft PR with the fix already written — `safeRedirect` in place, ready to review. You didn't write the fix. You review it."

Show the Autofix draft PR in GitHub. Point out: Semgrep as author, draft status, `safeRedirect` already applied.

> "This is the full loop: Claude Code wrote it, SMS caught it, Suggested Fix told you what to change, Autofix PR put that change in a reviewable PR."

---

## Scenario 5 — Secrets + SSRF (optional, 3 min)

*Two finding types in one PR. Hardcoded signing key + unvalidated outbound fetch.*

```bash
git checkout main && git pull
bash demo/scenarios/pr-05-secrets-ssrf.sh
git push -u origin demo/pr-05-secrets-ssrf
gh pr create \
  --title "Add webhook delivery endpoint" \
  --body "Delivers webhook payloads to user-configured URLs."
```

**Talk track:**
> "Two finding types in one PR. The secrets scanner catches the hardcoded `WEBHOOK_SIGNING_KEY` before it ever reaches the remote. The SSRF rule catches `fetch(req.body.url)` — no allowlist check, an attacker can point your server at internal metadata endpoints. Both flagged automatically, both with Memories guiding the fix."

---

## Close

> "Here's what just happened:
>
> You used Claude Code to write five endpoints. Every one had a security issue — command injection, broken tenant isolation, SQL injection, open redirect, hardcoded secrets, SSRF. All written by an AI. All caught by Semgrep.
>
> You didn't run a scan. You didn't configure a workflow. You opened PRs. Semgrep handled the rest — findings in the PR comment, Multimodal explanations shaped by your repo's patterns, Suggested Fixes, an Autofix PR, and all of it accessible from inside Claude Code via Guardian.
>
> That's the workflow. Any questions?"

---

## Fallback — If SMS scan hasn't finished

If you're moving faster than the scan, pivot to Claude Code while you wait:

> "While the scan runs, let me show you what this looks like from inside Claude Code."

Ask Guardian for findings from a previously scanned PR:
> "Use Guardian to show me the most recent open findings in semgrep-appsec-node-demo."

Keeps the demo moving. Reinforces the Claude Code integration.

---

## Timing Reference

| Scenario | Time | Vulnerability | Key demo moment |
|---|---|---|---|
| Intro | 0:00–0:02 | — | Feature overview |
| Command injection | 0:02–0:07 | `exec(branch)` | SMS catches it, Guardian pulls it into Claude Code |
| IDOR | 0:07–0:11 | `db.getTask()` no workspace | Memory-shaped Suggested Fix |
| SQL injection | 0:11–0:15 | Template literal SQL | Customize Fix creates Memory live |
| Open redirect | 0:15–0:20 | `res.redirect(next)` | Suggested Fix + Autofix PR |
| Secrets + SSRF | 0:20–0:23 | Hardcoded key + fetch | Two finding types, Memories for both |
| Close | 0:23–0:25 | — | Full lifecycle recap |
