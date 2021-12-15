<template>
  <!-- 重推工具 -->
  <div>
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>

    <el-table
      :data="listData"
      height="50vh"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="startTime" label="日期" min-width="300">
        <template slot-scope="scope">
          {{ scope.row.startTime | timeFormat }}~{{
            scope.row.endTime | timeFormat
          }}
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" show-overflow-tooltip />
      <el-table-column prop="pushType" label="推送类型">
        <template slot-scope="scope">{{
          scope.row.pushType === 1 ? "报告推送" : "上行推送"
        }}</template>
      </el-table-column>
      <el-table-column prop="pushNumber" label="推送条数" />
      <el-table-column prop="createUser" label="操作人" />
      <el-table-column prop="createTime" label="操作时间" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.createTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="完成时间" min-width="150">
        <template slot-scope="scope">
          {{ scope.row.updateTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button v-if="scope.row.taskStatus === 1" type="text" size="small"
            >列队中</el-button
          >
          <el-button v-if="scope.row.taskStatus === 2" type="text" size="small"
            >推送中…</el-button
          >
          <el-button v-if="scope.row.taskStatus === 3" type="text" size="small"
            >推送完成</el-button
          >
          <el-button
            v-if="scope.row.taskStatus === 4"
            type="text"
            size="small"
            style="color: #D9001B"
            >推送失败</el-button
          >
          <el-button
            v-if="scope.row.taskStatus === 5"
            type="text"
            size="small"
            style="color: #999999"
            >已取消</el-button
          >
          <el-button
            v-if="scope.row.taskStatus === 1"
            type="text"
            size="small"
            @click="cancel(scope.row.id)"
            >取消
          </el-button>
          <el-button
            v-if="scope.row.taskStatus === 4 || scope.row.taskStatus === 5"
            type="text"
            size="small"
            @click="
              _mxDeleteItem(
                'id',
                scope.row.id,
                false,
                false,
                '删除后将不可找回，请谨慎操作。'
              )
            "
            >删除
          </el-button>
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
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
        :footerIsCenter="true"
        @onChange="onChange"
        @submit="submit"
      >
        <template slot="Btn">
          <el-button @click="cancelAddChannel">取消</el-button>
          <el-button
            type="primary"
            v-throttle="3000"
            @click="
              pushType = 1;
              $refs.formItem.onSubmit('form');
            "
          >
            报告推送
          </el-button>
          <el-button
            type="primary"
            v-throttle="3000"
            @click="
              pushType = 2;
              $refs.formItem.onSubmit('form');
            "
          >
            上行推送
          </el-button>
        </template>
      </FormItem>
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
        list: "queryByPage",
        detele: "delete"
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
          key: "createTime"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile"
        },
        {
          type: "select",
          label: "推送类型",
          key: "pushType",
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
          rules: [
            {
              required: true,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (!value) callback(new Error("请输入必填项"));
                if (isNaN(value)) callback(new Error("请输入正确的账户编号"));
                callback();
              }
            }
          ]
        },
        {
          type: "dataTimes",
          label: "选择日期",
          key: "dataTimes",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号码，多个用英文逗号隔开",
          defaultValue: "",
          rules: [{ required: false }]
        }
      ],
      pushType: "" // 1 报告推送 2 上行推送
    };
  },
  mounted() {
    this._mxGetList();
  },
  activated() {
    // 重新获取数据
    this._mxGetList();
  },
  methods: {
    onChange({ val, item }) {
      if (item.key === "mobile") {
        item.rules = val ? this.$publicValidators.phone : [{ required: false }];
      }
    },
    submit(form) {
      this.$confirm("推送后可在列表进行查看", "确认推送", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认推送
          let params = {};
          if (this.formTit === "新增") {
            params = {
              ...form
            };
            params.pushType = this.pushType;
            params.startTime = params.dataTimes[0];
            params.endTime = params.dataTimes[1];
            this.$http.pushToolTask.add(params).then(res => {
              if (resOk(res)) {
                this.addChannel = false;
                this.$message.success(res.msg || res.data);
                this._mxGetList();
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
                this.addChannel = false;
                this.$message.success(res.msg || res.data);
                this._mxGetList();
              } else {
                this.$message.error(res.data || res.msg);
              }
            });
          }
        })
        .catch(() => {});
    },
    cancelAddChannel() {
      this.addChannel = false;
    },
    create() {
      this.$router.push({ name: "rePushToolType", query: { type: "create" } });
    },
    // 取消队列中-操作
    cancel(id) {
      this.$confirm("是否取消此列队中的任务？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.pushToolTask.updateStatus({ id }).then(res => {
            this.$message.success(res.data || res.msg);
            this._mxGetList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>
