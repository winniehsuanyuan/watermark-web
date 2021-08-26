import { PDFDocument } from "pdf-lib";
import pdfjsLib from "../vendor/pdfjs.js";

export async function readPdfAsPages(pdfFile) {
  try {
    const fileURL = URL.createObjectURL(pdfFile);
    const pdf = await pdfjsLib.getDocument({ url: fileURL }).promise;
    const pages = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      pages.push(await pdf.getPage(pageNum));
    }
    URL.revokeObjectURL(fileURL);
    return pages;
  } catch {
    //PasswordException
    return "encrypted";
  }
}

export function renderPdf(pdfPage, viewport, pdfCanvas) {
  pdfPage.render({
    canvasContext: pdfCanvas.getContext("2d"),
    viewport: viewport,
  });
}

export async function readPdfAsPDFDocument(file) {
  const fileURL = URL.createObjectURL(file);
  const pdfBytes = await fetch(fileURL).then((res) => res.arrayBuffer());
  const pdf = await PDFDocument.load(pdfBytes);
  URL.revokeObjectURL(fileURL);
  return pdf;
}

export async function embedImg(watermarkUrl, pdf, imgBytes) {
  let img;
  if (watermarkUrl.includes("image/png")) {
    img = await pdf.embedPng(imgBytes);
  } else if (
    watermarkUrl.includes("image/jpg") ||
    watermarkUrl.includes("image/jpeg")
  ) {
    img = await pdf.embedJpg(imgBytes);
  } else {
    console.log("Unsupported file type!");
  }
  return img;
}

export function embedSingleWatermark(pages, img) {
  for (let i = 0; i < pages.length; i++) {
    pages[i].drawImage(img, {
      x: pages[i].getWidth() / 2 - img.width / 2,
      y: pages[i].getHeight() / 2 - img.height / 2,
      width: img.width,
      height: img.height,
    });
  }
}

export function embedRepeatWatermark(pages, img, xInterval, yInterval) {
  for (let k = 0; k < pages.length; k++) {
    const pageWidth = pages[k].getWidth();
    const pageHeight = pages[k].getHeight();
    for (
      let i = 0;
      i * img.width * xInterval - img.width / 2 < pageWidth;
      i++
    ) {
      for (
        let j = 0;
        pageHeight - j * img.height * yInterval + img.height / 2 > 0;
        j++
      ) {
        if (i % 2 === j % 2) {
          pages[k].drawImage(img, {
            x: i * img.width * xInterval - img.width / 2,
            y: pageHeight - j * img.height * yInterval - img.height / 2,
            width: img.width,
            height: img.height,
          });
        }
      }
    }
  }
}

export function download(resultPdf, fileList) {
  for (let i = 0; i < resultPdf.length; i++) {
    const bytes = new Uint8Array(resultPdf[i]);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileList[i].name;
    link.click();
    URL.revokeObjectURL(url);
  }
}
