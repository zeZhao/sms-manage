<template>
  <!--接口加强签名-->
  <div class="sysInterfaceSign">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="_mxCreate"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="businessType" label="类型">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.businessType == 1
            ? "特服号"
            : scope.row.businessType == 2
            ? "客户ID"
            : "企业ID"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="sign" label="签名" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'signId')" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('signId', scope.row.signId)" type="text" size="small">删除</el-button>
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
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser :isChooseUser="isChooseUser" @chooseUserData="chooseUserData" @cancel="cancelUser"></ChooseUser>
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
      //接口地址
      searchAPI: {
        namespace: "sysInterfaceSign",
        list: "listInterfaceSignByPage",
        detele: "deleteInterfaceSign",
        add: "addInterfaceSign",
        edit: "updateInterfaceSign"
      },
      // 列表参数
      namespace: "sysInterfaceSign",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户特服号",
          key: "code",
          placeholder: "请输入用户特服号"
        },
        {
          type: "input",
          label: "签名",
          key: "sign",
          placeholder: "请输入电签名"
        },
        {
          type: "select",
          label: "类型",
          key: "businessType",
          optionData: [
            { key: "1", value: "特服号" },
            { key: "2", value: "客户ID" },
            { key: "3", value: "企业ID" }
          ],
          placeholder: "类型"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "企业ID",
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
          key: "businessType",
          optionData: [
            { key: 1, value: "特服号" },
            { key: 2, value: "客户ID" },
            { key: 3, value: "企业ID" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "签名",
          key: "sign",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
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
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
</style>
