<template>
  <label :class="$style.label">
    <input
      :class="$style.input"
      type="file"
      accept="application/pdf"
      multiple
      @change="onChange"
    />
  </label>
</template>

<script>
export default {
  name: "FileSelectButton",
  methods: {
    onChange(event) {
      this.$emit("update:files", [...event.target.files]);
      event.target.value = "";
    },
  },
};
</script>

<style lang="scss" module>
.label {
  display: inline-block;
  width: 23px;
  height: 23px;
  cursor: pointer;
  background-image: url(../assets/add.svg);

  &:hover {
    background-image: url(../assets/add-hover.svg);
  }
}

.input {
  display: none;
}
</style>
