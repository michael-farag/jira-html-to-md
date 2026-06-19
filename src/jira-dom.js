export function getDescriptionElement() {
  // Priority 1: testid for the rich-text description field wrapper
  const byTestid = document.querySelector(
    '[data-testid="issue.views.field.rich-text.description"]'
  );
  if (byTestid) {
    return byTestid.querySelector('.ak-renderer-document') || byTestid;
  }

  // Priority 2: renderer doc directly on the page
  const rendererDoc = document.querySelector('.ak-renderer-document');
  if (rendererDoc) return rendererDoc;

  // Priority 3: any element whose testid contains "description"
  return document.querySelector('[data-testid*="description"]') || null;
}

export function getIssueKey() {
  // Priority 1: /browse/PROJ-123 URL pattern
  const browseMatch = location.pathname.match(/\/browse\/([A-Z][A-Z0-9]+-\d+)/i);
  if (browseMatch) return browseMatch[1].toUpperCase();

  // Priority 2: selectedIssue query param (board/backlog views)
  const selectedIssue = new URLSearchParams(location.search).get('selectedIssue');
  if (selectedIssue) return selectedIssue.toUpperCase();

  // Priority 3: breadcrumb DOM node
  const keyEl = document.querySelector(
    '[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]'
  );
  if (keyEl) return keyEl.textContent.trim();

  return null;
}

export function getIssueSummary() {
  // Priority 1: testid heading
  const summaryEl = document.querySelector(
    '[data-testid="issue.views.issue-base.foundation.summary.heading"]'
  );
  if (summaryEl) return summaryEl.textContent.trim();

  // Priority 2: first h1 on the page
  const h1 = document.querySelector('h1');
  if (h1) return h1.textContent.trim();

  return 'untitled';
}
