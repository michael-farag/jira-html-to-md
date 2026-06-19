import { getDescriptionElement, getIssueKey, getIssueSummary } from './jira-dom.js';
import { convertToMarkdown } from './converter.js';

const BUTTON_ID = 'jira-to-md-download-btn';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function downloadMarkdown(issueKey, summary, markdown) {
  const content = `# ${issueKey}: ${summary}\n\n${markdown}`;
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const filename = `${issueKey}-${slugify(summary)}.md`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function injectButton() {
  if (document.getElementById(BUTTON_ID)) return;

  const descEl = getDescriptionElement();
  if (!descEl) {
    console.warn('[jira-to-md] Description element not found — button not injected.');
    return;
  }

  const btn = document.createElement('button');
  btn.id = BUTTON_ID;
  btn.textContent = '⬇ Download .md';
  btn.title = 'Export description as Markdown — Jira to Markdown by 52nd Solution';

  btn.addEventListener('click', () => {
    const el = getDescriptionElement();
    if (!el) return;
    const issueKey = getIssueKey() || 'ISSUE';
    const summary = getIssueSummary() || 'untitled';
    const markdown = convertToMarkdown(el.innerHTML);
    downloadMarkdown(issueKey, summary, markdown);
  });

  descEl.insertAdjacentElement('beforebegin', btn);
}

function removeButton() {
  document.getElementById(BUTTON_ID)?.remove();
}

// SPA navigation: Jira Cloud re-renders without a full page reload.
// Watch for URL changes and DOM updates to re-inject the button.
let currentHref = location.href;

const observer = new MutationObserver(() => {
  if (location.href !== currentHref) {
    currentHref = location.href;
    removeButton();
  }
  if (!document.getElementById(BUTTON_ID)) {
    injectButton();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

injectButton();
