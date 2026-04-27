import { useState } from 'react';
import type { LayoutConfig } from '../types';
import { exportConfigJSON, importConfigJSON } from '../config/store';

interface ConfigPanelProps {
  config: LayoutConfig;
  onChange: (config: LayoutConfig) => void;
  onReset: () => void;
  onClose: () => void;
}

type ConfigKey = keyof LayoutConfig;

interface FieldDef {
  key: ConfigKey;
  label: string;
  type: 'number' | 'color' | 'text';
  group: string;
}

const fields: FieldDef[] = [
  { key: 'imageWidth', label: '图片宽度', type: 'number', group: '图片尺寸' },
  { key: 'imageHeight', label: '图片高度', type: 'number', group: '图片尺寸' },
  { key: 'paddingTop', label: '上内边距', type: 'number', group: '内边距' },
  { key: 'paddingBottom', label: '下内边距', type: 'number', group: '内边距' },
  { key: 'paddingLeft', label: '左内边距', type: 'number', group: '内边距' },
  { key: 'paddingRight', label: '右内边距', type: 'number', group: '内边距' },
  { key: 'h1FontSize', label: 'H1 字号', type: 'number', group: '标题样式' },
  { key: 'h1FontWeight', label: 'H1 字重', type: 'number', group: '标题样式' },
  { key: 'h1LineHeight', label: 'H1 行高', type: 'number', group: '标题样式' },
  { key: 'h1LetterSpacing', label: 'H1 字间距', type: 'number', group: '标题样式' },
  { key: 'h1MarginBottom', label: 'H1 下间距', type: 'number', group: '标题样式' },
  { key: 'bodyFontSize', label: '正文字号', type: 'number', group: '正文样式' },
  { key: 'bodyFontWeight', label: '正文字重', type: 'number', group: '正文样式' },
  { key: 'bodyLineHeight', label: '正文行高', type: 'number', group: '正文样式' },
  { key: 'bodyLetterSpacing', label: '正文字间距', type: 'number', group: '正文样式' },
  { key: 'bodyMarginBottom', label: '正文下间距', type: 'number', group: '正文样式' },
  { key: 'dividerHeight', label: '分割线高度', type: 'number', group: '分割线' },
  { key: 'dividerMarginY', label: '分割线间距', type: 'number', group: '分割线' },
  { key: 'dividerColor', label: '分割线颜色', type: 'text', group: '分割线' },
  { key: 'emptyLineHeight', label: '空行高度', type: 'number', group: '空行' },
  { key: 'backgroundColor', label: '背景色', type: 'text', group: '颜色' },
  { key: 'textColor', label: '文字色', type: 'text', group: '颜色' },
  { key: 'fontFamily', label: '字体', type: 'text', group: '字体' },
  { key: 'previewColumns', label: '预览列数', type: 'number', group: '预览' },
  { key: 'cjkNumberSpacing', label: '中数间距', type: 'number', group: '排版增强' },
  { key: 'cjkQuoteSpacing', label: '中引间距', type: 'number', group: '排版增强' },
  { key: 'emDashOverlap', label: '破折号重叠', type: 'number', group: '排版增强' },
];

export default function ConfigPanel({ config, onChange, onReset, onClose }: ConfigPanelProps) {
  const [importText, setImportText] = useState('');

  const handleChange = (key: ConfigKey, value: string | number | boolean) => {
    onChange({ ...config, [key]: value });
  };

  const handleExport = () => {
    const json = exportConfigJSON(config);
    navigator.clipboard.writeText(json);
    alert('配置已复制到剪贴板');
  };

  const handleImport = () => {
    try {
      const newConfig = importConfigJSON(importText);
      onChange(newConfig);
      setImportText('');
      alert('导入成功');
    } catch {
      alert('配置格式错误');
    }
  };

  const groups = [...new Set(fields.map((f) => f.group))];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[360px] bg-white z-50 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <h2 className="font-semibold">排版配置</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {groups.map((group) => (
            <div key={group}>
              <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{group}</h3>
              <div className="space-y-2">
                {fields
                  .filter((f) => f.group === group)
                  .map((field) => (
                    <div key={field.key} className="flex items-center justify-between gap-2">
                      <label className="text-sm text-gray-600 shrink-0">{field.label}</label>
                      {field.type === 'number' ? (
                        <input
                          type="number"
                          value={config[field.key] as number}
                          onChange={(e) => handleChange(field.key, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1 border border-gray-200 rounded text-sm text-right"
                        />
                      ) : (
                        <input
                          type="text"
                          value={config[field.key] as string}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="w-40 px-2 py-1 border border-gray-200 rounded text-sm"
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Import/Export */}
          <div>
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-2">导入 / 导出</h3>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                导出配置到剪贴板
              </button>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="粘贴 JSON 配置..."
                className="w-full h-20 px-2 py-1 border border-gray-200 rounded text-xs font-mono resize-none"
              />
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-30"
              >
                导入配置
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onReset}
            className="w-full py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50"
          >
            恢复默认配置
          </button>
        </div>
      </div>
    </>
  );
}
