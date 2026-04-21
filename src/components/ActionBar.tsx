interface ActionBarProps {
  onGenerate: () => void;
  onDownload: () => void;
  hasPages: boolean;
  isExporting: boolean;
}

export default function ActionBar({
  onGenerate,
  onDownload,
  hasPages,
  isExporting,
}: ActionBarProps) {
  return (
    <div className="flex gap-3">
      <button
        onClick={onGenerate}
        className="flex-1 h-14 bg-black text-white text-lg font-medium hover:bg-gray-900 active:bg-black transition-colors"
      >
        生成图片
      </button>
      <button
        onClick={onDownload}
        disabled={!hasPages || isExporting}
        className="flex-1 h-14 bg-black text-white text-lg font-medium hover:bg-gray-900 active:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isExporting ? '导出中...' : '下载图片'}
      </button>
    </div>
  );
}
