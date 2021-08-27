<template>
  <div :class="$style.watermarkOptionContainer">
    <div>
      <div :class="$style.radioButton">
        <RadioButton
          id="textOption"
          value="text"
          name="文字浮水印"
          :selected="selectedType"
          @update:selected="selectedType = $event"
        />
      </div>
      <input
        v-model="text"
        :disabled="selectedType !== 'text'"
        :class="$style.textInput"
        placeholder="請輸入文字"
        type="text"
      />
    </div>
    <div>
      <div :class="$style.radioButton">
        <RadioButton
          id="imgOption"
          value="img"
          name="圖像浮水印"
          :selected="selectedType"
          @update:selected="selectedType = $event"
        />
      </div>
      <div
        :class="{
          [$style.imgSelect]: true,
          [$style.imgSelectDisabled]: selectedType !== 'img',
        }"
      >
        <FileSelect
          :disabled="selectedType !== 'img'"
          :accept-types="['image/png', 'image/jpg', 'image/jpeg']"
          :files.sync="imgFile"
        />
      </div>
    </div>
    <RangeSlider
      id="opacitySelection"
      v-model="selectedOpacity"
      slider-name="不透明度"
      :step="0.01"
    />
    <PatternSelect :pattern.sync="selectedPattern" />
    <transition
      :enter-class="$style.intervalSelectionStart"
      :leave-to-class="$style.intervalSelectionStart"
      :enter-active-class="$style.intervalSelectionActive"
      :leave-active-class="$style.intervalSelectionActive"
      :leave-class="$style.intervalSelectionEnd"
      :enter-to-class="$style.intervalSelectionEnd"
    >
      <div
        v-if="selectedPattern === 'repeat'"
        :enter-class="$style.intervalSelection"
      >
        <RangeSlider
          id="xIntervalSelection"
          v-model="xInterval"
          slider-name="橫向間距"
          :min="1"
          :max="20"
          :step="0.1"
        />
        <RangeSlider
          id="yIntervalSelection"
          v-model="yInterval"
          slider-name="縱向間距"
          :min="1"
          :max="20"
          :step="0.1"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import FileSelect from "./FileSelect.vue";
import RangeSlider from "./RangeSlider.vue";
import PatternSelect from "./PatternSelect.vue";
import RadioButton from "./RadioButton.vue";
import {
  createTextWatermarkUnit,
  createImgWatermarkUnit,
} from "../utils/watermark.js";

export default {
  name: "WatermarkOption",
  components: {
    FileSelect,
    PatternSelect,
    RangeSlider,
    RadioButton,
  },
  data() {
    return {
      selectedType: "text",
      text: "",
      imgFile: [],
      selectedOpacity: 0.5,
      selectedPattern: "single",
      xInterval: 1,
      yInterval: 1,
    };
  },
  watch: {
    text: "generateWatermarkUnit",
    imgFile: "generateWatermarkUnit",
    selectedOpacity: "generateWatermarkUnit",
    selectedType: "clearAnotherOption",
    selectedPattern: "getPattern",
    xInterval: "getXInterval",
    yInterval: "getYInterval",
  },
  methods: {
    clearAnotherOption() {
      if (this.selectedType === "text" && this.imgFile.length > 0) {
        this.imgFile.splice(0, 1);
      } else if (this.selectedType === "img" && this.text !== "") {
        this.text = "";
      }
    },
    getPattern() {
      this.$emit("update:pattern", this.selectedPattern);
    },
    getXInterval() {
      this.$emit("update:xinterval", this.xInterval);
    },
    getYInterval() {
      this.$emit("update:yinterval", this.yInterval);
    },
    async generateWatermarkUnit() {
      let watermarkUnit = document.createElement("canvas");
      if (this.selectedType === "text" && this.text !== "") {
        watermarkUnit = createTextWatermarkUnit(
          this.text,
          this.selectedOpacity
        );
      } else if (this.selectedType === "img" && this.imgFile.length > 0) {
        watermarkUnit = await createImgWatermarkUnit(
          this.imgFile[0],
          this.selectedOpacity
        );
      }
      this.$emit("update:unit", watermarkUnit);
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.watermarkOptionContainer {
  margin-top: 30px;
  margin-left: 20px;
}

.radioButton {
  margin: 15px 0px;
}

.textInput {
  height: 30px;
  border: solid 1px theme.$color-gray-dark;
  border-radius: 4px;
  outline: none;
  padding: 0px 6px 0px 10px;
  margin-left: 20px;
  color: theme.$font-color;
  font-size: 15px;
}

.textInput:hover {
  border-color: theme.$hover-border-color;
}

.textInput:focus {
  border-color: theme.$color-green-light;
}

.imgSelect {
  width: 90%;
  height: 150px;
  border-radius: 4px;
  border: dashed 1px theme.$color-green-light;
  margin-left: 20px;
}

.imgSelectDisabled {
  border: solid 1px theme.$color-gray-dark;
}

.intervalSelection {
  max-height: 0px;
  overflow: hidden;
}

.intervalSelectionStart {
  opacity: 0;
  max-height: 0px;
}

.intervalSelectionActive {
  transition: all 0.3s;
}

.intervalSelectionEnd {
  opacity: 1;
  max-height: 300px;
}
</style>
