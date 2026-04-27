import type { ParsedElement, Page, LayoutConfig } from '../types';
import { transformText, getTransformContext, applySegmentsToDOM } from './textTransform';

function measureElementHeight(
  el: ParsedElement,
  config: LayoutConfig,
  contentWidth: number,
): number {
  switch (el.type) {
    case 'h1': {
      const lineH = config.h1FontSize * config.h1LineHeight;
      const charPerLine = Math.floor(contentWidth / config.h1FontSize);
      const lines = Math.ceil(el.content.length / charPerLine) || 1;
      return lines * lineH + config.h1MarginBottom;
    }
    case 'body': {
      const lineH = config.bodyFontSize * config.bodyLineHeight;
      const charPerLine = Math.floor(contentWidth / config.bodyFontSize);
      const lines = Math.ceil(el.content.length / charPerLine) || 1;
      return lines * lineH + config.bodyMarginBottom;
    }
    case 'divider':
      return config.dividerHeight + config.dividerMarginY * 2;
    case 'empty-line':
      return config.emptyLineHeight;
    case 'page-break':
      return 0;
    default:
      return 0;
  }
}

/**
 * Measure element height using actual DOM rendering for accurate results.
 * Falls back to estimation if DOM measurement fails.
 */
export function measureWithDOM(
  elements: ParsedElement[],
  config: LayoutConfig,
): Map<number, number> {
  const heights = new Map<number, number>();
  const contentWidth = config.imageWidth - config.paddingLeft - config.paddingRight;

  const container = document.createElement('div');
  container.style.cssText = `
    position: absolute;
    left: -9999px;
    top: -9999px;
    width: ${contentWidth}px;
    font-family: ${config.fontFamily};
    visibility: hidden;
  `;
  document.body.appendChild(container);

  try {
    elements.forEach((el, index) => {
      if (el.type === 'page-break') {
        heights.set(index, 0);
        return;
      }
      if (el.type === 'divider') {
        heights.set(index, config.dividerHeight + config.dividerMarginY * 2);
        return;
      }
      if (el.type === 'empty-line') {
        heights.set(index, config.emptyLineHeight);
        return;
      }

      const node = document.createElement('div');
      if (el.type === 'h1') {
        node.style.cssText = `
          font-size: ${config.h1FontSize}px;
          font-weight: ${config.h1FontWeight};
          line-height: ${config.h1LineHeight};
          letter-spacing: 0px;
          margin-bottom: ${config.h1MarginBottom}px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        `;
        applySegmentsToDOM(node, transformText(el.content, getTransformContext(config, 'h1')));
      } else {
        node.style.cssText = `
          font-size: ${config.bodyFontSize}px;
          font-weight: ${config.bodyFontWeight};
          line-height: ${config.bodyLineHeight};
          letter-spacing: 0px;
          margin-bottom: ${config.bodyMarginBottom}px;
          word-wrap: break-word;
          overflow-wrap: break-word;
        `;
        applySegmentsToDOM(node, transformText(el.content, getTransformContext(config, 'body')));
      }
      container.appendChild(node);

      const rect = node.getBoundingClientRect();
      const style = window.getComputedStyle(node);
      const marginBottom = parseFloat(style.marginBottom) || 0;
      heights.set(index, rect.height + marginBottom);
      container.removeChild(node);
    });
  } finally {
    document.body.removeChild(container);
  }

  // Fallback for any missing measurements
  elements.forEach((el, index) => {
    if (!heights.has(index)) {
      heights.set(index, measureElementHeight(el, config, contentWidth));
    }
  });

  return heights;
}

export function paginate(
  elements: ParsedElement[],
  config: LayoutConfig,
): Page[] {
  const availableHeight =
    config.imageHeight - config.paddingTop - config.paddingBottom;
  const heights = measureWithDOM(elements, config);

  const pages: Page[] = [];
  let currentPage: ParsedElement[] = [];
  let currentHeight = 0;

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];
    let h = heights.get(i) || 0;

    // If this element is followed by a divider, remove its marginBottom
    // to avoid double spacing (divider already has its own marginTop)
    const nextEl = elements[i + 1];
    if (nextEl?.type === 'divider' && (el.type === 'h1' || el.type === 'body')) {
      const mb = el.type === 'h1' ? config.h1MarginBottom : config.bodyMarginBottom;
      h -= mb;
    }

    // Explicit page break: flush current page and start fresh
    if (el.type === 'page-break') {
      if (currentPage.length > 0) {
        pages.push({ elements: trimPageElements(currentPage), index: pages.length });
        currentPage = [];
        currentHeight = 0;
      }
      continue;
    }

    if (currentHeight + h > availableHeight && currentPage.length > 0) {
      pages.push({ elements: trimPageElements(currentPage), index: pages.length });
      currentPage = [];
      currentHeight = 0;
    }

    // Skip leading empty lines on new pages
    if (currentPage.length === 0 && el.type === 'empty-line') {
      continue;
    }

    currentPage.push(el);
    currentHeight += h;
  }

  if (currentPage.length > 0) {
    pages.push({ elements: trimPageElements(currentPage), index: pages.length });
  }

  return pages;
}

/** Remove leading/trailing empty-lines and dividers from a page */
function trimPageElements(elements: ParsedElement[]): ParsedElement[] {
  let start = 0;
  while (start < elements.length) {
    const type = elements[start].type;
    if (type === 'empty-line' || type === 'divider') {
      start++;
    } else {
      break;
    }
  }
  let end = elements.length;
  while (end > start) {
    const type = elements[end - 1].type;
    if (type === 'empty-line' || type === 'divider' || type === 'page-break') {
      end--;
    } else {
      break;
    }
  }
  return elements.slice(start, end);
}
