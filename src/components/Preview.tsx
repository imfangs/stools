import type { Page, LayoutConfig } from '../types';
import ImageCard from './ImageCard';

interface PreviewProps {
  pages: Page[];
  config: LayoutConfig;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
}

export default function Preview({ pages, config, registerRef }: PreviewProps) {
  if (pages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        点击「生成图片」预览排版效果
      </div>
    );
  }

  const cols = config.previewColumns;

  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {pages.map((page) => (
        <ImageCard
          key={page.index}
          page={page}
          config={config}
          ref={(el) => registerRef(page.index, el)}
        />
      ))}
    </div>
  );
}
