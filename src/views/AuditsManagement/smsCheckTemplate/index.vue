<template>
  <!--模板审核-->
  <div class="smsCheckTemplate">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="code" label="特服号" />
      <!-- <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.type === "1"
              ? "特服号"
              : scope.row.type === "2"
              ? "账户编号"
              : "商户编号"
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="template" label="模板信息" />
      <el-table-column prop="createdAt" label="创建时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createdAt | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{
            scope.row.status === 1
              ? "待审核"
              : scope.row.status === 2
              ? "审核处理中"
              : scope.row.status === 4
              ? "审核通过"
              : "审核拒绝"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >修改</el-button
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
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
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
        namespace: "smsCheckTemplate",
        list: "listCheckTemplateByPage",
        detele: "",
        add: "",
        edit: "updateCheckTemplate"
      },
      // 列表参数
      namespace: "checkTemplate",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "select",
          label: "匹配类型",
          key: "matchType",
          optionData: [
            {
              key: "1",
              value: "正常发送"
            },
            {
              key: "2",
              value: "拦截"
            }
          ],
          placeholder: "请选择匹配类型"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          //   btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          initDefaultValue: "2",
          defaultValue: "2",
          optionData: [
            // {
            //   key: "1",
            //   value: "特服号"
            // },
            {
              key: "2",
              value: "账户编号"
            },
            {
              key: "3",
              value: "商户编号"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "审核状态",
          key: "status",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "待审核"
            },
            // {
            //   key: 2,
            //   value: "审核处理中",
            // },
            {
              key: 4,
              value: "审核通过"
            },
            {
              key: 5,
              value: "审核拒绝"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "模板信息",
          key: "template",
          maxlength: 500,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      bId: "",
      GatewayList: [], // 通道列表
      ProvinceList: [], // 通道列表
      isChooseUser: false
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
      });
    },
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      data.status = 1;
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsCheckTemplate {
}
</style>
