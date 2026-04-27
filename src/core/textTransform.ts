import type { LayoutConfig } from '../types';

export interface SpanSegment {
  text: string;
  marginLeft: number;
  marginRight: number;
  style?: Record<string, string>;
}

export interface TransformContext {
  fontSize: number;
  letterSpacing: number;
  cjkNumberSpacing: boolean;
  cjkQuoteSpacing: boolean;
  arrowStyle: LayoutConfig['arrowStyle'];
  emDashSeamless: boolean;
}

// Character classifiers

function isCJK(ch: string): boolean {
  const code = ch.codePointAt(0)!;
  return (
    (code >= 0x4e00 && code <= 0x9fff) ||   // CJK Unified Ideographs
    (code >= 0x3400 && code <= 0x4dbf) ||   // CJK Unified Ideographs Extension A
    (code >= 0x20000 && code <= 0x2a6df) || // CJK Unified Ideographs Extension B
    (code >= 0x2a700 && code <= 0x2b739) || // CJK Unified Ideographs Extension C
    (code >= 0xf900 && code <= 0xfaff) ||   // CJK Compatibility Ideographs
    (code >= 0x3000 && code <= 0x303f)      // CJK Symbols and Punctuation (但不含标点，下面单独判断)
  );
}

function isDigit(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return code >= 0x30 && code <= 0x39; // 0-9
}

function isOpenQuote(ch: string): boolean {
  return ch === '\u201c'; // "
}

function isCloseQuote(ch: string): boolean {
  return ch === '\u201d'; // "
}

function isCJKPunctuation(ch: string): boolean {
  const code = ch.charCodeAt(0);
  return (
    ch === '\u3001' || // 、
    ch === '\u3002' || // 。
    ch === '\uff0c' || // ，
    ch === '\uff01' || // ！
    ch === '\uff1f' || // ？
    ch === '\uff1a' || // ：
    ch === '\uff1b' || // ；
    ch === '\u2026' || // …
    ch === '\uff09' || // ）
    ch === '\uff08' || // （
    (code >= 0x3001 && code <= 0x3003) // 、。〃
  );
}

function isEmDash(ch: string): boolean {
  return ch === '\u2014'; // —
}

function isArrow(ch: string): boolean {
  return ch === '\u2192'; // →
}

const ARROW_MAP: Record<string, string> = {
  'original': '\u2192',   // →
  'short-bold': '\u279c', // ➜
  'triangle': '\u25b8',   // ▸
  'long': '\u27f6',       // ⟶
};

export function getTransformContext(
  config: LayoutConfig,
  elementType: 'h1' | 'body',
): TransformContext {
  const isH1 = elementType === 'h1';
  return {
    fontSize: isH1 ? config.h1FontSize : config.bodyFontSize,
    letterSpacing: isH1 ? config.h1LetterSpacing : config.bodyLetterSpacing,
    cjkNumberSpacing: config.cjkNumberSpacing,
    cjkQuoteSpacing: config.cjkQuoteSpacing,
    arrowStyle: config.arrowStyle,
    emDashSeamless: config.emDashSeamless,
  };
}

export function transformText(text: string, ctx: TransformContext): SpanSegment[] {
  const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
  const graphemes = Array.from(segmenter.segment(text), (s) => s.segment);

  if (graphemes.length === 0) return [];

  const halfSpacing = ctx.fontSize * 0.5;
  const segments: SpanSegment[] = [];

  for (let i = 0; i < graphemes.length; i++) {
    let ch = graphemes[i];
    let marginLeft = 0;
    let marginRight = 0;
    let style: Record<string, string> | undefined;

    // Feature 3: Arrow replacement
    if (isArrow(ch) && ctx.arrowStyle !== 'original') {
      ch = ARROW_MAP[ctx.arrowStyle] || ch;
    }

    // Feature 4: Em dash seamless — pull second dash leftward
    if (ctx.emDashSeamless && isEmDash(ch) && i > 0 && isEmDash(graphemes[i - 1])) {
      marginLeft = -(ctx.fontSize * 0.14);
    }

    // Feature 1: CJK-Number spacing
    if (ctx.cjkNumberSpacing && i > 0) {
      const prev = graphemes[i - 1];
      if (
        (isCJK(prev) && !isCJKPunctuation(prev) && isDigit(ch)) ||
        (isDigit(prev) && isCJK(ch) && !isCJKPunctuation(ch))
      ) {
        // Add spacing to the previous segment's marginRight
        segments[segments.length - 1].marginRight += halfSpacing;
      }
    }

    // Feature 2: CJK-Quote spacing
    if (ctx.cjkQuoteSpacing && i > 0) {
      const prev = graphemes[i - 1];
      // CJK before open quote
      if (isOpenQuote(ch) && isCJK(prev) && !isCJKPunctuation(prev)) {
        segments[segments.length - 1].marginRight += halfSpacing;
      }
      // Close quote before CJK (not punctuation)
      if (isCloseQuote(prev) && isCJK(ch) && !isCJKPunctuation(ch)) {
        segments[segments.length - 1].marginRight += halfSpacing;
      }
    }

    // Base letter-spacing as marginRight (except last grapheme)
    if (i < graphemes.length - 1) {
      marginRight += ctx.letterSpacing;
    }

    segments.push({ text: ch, marginLeft, marginRight, style });
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
    if (seg.style) {
      for (const [key, value] of Object.entries(seg.style)) {
        span.style.setProperty(key, value);
      }
    }
    parent.appendChild(span);
  }
}
