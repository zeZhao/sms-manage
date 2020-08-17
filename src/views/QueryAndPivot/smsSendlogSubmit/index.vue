<template>
  <!--前台提交调整-->
  <div class="smsSendlogSubmit">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="taskId" label="任务ID" width="100" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="count" label="数量" />
      <el-table-column prop="mobilesCount" label="手机号数量" />
      <el-table-column prop="submitTime" label="提交时间" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.submitTime | Format}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="definiteTime" label="定时时间" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.definiteTime | Format}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendCount" label="发送条数" />
      <el-table-column prop="successCount" label="成功条数" />
      <el-table-column prop="failCount" label="失败条数" />
      <el-table-column prop="unknowCount" label="未知条数" />
      <el-table-column prop="taskstatus" label="定时状态">
        <template slot-scope="scope">
          <span>{{scope.row.taskstatus == 0 ? '不定时': (scope.row.taskstatus == 1 ? '定时': (scope.row.taskstatus == 1 ? '定时取消': ''))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'id')" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem(scope.row.taskId)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @selectChange="selectChange"
      ></FormItem>
    </el-dialog>
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
        namespace: "sysRouteReturnError",
        list: "queryByPage",
        detele: "deleteTaskid",
        add: "addRouteReturnError",
        edit: "updateRouteReturnError",
      },
      // 列表参数
      namespace: "",
      isParamsNotData: true,
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userid",
        },
        {
          type: "input",
          label: "任务ID",
          key: "taskid",
        },
        {
          type: "input",
          label: "内容",
          key: "content",
        },
        {
          type: "daterange",
          label: "日期",
          key: ["", "startTime", "endTime"],
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "内容",
          key: "routeIds",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "数量",
          key: "routeIds",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "手机数量",
          key: "routeIds",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },

        {
          type: "input",
          label: "发送条数",
          key: "routeIds",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "成功条数",
          key: "routeIds",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "失败条数",
          key: "routeIds",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "未知条数",
          key: "routeIds",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },

        // {
        //   type: "textarea",
        //   label: "返回错误说明",
        //   key: "notes",
        //   defaultValue: "",
        // },
      ],
      bId: "",
      GatewayList: [], // 通道列表
      ProvinceList: [], // 通道列表
    };
  },
  mounted() {},
  computed: {},
  methods: {
    selectChange(data) {},
    // 修改搜索参数
    _formatRequestData(data) {
      const { startTime, endTime } = data;
      if (startTime) {
        data.startTime = new Date(startTime).Format("yyyy-MM-dd");
      }
      if (endTime) {
        data.endTime = new Date(endTime).Format("yyyy-MM-dd");
      }
      return data;
    },
    _mxDeleteItem(rowKey) {
      const h = this.$createElement;
      this.$msgbox({
        title: "删除",
        message: h("div", null, [h("p", null, "您确定要删除此项吗？")]),
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then((action) => {
        this.$http.sysRouteReturnError
          .deleteTaskid({ taskid: rowKey })
          .then((res) => {
            if (resOk(res)) {
              this.$message.info("删除成功！");
              this._mxGetList();
            } else {
              this.$message.info("删除失败！");
            }
            console.log(res);
          });
      });
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.smsSendlogSubmit {
}
</style>
