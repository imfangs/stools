import type { LayoutConfig } from '../types';
import { defaultConfig } from './defaults';

const STORAGE_KEY = 'stools-config';

export function loadConfig(): LayoutConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultConfig, ...JSON.parse(saved) };
    }
  } catch {
    // ignore parse errors
  }
  return { ...defaultConfig };
}

export function saveConfig(config: LayoutConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore storage errors
  }
}

export function resetConfig(): LayoutConfig {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultConfig };
}

export function exportConfigJSON(config: LayoutConfig): string {
  return JSON.stringify(config, null, 2);
}

export function importConfigJSON(json: string): LayoutConfig {
  const parsed = JSON.parse(json);
  return { ...defaultConfig, ...parsed };
}
