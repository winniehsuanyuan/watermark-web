<template>
  <div :class="$style.menuContainer" tabindex="-1" @blur="isOpened = false">
    <div
      :class="{
        [$style.selected]: true,
        [$style.selectedHovered]: isSelectedHovered,
        [$style.selectedClicked]: isOpened,
      }"
      @mouseover="selectedHover = true"
      @mouseleave="selectedHover = false"
      @click="isOpened = !isOpened"
    >
      <div :class="$style.fileName">
        {{ fileList[selected].name }}
      </div>
      <span
        :class="{ [$style.triangle]: true, [$style.triangleClicked]: isOpened }"
      ></span>
    </div>
    <div
      :class="{ [$style.optionsContainer]: true, [$style.isClosed]: !isOpened }"
    >
      <div
        v-for="(file, index) in fileList"
        :key="index"
        :value="index"
        :class="{
          [$style.option]: true,
          [$style.optionHovered]: isOptionHovered(index),
        }"
        @mouseover="hover = index"
      >
        <div :class="$style.fileName" @click="click(index)">
          {{ file.name }}
        </div>
        <img
          v-show="isOptionHovered(index)"
          :src="deleteIconSrc"
          :class="$style.deleteIcon"
          @mouseover="hoverDelete"
          @mouseleave="defaultDelete"
          @click="remove(file)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import deleteIconGray from "../assets/delete-gray.svg";
import deleteIconGreen from "../assets/delete-green.svg";

export default {
  name: "SelectionMenu",
  props: {
    fileList: {
      required: true,
      validator(value) {
        return Array.isArray(value) && value.every((v) => v instanceof File);
      },
    },
    selected: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isOpened: false,
      hover: -1,
      selectedHover: false,
      deleteIconSrc: deleteIconGray,
    };
  },
  computed: {
    isSelectedHovered() {
      if (this.selectedHover && !this.isOpened) return true;
      else return false;
    },
  },
  methods: {
    isOptionHovered(index) {
      if (this.hover === -1) {
        return this.selected === index;
      } else {
        return this.hover === index;
      }
    },
    click(index) {
      this.isOpened = false;
      this.hover = -1;
      this.$emit("update:selected", index);
    },
    remove(file) {
      this.$emit(
        "update:files",
        this.fileList.filter((f) => f !== file)
      );
    },
    hoverDelete() {
      this.deleteIconSrc = deleteIconGreen;
    },
    defaultDelete() {
      this.deleteIconSrc = deleteIconGray;
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.menuContainer {
  width: 100%;
  text-align: left;
  height: 32px;
  line-height: 32px;
  position: relative;
  z-index: 2;
  outline: none;
}

.selected {
  border-radius: 4px;
  border: solid 1px theme.$color-gray-dark;
  cursor: pointer;
  padding-left: 15px;
  background-color: theme.$color-white;
}

.selectedHovered {
  border: solid 1px theme.$hover-border-color;
}

.selectedClicked {
  border-color: theme.$color-green-light;
}

.fileName {
  max-width: 85%;
  max-height: 32px;
  overflow: hidden;
}

.triangle {
  width: 0;
  height: 0;
  position: absolute;
  top: 50%;
  right: 15px;
  border: 5px solid transparent;
  border-top-color: theme.$font-color;
}

.triangleClicked {
  border: 5px solid transparent;
  border-bottom-color: theme.$color-green-light;
  transform: translateY(-50%);
}

.optionsContainer {
  border: solid 1px theme.$hover-border-color;
  border-radius: 4px;
  background-color: theme.$color-white;
  box-shadow: 0 1px 2px 1px theme.$shadow-color;
  position: absolute;
  left: 0;
  right: 0;
  margin-top: 1px;
  max-height: 350px;
  overflow-y: auto;
}

.isClosed {
  display: none;
}

.option {
  position: relative;
  padding: 2px 0 1px 15px;
  cursor: pointer;
}

.optionHovered {
  background-color: theme.$color-gray-light;
}

.deleteIcon {
  width: 17px;
  height: 17px;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
