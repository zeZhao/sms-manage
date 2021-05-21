<style scoped lang="scss">
.el-form-item {
  height: 32px;
  margin-bottom: 24px;
}
.searchPanel {
  background: #fff;
  padding-bottom: 24px;
  .btnStyle {
    float: right;
  }
  // padding: 24px;
}
</style>

<template>
  <div class="searchPanel">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      v-if="searchFormConfig.length"
    >
      <el-row>
        <el-col
          :sm="12"
          :md="8"
          :lg="item.type === 'daterange' || item.type === 'timerange' || item.type === 'datetime' ? 12 : 6"
          v-for="(item, index) in searchFormConfig"
          :key="index"
        >
          <el-form-item
            :label="item.label ? `${item.label}` : ``"
            :class="item.label ? `` : `empty-label-item`"
          >
            <!--输入框-->
            <template v-if="item.type === 'input'">
              <el-input
                v-model="form[item.key]"
                size="small"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :clearable="isClearAble(item)"
              ></el-input>
              <!-- @input="_mxHandleSubmit()" -->
            </template>
            <!--数字输入框-->
            <template v-if="item.type === 'inputNum'">
              <el-input
                v-model="form[item.key]"
                type="number"
                size="small"
                :placeholder="item.placeholder || `请输入${item.label}`"
                :clearable="isClearAble(item)"
              ></el-input>
              <!-- @input="_mxHandleSubmit()" -->
            </template>

            <!--下拉列表-->
            <template v-if="item.type === 'select'">
              <!-- @change="_mxHandleSubmit()" -->
              <el-select
                style="width: 100%"
                v-model="form[item.key]"
                :placeholder="item.placeholder || `请选择${item.label}`"
                filterable
                size="small"
                :clearable="isClearAble(item)"
                @focus="_mxHandleFocus()"
                @change="forceUpdate"
              >
                <el-option
                  v-for="option in item.optionData"
                  :value="option.key"
                  :key="option.key"
                  :label="option.value"
                />
              </el-select>
            </template>

            <!--日期范围选择-->
            <template v-if="item.type === 'daterange'">
              <!-- @change="_mxHandleSubmit()" -->
              <el-date-picker
                type="date"
                size="small"
                :placeholder="item.placeholder || '选择开始日期'"
                style="width: 45%"
                value-format="yyyy-MM-dd"
                :clearable="isClearAble(item)"
                v-model="form[item.key[1]]"
              ></el-date-picker>
              -
              <el-date-picker
                type="date"
                size="small"
                :placeholder="item.placeholder || '选择结束日期'"
                style="width: 45%"
                value-format="yyyy-MM-dd"
                :clearable="isClearAble(item)"
                v-model="form[item.key[2]]"
              ></el-date-picker>
              <!-- @change="_mxHandleSubmit()" -->
            </template>
            <!--时间范围选择-->
            <template v-if="item.type === 'timerange'">
              <!-- @change="_mxHandleSubmit()" -->
              <el-time-picker
                size="small"
                :placeholder="item.placeholder || '选择开始时间'"
                style="width: 45%"
                :clearable="isClearAble(item)"
                v-model="form[item.key[1]]"
              ></el-time-picker>
              -
              <el-time-picker
                size="small"
                :placeholder="item.placeholder || '选择结束时间'"
                style="width: 45%"
                :clearable="isClearAble(item)"
                v-model="form[item.key[2]]"
              ></el-time-picker>
            </template>
            <!--单个日期-->
            <template v-if="item.type === 'date'">
              <!-- @change="_mxHandleSubmit()" -->
              <el-date-picker
                style="width: 100%"
                size="small"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="item.placeholder || '选择日期'"
                :clearable="isClearAble(item)"
                v-model="form[item.key]"
              ></el-date-picker>
            </template>
            <!--单个月份-->
            <template v-if="item.type === 'month'">
              <!-- @change="_mxHandleSubmit()" -->
              <el-date-picker
                style="width: 100%"
                size="small"
                type="month"
                value-format="yyyy-MM"
                :placeholder="item.placeholder || '选择月份'"
                :clearable="isClearAble(item)"
                v-model="form[item.key]"
                :picker-options="item.pickerOptions || ''"
              ></el-date-picker>
            </template>
            <!--多个日期-选择具体到某天某时某秒-->
            <template v-if="item.type === 'datetime'">
              <!-- @change="_mxHandleSubmit()" -->
              <el-date-picker
                type="datetime"
                size="small"
                :placeholder="item.placeholder || '选择开始日期'"
                style="width: 45%"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="isClearAble(item)"
                v-model="form[item.key[1]]"
              ></el-date-picker>
              -
              <el-date-picker
                type="datetime"
                size="small"
                :placeholder="item.placeholder || '选择结束日期'"
                style="width: 45%"
                value-format="yyyy-MM-dd HH:mm:ss"
                :clearable="isClearAble(item)"
                v-model="form[item.key[2]]"
              ></el-date-picker>
              <!-- @change="_mxHandleSubmit()" -->
            </template>
          </el-form-item>
        </el-col>
        <div class="btnStyle">
          <slot name="Btn">
            <!-- <div> -->
            <el-button
              type="primary"
              @click="_mxHandleSubmit()"
              style="margin-left: 15px"
              size="small"
              v-throttle
              >查询</el-button
            >
            <el-button size="small" @click="_mxHandleReset()">重置</el-button>
            <!-- </div> -->
          </slot>
          <slot name="Other" :form="form"></slot>
        </div>
      </el-row>
      <el-row>
        <el-col
          ><el-button
            type="primary"
            v-if="add && searchFormConfig.length"
            @click="create"
            size="small"
            icon="el-icon-plus"
            >新建</el-button
          ></el-col
        >
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    searchFormConfig: {
      type: Array,
      default() {
        return [];
      }
    },
    add: {
      type: Boolean,
      default: true
    },
    search: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      form: {}
    };
  },
  // 注释重复请求列表接口,只在监听searchFormConfig的时候请求即可
  // mounted() {
  //   this.initComponent();
  // },
  methods: {
    //提交表单，通知列表做一次查询操作
    _mxHandleSubmit() {
      this.$emit("search", this.form);
      this.searchFormConfig.forEach(item => {
        if (item.hasOwnProperty("isSpecial")) {
          this.$emit("isChooseTime", this.form);
        }
      });

      // 彩信分类统计特殊页面搜索时展示时间功能
      // if (
      //   this.searchFormConfig[this.searchFormConfig.length - 2].hasOwnProperty(
      //     "hasOwnProperty"
      //   )
      // )
      //   this.$emit("isChooseTime", this.form);
    },
    //传值
    _mxHandleSendData() {
      this.$;
    },
    //重置筛选条件
    _mxHandleReset() {
      let form = this.form;
      console.log(form, "------------");
      // 彩信分类统计特殊页面特殊重置
      // if(){
      // if (this.searchFormConfig[this.searchFormConfig.length - 2].isSpecial) {
      //   for (let key in form) {
      //     form[key] = "";
      //   }
      //   form["statisticType"] = 2;
      //   return;
      // }
      // }

      for (let key in form) {
        form[key] = "";
        if (key === "statisticType") {
          form["statisticType"] = 2;
        }

        if (key === "reductType") {
          form["reductType"] = 1;
        }
      }

      this.form = form;
      // this.$emit("search", this.form);
    },

    forceUpdate() {
      this.$forceUpdate();
    }, //强制更新ui

    initComponent() {
      const form = {};
      this.searchFormConfig.forEach((item, index) => {
        const { type, key, api, params, keys, defaultValue } = item;
        if (defaultValue || defaultValue === "") {
          if (type !== "daterange") {
            form[key] = item.defaultValue;
          } else {
            form[key[1]] = item.defaultValue[1];
            form[key[2]] = item.defaultValue[2];
          }
        }
        // if (api) {
        //   this.$http[item.api]({ data: { ...params } }).then((res) => {
        //     res.data.forEach((data) => {
        //       let obj = {
        //         key: data[keys[0]],
        //         value: data[keys[1]],
        //       };
        //       item.optionData.push(obj);
        //     });
        //   });
        // }
      });
      this.form = form;
      this._mxHandleSubmit();

      // 彩信分类统计特殊页面传该form引用类型数据
      this.searchFormConfig.forEach(item => {
        if (item.hasOwnProperty("isSpecial")) {
          this.$emit("forms", this.form);
        }
      });
      // if (
      //   this.searchFormConfig[this.searchFormConfig.length - 2].hasOwnProperty(
      //     "isSpecial"
      //   )
      // )
      //   this.$emit("forms", this.form);
    },

    /**
     * 是否可以清除
     */
    isClearAble(item) {
      return item.clearable !== false;
    },
    /**
     * 重置表单
     */
    resetForm() {
      for (let key in this.form) {
        this.form[key] = "";
      }
      this.$emit("search", this.form);
    },
    // 新建
    create() {
      this.$emit("create");
    },
    //获取焦点触发事件
    _mxHandleFocus() {
      this.$emit("focus");
    },
    //导出功能，给父组件传form对象
    handleExport() {
      this.$emit("exportData", this.form);
    }
  },
  computed: {},
  watch: {
    searchFormConfig: {
      handler() {
        this.initComponent();
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
