import html2canvas from 'html2canvas-pro';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Page, LayoutConfig, ParsedElement } from '../types';
import { transformText, getTransformContext, applySegmentsToDOM } from './textTransform';

function buildPageDOM(page: Page, config: LayoutConfig): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = `
    width: ${config.imageWidth}px;
    height: ${config.imageHeight}px;
    background-color: ${config.backgroundColor};
    padding: ${config.paddingTop}px ${config.paddingRight}px ${config.paddingBottom}px ${config.paddingLeft}px;
    font-family: ${config.fontFamily};
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `;

  const inner = document.createElement('div');
  for (let i = 0; i < page.elements.length; i++) {
    const nextType = page.elements[i + 1]?.type;
    inner.appendChild(buildElementDOM(page.elements[i], config, nextType));
  }
  container.appendChild(inner);

  return container;
}

function buildElementDOM(el: ParsedElement, config: LayoutConfig, nextType?: string): HTMLElement {
  const node = document.createElement('div');
  const beforeDivider = nextType === 'divider';

  switch (el.type) {
    case 'h1':
      node.style.cssText = `
        font-size: ${config.h1FontSize}px;
        font-weight: ${config.h1FontWeight};
        line-height: ${config.h1LineHeight};
        letter-spacing: ${config.h1LetterSpacing}px;
        margin-bottom: ${beforeDivider ? 0 : config.h1MarginBottom}px;
        color: ${config.textColor};
        word-wrap: break-word;
        overflow-wrap: break-word;
      `;
      applySegmentsToDOM(node, transformText(el.content, getTransformContext(config, 'h1')));
      break;
    case 'body':
      node.style.cssText = `
        font-size: ${config.bodyFontSize}px;
        font-weight: ${config.bodyFontWeight};
        line-height: ${config.bodyLineHeight};
        letter-spacing: ${config.bodyLetterSpacing}px;
        margin-bottom: ${beforeDivider ? 0 : config.bodyMarginBottom}px;
        color: ${config.textColor};
        word-wrap: break-word;
        overflow-wrap: break-word;
      `;
      applySegmentsToDOM(node, transformText(el.content, getTransformContext(config, 'body')));
      break;
    case 'divider':
      node.style.cssText = `
        height: ${config.dividerHeight}px;
        background-color: ${config.dividerColor};
        margin-top: ${config.dividerMarginY}px;
        margin-bottom: ${config.dividerMarginY}px;
      `;
      break;
    case 'empty-line':
      node.style.cssText = `height: ${config.emptyLineHeight}px;`;
      break;
    case 'page-break':
      node.style.cssText = 'display: none;';
      break;
  }

  return node;
}

async function captureOffscreen(page: Page, config: LayoutConfig): Promise<Blob> {
  const el = buildPageDOM(page, config);

  // Mount offscreen for html2canvas to measure
  el.style.position = 'fixed';
  el.style.left = '-9999px';
  el.style.top = '0';
  document.body.appendChild(el);

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
      width: config.imageWidth,
      height: config.imageHeight,
    });

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create blob'));
        },
        'image/png',
        1.0,
      );
    });
  } finally {
    document.body.removeChild(el);
  }
}

function formatTimestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

function extractFilenameFromText(text: string): string {
  // Get first non-empty line, strip markdown heading prefix
  const firstLine = text
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0);
  if (!firstLine) return 'stools';

  const cleaned = firstLine
    .replace(/^#+\s*/, '') // remove heading markers
    .replace(/[^\u4e00-\u9fffa-zA-Z0-9]/g, '') // keep only CJK, letters, digits
    .slice(0, 10);

  return cleaned || 'stools';
}

export async function renderAndExport(
  pages: Page[],
  config: LayoutConfig,
  text?: string,
): Promise<void> {
  if (pages.length === 0) return;

  const baseName = text ? extractFilenameFromText(text) : 'stools';
  const timestamp = formatTimestamp();

  if (pages.length === 1) {
    const blob = await captureOffscreen(pages[0], config);
    saveAs(blob, `${baseName}_${timestamp}.png`);
    return;
  }

  const zip = new JSZip();

  for (let i = 0; i < pages.length; i++) {
    const blob = await captureOffscreen(pages[i], config);
    zip.file(`${i + 1}.png`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, `${baseName}_${timestamp}.zip`);
}
