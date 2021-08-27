<template>
  <div
    :class="{
      [$style.dropArea]: true,
      [$style.dropAreaDisabled]: disabled,
    }"
    @dragover.prevent="dragOver"
    @drop.prevent="drop"
    @dragleave="dragLeave"
  >
    <div v-show="isDraggingOver" :class="$style.uploadIcon"></div>
    <div v-if="!files.length" :class="$style.instruction">
      <label
        :class="{
          [$style.label]: !disabled,
          [$style.labelDragging]: isDraggingOver,
        }"
      >
        <input
          type="file"
          :accept="acceptTypes"
          :multiple="multiple"
          :disabled="disabled"
          :class="$style.input"
          @change="onChange"
        />
        請將你的
        <span :class="$style.fileType">{{ accept }}</span>
        檔拖曳至此或 <span :class="$style.wordsToClick">點選此處</span>上傳
      </label>
    </div>
    <ul v-if="files.length" :class="$style.list">
      <li v-for="(file, index) in files" :key="index">
        <span :class="$style.fileName">{{ file.name }}</span>
        <img
          :src="deleteIconSrc"
          :class="$style.deleteIcon"
          @mouseover="hoverDelete"
          @mouseleave="defaultDelete"
          @click="remove(file)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import deleteIconGray from "../assets/delete-gray.svg";
import deleteIconGreen from "../assets/delete-green.svg";

export default {
  name: "FileSelect",
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    acceptTypes: {
      validator(value) {
        return (
          Array.isArray(value) && value.every((v) => typeof v === "string")
        );
      },
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    files: {
      required: true,
      validator(value) {
        return Array.isArray(value) && value.every((v) => v instanceof File);
      },
    },
  },
  data() {
    return {
      isDraggingOver: false,
      deleteIconSrc: deleteIconGray,
    };
  },
  computed: {
    accept() {
      return this.acceptTypes
        .map((type) =>
          type.replace(/application\//g, "").replace(/image\//g, "")
        )
        .join(", ");
    },
  },
  methods: {
    onChange(event) {
      this.$emit("update:files", [...event.target.files]);
      event.target.value = "";
    },
    remove(file) {
      this.$emit(
        "update:files",
        this.files.filter((f) => f !== file)
      );
    },
    dragOver() {
      if (!this.disabled) {
        this.isDraggingOver = true;
      }
    },
    drop(event) {
      if (!this.disabled) {
        this.isDraggingOver = false;
        let fileList = [...event.dataTransfer.files];
        if (!this.multiple) {
          fileList = [fileList[0]];
        }
        this.$emit(
          "update:files",
          fileList.filter((file) => this.acceptTypes.includes(file.type))
        );
      }
    },
    dragLeave() {
      this.isDraggingOver = false;
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

.dropArea {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
  border-radius: 4px;
  line-height: 100%;
}

.dropAreaDisabled {
  background-color: theme.$color-gray-dark;
  opacity: 0.7;
}

.uploadIcon {
  width: 70px;
  height: 70px;
  background-image: url("../assets/upload.svg");
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  top: 30%;
}

.input {
  display: none;
}

.label {
  cursor: pointer;
}

.labelDragging {
  opacity: 0.15;
}

.instruction {
  width: 90%;
  line-height: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fileType {
  font-weight: 600;
}

.wordsToClick {
  text-decoration: underline;
}

.list {
  list-style: none;
  margin: 0;
  width: 90%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fileName {
  display: inline-block;
  vertical-align: middle;
}

.deleteIcon {
  margin: 0 10px 0 10px;
  width: 17px;
  height: 17px;
  cursor: pointer;
  display: inline-block;
  vertical-align: middle;
}
</style>
