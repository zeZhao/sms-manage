<template>
  <div class="searchPanel" id="searchPanel">
    <el-form
      v-if="searchFormConfig.length"
      ref="form"
      :model="form"
      label-width="auto"
    >
      <el-row :gutter="16">
        <el-col
          v-for="(item, index) in searchFormConfig"
          :key="index"
          :gutter="16"
          :xs="grid(item, 'xs', 12, 8, 16, 6)"
          :sm="grid(item, 'sm', 12, 8, 16, 6)"
          :md="grid(item, 'md', 12, 8, 16, 6)"
          :lg="grid(item, 'lg', 8, 6, 12, 4)"
          :xl="grid(item, 'xl', 6, 5, 8, 3)"
        >
          <transition name="el-zoom-in-top">
            <el-form-item
              v-show="!item.isCollapse"
              :label="item.label ? `${item.label}` : ``"
              :class="item.label ? `` : `empty-label-item`"
            >
              <!--输入框-->
              <template v-if="item.type === 'input'">
                <el-input
                  v-model.trim="form[item.key]"
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
                  onKeypress="this.value=this.value.replace(/\D/g,'')"
                ></el-input>
                <!-- oninput="if(value.length > 11)value=value.slice(0,11)" -->
                <!-- 
                  @blur="
                    item.defaultValue = form[
                      item.key
                    ] = $event.target.value = $event.target.value.replace(
                      /\D+/gm,
                      ''
                    )
                  "
                 -->
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

              <template v-if="item.type === 'selectInp'">
                <el-select
                  style="width: 30%"
                  v-model="form[item.key[0]]"
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
                <el-input
                  style="width: 65%"
                  v-model="form[item.key[1]]"
                  type="number"
                  size="small"
                  :placeholder="item.placeholder || `请输入${item.label}`"
                  :clearable="isClearAble(item)"
                ></el-input>
              </template>
              <!--多选框-->
              <template v-if="item.type === 'checkbox'">
                <el-checkbox-group v-model="form[item.key]">
                  <el-checkbox
                    v-for="option in item.optionData"
                    :key="option.key"
                    :label="option.key"
                    >{{ option.value }}</el-checkbox
                  >
                </el-checkbox-group>
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
          </transition>
        </el-col>
        <el-col :md="mxCol" :lg="lgCol" :xl="xlCol">
          <div class="btnStyle">
            <slot name="Btn">
              <el-button
                type="primary"
                @click="_mxHandleSubmit()"
                size="small"
                v-throttle
                >查询</el-button
              >
              <el-button size="small" @click="_mxHandleReset()">重置</el-button>
            </slot>
          </div>
        </el-col>
        <el-col :span="8" v-show="$slots.Other || isOther">
          <div class="btnStyle">
            <slot name="Other" :form="form"></slot>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- <el-row>
      <el-col>
        <div class="btnStyle">
          <slot name="Btn">
            <el-button
              type="primary"
              @click="_mxHandleSubmit()"
              style="margin-left: 15px"
              size="small"
              v-throttle
              >查询</el-button
            >
            <el-button size="small" @click="_mxHandleReset()">重置</el-button>
          </slot>
          <slot name="Other" :form="form"></slot>
        </div>
      </el-col>
    </el-row> -->

    <!-- <el-row>
      <el-col>
        <el-button
          style="float: right; margin: 10px 0"
          type="text"
          size="mini"
          @click="handleToggleIsCollapse"
          >{{ isCollapse ? "收起筛选" : "展开筛选"
          }}<i
            :class="isCollapse ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
          ></i>
        </el-button>
      </el-col>
    </el-row> -->

    <el-row style="margin-top:8px" v-show="add">
      <el-col>
        <el-button
          v-if="add && searchFormConfig.length"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="create"
          >新建</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDateTime } from "@/utils";

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
    isOther: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: true
    },
    mxCol: {
      type: Number,
      default: 6
    },
    lgCol: {
      type: Number,
      default: 4
    },
    xlCol: {
      type: Number,
      default: 3
    },
    //默认进入该页面不查询
    notSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCollapse: true, // 默认展开
      form: {}
    };
  },
  mounted() {},
  watch: {
    searchFormConfig: {
      handler() {
        this.initComponent();
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //栅格占比
    grid(item, type, combinationGrid, dateGrid, datetimeGrid, defaultGrid) {
      let combinationGridList = ["daterange", "timerange", "selectInp"];
      let checkboxGrid = null;
      if (item.type === "checkbox") {
        if (item.gridList && item.gridList.length > 0) {
          item.gridList.forEach(item => {
            if (item.type === type) {
              checkboxGrid = item.grid;
            }
          });
        }
      }
      return combinationGridList.includes(item.type) || item.isLonger
        ? combinationGrid
        : ["date"].includes(item.type)
        ? dateGrid
        : ["datetime"].includes(item.type)
        ? datetimeGrid
        : ["checkbox"].includes(item.type)
        ? checkboxGrid || combinationGrid
        : defaultGrid;
    },
    //切换收起和展开功能
    handleToggleIsCollapse() {
      this.isCollapse = !this.isCollapse;
      this.searchFormConfig.forEach((item, index) => {
        if (index > 2) {
          item.isCollapse = this.isCollapse ? false : true;
        }
      });
    },
    //提交表单，通知列表做一次查询操作
    _mxHandleSubmit() {
      this.$emit("search", this.form);
      this.searchFormConfig.forEach(item => {
        if (item.hasOwnProperty("isSpecial")) {
          this.$emit("isChooseTime", this.form);
        }
      });
    },
    //重置筛选条件
    _mxHandleReset() {
      const form = this.form;
      const { path } = this.$route;

      for (let key in form) {
        form[key] = "";

        if (key === "statisticType") {
          form["statisticType"] = 2;
        }

        if (key === "reductType") {
          form["reductType"] = 1;
        }

        if (key === "isSpecials") {
          form["isSpecials"] = [];
        }

        if (key === "billDate") {
          form["billDate"] = new Date();
        }

        if (path === "/OperationLog/index") {
          if (key === "serverType") {
            form[key] = 1;
          }
          if (key === "startTime") {
            form[key] = getDateTime("start");
          }
          if (key === "endTime") {
            form[key] = getDateTime("end");
          }
        }

        if (path === "/sysReport/index") {
          if (key === "countDate" || key === "endDate") {
            form[key] = null;
          }
        }
      }

      this.form = form;
      // this.$emit("search", this.form);
    },

    // 强制更新ui
    forceUpdate() {
      this.$forceUpdate();
    },

    initComponent() {
      const form = {};
      const doubleValue = ["daterange", "datetime", "timerange"]; // 双值的type类型
      this.searchFormConfig.forEach((item, index) => {
        const { type, key, api, params, keys, defaultValue } = item;
        if (defaultValue || defaultValue === "") {
          if (doubleValue.indexOf(type) === -1) { // 单值
            form[key] = item.defaultValue;
          } else {                                // 双值
            form[key[1]] = item.defaultValue[1];
            form[key[2]] = item.defaultValue[2];
          }
        }
      });

      this.form = Object.assign({}, this.form, form);

      // 彩信分类统计特殊页面传该form引用类型数据
      this.searchFormConfig.forEach(item => {
        if (item.hasOwnProperty("isSpecial")) {
          this.$emit("forms", this.form);
        }
      });

      if (this.notSearch) return; // 默认进入该页面不查询

      this._mxHandleSubmit();
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
    //给父组件传form对象
    renderForm() {
      this.$emit("getForm", this.form);
    },
    //导出功能，给父组件传form对象
    handleExport() {
      this.$emit("exportData", this.form);
    }
  }
};
</script>

<style scoped lang="scss">
.el-form-item {
  height: 20px;
}

.searchPanel {
  background: #fff;
  margin-bottom: 8px;
  ::v-deep .el-col {
    height: 28px;
    margin-bottom: 8px;
  }
  ::v-deep .el-col:last-child {
    margin-bottom: 0;
  }
  ::v-deep .el-date-editor .el-input__inner {
    padding: 0 0 0 30px !important;
  }

  .btnStyle {
    margin-top: 3px;
    // float: right;
  }
}
</style>
