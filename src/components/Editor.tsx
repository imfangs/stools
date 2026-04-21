interface EditorProps {
  text: string;
  onChange: (text: string) => void;
}

export default function Editor({ text, onChange }: EditorProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-5 py-3 border-b border-gray-100">
        <span className="text-xs text-gray-400">
          支持 # 标题、--- 分割线、=== 强制分页、空行控制间距
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-5 py-4 resize-none outline-none font-mono text-sm leading-relaxed bg-white text-gray-800 placeholder:text-gray-300"
        placeholder={`输入文案内容...\n\n# 标题文字\n普通正文内容\n---\n分割线`}
        spellCheck={false}
      />
    </div>
  );
}
