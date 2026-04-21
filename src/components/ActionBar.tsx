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
    <div className="flex flex-col gap-2 px-5 py-4 border-t border-gray-100 bg-white">
      <button
        onClick={onGenerate}
        className="w-full py-3.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:bg-black transition-colors"
      >
        生成图片
      </button>
      <button
        onClick={onDownload}
        disabled={!hasPages || isExporting}
        className="w-full py-3.5 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 active:bg-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isExporting ? '导出中...' : '下载图片'}
      </button>
    </div>
  );
}
