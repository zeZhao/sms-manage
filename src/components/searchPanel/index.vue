<style scoped lang="scss">
.el-form-item {
  margin-bottom: 5px;
}
</style>

<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      v-if="searchFormConfig.length"
    >
      <el-row style="margin-bottom: 10px">
        <el-col
          :sm="12"
          :md="8"
          :lg="item.type === 'daterange' || item.type === 'timerange' ? 12 : 6"
          v-for="(item, index) in searchFormConfig"
          :key="index"
        >
          <el-form-item
            :label="item.label ? `${item.label}：` : ``"
            :class="item.label ? `` : `empty-label-item`"
          >
            <!--输入框-->
            <template v-if="item.type === 'input'">
              <el-input
                v-model="form[item.key]"
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
                :clearable="isClearAble(item)"
                @focus="_mxHandleFocus()"
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
                :placeholder="item.placeholder || '选择开始日期'"
                style="width: 45%"
                value-format="yyyy-MM-dd"
                :clearable="isClearAble(item)"
                v-model="form[item.key[1]]"
              ></el-date-picker
              > -
              <el-date-picker
                type="date"
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
                :placeholder="item.placeholder || '选择开始时间'"
                style="width: 45%"
                :clearable="isClearAble(item)"
                v-model="form[item.key[1]]"
              ></el-time-picker
              > -
              <el-time-picker
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
                type="month"
                value-format="yyyy-MM"
                :placeholder="item.placeholder || '选择月份'"
                :clearable="isClearAble(item)"
                v-model="form[item.key]"
              ></el-date-picker>
            </template>
          </el-form-item>
        </el-col>
        <slot name="Btn">
          <el-button
            type="primary"
            @click="_mxHandleSubmit()"
            style="margin-left: 15px"
            v-throttle
            >查询</el-button
          >
          <el-button
            type="primary"
            @click="_mxHandleReset()"
            style="margin-left: 15px"
            >重置</el-button
          >
          <el-button
            type="primary"
            v-if="add && searchFormConfig.length"
            @click="create"
            >新建</el-button
          >
        </slot>
        <slot name="Other" :form="form"></slot>
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
    },
    //传值
    _mxHandleSendData() {
      this.$;
    },
    //重置筛选条件
    _mxHandleReset() {
      let form = this.form;
      for (let key in form) {
        form[key] = "";
      }
      this.form = form;
      // this.$emit("search", this.form);
    },

    initComponent() {
      const form = {};
      this.searchFormConfig.forEach((item, index) => {
        const { type, key, api, params, keys, defaultValue } = item;
        if (defaultValue || defaultValue === "") {
          if (type !== 'daterange') {
            form[key] = item.defaultValue;
          } else {
            form[key[1]] = item.defaultValue[1]
            form[key[2]] = item.defaultValue[2]
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
      if (this.searchFormConfig[this.searchFormConfig.length - 2].isSpecial) this.$emit("forms", this.form);
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
