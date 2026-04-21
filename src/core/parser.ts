import type { ParsedElement } from '../types';

export function parseText(text: string): ParsedElement[] {
  const lines = text.split('\n');
  const elements: ParsedElement[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      elements.push({ type: 'empty-line', content: '' });
    } else if (/^---+$/.test(trimmed)) {
      elements.push({ type: 'divider', content: '' });
    } else if (trimmed.startsWith('# ')) {
      elements.push({ type: 'h1', content: trimmed.slice(2) });
    } else {
      elements.push({ type: 'body', content: trimmed });
    }
  }

  return elements;
}
