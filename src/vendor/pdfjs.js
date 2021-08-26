import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.min.js";
import * as pdfjsWorker from "pdfjs-dist/legacy/build/pdf.worker.min.js";

if (typeof window !== "undefined") {
  window.pdfjsWorker = pdfjsWorker;
}

export default pdfjsLib;
