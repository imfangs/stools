import { forwardRef } from 'react';
import type { Page, LayoutConfig, ParsedElement } from '../types';

interface ImageCardProps {
  page: Page;
  config: LayoutConfig;
}

function renderElement(el: ParsedElement, index: number, config: LayoutConfig) {
  switch (el.type) {
    case 'h1':
      return (
        <div
          key={index}
          style={{
            fontSize: config.h1FontSize,
            fontWeight: config.h1FontWeight,
            lineHeight: config.h1LineHeight,
            marginBottom: config.h1MarginBottom,
            color: config.textColor,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {el.content}
        </div>
      );
    case 'body':
      return (
        <div
          key={index}
          style={{
            fontSize: config.bodyFontSize,
            fontWeight: config.bodyFontWeight,
            lineHeight: config.bodyLineHeight,
            marginBottom: config.bodyMarginBottom,
            color: config.textColor,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {el.content}
        </div>
      );
    case 'divider':
      return (
        <div
          key={index}
          style={{
            height: config.dividerHeight,
            backgroundColor: config.dividerColor,
            marginTop: config.dividerMarginY,
            marginBottom: config.dividerMarginY,
          }}
        />
      );
    case 'empty-line':
      return (
        <div
          key={index}
          style={{ height: config.emptyLineHeight }}
        />
      );
    default:
      return null;
  }
}

const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ page, config }, ref) => {
    // Scale factor for preview display
    const scale = 1;

    return (
      <div className="relative">
        <div
          ref={ref}
          style={{
            width: config.imageWidth,
            height: config.imageHeight,
            backgroundColor: config.backgroundColor,
            paddingTop: config.paddingTop,
            paddingBottom: config.paddingBottom,
            paddingLeft: config.paddingLeft,
            paddingRight: config.paddingRight,
            fontFamily: config.fontFamily,
            overflow: 'hidden',
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
          }}
        >
          {page.elements.map((el, i) => renderElement(el, i, config))}

          {/* Page number */}
          {config.showPageNumber && (
            <div
              style={{
                position: 'absolute',
                bottom: config.paddingBottom / 2,
                right: config.paddingRight,
                fontSize: config.pageNumberFontSize,
                color: config.pageNumberColor,
              }}
            >
              {page.index + 1}
            </div>
          )}
        </div>
      </div>
    );
  },
);

ImageCard.displayName = 'ImageCard';

export default ImageCard;
