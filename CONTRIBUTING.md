# Contributing to Jira to Markdown

Thank you for your interest in contributing! This document covers how to set up the project, build it, test it, and submit changes.

## Setup

**Requirements:** Node.js 18+, npm 9+

```bash
git clone https://github.com/52nd-solution/jira-to-md.git
cd jira-to-md
npm install
```

## Build

```bash
npm run build       # one-off build → dist/content.js
npm run watch       # rebuild on file changes during development
npm run package     # build + zip → jira-to-md.zip (for store upload)
```

## Load in Chrome for development

1. Run `npm run watch` in a terminal so the bundle rebuilds automatically.
2. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select this folder.
3. After saving a source file the bundle rebuilds; click the **↻** reload button on the extension card, then hard-refresh the Jira page.

## Testing

There is no automated test suite yet. Manual testing steps:

1. Open a Jira Cloud issue with a rich description (headings, bold, a table, a code block, a checklist).
2. Confirm the **⬇ Download .md** button appears above the description.
3. Click it — a `.md` file should download named `PROJ-123-<summary>.md`.
4. Open the file and verify formatting is correct.
5. Navigate to a different issue without reloading the page — confirm the button re-appears and downloads the new issue's description.
6. Test an issue with no description — the button should still appear and produce a file with only the title heading.

## Project structure

```
src/
  content.js    Entry point bundled by esbuild. Injects the button and handles downloads.
  jira-dom.js   DOM selectors for the description, issue key, and summary.
  converter.js  Turndown (HTML → Markdown) configuration and custom rules.
  button.css    Styles for the injected button.
manifest.json   Chrome Manifest V3 config.
package.json    Build scripts and dependencies.
```

## Branch & PR workflow

- Branch from `main` using the pattern `feat/<short-description>` or `fix/<short-description>`.
- Keep PRs focused — one logical change per PR.
- Write a clear PR description explaining what changed and why.
- For DOM-selector changes, note which Jira Cloud version/testid you verified against.

## Code style

- Vanilla ES modules (`import`/`export`), no TypeScript, no framework.
- Prefer explicit, descriptive names over comments.
- Keep DOM selectors in `jira-dom.js` — don't scatter them across files.
- Avoid adding permissions to `manifest.json` without discussion; minimal permissions ease Chrome Web Store review.

## Reporting issues

Please open a GitHub Issue with:
- The Jira Cloud URL pattern (e.g. `myorg.atlassian.net/browse/...`)
- A description of what you expected vs what happened
- Browser version and extension version

For security issues, email [admin@52ndSolution.net](mailto:admin@52ndSolution.net) rather than opening a public issue.

## Contact

**52nd Solution Pty Ltd**  
[www.52ndSolution.net](https://www.52ndSolution.net) · [admin@52ndSolution.net](mailto:admin@52ndSolution.net)
