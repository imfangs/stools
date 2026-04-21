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

const SAMPLE_TEXT = `# 男人的三大需求

# 生理、情绪、价值

---

很多人以为：

男人要的是性
要的是安慰
要的是被夸

其实都不对。

你不是没满足他
你是满足错了结构。

---

你以为你在给他需要的

# 其实你在——

# 给错位置

# 给错方式

# 给错时机

---

# 男人的三大需求

# 本质是三种结构

---

# 01｜生理需求，本质不是性

很多人理解错了。

男人的“生理需求”，不是简单的性冲动。
而是：

# 被欲望点燃的感觉

核心是三件事：
• 可得性（你不是完全不可得）
• 不确定性（你不是完全稳定）
• 反馈感（他能感受到自己在影响你）

换句话说：

# 他不是在要“性”

# 他在要——

# 我想要你

# 而且我能得到你一点点

# 但又没完全得到

---

# 怎么被满足

不是“你给不给”。

而是：
• 你有没有张力（不是随时都在）
• 你有没有边界（不是无条件）
• 你有没有反馈（他推进→你有回应）

---

# 典型错位

1）过度提供
你很主动、很配合、很容易得到
→ 欲望消失

2）完全关闭
你冷、拒绝、无反馈
→ 他放弃投入

3）稳定过头
关系像“日常搭子”
→ 性张力消失

---

# 02｜情绪需求，本质不是被安慰

很多人以为：

男人需要被理解、被安慰。

# 不够。

男人真正的情绪需求是：

# 被接住，但不被拖累

他要的是：
• 我可以脆弱一瞬间
• 但我不会因此掉价

---

# 怎么被满足

关键不是“安慰他说什么”。

而是三点：

1）你不放大他的弱
不是共情过度，而是稳住

2）你不抢他的位
不替他做决定，不控制他

3）你能恢复他的状态
让他回到“能动”的位置

# 一句话总结：

# 你让他更强

# 而不是更依赖你

---

# 典型错位

1）母性照顾
你一直哄、安慰、包容
→ 他变弱 + 你掉位

2）情绪索取
你需要他提供情绪价值
→ 他开始逃避

3）共同沉沦
你跟他一起崩
→ 关系失去支点

---

# 03｜价值需求，本质不是被认可

很多人理解成：

夸他、崇拜他。

# 太浅。

男人的价值需求，本质是：

# 我在这段关系里

# 是有位置、有作用的

核心不是“你说他好”。
而是：

# 他真实地在创造影响

---

# 怎么被满足

三个层级：

1）被需要
你有一部分是他可以提供的

2）被验证
他的付出有结果、有反馈

3）被放大
他在你身上的影响是“可见的”

---

# 典型错位

1）你太强
你什么都自己搞定
→ 他无价值

2）你假性崇拜
嘴上夸，但实际不依赖
→ 他识别出虚假

3）你只索取不反馈
他做了，但你没回应
→ 价值感断裂

---

# 04｜真正稳定关系的结构

# 不是三件事分别成立

# 而是三者形成一个循环系统

结构是这样的：
• 生理 → 提供张力（关系有吸引）
• 情绪 → 提供稳定（关系不崩）
• 价值 → 提供动力（关系能持续）

# 缺了任一：

# 没生理 → 无吸引

# 没情绪 → 不安全

# 没价值 → 不投入

---

# 05｜最常见的致命问题

# 不是缺

# 而是错位组合

组合1：高生理 + 低价值
很有吸引，但他不投入
→ 短期关系

组合2：高情绪 + 低生理
很稳定，但没有欲望
→ 变室友

组合3：高价值 + 低情绪
他很有用，但很累
→ 关系压抑

---

# 06｜行动指南

# 不要抽象

# 直接执行

---

# ① 生理：维持张力

• 不要随叫随到
• 有回应，但不全部给
• 保留“不确定性”

# 一句话：

# 让他持续想推进你

---

# ② 情绪：稳住结构

• 不过度共情
• 不情绪绑架
• 不替他解决人生

# 一句话：

# 你是支点

# 不是依赖源

---

# ③ 价值：制造位置

• 让他参与关键决策的一部分
• 给出明确反馈（不是泛夸）
• 让他的行为“有结果”

# 一句话：

# 让他感觉

# 我在这段关系里有用

---

# 最后

很多人以为：

关系好不好，看爱不爱。

# 其实不是。

# 是结构有没有对齐：

• 有没有张力（生理）
• 有没有支点（情绪）
• 有没有位置（价值）

---

# 一旦看懂这个

# 你就不会再：

# 用付出换爱

# 用理解换珍惜

# 用讨好换关系

---

# 你会直接判断：

# 这段关系

# 有没有长期成立的结构

---





# 你不是不会谈关系

# 你只是——

# 一直在用本能

# 对抗结构`;

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
    <div className="h-full p-10 bg-gray-200">
      <div className="h-full flex flex-col bg-gray-50 overflow-hidden shadow-sm ring-1 ring-black/5">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur border-b border-gray-200/60 shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-gray-900">STools</h1>
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span className="text-lg font-semibold tracking-tight text-gray-900">Pub</span>
          </div>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            title="配置"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0 gap-4">
          {/* Left: Preview */}
          <div className="flex-1 overflow-y-auto p-8">
            <Preview
              pages={pages}
              config={config}
            />
          </div>

          {/* Right: Editor + Actions */}
          <div className="w-[400px] flex flex-col shrink-0 border-l border-gray-200">
            <div className="flex-1 min-h-0 m-4 mb-3 bg-white ring-1 ring-gray-200 shadow-sm overflow-hidden">
              <Editor text={text} onChange={setText} />
            </div>
            <div className="mx-4 mb-4">
              <ActionBar
                onGenerate={handleGenerate}
                onDownload={handleDownload}
                hasPages={pages.length > 0}
                isExporting={isExporting}
              />
            </div>
          </div>
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
