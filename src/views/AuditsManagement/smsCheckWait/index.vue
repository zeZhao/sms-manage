<template>
  <!--待审-->
  <div class="smsCheckWait">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    >
      <template slot="Other">
        <!-- <el-button type="primary" @click="_mxCreate">超审</el-button> -->
        <el-button type="primary" @click="addCheck">增加分配</el-button>
        <el-button type="primary" @click="stopCheck">停止分配</el-button>
      </template>
    </Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" show-overflow-tooltip />
      <el-table-column prop="source" label="审核根源">
        <template slot-scope="scope">
          <span>{{
            scope.row.gatewayType === 1
              ? "路由信息错"
              : scope.row.gatewayType === 2
              ? "关键字"
              : scope.row.gatewayType === 3
              ? "模板不匹配"
              : scope.row.gatewayType === 5
              ? "数量超标"
              : scope.row.gatewayType === 6
              ? "组合redis出错"
              : "组合超时"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cm" label="移动通道" />
      <el-table-column prop="cu" label="联通通道" />
      <el-table-column prop="ct" label="电信通道" />
      <el-table-column prop="submitTime" label="提交时间">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="supperCheck(scope.row)"
            >超审</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
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
      formTit: "超审",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "smsCheckWait",
        list: "listCheckWaitByPage",
        detele: "",
        add: "",
        edit: "",
      },
      // 列表参数
      namespace: "checkWait",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号",
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容",
        },
        {
          type: "select",
          label: "审核根源",
          key: "source",
          optionData: [
            {
              key: "1",
              value: "路由信息错",
            },
            {
              key: "2",
              value: "关键字",
            },
            {
              key: "3",
              value: "模板不匹配",
            },
            {
              key: "5",
              value: "数量超标",
            },
            {
              key: "6",
              value: "组合redis错",
            },
            {
              key: "7",
              value: "组合超时",
            },
          ],
          placeholder: "请选择类型",
        },
        {
          type: "date",
          label: "提交时间",
          key: "submitTime",
          placeholder: "请选择提交时间",
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "审核内容",
          key: "content",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "移动通道",
          key: "cm",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "联通通道",
          key: "cu",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "电信通道",
          key: "ct",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "radio",
          label: "审核状态",
          key: "checkStatus",
          initDefaultValue: "2",
          defaultValue: "",
          optionData: [
            {
              key: "2",
              value: "通过",
            },
            {
              key: "3",
              value: "拒绝",
            },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
      ],
    };
  },
  mounted() {},
  computed: {},
  methods: {
    supperCheck(row) {
      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    submit(form) {
      this.$http.smsCheckWait.supperCheck({ data: { ...form } }).then((res) => {
        this._mxSuccess(res);
      });
    },
    addCheck() {
      this.$http.smsCheckWait.addCheck().then((res) => {
        if (resOk(res)) {
          this.$message.success("请求成功");
        }
      });
    },
    stopCheck() {
      this.$http.smsCheckWait.stopCheck().then((res) => {
        if (resOk(res)) {
          this.$message.success("请求成功");
        }
      });
    },
    selectChange(data) {},
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.smsCheckWait {
}
</style>
