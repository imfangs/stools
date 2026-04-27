import { useRef, useEffect, useState } from 'react';
import type { Page, LayoutConfig, ParsedElement } from '../types';
import { transformText, getTransformContext } from '../core/textTransform';
import type { SpanSegment } from '../core/textTransform';

interface ImageCardProps {
  page: Page;
  config: LayoutConfig;
}

function renderSegments(segments: SpanSegment[]) {
  return segments.map((seg, i) => (
    <span
      key={i}
      style={{
        ...(seg.marginLeft !== 0 ? { marginLeft: seg.marginLeft } : {}),
        ...(seg.marginRight !== 0 ? { marginRight: seg.marginRight } : {}),
      }}
    >
      {seg.text}
    </span>
  ));
}

function renderElement(el: ParsedElement, index: number, config: LayoutConfig, nextType?: string) {
  const beforeDivider = nextType === 'divider';
  switch (el.type) {
    case 'h1': {
      const segments = transformText(el.content, getTransformContext(config, 'h1'));
      return (
        <div
          key={index}
          style={{
            fontSize: config.h1FontSize,
            fontWeight: config.h1FontWeight,
            lineHeight: config.h1LineHeight,
            letterSpacing: 0,
            marginBottom: beforeDivider ? 0 : config.h1MarginBottom,
            color: config.textColor,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {renderSegments(segments)}
        </div>
      );
    }
    case 'body': {
      const segments = transformText(el.content, getTransformContext(config, 'body'));
      return (
        <div
          key={index}
          style={{
            fontSize: config.bodyFontSize,
            fontWeight: config.bodyFontWeight,
            lineHeight: config.bodyLineHeight,
            letterSpacing: 0,
            marginBottom: beforeDivider ? 0 : config.bodyMarginBottom,
            color: config.textColor,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {renderSegments(segments)}
        </div>
      );
    }
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
    case 'page-break':
      return null;
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
            boxSizing: 'border-box',
            overflow: 'hidden',
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
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div>
            {page.elements.map((el, i) => renderElement(el, i, config, page.elements[i + 1]?.type))}
          </div>
        </div>
      </div>
      <div className="text-center text-[10px] text-gray-400 font-mono tracking-wide">
        {page.index + 1}
      </div>
    </div>
  );
}
