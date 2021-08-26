<template>
  <div :class="$style.myButtonContainer">
    <MyButton text="下載" @click="click" />
  </div>
</template>

<script>
import MyButton from "./MyButton.vue";
import {
  embedImg,
  readPdfAsPDFDocument,
  embedSingleWatermark,
  embedRepeatWatermark,
  download,
} from "../utils/pdf-utils.js";

export default {
  name: "FileDownload",
  components: {
    MyButton,
  },
  props: {
    fileList: {
      required: true,
      validator(value) {
        return Array.isArray(value) && value.every((v) => v instanceof File);
      },
    },
    watermarkUnit: {
      type: HTMLCanvasElement,
      required: true,
    },
    selectedPattern: {
      type: String,
      required: true,
    },
    xInterval: {
      type: Number,
      default: 1,
    },
    yInterval: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    async click() {
      this.embedWatermark(this.watermarkUnit.toDataURL());
    },
    async embedWatermark(watermarkUrl) {
      if (watermarkUrl === "") return;
      const imgBytes = await fetch(watermarkUrl).then((res) =>
        res.arrayBuffer()
      );
      let resultPdf = [];
      for (const file of this.fileList) {
        const pdf = await readPdfAsPDFDocument(file);
        const img = await embedImg(watermarkUrl, pdf, imgBytes);
        const pages = pdf.getPages();
        if (this.selectedPattern === "single") {
          embedSingleWatermark(pages, img);
        } else if (this.selectedPattern === "repeat") {
          embedRepeatWatermark(pages, img, this.xInterval, this.yInterval);
        }
        resultPdf.push(await pdf.save());
      }
      download(resultPdf, this.fileList);
    },
  },
};
</script>

<style module>
.myButtonContainer {
  margin-top: 30px;
}
</style>
