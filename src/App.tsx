import { useState, useCallback, useEffect } from 'react';
import type { Page, LayoutConfig } from './types';
import { parseText } from './core/parser';
import { paginate } from './core/paginator';
import { renderAndExport } from './core/exporter';
import { loadConfig, saveConfig, resetConfig } from './config/store';
import Editor from './components/Editor';
import Preview from './components/Preview';
import ActionBar from './components/ActionBar';
import ConfigPanel from './components/ConfigPanel';

const SAMPLE_TEXT = `# 关系的本质是什么？

很多人以为关系靠的是感情。
但其实，关系靠的是结构。

---

感情是流动的，结构才是稳定的。

你有没有想过：
为什么有些人明明很爱，却走不到最后？

因为他们只有感情，没有结构。

---

# 什么是关系中的结构？

结构就是三个东西：

• 你有没有张力（不是随时都在）
• 你有没有边界（不是无条件）
• 你有没有反馈（他推进→你有回应）

这三样东西，决定了一段关系能不能长久。`;

export default function App() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [pages, setPages] = useState<Page[]>([]);
  const [config, setConfig] = useState<LayoutConfig>(loadConfig);
  const [showConfig, setShowConfig] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const generate = useCallback((t: string, c: LayoutConfig) => {
    const elements = parseText(t);
    const result = paginate(elements, c);
    setPages(result);
  }, []);

  const handleGenerate = useCallback(() => {
    generate(text, config);
  }, [text, config, generate]);

  // Auto-generate on text or config change
  useEffect(() => {
    generate(text, config);
  }, [text, config, generate]);

  const handleDownload = useCallback(async () => {
    if (pages.length === 0) return;
    setIsExporting(true);
    try {
      await renderAndExport(pages, config, text);
    } finally {
      setIsExporting(false);
    }
  }, [pages, config, text]);

  const handleConfigChange = useCallback((newConfig: LayoutConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  }, []);

  const handleConfigReset = useCallback(() => {
    const c = resetConfig();
    setConfig(c);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200/80 shrink-0">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold tracking-tight text-gray-900">STools</h1>
          <span className="text-xs text-gray-400 font-light">*</span>
          <span className="text-lg font-semibold tracking-tight text-gray-900">Pub</span>
        </div>
        <button
          onClick={() => setShowConfig(!showConfig)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          title="配置"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left: Preview */}
        <div className="flex-1 overflow-y-auto p-8">
          <Preview
            pages={pages}
            config={config}
          />
        </div>

        {/* Right: Editor + Actions */}
        <div className="w-[400px] flex flex-col bg-white border-l border-gray-200/80 shrink-0 shadow-sm ml-2">
          <div className="flex-1 min-h-0">
            <Editor text={text} onChange={setText} />
          </div>
          <ActionBar
            onGenerate={handleGenerate}
            onDownload={handleDownload}
            hasPages={pages.length > 0}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Config Panel */}
      {showConfig && (
        <ConfigPanel
          config={config}
          onChange={handleConfigChange}
          onReset={handleConfigReset}
          onClose={() => setShowConfig(false)}
        />
      )}
    </div>
  );
}
