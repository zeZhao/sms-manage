<template>
  <!--批量添加-->
  <div class="batchAddition">
    <el-dialog
      :visible.sync="isOpen"
      :title="title"
      width="50%"
      top="120px"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="tips">
        第1步：请先<a
          style="color: blue"
          target="_blank"
          :href="`/view${downloadTemplateUrl}`"
          >下载模板</a
        >，按照说明填写信息后上传
      </div>

      <div class="tips">第2步：导入文件</div>

      <el-upload
        class="upload"
        ref="upload"
        :action="`api${action}`"
        :headers="header"
        :accept="accept.join(',')"
        :limit="1"
        :auto-upload="false"
        :file-list="fileList"
        :on-change="onChange"
        :on-remove="onRemove"
        :on-success="onSuccess"
        :before-upload="beforeUpload"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>

      <div class="btnStyle">
        <slot name="Btn">
          <el-button size="small" @click="cancel">取消</el-button>
          <el-button
            size="small"
            type="primary"
            style="margin-left: 15px"
            v-throttle
            @click="handleSubmit"
            >确认
          </el-button>
        </slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "批量添加"
    },
    downloadTemplateUrl: {
      type: String,
      default: ""
    },
    action: {
      type: String,
      default: ""
    },
    accept: {
      type: Array,
      default: () => {
        return [
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ];
      }
    }
  },
  data() {
    return {
      header: { token: getToken() },
      file: "",
      fileList: []
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.file = "";
          this.$refs.upload.clearFiles();
        });
      }
    }
  },
  methods: {
    downLoad() {
      this.$axios
        .get(this.downloadTemplateUrl, {
          responseType: "blob"
        })
        .then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "模板.xlsx");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        });
    },
    onChange(file, fileList) {
      this.file = file.raw;
    },
    onRemove(file, fileList) {
      this.file = "";
    },
    onSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$emit("submit");
        this.$alert(response.msg, "批量添加", {
          center: true,
          confirmButtonText: "确定",
          callback: action => {}
        });
      } else {
        this.$message.error(response.data || response.msg);
      }
    },
    beforeUpload(file) {
      const isType = this.accept.indexOf(file.type) !== -1;
      if (!isType) {
        this.file = "";
        this.$message.error("上传文件类型错误，请重新上传");
        return false;
      }
      return true;
    },
    //确认批量上传操作
    handleSubmit() {
      if (!this.file) {
        this.$message.error("请选择上传文件");
        return;
      }
      this.$refs.upload.submit();
    },
    // 关闭
    cancel() {
      this.$emit("cancel");
    }
  }
};
</script>

<style lang="scss" scoped>
.batchAddition {
  >>> .el-dialog__body {
    padding: 16px 60px;

    .tips {
      margin-top: 20px;
    }

    .upload {
      margin: 30px 0 30px 50px;
    }

    .btnStyle {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
