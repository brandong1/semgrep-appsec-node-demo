# Troubleshooting

---

## No Semgrep PR comment

1. Policies → confirm rules are in **Comment** or **Block** mode (not Monitor)
2. Confirm Managed Scans is enabled for the repo
3. Close and re-open the PR to re-trigger the scan
4. Do not troubleshoot `SEMGREP_APP_TOKEN` — SMS doesn't use it

## No Semgrep status check on the PR

1. Confirm Managed Scans is on in Project Settings
2. GitHub org Settings → GitHub Apps → confirm Semgrep has access to this repo
3. Check Semgrep AppSec Platform → Projects → scan history — did a scan run?

## No Multimodal explanation

1. Org Settings → confirm Multimodal is enabled
2. Open the finding → click **Analyze** to trigger manually
3. If finding was dismissed, re-open a fresh PR

## No Autofix PR option

- [ ] Finding is Semgrep Code (not Secrets)
- [ ] Repo is GitHub Cloud
- [ ] Autofix enabled in org Settings
- [ ] Semgrep GitHub App has Contents: Read and write
- [ ] Semgrep GitHub App has Pull requests: Read and write
- [ ] Org admin has accepted permission update
- [ ] Finding is open (not resolved or ignored)

To open: finding detail page → **Fix** dropdown → **Open Autofix PR**. Do NOT click Apply Suggested Fix first.

## Guardian MCP returns no findings

- Confirm an SMS scan has completed — Guardian reads existing findings, it does not run a new scan
- Confirm the finding is open (not resolved or ignored)
- Claude Code → Settings → Connectors → confirm `guardian` is active
- Run the smoke test PR first if no scans have run yet

## Scenario script fails (branch already exists)

```bash
git branch -D demo/pr-01-command-injection
git push origin --delete demo/pr-01-command-injection 2>/dev/null || true
gh pr list --head demo/pr-01-command-injection  # close any open PR first
```

Then re-run the script.
