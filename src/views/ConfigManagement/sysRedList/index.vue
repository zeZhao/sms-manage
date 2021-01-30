<template>
  <!--红名单管理-->
  <div class="sysRedList">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="codeType" label="账号类型">
        <template slot-scope="scope">
          <span>{{ scope.row.codeType === 1 ? "用户" : "特服号" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row, 'redId')" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('redId', scope.row.redId)"
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
        @cancel="cancel"
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
      //接口地址
      searchAPI: {
        namespace: "sysRedList",
        list: "listRedListByPage",
        detele: "deleteSysRedList"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "红名单号码",
          key: "mobile",
          placeholder: "请输入红名单号码"
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: "用户id",
          key: "userId",
          placeholder: "请输入用户id"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "账号类型",
          initDefaultValue: 1,
          defaultValue: 1,
          key: "codeType",
          optionData: [
            {
              key: 1,
              value: "用户"
            },
            {
              key: 2,
              value: "特服号"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
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
          type: "input",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
              message: "手机号格式不对",
              trigger: "blur"
            }
          ]
        },
        {
          type: "select",
          label: "优化类型",
          initDefaultValue: 1,
          defaultValue: 1,
          key: "type",
          optionData: [
            {
              key: 1,
              value: "不优化"
            },
            {
              key: 2,
              value: "特定通道"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "通道编号",
          key: "gateway",
          optionData: [],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        }
      ],
      redId: "",
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
    gateway() {
      const params = {
        data: {
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;

          if (key === "gateway") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corporateId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
      });
    },
    edit(row) {
      this.redId = row.redId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "userId") {
          item.btnDisabled = true;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },

    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysRedList.addSysRedList(params).then(res => {
          if (resOk(res)) {
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
            redId: this.redId,
            ...form
          }
        };
        this.$http.sysRedList.updateSysRedList(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          item.btnDisabled = false;
        }
      });
    },
    cancel() {
      this.addChannel = false;
    },
    //修改表格数据
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.createTime) {
          item.createTime = new Date(item.createTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysRedList {
}
</style>
