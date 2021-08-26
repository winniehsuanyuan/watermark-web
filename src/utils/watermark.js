import { clearCanvas, isBlank, textSetup, measureText } from "./canvas.js";
import { createImg } from "./img-utils.js";

export async function renderWatermark(
  watermarkCanvas,
  watermarkUnit,
  selectedPattern,
  xInterval,
  yInterval
) {
  clearCanvas(watermarkCanvas);
  if (isBlank(watermarkUnit)) return;
  if (selectedPattern === "single") {
    renderSingleWatermark(watermarkCanvas, watermarkUnit);
  } else if (selectedPattern === "repeat") {
    renderRepeatWatermark(watermarkCanvas, watermarkUnit, xInterval, yInterval);
  }
}

export function renderSingleWatermark(canvas, watermarkUnit) {
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    watermarkUnit,
    canvas.width / 2 - watermarkUnit.width / 2,
    canvas.height / 2 - watermarkUnit.height / 2
  );
}

export function renderRepeatWatermark(
  canvas,
  watermarkUnit,
  xInterval,
  yInterval
) {
  const ctx = canvas.getContext("2d");
  const width = watermarkUnit.width;
  const height = watermarkUnit.height;
  for (let i = 0; i * width * xInterval - width / 2 < canvas.width; i++) {
    for (let j = 0; j * height * yInterval - height / 2 < canvas.height; j++) {
      if (i % 2 === j % 2)
        ctx.drawImage(
          watermarkUnit,
          i * width * xInterval - width / 2,
          j * height * yInterval - height / 2
        );
    }
  }
}

export function createTextWatermarkUnit(text, opacity) {
  const watermarkUnit = document.createElement("canvas");
  const ctx = watermarkUnit.getContext("2d");
  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  textSetup(measureCtx, opacity);
  const textMetrics = measureText(measureCtx, text);
  watermarkUnit.width = textMetrics[0] + 10; //to avoid text being cropped
  watermarkUnit.height = textMetrics[1] + 10; //to avoid text being cropped
  textSetup(ctx, opacity);
  ctx.fillText(text, watermarkUnit.width / 2, watermarkUnit.height / 2);
  return watermarkUnit;
}

export async function createImgWatermarkUnit(imgFile, opacity) {
  const watermarkUnit = document.createElement("canvas");
  const ctx = watermarkUnit.getContext("2d");
  const img = await createImg(imgFile);
  watermarkUnit.width = img.width;
  watermarkUnit.height = img.height;
  ctx.globalAlpha = opacity;
  ctx.drawImage(img, 0, 0);
  return watermarkUnit;
}
