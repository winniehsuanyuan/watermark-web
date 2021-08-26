<template>
  <div :class="$style.buttonContainer">
    <input :id="id" type="radio" :class="$style.defaultInput" :value="value" />
    <span
      :class="{
        [$style.radioButton]: true,
        [$style.radioButtonClicked]: selected === value,
      }"
      @click="$emit('update:selected', value)"
    ></span>
    <span :class="{ [$style.dot]: selected === value }"> </span>
    <label :for="id"> {{ name }} </label>
  </div>
</template>

<script>
export default {
  name: "RadioButton",
  props: {
    id: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    selected: {
      type: String,
      required: true,
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.buttonContainer {
  position: relative;
}

.defaultInput {
  opacity: 0;
}

.radioButton {
  height: 15px;
  width: 15px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  background-color: theme.$color-white;
  border: solid 1px theme.$color-gray-dark;
  border-radius: 50%;
}

.radioButton:hover {
  cursor: pointer;
  border-color: theme.$hover-border-color;
}

.radioButtonClicked {
  background-color: theme.$color-green-dark;
}

.dot {
  height: 7px;
  width: 7px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 5px;
  background-color: theme.$color-white;
  border-radius: 50%;
}
</style>
