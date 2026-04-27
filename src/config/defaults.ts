import type { LayoutConfig } from '../types';

export const defaultConfig: LayoutConfig = {
  imageWidth: 1170,
  imageHeight: 1560,

  paddingTop: 120,
  paddingBottom: 120,
  paddingLeft: 60,
  paddingRight: 60,

  h1FontSize: 79,
  h1FontWeight: 700,
  h1LineHeight: 1.2,
  h1LetterSpacing: 1,
  h1MarginBottom: 8,

  bodyFontSize: 48,
  bodyFontWeight: 400,
  bodyLineHeight: 1.4,
  bodyLetterSpacing: 2,
  bodyMarginBottom: 0,

  dividerHeight: 3,
  dividerColor: 'rgba(255,255,255,0.2)',
  dividerMarginY: 100,

  emptyLineHeight: 70,

  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  fontFamily: '-apple-system, "PingFang SC", "Helvetica Neue", "Noto Sans SC", sans-serif',

  previewColumns: 3,

  cjkNumberSpacing: 16,
  cjkQuoteSpacing: 16,
  emDashOverlap: 5,
};
