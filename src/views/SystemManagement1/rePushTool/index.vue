<template>
  <!-- 重推工具 -->
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="createTime" label="日期" width="135">
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="手机号" />
      <el-table-column prop="code" label="推送类型" />
      <el-table-column prop="sign" label="推送条数" />
      <el-table-column prop="cm" label="操作人" />
      <el-table-column prop="createTime" label="操作时间" width="135">
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="完成时间" width="135">
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            @click="_mxDeleteItem('routeId', scope.row.routeId)"
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-drawer
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-press-escape="false"
      :wrapperClosable="false"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
        @submit="submit"
        @cancel="cancel"
      ></FormItem>
      <!-- <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"></FormItem> -->
    </el-drawer>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "pushToolTask",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "",
      isParamsNotData: false,
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "date",
          label: "操作时间",
          key: "sign"
        },
        {
          type: "input",
          label: "手机号",
          key: "sign"
        },
        {
          type: "select",
          label: "推送类型",
          key: "type",
          optionData: [
            {
              key: 1,
              value: "报告推送"
            },
            {
              key: 2,
              value: "上行推送"
            }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "dataTime",
          label: "选择日期",
          key: "userId",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "手机号",
          key: "userId",
          placeholder: "请输入手机号码，多个用英文逗号隔开",
          defaultValue: "",
          rules: this.$publicValidators.phone
        }
      ]
    };
  },
  mounted() {},
  activated() {
    // 重新获取数据
    this._mxGetList();
  },
  methods: {
    create() {
      // this.$router.push({ name: "rePushToolType", query: { type: "create" } });
      this.formTit = "新建";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          item.btnDisabled = false;
        }
      });
      this.addChannel = true;
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新建") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysSignRoute.addSignRoute(params).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          data: {
            routeId: this.routeId,
            ...form
          }
        };
        this.$http.sysSignRoute.updateSignRoute(params).then(res => {
          if (resOk(res)) {
            window.history.back();
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    cancel() {
      this.addChannel = false;
    }
  }
};
</script>
