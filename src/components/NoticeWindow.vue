<template>
  <div :class="$style.noticeWindowContainer">
    <div :class="$style.notice">
      <span :class="$style.noticeText">
        {{ fileNames }} 已加密<br />不支援浮水印
      </span>
    </div>
    <div :class="$style.buttonContainer">
      <div :class="$style.confirmButton">
        <MyButton text="確認" @click="$emit('confirm')" />
      </div>
    </div>
  </div>
</template>

<script>
import MyButton from "./MyButton.vue";

export default {
  name: "NoticeWindow",
  components: {
    MyButton,
  },
  props: {
    fileNames: {
      type: String,
      default: "",
    },
  },
};
</script>

<style module lang="scss">
@use '~@/theme.scss' as theme;

.noticeWindowContainer {
  background-color: theme.$color-white;
  border-radius: 15px;
  text-align: center;
  width: 100%;
  height: 100%;
}

.notice {
  width: 100%;
  height: 70%;
  position: relative;
}

.noticeText {
  width: 75%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.buttonContainer {
  width: 100%;
  height: 30%;
  position: relative;
}

.confirmButton {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
