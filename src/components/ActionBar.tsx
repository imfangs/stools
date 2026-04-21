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
    <div className="flex gap-3 p-4 border-t border-gray-200 bg-white">
      <button
        onClick={onGenerate}
        className="flex-1 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors"
      >
        生成图片
      </button>
      <button
        onClick={onDownload}
        disabled={!hasPages || isExporting}
        className="flex-1 py-2.5 border border-black text-sm font-medium rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isExporting ? '导出中...' : '下载图片'}
      </button>
    </div>
  );
}
