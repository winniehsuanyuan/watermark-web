<template>
  <div :class="$style.buttonContainer">
    <button type="button" :class="$style.button" @click="$emit('click')">
      <span :class="$style.buttonText">{{ text }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: "MyButton",
  props: {
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.buttonContainer {
  text-align: center;
}

.button {
  width: 100px;
  height: 32px;
  background-color: theme.$color-green-light;
  border: solid 1px theme.$color-green-light;
  border-radius: 100px;
  cursor: pointer;
}

.button:hover {
  background-color: theme.$color-green-dark;
  border-color: theme.$color-green-dark;
}

.buttonText {
  font-size: 13px;
  font-weight: 600;
  color: theme.$color-white;
  padding: 3px 20px 3px 20px;
}
</style>
