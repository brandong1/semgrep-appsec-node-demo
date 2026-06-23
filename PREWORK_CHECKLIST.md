# Pre-Work Checklist

Complete in order. Smoke test at the end is the go/no-go gate.

---

## Step 1 — Create and Push the Repo

```bash
cd ~/Desktop/semgrep-appsec-node-demo
npm install
git init
git add .
git commit -m "Initial commit: baseline project management API"
gh repo create semgrep-appsec-node-demo \
  --public \
  --source=. \
  --push \
  --description "Semgrep AppSec demo — Managed Scans, Multimodal, Memories, Autofix"
```

- [ ] Repo on GitHub, `main` pushed
- [ ] No `.github/workflows/` directory: `ls .github/ 2>/dev/null || echo "clean"`

---

## Step 2 — Connect to Semgrep AppSec Platform

1. [semgrep.dev](https://semgrep.dev) → **Projects** → **Add project**
2. Select GitHub → find `semgrep-appsec-node-demo` → **Add**

- [ ] Repo appears in Semgrep AppSec Platform → Projects

---

## Step 3 — Enable Managed Scans

1. Projects → `semgrep-appsec-node-demo` → **Settings**
2. **Scan method** → **Managed Scans**
3. **PR / MR diff-aware scans** → **On**

- [ ] Managed Scans enabled
- [ ] PR diff-aware scans on
- [ ] No `SEMGREP_APP_TOKEN` needed

---

## Step 4 — Create the Demo Policy

### 4a — Code Policy

1. **Policies** → **Create policy** → Name: `AppSec Node Demo` → Type: **Code**
2. Add these rules and set each to **Comment** mode:

| Scenario | Search term | Rule to add |
|---|---|---|
| PR-01 Command injection | `child-process-injection` | `javascript.lang.security.audit.child-process-injection.child-process-injection` |
| PR-02 IDOR | `idor` or `bola` | Best available IDOR/BOLA rule for JavaScript |
| PR-03 SQL injection | `node mysql sqli` | `javascript.lang.security.audit.sqli.node-mysql-sqli.node-mysql-sqli` |
| PR-04 Open redirect | `express open redirect` | `javascript.express.security.audit.express-open-redirect.express-open-redirect` |
| PR-05 SSRF | `ssrf node fetch` | Best available SSRF rule for Node.js |

3. **Projects** tab → assign to `semgrep-appsec-node-demo` → **Save**

### 4b — Secrets Policy

1. **Policies** → **Create policy** → Name: `AppSec Node Demo — Secrets` → Type: **Secrets**
2. Add: `generic.secrets.security.detected-generic-api-key.detected-generic-api-key` → **Comment**
3. Assign to `semgrep-appsec-node-demo` → **Save**

- [ ] Code policy created, all rules in Comment mode, assigned to repo
- [ ] Secrets policy created, assigned to repo

---

## Step 5 — Enable AI Features

Semgrep AppSec Platform → **Settings** (org-level) → AI features:

- [ ] **Multimodal** → On
- [ ] **Suggested Fix** → On
- [ ] **Autofix** → On

---

## Step 6 — GitHub App Permissions (required for Autofix PR)

GitHub org → **Settings** → **GitHub Apps** → Semgrep → **Configure**:

- [ ] **Contents:** Read and write
- [ ] **Pull requests:** Read and write
- [ ] Permission update accepted by org admin

---

## Step 7 — Add Memories

Semgrep AppSec Platform → Projects → `semgrep-appsec-node-demo` → **Assistant / Memories** → **Add memory**

Paste all five from `docs/semgrep-memories.md`.

- [ ] All five Memories added

---

## Step 8 — Confirm Guardian MCP in Claude Code

Claude Code → Settings → Connectors → confirm `guardian` is listed and active.

- [ ] Guardian MCP connector active

---

## Step 9 — Smoke Test

```bash
cd ~/Desktop/semgrep-appsec-node-demo
git checkout main && git pull
bash demo/scenarios/pr-04-open-redirect.sh
git push -u origin demo/pr-04-open-redirect
gh pr create \
  --title "Add post-signup auth callback redirect" \
  --body "Smoke test: confirm SMS, PR comment, finding, Multimodal/Suggested Fix."
```

Wait 2–5 minutes. Confirm:

- [ ] Semgrep status check appears on the PR
- [ ] Semgrep PR comment appears with the open redirect finding
- [ ] Finding appears in Semgrep AppSec Platform → Findings
- [ ] Multimodal explanation or Suggested Fix appears (click **Analyze** if needed)
- [ ] Guardian MCP works: in Claude Code type *"Use Guardian to check for open findings in semgrep-appsec-node-demo."* — finding should appear

**If all five pass**, clean up:

```bash
gh pr close demo/pr-04-open-redirect --delete-branch
git branch -D demo/pr-04-open-redirect
git push origin --delete demo/pr-04-open-redirect 2>/dev/null || true
```

**If anything fails**, see TROUBLESHOOTING.md before the demo.
