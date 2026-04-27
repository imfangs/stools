import type { LayoutConfig } from '../types';

export interface SpanSegment {
  text: string;
  marginLeft: number;
  marginRight: number;
}

export interface TransformContext {
  letterSpacing: number;
  cjkNumberSpacing: number;
  cjkQuoteSpacing: number;
  emDashOverlap: number;
}

// Character classifiers

function isCJK(ch: string): boolean {
  const code = ch.codePointAt(0)!;
  return (
    (code >= 0x4e00 && code <= 0x9fff) ||
    (code >= 0x3400 && code <= 0x4dbf) ||
    (code >= 0x20000 && code <= 0x2a6df) ||
    (code >= 0x2a700 && code <= 0x2b739) ||
    (code >= 0xf900 && code <= 0xfaff)
  );
}

function isDigit(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code >= 0x30 && code <= 0x39;
}

function isOpenQuote(ch: string): boolean {
  return ch === '\u201c';
}

function isCloseQuote(ch: string): boolean {
  return ch === '\u201d';
}

function isCJKPunctuation(ch: string): boolean {
  return (
    ch === '\u3001' ||
    ch === '\u3002' ||
    ch === '\uff0c' ||
    ch === '\uff01' ||
    ch === '\uff1f' ||
    ch === '\uff1a' ||
    ch === '\uff1b' ||
    ch === '\u2026' ||
    ch === '\uff09' ||
    ch === '\uff08'
  );
}

function isEmDash(ch: string): boolean {
  return ch === '\u2014';
}

export function getTransformContext(
  config: LayoutConfig,
  elementType: 'h1' | 'body',
): TransformContext {
  const isH1 = elementType === 'h1';
  return {
    letterSpacing: isH1 ? config.h1LetterSpacing : config.bodyLetterSpacing,
    cjkNumberSpacing: config.cjkNumberSpacing,
    cjkQuoteSpacing: config.cjkQuoteSpacing,
    emDashOverlap: config.emDashOverlap,
  };
}

export function transformText(text: string, ctx: TransformContext): SpanSegment[] {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const graphemes = Array.from(segmenter.segment(text), (s) => s.segment);

  if (graphemes.length === 0) return [];

  const segments: SpanSegment[] = [];

  for (let i = 0; i < graphemes.length; i++) {
    const ch = graphemes[i];
    let marginLeft = 0;
    let marginRight = 0;

    // Em dash overlap — pull second consecutive dash leftward
    if (ctx.emDashOverlap > 0 && isEmDash(ch) && i > 0 && isEmDash(graphemes[i - 1])) {
      marginLeft = -ctx.emDashOverlap;
    }

    // CJK-Number spacing
    if (ctx.cjkNumberSpacing > 0 && i > 0) {
      const prev = graphemes[i - 1];
      if (
        (isCJK(prev) && !isCJKPunctuation(prev) && isDigit(ch)) ||
        (isDigit(prev) && isCJK(ch) && !isCJKPunctuation(ch))
      ) {
        segments[segments.length - 1].marginRight += ctx.cjkNumberSpacing;
      }
    }

    // CJK-Quote spacing
    if (ctx.cjkQuoteSpacing > 0 && i > 0) {
      const prev = graphemes[i - 1];
      if (isOpenQuote(ch) && isCJK(prev) && !isCJKPunctuation(prev)) {
        segments[segments.length - 1].marginRight += ctx.cjkQuoteSpacing;
      }
      if (isCloseQuote(prev) && isCJK(ch) && !isCJKPunctuation(ch)) {
        segments[segments.length - 1].marginRight += ctx.cjkQuoteSpacing;
      }
    }

    // Base letter-spacing as marginRight (except last grapheme)
    if (i < graphemes.length - 1) {
      marginRight += ctx.letterSpacing;
    }

    segments.push({ text: ch, marginLeft, marginRight });
  }

  return segments;
}

/**
 * Apply SpanSegment[] to a DOM element by creating <span> per segment.
 * Sets parent letter-spacing to 0 (spacing handled by margins).
 */
export function applySegmentsToDOM(
  parent: HTMLElement,
  segments: SpanSegment[],
): void {
  parent.style.letterSpacing = '0px';

  for (const seg of segments) {
    const span = document.createElement('span');
    span.textContent = seg.text;
    if (seg.marginLeft !== 0) {
      span.style.marginLeft = `${seg.marginLeft}px`;
    }
    if (seg.marginRight !== 0) {
      span.style.marginRight = `${seg.marginRight}px`;
    }
    parent.appendChild(span);
  }
}
