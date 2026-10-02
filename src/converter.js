import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

td.use(gfm);

// Preserve code-block language from Jira's rendered <pre><code class="language-...">
td.addRule('fencedCodeBlock', {
  filter(node) {
    return (
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    );
  },
  replacement(_content, node) {
    const code = node.firstChild;
    const lang = (code.className.match(/language-(\S+)/) || [])[1] || '';
    return `\n\`\`\`${lang}\n${code.textContent.trimEnd()}\n\`\`\`\n`;
  },
});

// Jira renders <p> inside every <td>/<th>. Without this rule Turndown adds
// surrounding newlines to those paragraphs, which breaks the GFM table rows.
td.addRule('tableCellParagraph', {
  filter(node) {
    return (
      node.nodeName === 'P' &&
      node.parentNode &&
      (node.parentNode.nodeName === 'TD' || node.parentNode.nodeName === 'TH')
    );
  },
  replacement(content) {
    return content.trim();
  },
});

// Strip Jira UI chrome injected inside the renderer that isn't description content
td.remove(['button', '[data-testid="ak-renderer-toolbar"]', '.copy-button']);

// Jira sometimes stores text like "**Heading**" inside a <strong> element
// (users typing Markdown syntax in the rich-text editor). Strip the redundant
// leading/trailing ** so we don't end up with **\*\*Heading\*\***.
td.addRule('cleanStrongMarkdown', {
  filter: 'strong',
  replacement(content) {
    const clean = content.replace(/^\\\*\\\*/, '').replace(/\\\*\\\*$/, '').trim();
    return `**${clean}**`;
  },
});

// Base64-embedded images are written reference-style — ![alt][image-1] in the
// text, with the data URI collected at the end of the file — so the huge
// base64 strings don't bury the description itself.
td.addRule('embeddedImage', {
  filter(node) {
    return (
      node.nodeName === 'IMG' &&
      (node.getAttribute('src') || '').startsWith('data:')
    );
  },
  replacement(_content, node) {
    const src = node.getAttribute('src');
    // An image used more than once is only stored once.
    if (!this.labelBySrc.has(src)) {
      this.labelBySrc.set(src, `image-${this.labelBySrc.size + 1}`);
    }
    const alt = (node.getAttribute('alt') || '').replace(/[\[\]\\]/g, '\\$&').replace(/\s+/g, ' ');
    return `![${alt}][${this.labelBySrc.get(src)}]`;
  },
  labelBySrc: new Map(),
  append() {
    if (!this.labelBySrc.size) return '';
    const references = [...this.labelBySrc].map(([src, label]) => `[${label}]: <${src}>`);
    this.labelBySrc.clear();
    return `\n\n${references.join('\n')}\n\n`;
  },
});

export function convertToMarkdown(html) {
  return td.turndown(html).trim();
}
