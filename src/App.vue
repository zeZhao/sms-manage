<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
<style>
.el-button--mini {
  font-size: 14px;
}
.el-input__inner {
  font-size: 14px;
}
.el-table--mini {
  font-size: 14px;
}
.app-main {
  padding: 16px;
}
.remind {
  line-height: 16px;
  font-size: 14px;
  color: #ec5858;
}
.el-message-box__message {
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
.el-dialog {
  padding-bottom: 30px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: inherit;
}
</style>
