import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Cấu hình worker cho pdfjs-dist khớp chính xác phiên bản API
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker || `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export interface UploadedPage {
  pageNumber: number;
  dataUrl: string;
  rotation: number;
}

/**
 * Đọc file ảnh thông thường (JPG, PNG, WEBP)
 */
export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Chuyển đổi từng trang của file PDF thành ảnh PNG base64
 */
export async function convertPdfToImages(file: File): Promise<UploadedPage[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const pages: UploadedPage[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.8 }); // Scale 1.8 cho độ nét cao

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      if (context) {
        await page.render({
          canvasContext: context,
          canvas: canvas,
          viewport: viewport,
        } as any).promise;

        pages.push({
          pageNumber: i,
          dataUrl: canvas.toDataURL('image/png'),
          rotation: 0,
        });
      }
    }

    return pages;
  } catch (error) {
    console.error('Lỗi phân giải PDF qua pdfjs:', error);
    throw new Error('Không thể đọc file PDF. Vui lòng thử xuất PDF thành ảnh JPG/PNG hoặc kiểm tra file.');
  }
}
