type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: EventData) => void;
    };
  }
}

export function track(event: string, data?: EventData): void {
  try {
    window.umami?.track(event, data);
  } catch {
    // never throw from analytics
  }
}
