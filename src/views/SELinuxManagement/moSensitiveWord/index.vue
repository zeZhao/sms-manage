<template>
  <!--上行敏感词-->
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="_mxCreate"></Search>
    <el-table :data="listData" max-height="500" highlight-current-row style="width: 100%" v-loading="loading">
      <el-table-column prop="keyword" label="敏感词" />
      <el-table-column prop="createUserStr" label="创建人" />
      <el-table-column prop="createdAt" label="创建时间" min-width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createdAt | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'id')" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('id', scope.row.id, false, false, '您确定要删除该条上行敏感词吗？')" type="text"
            size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="_mxHandleSubmit" @cancel="_mxCancel"
        @choose="choose"></FormItem>
    </el-dialog>
    <ChooseUser :isChooseUser="isChooseUser" @chooseUserData="chooseUserData" @cancel="cancelUser"></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data () {
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "moKeyword",
        list: "queryByPage",
        add: "addOrUpdate",
        edit: "addOrUpdate",
        detele: "delete"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "敏感词",
          key: "keyword"
        }
      ],
      // 表单配置
      formConfig: [
        // {
        //   type: "input",
        //   label: "账户编号",
        //   key: "userId",
        //   btnTxt: "选择用户",
        //   btnDisabled: false,
        //   disabled: true,
        //   defaultValue: "",
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        // {
        //   type: "input",
        //   label: "商户编号",
        //   key: "corpId",
        //   defaultValue: "",
        //   isShow: true,
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        {
          type: "input",
          label: "敏感词",
          key: "keyword",
          defaultValue: "",
          maxlength: 8,
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        }
      ],
      id: "",
      isParamsNotData: false,
      submitParamsIsData: false,
      isChooseUser: false
    };
  },
  methods: {
    //选择用户选取赋值
    chooseUserData (data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
        // if (key === "code") {
        //   t.defaultValue = data.code;
        // }
      });
    }
  }
};
</script>