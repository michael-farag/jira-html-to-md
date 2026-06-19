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

export function convertToMarkdown(html) {
  return td.turndown(html).trim();
}
