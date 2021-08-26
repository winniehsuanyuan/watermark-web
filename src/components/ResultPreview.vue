<template>
  <div :class="$style.resultPreviewContainer">
    <div v-if="encryptedFiles.length" :class="$style.mask"></div>
    <div v-if="encryptedFiles.length" :class="$style.noticeWindow">
      <NoticeWindow :file-names="encryptedFileNames" @confirm="confirm" />
    </div>
    <div v-if="selectedIndex > -1" :class="$style.selectionContainer">
      <div :class="$style.menu">
        <SelectionMenu
          :file-list="fileListForMenu"
          :selected.sync="selectedIndex"
          @update:files="$emit('update:files', $event)"
        />
      </div>
      <div :class="$style.addIcon">
        <FileSelectButton
          @update:files="$emit('update:files', [...$event, ...fileList])"
        />
      </div>
    </div>
    <div ref="root" :class="$style.previewContainer">
      <canvas
        v-for="(viewport, index) in viewports"
        ref="pdfCanvasRefs"
        :key="'pdf' + index"
        :height="viewport.height"
        :width="viewport.width"
        :style="{ top: canvasHeight[index] + 'px' }"
        :class="$style.previewCanvas"
      ></canvas>
      <canvas
        v-for="(viewport, index) in viewports"
        ref="watermarkCanvasRefs"
        :key="'watermark' + index"
        :height="viewport.height"
        :width="viewport.width"
        :style="{ top: canvasHeight[index] + 'px' }"
        :class="[$style.previewCanvas, $style.watermark]"
      ></canvas>
    </div>
  </div>
</template>

<script>
import SelectionMenu from "./SelectionMenu.vue";
import FileSelectButton from "./FileSelectButton.vue";
import NoticeWindow from "./NoticeWindow.vue";
import { readPdfAsPages, renderPdf } from "../utils/pdf-utils.js";
import { observerSetup, observerDisconnect } from "../utils/observer.js";
import { renderWatermark } from "../utils/watermark.js";

export default {
  name: "ResultPreview",
  components: {
    SelectionMenu,
    FileSelectButton,
    NoticeWindow,
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
      default: "single",
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
  data() {
    return {
      viewports: [],
      selectedIndex: -1,
      fileListForMenu: [],
      pages: [],
      encryptedFiles: [],
      observing: [],
      pdfObserver: null,
      watermarkObserver: null,
    };
  },
  computed: {
    canvasHeight() {
      let height = [0];
      for (let i = 1; i < this.viewports.length; i++) {
        height.push(height[i - 1] + this.viewports[i - 1].height);
      }
      return height;
    },
    encryptedFileNames() {
      return this.encryptedFiles.map((file) => file.name).join(", ");
    },
  },
  watch: {
    fileList: "readPdf",
    selectedIndex: "previewSetup",
    watermarkUnit: "renderObserving",
    selectedPattern: "renderObserving",
    xInterval: "renderObserving",
    yInterval: "renderObserving",
  },
  mounted() {
    document.oncontextmenu = function () {
      return false;
    };
  },
  beforeDestroy() {
    observerDisconnect([this.pdfObserver, this.watermarkObserver]);
  },
  methods: {
    confirm() {
      this.$emit(
        "update:files",
        this.fileList.filter((file) => !this.encryptedFiles.includes(file))
      );
      this.encryptedFiles = [];
    },
    renderObserving() {
      if (this.observing.length > 0) {
        this.observing.forEach((ref) => {
          renderWatermark(
            ref,
            this.watermarkUnit,
            this.selectedPattern,
            this.xInterval,
            this.yInterval
          );
        });
      }
    },
    async readPdf() {
      this.pages = [];
      if (this.fileList.length) {
        for (const file of this.fileList) {
          const returnedData = await readPdfAsPages(file);
          if (returnedData === "encrypted") {
            this.encryptedFiles.push(file);
          } else {
            this.pages.push(returnedData);
          }
        }
        if (this.encryptedFiles.length) return;
        this.fileListForMenu = this.fileList;
        this.selectedIndex === 0
          ? this.previewSetup()
          : (this.selectedIndex = 0);
      } else {
        this.fileListForMenu = [];
        this.selectedIndex = -1;
      }
    },
    async previewSetup() {
      this.viewports = [];
      if (this.selectedIndex < 0) return;
      observerDisconnect([this.pdfObserver, this.watermarkObserver]);
      this.viewports = this.pages[this.selectedIndex].map((page) =>
        page.getViewport({ scale: 1 })
      );
      //wait for the canvases to be set on the DOM
      await this.$nextTick();
      this.pdfObserver = observerSetup(
        this.$refs.root,
        this.$refs.pdfCanvasRefs,
        this.pdfCallback
      );
      this.watermarkObserver = observerSetup(
        this.$refs.root,
        this.$refs.watermarkCanvasRefs,
        this.watermarkCallback
      );
    },
    pdfCallback(entries, observer) {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const pageIndex = this.$refs.pdfCanvasRefs.indexOf(entry.target);
        renderPdf(
          this.pages[this.selectedIndex][pageIndex],
          this.viewports[pageIndex],
          entry.target
        );
        observer.unobserve(entry.target);
      });
    },
    watermarkCallback(entries) {
      let intersect = false;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersect = true;
          if (!this.observing.includes(entry.target))
            this.observing.push(entry.target);
        } else {
          if (this.observing.includes(entry.target))
            this.observing.splice(this.observing.indexOf(entry.target), 1);
        }
      });
      if (intersect) this.renderObserving();
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.resultPreviewContainer {
  width: 100%;
  height: 100%;
}

.selectionContainer {
  padding-top: 20px;
  margin-bottom: 10px;
  text-align: center;
}

.menu {
  width: 250px;
  padding: 0;
  display: inline-block;
  vertical-align: middle;
}

.addIcon {
  margin-left: 15px;
  display: inline-block;
  vertical-align: middle;
}

.previewContainer {
  clear: left;
  position: relative;
  height: 90vh;
  overflow: auto;
  /*firefox*/
  scrollbar-color: theme.$scroll-bar-color transparent;
  scrollbar-width: thin;
}

.previewContainer:hover {
  scrollbar-color: theme.$scroll-bar-hover-color transparent;
}

.previewCanvas {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.watermark {
  z-index: 1;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: theme.$scroll-bar-color;
  border-radius: 10px;
  border: solid 2px theme.$color-white;
}

::-webkit-scrollbar-thumb:hover {
  background-color: theme.$scroll-bar-hover-color;
}

.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: theme.$mask-color;
  z-index: 3;
}

.noticeWindow {
  width: 350px;
  height: 200px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
}
</style>
