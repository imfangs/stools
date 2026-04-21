interface EditorProps {
  text: string;
  onChange: (text: string) => void;
}

export default function Editor({ text, onChange }: EditorProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <span className="text-sm text-gray-500">
          文本输入（支持 # 标题、--- 分割线、空行）
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-4 resize-none outline-none font-mono text-sm leading-relaxed bg-white"
        placeholder={`输入文案内容...\n\n# 标题文字\n普通正文内容\n---\n分割线`}
        spellCheck={false}
      />
    </div>
  );
}
