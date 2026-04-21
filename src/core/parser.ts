import type { ParsedElement } from '../types';

export function parseText(text: string): ParsedElement[] {
  const lines = text.split('\n');
  const elements: ParsedElement[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      elements.push({ type: 'empty-line', content: '' });
    } else if (/^===+$/.test(trimmed)) {
      elements.push({ type: 'page-break', content: '' });
    } else if (/^---+$/.test(trimmed)) {
      elements.push({ type: 'divider', content: '' });
    } else if (trimmed.startsWith('# ')) {
      elements.push({ type: 'h1', content: trimmed.slice(2) });
    } else {
      elements.push({ type: 'body', content: trimmed });
    }
  }

  // Remove empty lines adjacent to dividers — dividerMarginY handles spacing
  return elements.filter((el, i) => {
    if (el.type !== 'empty-line') return true;
    const prev = elements[i - 1];
    const next = elements[i + 1];
    if (prev?.type === 'divider' || next?.type === 'divider') return false;
    return true;
  });
}
