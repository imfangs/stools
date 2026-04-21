export type ElementType = 'h1' | 'body' | 'divider' | 'empty-line' | 'page-break';

export interface ParsedElement {
  type: ElementType;
  content: string;
}

export interface Page {
  elements: ParsedElement[];
  index: number;
}

export interface LayoutConfig {
  imageWidth: number;
  imageHeight: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
  h1FontSize: number;
  h1FontWeight: number;
  h1LineHeight: number;
  h1LetterSpacing: number;
  h1MarginBottom: number;
  bodyFontSize: number;
  bodyFontWeight: number;
  bodyLineHeight: number;
  bodyLetterSpacing: number;
  bodyMarginBottom: number;
  dividerHeight: number;
  dividerColor: string;
  dividerMarginY: number;
  emptyLineHeight: number;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  previewColumns: number;
}
