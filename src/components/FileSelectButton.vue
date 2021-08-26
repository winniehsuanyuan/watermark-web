<template>
  <div :class="$style.buttonContainer">
    <input
      id="addFile"
      type="file"
      accept="application/pdf"
      multiple
      :class="$style.defaultInput"
      @change="onChange"
    />
    <label for="addFile" :class="$style.label">
      <img
        :src="buttonSrc"
        :class="$style.addIcon"
        @mouseover="hoverIcon"
        @mouseleave="defaultIcon"
      />
    </label>
  </div>
</template>

<script>
import addIcon from "../assets/add.svg";
import addIconHover from "../assets/add-hover.svg";

export default {
  name: "FileSelectButton",
  data() {
    return {
      buttonSrc: addIcon,
    };
  },
  methods: {
    onChange(event) {
      this.$emit("update:files", [...event.target.files]);
      event.target.value = "";
    },
    hoverIcon() {
      this.buttonSrc = addIconHover;
    },
    defaultIcon() {
      this.buttonSrc = addIcon;
    },
  },
};
</script>

<style module>
.buttonContainer {
  width: 23px;
  height: 23px;
}

.defaultInput {
  width: 0;
  height: 0;
  opacity: 0;
}

.label {
  display: inline-flex;
}

.addIcon {
  width: 23px;
  height: 23px;
  cursor: pointer;
}
</style>
