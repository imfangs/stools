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
    <div className="flex gap-3 px-5 py-4 border-t border-gray-100 bg-white">
      <button
        onClick={onGenerate}
        className="flex-1 h-16 bg-gray-900 text-white text-lg font-medium hover:bg-gray-800 active:bg-black transition-colors"
      >
        生成图片
      </button>
      <button
        onClick={onDownload}
        disabled={!hasPages || isExporting}
        className="flex-1 h-16 bg-gray-900 text-white text-lg font-medium hover:bg-gray-800 active:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isExporting ? '导出中...' : '下载图片'}
      </button>
    </div>
  );
}
