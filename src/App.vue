<template>
  <div :class="$style.app">
    <div :class="$style.left">
      <FileSelect
        v-show="fileList.length === 0"
        id="pdf-file-select"
        multiple
        :accept-types="['application/pdf']"
        :files.sync="fileList"
      />
      <ResultPreview
        v-show="fileList.length"
        :file-list="fileList"
        :watermark-unit="watermarkUnit"
        :x-interval="xInterval"
        :y-interval="yInterval"
        :selected-pattern="selectedPattern"
        @update:files="fileList = $event"
      />
    </div>
    <div :class="$style.right">
      <WatermarkOption
        @update:pattern="selectedPattern = $event"
        @update:xinterval="xInterval = $event"
        @update:yinterval="yInterval = $event"
        @update:unit="watermarkUnit = $event"
      />
      <transition
        :enter-class="$style.downloadStart"
        :leave-to-class="$style.downloadStart"
        :enter-active-class="$style.downloadActive"
        :leave-active-class="$style.downloadActive"
        :leave-class="$style.downloadEnd"
        :enter-to-class="$style.downloadEnd"
      >
        <FileDownload
          v-if="showDownloadButton"
          :file-list="fileList"
          :selected-pattern="selectedPattern"
          :x-interval="xInterval"
          :y-interval="yInterval"
          :watermark-unit="watermarkUnit"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import FileDownload from "./components/FileDownload.vue";
import FileSelect from "./components/FileSelect.vue";
import WatermarkOption from "./components/WatermarkOption.vue";
import ResultPreview from "./components/ResultPreview.vue";
import { isBlank } from "./utils/canvas";

export default {
  name: "App",
  components: {
    FileSelect,
    FileDownload,
    WatermarkOption,
    ResultPreview,
  },
  data() {
    return {
      fileList: [],
      watermarkUnit: document.createElement("canvas"),
      selectedPattern: "single",
      xInterval: 1,
      yInterval: 1,
    };
  },
  computed: {
    showDownloadButton() {
      return this.fileList.length && !isBlank(this.watermarkUnit);
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.app {
  font-family: Verdana, Arial, sans-serif;
  color: theme.$font-color;
  font-size: 15px;
}

.left {
  width: 65%;
  height: 100vh;
  position: absolute;
  left: 0px;
  top: 0px;
}

.right {
  width: 35%;
  height: 100vh;
  position: absolute;
  right: 0px;
  top: 0px;
  background-color: theme.$color-gray-light;
  border-left: solid 1px theme.$color-gray-dark;
}

.downloadStart {
  opacity: 0;
}

.downloadActive {
  transition: all 0.2s;
}

.downloadEnd {
  opacity: 1;
}
</style>
