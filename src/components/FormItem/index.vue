<template>
  <div class="FormItem">
    <el-form
      ref="form"
      label-width="150px"
      :model="formData"
      v-if="formConfig.length"
      class="demo-ruleForm"
    >
      <el-row>
        <el-col
          :span="colSpan"
          v-for="(item, index) in formConfig"
          :key="index"
        >
          <el-form-item
            :label="item.label ? `${item.label}：` : ``"
            :prop="item.key"
            :rules="item.rules"
            v-if="!item.isShow"
          >
            <!--输入框-->
            <template v-if="item.type === 'input'">
              <el-input
                v-model="formData[item.key]"
                clearable
                :disabled="item.disabled"
                :placeholder="item.placeholder"
              />
            </template>

            <!--多文本输入框-->
            <template v-if="item.type === 'textarea'">
              <el-input
                v-model="formData[item.key]"
                type="textarea"
                clearable
                :disabled="item.disabled"
                :placeholder="item.placeholder"
              />
            </template>

            <!--下拉列表-->
            <template v-if="item.type === 'select'">
              <el-select
                v-model="formData[item.key]"
                filterable
                clearable
                @change="
                  val => {
                    selectChange(val, item);
                  }
                "
              >
                <el-option
                  v-for="option in item.optionData"
                  :value="option.key"
                  :key="option.key"
                  :label="option.value"
                />
              </el-select>
            </template>

            <!--多选框-->
            <template v-if="item.type === 'checkbox'">
              <el-checkbox-group v-model="formData[item.key]">
                <el-checkbox
                  v-for="option in item.optionData"
                  :key="option"
                  :label="option"
                  >{{ option }}</el-checkbox
                >
              </el-checkbox-group>
            </template>

            <!--单个日期-->
            <template v-if="item.type === 'date'">
              <el-date-picker
                type="date"
                :placeholder="item.placeholder || '选择日期'"
                clearable
                v-model="formData[item.key]"
              >
              </el-date-picker>
            </template>

            <!--单个月份-->
            <template v-if="item.type === 'month'">
              <el-date-picker
                type="month"
                :placeholder="item.placeholder || '选择日期'"
                clearable
                v-model="formData[item.key]"
              >
              </el-date-picker>
            </template>
          </el-form-item>
        </el-col>
        <slot name="sysGatewayGroup"></slot>
        <slot name="Btn">
          <el-button type="primary" @click="onSubmit('form')">{{
            btnTxt
          }}</el-button>
          <el-button @click="cancel">取消</el-button>
        </slot>
      </el-row>
    </el-form>
  </div>
</template>

<script>
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
    colSpan: {
      type: [String, Number],
      default() {
        return 24;
      }
    }
  },
  data() {
    return {
      formData: {}
    };
  },
  mounted() {
    this.initComponent();
  },
  computed: {},
  methods: {
    /**
     * 提交验证
     */
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit("submit", this.formData);
        } else {
          // this.$message.error("请输入必填项")
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
        if (defaultValue) {
          form[key] = item.defaultValue;
        }
      });
      this.formData = form;
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.formConfig.forEach(item => {
        const { defaultValue, key, type } = item;
        if (defaultValue || this.formData[key]) {
          if (type === "checkbox") {
            item.defaultValue = [];
            this.formData[key] = [];
          } else {
            item.defaultValue = null;
            this.formData[key] = null;
          }
        }
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
      this.$emit("selectChange", { val, item });
      item.defaultValue = val;
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
}
</style>
