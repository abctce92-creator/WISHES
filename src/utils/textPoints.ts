/**
 * Samples 2D points from text using an offscreen canvas.
 * Perfectly scales to current viewport dimensions (mobile & desktop).
 */

export interface Point2D {
  x: number;
  y: number;
}

export function sampleTextPoints(
  text: string,
  containerWidth: number,
  containerHeight: number,
  targetPointCount: number = 85
): Point2D[] {
  if (typeof document === 'undefined') return [];

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return [];

  // Determine responsive font size based on container width
  const isMobile = containerWidth < 640;
  // Make sure word fits with comfortable margins
  const letterCount = text.length;
  const maxAvailableWidth = containerWidth * (isMobile ? 0.88 : 0.75);
  const approxLetterWidth = maxAvailableWidth / letterCount;
  const fontSize = Math.min(
    isMobile ? 54 : 96,
    Math.max(34, Math.floor(approxLetterWidth * 1.35))
  );

  const canvasW = Math.min(1200, Math.floor(containerWidth));
  const canvasH = Math.min(400, Math.floor(containerHeight * 0.45));

  canvas.width = canvasW;
  canvas.height = canvasH;

  ctx.clearRect(0, 0, canvasW, canvasH);
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", "Arial Black", sans-serif`;

  const centerX = canvasW / 2;
  const centerY = canvasH / 2;

  ctx.fillText(text.toUpperCase(), centerX, centerY);

  const imgData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data = imgData.data;
  const rawPoints: Point2D[] = [];

  // First pass: collect all filled pixels with an initial grid step
  const initialStep = Math.max(4, Math.floor(fontSize / 10));
  for (let y = 0; y < canvasH; y += initialStep) {
    for (let x = 0; x < canvasW; x += initialStep) {
      const idx = (y * canvasW + x) * 4;
      if (data[idx + 3] > 140) {
        rawPoints.push({ x, y });
      }
    }
  }

  if (rawPoints.length === 0) return [];

  // Downsample or upsample to match targetPointCount uniformly
  if (rawPoints.length <= targetPointCount) {
    return rawPoints;
  }

  // Shuffle / evenly pick targetPointCount points to ensure even letter coverage
  const step = rawPoints.length / targetPointCount;
  const sampled: Point2D[] = [];
  for (let i = 0; i < targetPointCount; i++) {
    const idx = Math.floor(i * step);
    if (rawPoints[idx]) {
      sampled.push(rawPoints[idx]);
    }
  }

  return sampled;
}
