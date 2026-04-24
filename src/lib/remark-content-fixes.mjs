import fs from 'node:fs';
import path from 'node:path';
import { visit } from 'unist-util-visit';

function escapeHtml(value = '') {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function parseObsidianEmbed(rawValue) {
  const match = rawValue.match(/^!\[\[([^[\]]+)\]\]$/);
  if (!match) {
    return null;
  }

  const [rawTarget, rawWidth] = match[1].split('|');
  const target = rawTarget?.trim();
  const width = rawWidth?.trim();

  if (!target) {
    return null;
  }

  return {
    target,
    width: width && /^\d+$/.test(width) ? width : null,
  };
}

function resolvePublicAsset(target, filePath) {
  if (/^(https?:)?\/\//.test(target) || target.startsWith('/')) {
    return target;
  }

  const projectRoot = process.cwd();
  const publicRoot = path.join(projectRoot, 'public');
  const directPublicCandidate = path.join(publicRoot, target);

  if (fs.existsSync(directPublicCandidate)) {
    return `/${toPosixPath(target)}`;
  }

  if (!filePath) {
    return null;
  }

  const currentDir = path.dirname(filePath);
  const relativeCandidate = path.resolve(currentDir, target);

  if (relativeCandidate.startsWith(publicRoot) && fs.existsSync(relativeCandidate)) {
    return `/${toPosixPath(path.relative(publicRoot, relativeCandidate))}`;
  }

  return null;
}

function createHtmlNode(value) {
  return { type: 'html', value };
}

function renderObsidianFigure(embed, filePath) {
  const publicSrc = resolvePublicAsset(embed.target, filePath);
  const widthStyle = embed.width ? ` style="max-width:${embed.width}px"` : '';
  const caption = escapeHtml(embed.target);

  if (publicSrc) {
    return `<figure class="obsidian-figure"${widthStyle}>
      <img class="obsidian-image" src="${escapeHtml(publicSrc)}" alt="${caption}" loading="lazy" />
      <figcaption>${caption}</figcaption>
    </figure>`;
  }

  return `<figure class="obsidian-figure obsidian-figure-missing"${widthStyle}>
    <div class="obsidian-asset-placeholder">
      <strong>Image placeholder</strong>
      <span>${caption}</span>
    </div>
    <figcaption>Missing local asset: ${caption}</figcaption>
  </figure>`;
}

function renderInlineObsidianEmbed(embed, filePath) {
  const publicSrc = resolvePublicAsset(embed.target, filePath);
  const label = escapeHtml(embed.target);

  if (publicSrc) {
    return `<img class="obsidian-inline-image" src="${escapeHtml(publicSrc)}" alt="${label}" loading="lazy" />`;
  }

  return `<span class="obsidian-inline-asset">${label}</span>`;
}

function splitInlineText(value, filePath) {
  const parts = [];
  const pattern = /!\[\[([^[\]]+)\]\]/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: value.slice(lastIndex, match.index) });
    }

    if (match[0].startsWith('![[')) {
      const embed = parseObsidianEmbed(match[0]);
      if (embed) {
        parts.push(createHtmlNode(renderInlineObsidianEmbed(embed, filePath)));
      } else {
        parts.push({ type: 'text', value: match[0] });
      }
    } else {
      parts.push({ type: 'text', value: match[0] });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < value.length) {
    parts.push({ type: 'text', value: value.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: 'text', value }];
}

export default function remarkContentFixes() {
  return (tree, file) => {
    const filePath = typeof file.path === 'string' ? file.path : null;

    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || typeof index !== 'number') {
        return;
      }

      if (node.children.length !== 1) {
        return;
      }

      const [child] = node.children;
      if (!child || child.type !== 'text') {
        return;
      }

      const rawSource = child.value.trim();
      const embed = rawSource ? parseObsidianEmbed(rawSource) : null;
      if (embed) {
        parent.children.splice(index, 1, createHtmlNode(renderObsidianFigure(embed, filePath)));
        return index;
      }
    });

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') {
        return;
      }

      if (
        parent.type === 'inlineCode' ||
        parent.type === 'code' ||
        parent.type === 'html' ||
        parent.type === 'inlineMath' ||
        parent.type === 'math'
      ) {
        return;
      }

      const replacements = splitInlineText(node.value, filePath);
      if (replacements.length === 1 && replacements[0].type === 'text' && replacements[0].value === node.value) {
        return;
      }

      parent.children.splice(index, 1, ...replacements);
      return index + replacements.length;
    });
  };
}
