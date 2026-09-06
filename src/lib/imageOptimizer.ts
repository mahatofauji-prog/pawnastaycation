/**
 * Production-grade client-side image optimizer/compressor.
 * This helper resizes extremely large images, compresses them to WebP/JPEG format,
 * and maintains excellent aspect ratio and visual quality.
 *
 * This reduces upload size from 5-15MB to under 500KB, improving speed and reliability,
 * especially on mobile devices (Android) and slow connections.
 */

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0
  convertToType?: 'image/webp' | 'image/jpeg';
}

export async function optimizeImage(
  file: File,
  options: OptimizationOptions = {}
): Promise<{ file: File; base64: string }> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.75,
    convertToType = 'image/jpeg', // Jpeg is universally supported
  } = options;

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Unsupported file type: ${file.type}. Please upload JPG, JPEG, PNG, or WEBP.`);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Draw to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to data URL
        const mimeType = convertToType === 'image/webp' && isWebpSupported() ? 'image/webp' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);

        // Convert data URL back to a File object
        try {
          const arr = dataUrl.split(',');
          const mimeMatches = arr[0].match(/:(.*?);/);
          const mime = mimeMatches ? mimeMatches[1] : mimeType;
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }

          const fileExtension = mime.split('/')[1];
          const newFileName = `${file.name.substring(0, file.name.lastIndexOf('.')) || 'optimized'}_optimized.${fileExtension}`;
          const optimizedFile = new File([u8arr], newFileName, { type: mime });

          resolve({
            file: optimizedFile,
            base64: dataUrl,
          });
        } catch (err) {
          reject(new Error('Failed to slice/encode optimized image: ' + (err as Error).message));
        }
      };

      img.onerror = () => reject(new Error('Failed to load image file for optimization'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

function isWebpSupported(): boolean {
  try {
    const elem = document.createElement('canvas');
    if (elem.getContext && elem.getContext('2d')) {
      return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
  } catch (e) {
    return false;
  }
}
