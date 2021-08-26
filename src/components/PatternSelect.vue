<template>
  <div :class="$style.buttonContainer">
    <span>排列方式</span>
    <button
      type="button"
      :class="{
        [$style.button]: true,
        [$style.singleButton]: true,
        [$style.buttonSelected]: singleSelected,
      }"
      @click="$emit('update:pattern', 'single')"
      @mouseover="hover = 'single'"
      @mouseleave="hover = ''"
    >
      <svg height="22" width="26">
        <circle
          cx="13"
          cy="11"
          r="3.5"
          fill="#00b491"
          :class="{
            [$style.dotSelected]: singleSelected,
            [$style.dotHovered]: singleHovered,
          }"
        />
      </svg>
    </button>
    <button
      type="button"
      :class="{
        [$style.button]: true,
        [$style.repeatButton]: true,
        [$style.buttonSelected]: !singleSelected,
      }"
      @click="$emit('update:pattern', 'repeat')"
      @mouseover="hover = 'repeat'"
      @mouseleave="hover = ''"
    >
      <svg height="22" width="26">
        <circle
          cx="13"
          cy="4"
          r="3.2"
          fill="#00b491"
          :class="{
            [$style.dotSelected]: !singleSelected,
            [$style.dotHovered]: repeatHovered,
          }"
        />
        <circle
          cx="5"
          cy="11"
          r="3.2"
          fill="#00b491"
          :class="{
            [$style.dotSelected]: !singleSelected,
            [$style.dotHovered]: repeatHovered,
          }"
        />
        <circle
          cx="13"
          cy="18"
          r="3.2"
          fill="#00b491"
          :class="{
            [$style.dotSelected]: !singleSelected,
            [$style.dotHovered]: repeatHovered,
          }"
        />
        <circle
          cx="21"
          cy="11"
          r="3.2"
          fill="#00b491"
          :class="{
            [$style.dotSelected]: !singleSelected,
            [$style.dotHovered]: repeatHovered,
          }"
        />
      </svg>
    </button>
  </div>
</template>
<script>
export default {
  name: "PatternSelect",
  props: {
    pattern: {
      type: String,
      default: "single",
    },
  },
  data: function () {
    return {
      hover: "",
    };
  },
  computed: {
    singleSelected() {
      return this.pattern === "single";
    },
    singleHovered() {
      if (this.pattern !== "single" && this.hover === "single") return true;
      else return false;
    },
    repeatHovered() {
      if (this.pattern !== "repeat" && this.hover === "repeat") return true;
      else return false;
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.buttonContainer {
  margin: 0;
  display: inline-flex;
  align-items: center;
}

.button {
  padding: 5px 3px 1px 3px;
  margin: 0;
  border-radius: 4px;
  border: solid 1px theme.$color-gray-dark;
  background-color: theme.$color-white;
  cursor: pointer;
}

.button:hover {
  border-color: theme.$color-green-dark;
}

.buttonSelected {
  border-color: theme.$color-green-dark;
  background-color: theme.$color-green-dark;
}

.singleButton {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  margin-left: 20px;
}

.repeatButton {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: 0px;
}

.dotSelected {
  fill: theme.$color-white;
}

.dotHovered {
  fill: theme.$color-green-dark;
}
</style>
