# semgrep-appsec-node-demo

> ⚠️ This repo intentionally contains vulnerable demo code. Do NOT deploy to production.

A Node.js project management API used to demo Semgrep Managed Scans, Multimodal, Memories, Suggested Fix, Autofix PR, and Guardian in Claude Code.

## Setup

```bash
npm install
npm start
# → http://localhost:3000
```

## Baseline routes

```bash
curl http://localhost:3000/health
curl -H "x-demo-workspace-id: ws-001" http://localhost:3000/me
curl -H "x-demo-workspace-id: ws-001" http://localhost:3000/tasks/task-001
```

## Files to follow (in order)

1. `PREWORK_CHECKLIST.md` — setup, policy creation, smoke test
2. `docs/semgrep-memories.md` — paste into Semgrep AppSec Platform before demo
3. `docs/agent-prompts.md` — Claude Code prompts for each scenario
4. `DEMO_FLOW.md` — full talk track
5. `TROUBLESHOOTING.md` — if something breaks

## Demo PRs

```bash
# Run each from main
git checkout main && git pull
bash demo/scenarios/pr-01-command-injection.sh
git push -u origin demo/pr-01-command-injection
gh pr create --title "Add CI pipeline log viewer" --body "Demo: command injection"

git checkout main && git pull
bash demo/scenarios/pr-02-idor-task.sh
git push -u origin demo/pr-02-idor-task
gh pr create --title "Add shareable task detail endpoint" --body "Demo: IDOR / workspace isolation"

git checkout main && git pull
bash demo/scenarios/pr-03-sql-injection.sh
git push -u origin demo/pr-03-sql-injection
gh pr create --title "Add task search by status" --body "Demo: SQL injection + Customize Fix"

git checkout main && git pull
bash demo/scenarios/pr-04-open-redirect.sh
git push -u origin demo/pr-04-open-redirect
gh pr create --title "Add post-signup auth callback redirect" --body "Demo: open redirect + Autofix PR"

git checkout main && git pull
bash demo/scenarios/pr-05-secrets-ssrf.sh
git push -u origin demo/pr-05-secrets-ssrf
gh pr create --title "Add webhook delivery endpoint" --body "Demo: secrets + SSRF"
```
