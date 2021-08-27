<template>
  <div :class="$style.app">
    <div :class="$style.left">
      <FileSelect
        v-show="fileList.length === 0"
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
        :enter-class="$style.transitionEnter"
        :enter-active-class="$style.transitionEnterActive"
        :enter-to-class="$style.transitionEnterTo"
        :leave-class="$style.transitionLeave"
        :leave-active-class="$style.transitionLeaveActive"
        :leave-to-class="$style.transitionLeaveTo"
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

<style lang="scss" module>
@use '~@/theme.scss' as theme;

html,
body {
  margin: 0;
  height: 100%;
}

.app {
  height: 100%;
  display: flex;
  font-family: Verdana, Arial, sans-serif;
  color: theme.$font-color;
  font-size: 15px;
}

.left {
  flex: 2;
}

.right {
  flex: 1;
  background-color: theme.$color-gray-light;
  border-left: solid 1px theme.$color-gray-dark;
}

.transitionEnter,
.transitionLeaveTo {
  opacity: 0;
}

.transitionEnterTo,
.transitionLeave {
  opacity: 1;
}

.transitionEnterActive,
.transitionLeaveActive {
  transition: all 0.2s;
}
</style>
