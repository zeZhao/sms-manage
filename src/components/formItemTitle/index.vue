<template>
  <div class="FormItem">
    <el-form
      ref="form"
      :label-width="`${labelWidth}px`"
      :model="formData"
      :label-position="labelPosition"
      v-if="formConfig.length"
      class="demo-ruleForm"
    >
      <el-row :gutter="gutter">
        <el-col
          v-for="(item, index) in formConfig"
          :key="index"
          :span="item.colSpan || colSpan"
          :offset="item.offset"
        >
          <h3 v-if="item.isTitle && !item.isShow">{{ item.title }}</h3>
          <el-button
            v-if="item.isBtn && !item.isShow"
            size="small"
            @click="handleClick(item)"
            >{{ item.btnTxt }}</el-button
          >
          <el-form-item
            :label="item.label ? `${item.label}：` : ``"
            :prop="item.key"
            :rules="item.rules"
            v-if="!item.isShow && !item.isTitle && !item.isBtn"
          >
            <!--输入框-->
            <template v-if="item.type === 'input'">
              <el-input
                :class="{
                  inputWid: item.btnTxt || item.specialSymbols,
                  inputIcon: item.lock
                }"
                v-model.trim="formData[item.key]"
                clearable
                :disabled="item.disabled || item.lock"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :maxlength="item.maxlength"
                show-word-limit
                @keyup.native="
                  $event.target.value = $event.target.value.replace(
                    /^\s+|\s+$/gm,
                    ''
                  )
                "
                @input="
                  val => {
                    onInputChange(val, item);
                  }
                "
              />
              <el-button
                style="border-color: #0964FF"
                v-if="item.btnTxt"
                :disabled="item.btnDisabled"
                @click="chooses(item)"
                size="small"
                >{{ item.btnTxt }}</el-button
              >
              <i
                class="el-icon-lock"
                v-if="item.lock"
                @click="decode(item)"
                style="font-size: 22px;vertical-align: sub;color: #909399;margin-left:5px"
              ></i>
              <span v-if="item.specialSymbols">{{ item.specialSymbols }}</span>
              <div v-if="item.tips" class="item-tips">{{ item.tips }}</div>
            </template>
            <!--密码类型-输入框-->
            <template v-if="item.type === 'password'">
              <el-input
                :class="{ inputWid: item.btnTxt }"
                v-model.trim="formData[item.key]"
                clearable
                type="password"
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :maxlength="item.maxlength"
                show-word-limit
                @keyup.native="
                  $event.target.value = $event.target.value.replace(
                    /^\s+|\s+$/gm,
                    ''
                  )
                "
                @input="
                  val => {
                    onInputChange(val, item);
                  }
                "
              />
            </template>
            <!--多文本输入框-->
            <template v-if="item.type === 'textarea'">
              <el-input
                v-model="formData[item.key]"
                type="textarea"
                clearable
                show-word-limit
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :maxlength="item.maxlength"
                :autosize="{ minRows: 3, maxRows: 4 }"
                @input="
                  val => {
                    onChange(val, item);
                  }
                "
              />
              <slot
                v-if="item.isChooseProviceOrCity"
                name="isChooseProviceOrCity"
              ></slot>
              <div v-if="item.mobileTips" class="item-tips">
                {{ returnMobileTips(formData[item.key]) }}
              </div>
              <div v-if="item.contentTips" class="item-tips">
                {{ returnContentTips(formData[item.key]) }}
              </div>
            </template>
            <!--数字输入框-->
            <template v-if="item.type === 'inputNum'">
              <el-input-number
                v-model="formData[item.key]"
                clearable
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :max="item.maxlength"
                :min="item.minlength"
                :precision="item.precision || 0"
                :controls-position="item.position || 'right'"
                @input="
                  val => {
                    onChange(val, item);
                  }
                "
              />
            </template>

            <!--下拉列表-->
            <template v-if="item.type === 'select'">
              <el-select
                style="width: 100%"
                v-model="formData[item.key]"
                filterable
                :clearable="!item.clearable ? true : false"
                :multiple="item.multiple"
                :disabled="item.disabled"
                :placeholder="item.placeholder || `请选择${item.label}`"
                @change="
                  val => {
                    selectChange(val, item);
                  }
                "
                @remove-tag="
                  val => {
                    removeTag(val, item);
                  }
                "
              >
                <el-option
                  v-for="option in item.optionData"
                  :value="option.key"
                  :key="option.key"
                  :label="option.value"
                  :disabled="option.disabled"
                />
              </el-select>
            </template>

            <!--多选框-->
            <template v-if="item.type === 'checkbox'">
              <el-checkbox-group
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              >
                <el-checkbox
                  v-for="option in item.optionData"
                  :key="option.key"
                  :label="option.key"
                  >{{ option.value }}</el-checkbox
                >
              </el-checkbox-group>
            </template>

            <!--单选框-->
            <template v-if="item.type === 'radio'">
              <el-radio-group
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              >
                <el-radio
                  v-for="option in item.optionData"
                  :key="option.key"
                  :label="option.key"
                  >{{ option.value }}</el-radio
                >
              </el-radio-group>
            </template>

            <!--单个日期-->
            <template v-if="item.type === 'date'">
              <el-date-picker
                type="date"
                :placeholder="item.placeholder || `请选择${item.label}`"
                clearable
                :value-format="item.format || 'yyyy-MM-dd'"
                :picker-options="item.disabledDate || null"
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-date-picker>
            </template>

            <!--单个月份-->
            <template v-if="item.type === 'month'">
              <el-date-picker
                type="month"
                :placeholder="item.placeholder || `请选择${item.label}`"
                clearable
                :value-format="item.format || 'yyyy-MM'"
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-date-picker>
            </template>

            <!--单个时间-->
            <template v-if="item.type === 'time'">
              <el-time-picker
                clearable
                v-model="formData[item.key]"
                :value-format="item.format || 'HH:mm:ss'"
                :placeholder="item.placeholder || `请选择${item.label}`"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-time-picker>
            </template>
            <!--双时间-->
            <template v-if="item.type === 'times'">
              <el-time-picker
                clearable
                v-model="formData[item.key]"
                :value-format="item.format || 'HH:mm:ss'"
                is-range
                range-separator="-"
                :start-placeholder="item.startPlaceholder || '开始时间'"
                :end-placeholder="item.endPlaceholder || '结束时间'"
                :placeholder="item.placeholder || '选择时间范围'"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
              ></el-time-picker>
            </template>
            <template v-if="item.type === 'switch'">
              <el-switch
                style="display: block"
                v-model="formData[item.key]"
                @change="
                  val => {
                    onChange(val, item);
                  }
                "
                :active-color="item.activeColor || '#13ce66'"
                :inactive-color="item.inactiveColor || '#ff4949'"
                :active-text="item.activeText"
                :inactive-text="item.inactiveText"
                :active-value="item.activeValue || '1'"
                :inactive-value="item.inactiveValue || '0'"
              >
              </el-switch>
            </template>
            <!--上传-->
            <template v-if="item.type === 'upload'">
              <div v-if="!item.defaultValue">
                <el-upload
                  ref="uploadFile"
                  :action="action"
                  :headers="header"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :on-success="
                    (res, file, fileList) => {
                      handleSuccess(item, res, file, fileList);
                    }
                  "
                  :before-upload="
                    file => {
                      beforeUpload(item, file);
                    }
                  "
                  :on-progress="
                    (event, file, fileList) => {
                      handleProgress(item, event, file, fileList);
                    }
                  "
                  :on-error="handleError"
                  :limit="item.limit || 1"
                  :file-list="item.defaultFileList || []"
                  :on-exceed="handleExceed"
                >
                  <el-button size="small" type="primary">{{
                    item.btnTxt ? item.btnTxt : "上传文件"
                  }}</el-button>
                </el-upload>
                <div slot="tip" class="el-upload__tip">
                  {{ item.tip }}
                </div>
              </div>
              <div v-else>
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="`${href}/${item.defaultValue}`"
                  alt=""
                  style="width: 100px;height: 75px;"
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(item.defaultValue)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!item.disabled"
                    style="display: inline-block;"
                    @click="handleRemoveImg(item)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </template>
          </el-form-item>
        </el-col>
        <div>
          <slot name="Other"></slot>
          <div class="submitBtn">
            <slot name="Btn">
              <el-button @click="cancel" size="small">取消</el-button>
              <el-button
                type="primary"
                @click="onSubmit('form')"
                v-throttle="3000"
                size="small"
              >
                {{ btnTxt }}
              </el-button>
            </slot>
          </div>
        </div>
      </el-row>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" :modal="false">
      <img width="100%" :src="`${href}/${dialogImageUrl}`" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  props: {
    formConfig: {
      type: Array,
      default() {
        return [];
      }
    },
    btnTxt: {
      type: String,
      default() {
        return "新增";
      }
    },
    labelPosition: {
      type: String,
      default() {
        return "right";
      }
    },
    labelWidth: {
      type: [String, Number],
      default() {
        return 150;
      }
    },
    gutter: {
      type: [String, Number],
      default() {
        return 24;
      }
    },
    colSpan: {
      type: [String, Number],
      default() {
        return 24;
      }
    }
  },
  data() {
    return {
      formData: {},
      action: "/api/sysPrepaidCard/uploadFile",
      header: {
        token: getToken()
      },
      href: window.location.origin,
      dialogVisible: false,
      dialogImageUrl: ""
    };
  },
  mounted() {
    this.initComponent();
  },
  computed: {},
  methods: {
    //input Change事件
    onInputChange(val, item) {
      val = val.trim();
      this._setDefaultVal(val, item);
      this.$emit("inpChange", { val, item });
    },
    handleClick(item) {
      this.$emit("handleClick", item);
    },
    //  select 事件
    onChange(val, item) {
      this._setDefaultVal(val, item);
      this.$emit("onChange", { val, item });
    },
    // 选择组件
    chooses(item) {
      this.$emit("choose", item);
    },
    decode(item) {
      this.$emit("decode", item);
    },
    /**
     * 提交验证
     */
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("submit", this.formData);
        } else {
          // this.$message.error("请输入必填项");
          return false;
        }
      });
    },
    /**
     * 回显数据
     */
    initComponent() {
      const form = {};
      this.formConfig.forEach(item => {
        const { key, defaultValue } = item;
        form[key] = item.defaultValue;
      });

      this.formData = form;
    },
    /* 清除表单验证信息 */
    clearValidate() {
      this.$refs.form.clearValidate();
    },
    //清空上传文件
    clearFiles() {
      this.$refs.uploadFile.clearFiles();
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.formConfig.forEach(item => {
        const { defaultValue, key, type } = item;
        if (defaultValue || this.formData[key]) {
          if (type === "checkbox") {
            if (item.initDefaultValue) {
              this.$set(item, "defaultValue", item.initDefaultValue);
            } else {
              item.defaultValue = [];
              this.formData[key] = [];
            }
          } else if (
            type === "input" ||
            type === "select" ||
            type === "radio" ||
            type === "switch"
          ) {
            if (item.initDefaultValue) {
              this.$set(item, "defaultValue", item.initDefaultValue);
            } else {
              item.defaultValue = null;
            }
          } else {
            item.defaultValue = null;
            this.formData[key] = null;
          }
        }
      });
      this.$nextTick(() => {
        this.clearValidate();
      });
      // this.$refs.form.resetFields();
    },
    cancel() {
      this.$emit("cancel");
    },
    /**
     * 是否可以清除
     */
    isClearAble(item) {
      return item.clearable !== false;
    },
    selectChange(val, item) {
      this._setDefaultVal(val, item);
      this.$emit("selectChange", { val, item });
    },
    removeTag(val, item) {
      this.$emit("removeTag", { val, item });
    },
    //设置默认值
    _setDefaultVal(val, item) {
      if (item.hasOwnProperty("defaultValue")) {
        item.defaultValue = val;
      } else {
        this.$set(item, "defaultValue", val);
      }
    },
    //  文件上传成功时的钩子
    handleSuccess(item, response, file, fileList) {
      if (response.code == 200) {
        this.$emit("handleSuccess", { response, file, fileList, item });
      } else {
        this.$message.error(response.data);
        item.defaultFileList = [];
        // fileList = [];
      }
    },
    //上传前
    beforeUpload(item, file) {},
    //  文件上传时的钩子
    handleProgress(item, event, file, fileList) {},
    //  文件上传失败时的钩子
    handleError(err, file, fileList) {
      this.$emit("handleError", { err, file, fileList });
    },
    //  文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.$emit("handleRemove", { file, fileList });
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePreview(file) {
      console.log(file);
    },

    //  文件超出个数限制时的钩子
    handleExceed(files, fileList) {
      this.$emit("handleExceed", { files, fileList });
    },
    //删除图片
    handleRemoveImg(item) {
      // console.log(file);
      item.defaultValue = "";
      item.defaultFileList = [];
    },
    //查看图片
    handlePictureCardPreview(file) {
      console.log(file);
      this.dialogImageUrl = file;
      this.dialogVisible = true;
    },

    //回显input下列提示
    returnMobileTips(value) {
      if (!value) return "已输入0个手机号";
      const arr = value.split(",");
      let num = 0;
      arr.forEach(item => {
        if (item) num++;
      });
      return `已输入${num}个手机号`;
    },
    //回显input下列提示
    returnContentTips(value) {
      const num = 67; //67个文字算一条
      const computeder = value ? value.length / num : 0;
      return `已输入${value ? value.length : 0}字符，将按${
        value ? Math.ceil(computeder) : 1
      }条计费，计费条数仅供参考，以实际扣费为准！`;
    }
  },
  watch: {
    formConfig: {
      handler() {
        this.initComponent();
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style lang="scss" scoped>
.FormItem {
  // position: relative;
  .submitBtn {
    float: right;
    margin-right: 12px;
    // position: absolute;
    // right: 20px;
    // bottom: 20px;
  }
  .inputWid {
    width: 63%;
  }
  .inputIcon {
    width: 85%;
  }
  .item-tips {
    color: #999999;
    font-size: 12px;
    line-height: 17px;
    text-align: right;
    margin-top: 6px;
  }
}
</style>
