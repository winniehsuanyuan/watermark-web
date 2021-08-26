<template>
  <div :class="$style.sliderContainer">
    <label :class="$style.label" :for="id">{{ sliderName }}</label>
    <input
      :id="id"
      :class="$style.slider"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      @input="$emit('input', $event.target.valueAsNumber)"
    />
    <input
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      :class="$style.numInput"
      @input="$emit('input', $event.target.valueAsNumber)"
    />
  </div>
</template>
<script>
export default {
  name: "RangeSlider",
  props: {
    id: {
      type: String,
      required: true,
    },
    sliderName: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    step: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.sliderContainer {
  margin-top: 20px;
  margin-bottom: 20px;
}

.label {
  margin-right: 15px;
}

.slider {
  appearance: none;
  height: 4px;
  border: solid 1px theme.$color-gray-dark;
  border-radius: 4px;
  background-color: theme.$color-white;
  transform: translateY(-50%);
  transition: 0.2s;
  margin-right: 15px;
}

.slider:hover {
  border-color: theme.$color-green-dark;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: theme.$color-green-light;
  cursor: pointer;
}

.slider::-webkit-slider-thumb:hover {
  background: theme.$color-green-dark;
}

.slider::-moz-range-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: theme.$color-green-light;
  cursor: pointer;
}

.slider::-moz-range-thumb:hover {
  background: theme.$color-green-dark;
}

.numInput {
  width: 53px;
  height: 30px;
  border: solid 1px theme.$color-gray-dark;
  border-radius: 4px;
  padding: 0px 6px 0px 10px;
  color: theme.$font-color;
  font-size: 15px;
  outline: none;
}

.numInput:hover {
  border-color: theme.$hover-border-color;
}

.numInput:focus {
  border-color: theme.$color-green-light;
}
</style>
