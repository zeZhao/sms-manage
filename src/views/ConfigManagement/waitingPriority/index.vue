<template>
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" max-height="500" highlight-current-row style="width: 100%" v-loading="loading">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="priority" label="优先级" />
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" min-width="150">
        <template slot-scope="scope">{{ scope.row.createTime | timeFormat }}</template>
      </el-table-column>
      <el-table-column prop="modifyUser" label="修改人" />
      <el-table-column prop="modifyTime" label="修改时间" min-width="150">
        <template slot-scope="scope">{{ scope.row.modifyTime | timeFormat }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="deleteItem(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
    <el-dialog :title="formTit" :visible.sync="addChannel" :close-on-click-modal="false" top="45px">
      <FormItem ref="formItem" :formConfig="formConfig" :btnTxt="formTit" @submit="submit" @cancel="cancel"
        @choose="choose">
      </FormItem>
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
        namespace: "priority",
        list: "queryPriority",
        detele: "deletePriority"
      },
      // 列表参数
      namespace: "priorityDataVo",
      //搜索框数据
      searchParam: {
        userId: ""
      },
      //筛选不加data对象
      isParamsNotData: true,
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corpId"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "select",
          label: "优先级",
          key: "priority",
          optionData: [
            { key: 1, value: 1 },
            { key: 2, value: 2 },
            { key: 3, value: 3 },
            { key: 4, value: 4 },
            { key: 5, value: 5 },
            { key: 6, value: 6 },
            { key: 7, value: 7 },
            { key: 8, value: 8 },
            { key: 9, value: 9 }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ['blur', 'change']
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "select",
          label: "优先级",
          key: "priority",
          initDefaultValue: "",
          defaultValue: "",
          optionData: [
            { key: 1, value: 1 },
            { key: 2, value: 2 },
            { key: 3, value: 3 },
            { key: 4, value: 4 },
            { key: 5, value: 5 },
            { key: 6, value: 6 },
            { key: 7, value: 7 },
            { key: 8, value: 8 },
            { key: 9, value: 9 }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        }
      ],
      id: "",
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
        if (key === "userName") {
          t.defaultValue = data.userName;
        }
      })
    },
    submit (form) {
      let params = {};
      if (this.formTit == "新增") {
        params = { data: { priorityDataVo: { ...form } } };
        this.$http.priority.addPriority(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = { data: { priorityDataVo: { id: this.id, ...form } } };
        this.$http.priority.updatePriority(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }
    },
    create () {
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit (row) {
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
          if (item.key === "userId") {
            this.$set(item, "btnDisabled", true);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
    },
    deleteItem (id) {
      this.$confirm('您确定要删除该账户的待发优先级设置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = { data: { priorityDataVo: { id } } };
        this.$http.priority.deletePriority(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }).catch(() => { });
    },
    cancel () {
      this.addChannel = false;
    }
  }
}
</script>