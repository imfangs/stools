import type { LayoutConfig } from '../types';

export const defaultConfig: LayoutConfig = {
  imageWidth: 1080,
  imageHeight: 1440,

  paddingTop: 120,
  paddingBottom: 120,
  paddingLeft: 80,
  paddingRight: 80,

  h1FontSize: 52,
  h1FontWeight: 700,
  h1LineHeight: 1.4,
  h1MarginBottom: 40,

  bodyFontSize: 34,
  bodyFontWeight: 400,
  bodyLineHeight: 1.8,
  bodyMarginBottom: 20,

  dividerHeight: 1,
  dividerColor: 'rgba(255,255,255,0.2)',
  dividerMarginY: 40,

  emptyLineHeight: 34,

  backgroundColor: '#000000',
  textColor: '#FFFFFF',
  fontFamily: '-apple-system, "PingFang SC", "Helvetica Neue", "Noto Sans SC", sans-serif',

  showPageNumber: true,
  pageNumberFontSize: 24,
  pageNumberColor: 'rgba(255,255,255,0.3)',

  previewColumns: 4,
};
