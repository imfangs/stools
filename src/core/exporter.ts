import html2canvas from 'html2canvas-pro';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function captureElement(element: HTMLElement): Promise<Blob> {
  // The element is already rendered at full resolution (e.g. 1080x1440).
  // Use scale=1 to capture at that exact pixel size.
  const canvas = await html2canvas(element, {
    scale: 1,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create blob'));
      },
      'image/png',
      1.0,
    );
  });
}

export async function downloadAllImages(
  elements: HTMLElement[],
): Promise<void> {
  if (elements.length === 0) return;

  if (elements.length === 1) {
    const blob = await captureElement(elements[0]);
    saveAs(blob, '1.png');
    return;
  }

  const zip = new JSZip();

  for (let i = 0; i < elements.length; i++) {
    const blob = await captureElement(elements[i]);
    zip.file(`${i + 1}.png`, blob);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  saveAs(zipBlob, 'stools-images.zip');
}
