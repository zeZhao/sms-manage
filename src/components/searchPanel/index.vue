<style scoped lang="scss"></style>

<template>
  <div>
    <el-form ref="form" :model="form" label-width="120px" v-if="searchFormConfig.length">
      <el-row>
        <el-col :sm="24" :md="12" :lg="8" v-for="(item, index) in searchFormConfig" :key="index">
          <el-form-item
            :label="item.label ? `${item.label}：` : ``"
            :class="item.label ? `` : `empty-label-item`"
          >
            <!--输入框-->
            <template v-if="item.type === 'input'">
              <el-input
                v-model="form[item.key]"
                :placeholder="item.placeholder"
                :clearable="isClearAble(item)"
                @input="_mxHandleSubmit()"
              ></el-input>
            </template>

            <!--下拉列表-->
            <template v-if="item.type === 'select'">
              <el-select
                v-model="form[item.key]"
                filterable
                :clearable="isClearAble(item)"
                @change="_mxHandleSubmit()"
              >
                <el-option
                  v-for="option in item.optionData"
                  :value="option.key"
                  :key="option.key"
                  :label="option.value"
                />
              </el-select>
            </template>

            <!--时间范围选择-->
            <template v-if="item.type === 'daterange'">
              <el-date-picker
                type="date"
                :placeholder="item.placeholder || '选择日期'"
                style="width: 40%"
                :clearable="isClearAble(item)"
                v-model="form[item.key[1]]"
                @change="_mxHandleSubmit()"
              ></el-date-picker>-
              <el-date-picker
                type="date"
                :placeholder="item.placeholder || '选择日期'"
                style="width: 40%"
                :clearable="isClearAble(item)"
                v-model="form[item.key[2]]"
                @change="_mxHandleSubmit()"
              ></el-date-picker>
            </template>
            <!--单个日期-->
            <template v-if="item.type === 'date'">
              <el-date-picker
                type="date"
                :placeholder="item.placeholder || '选择日期'"
                :clearable="isClearAble(item)"
                v-model="form[item.key]"
                @change="_mxHandleSubmit()"
              ></el-date-picker>
            </template>
            <!--单个月份-->
            <template v-if="item.type === 'month'">
              <el-date-picker
                type="month"
                :placeholder="item.placeholder || '选择日期'"
                :clearable="isClearAble(item)"
                v-model="form[item.key]"
                @change="_mxHandleSubmit()"
              ></el-date-picker>
            </template>
          </el-form-item>
        </el-col>
        <slot name="Btn">
          <el-button type="primary" @click="_mxHandleSubmit()" style="margin-left: 15px">查询</el-button>
          <el-button type="primary" v-if="add && searchFormConfig.length" @click="create">新建</el-button>
        </slot>
        <slot name="Other"></slot>
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
  created() {},
  mounted() {
    this.initComponent();
  },
  methods: {
    //提交表单，通知列表做一次查询操作
    _mxHandleSubmit() {
      this.$emit("search", this.form);
    },

    initComponent() {
      const form = {};
      this.searchFormConfig.forEach((item, index) => {
        const { key, api, params, keys, defaultValue } = item;
        if (defaultValue) {
          form[key] = item.defaultValue;
          this._mxHandleSubmit();
        }
        if (api) {
          this.$http[item.api]({ data: { ...params } }).then(res => {
            res.data.forEach(data => {
              let obj = {
                key: data[keys[0]],
                value: data[keys[1]]
              };
              item.optionData.push(obj);
            });
          });
        }
      });
      this.form = form;
    },

    /**
     * 是否可以清除
     */
    isClearAble(item) {
      return item.clearable !== false;
    },
    // 新建
    create() {
      this.$emit("create");
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
