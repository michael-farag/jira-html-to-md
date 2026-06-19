# Jira to Markdown — Export Issue Description

A Chrome extension that adds a **⬇ Download .md** button to any Jira Cloud issue page. One click exports the issue description as a clean Markdown (`.md`) file.

## Features

- Works on all Jira Cloud instances (`*.atlassian.net`)
- Converts the rendered description to Markdown including:
  - Headings, paragraphs, bold, italic
  - Ordered and unordered lists, task lists (checkboxes)
  - Code blocks with language syntax fencing
  - Tables (GitHub Flavored Markdown)
  - Strikethrough and other inline formatting
- Downloads a file named `PROJ-123-issue-summary.md` with the issue key as a top-level heading
- Handles Jira Cloud as a single-page app — the button re-injects when you navigate between issues

## Install from Chrome Web Store

> Chrome Web Store link coming soon.

## Build & load locally

**Requirements:** Node.js 18+

```bash
git clone https://github.com/52nd-solution/jira-to-md.git
cd jira-to-md
npm install
npm run build
```

Then in Chrome:

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `jira-to-md` folder

Open any Jira Cloud issue and the **⬇ Download .md** button will appear above the description.

## Package for distribution

```bash
npm run package
```

This builds the extension and creates `jira-to-md.zip`, ready to upload to the Chrome Web Store Developer Dashboard.

## Known limitations

- **Inline images** become `![alt text](url)` references pointing to Jira's CDN — they require authentication to view and are not downloaded.
- **Smart links / embed cards** (Confluence pages, GitHub PRs, etc.) are converted to plain hyperlinks.
- **ADF-specific layout blocks** (multi-column layouts, panels) may lose their visual structure but their text content is preserved.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2024 52nd Solution Pty Ltd

---

**52nd Solution Pty Ltd** — Business-Minded Developers  
Website: [www.52ndSolution.net](https://www.52ndSolution.net)  
Email: [admin@52ndSolution.net](mailto:admin@52ndSolution.net)  
Phone: +61 2 8090 2401  
Address: 295 King Street, Mascot, NSW 2020, Australia  
[LinkedIn](https://linkedin.com/company/52nd-solution-pty-ltd) · [Facebook](https://facebook.com/52ndsolution)
