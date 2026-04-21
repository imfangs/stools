import { useRef, useEffect, useState } from 'react';
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

export default function ImageCard({ page, config }: ImageCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const width = container.clientWidth;
      setScale(width / config.imageWidth);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [config.imageWidth]);

  return (
    <div className="flex flex-col gap-1.5">
      {/* Aspect Ratio Container */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden shadow-sm ring-1 ring-black/5"
        style={{ aspectRatio: `${config.imageWidth} / ${config.imageHeight}` }}
      >
        {/* Scaled Preview Content */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: config.imageWidth,
            height: config.imageHeight,
            backgroundColor: config.backgroundColor,
            paddingTop: config.paddingTop,
            paddingBottom: config.paddingBottom,
            paddingLeft: config.paddingLeft,
            paddingRight: config.paddingRight,
            fontFamily: config.fontFamily,
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
      <div className="text-center text-[10px] text-gray-400 font-mono tracking-wide">
        {page.index + 1} / {config.imageWidth}×{config.imageHeight}
      </div>
    </div>
  );
}
