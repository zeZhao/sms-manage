<template>
  <!--黑名单管理-->
  <div class="sysBlacklist">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="mobile" label="手机号码" />
      <el-table-column prop="blackType" label="黑名单类型">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.blackType === "0"
            ? "系统级"
            : scope.row.blackType === "1"
            ? "网关级"
            : scope.row.blackType === "2"
            ? "用户级"
            : scope.row.blackType === "3"
            ? "营销级"
            : "BSATS级"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="modifyTime" label="修改日期" />
      <el-table-column prop="remark" label="描述" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>
            {{
            scope.row.status === "1"
            ? "正常": "禁用"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('blackId', scope.row.blackId)"
            type="text"
            size="small"
          >删除</el-button>
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
        @submit="submit"
        @cancel="cancel"
        @selectChange="selectChange"
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
        namespace: "sysBlacklist",
        list: "listBlacklistByPage",
        detele: "deleteSysBlackList",
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "黑名单号码",
          key: "mobile",
          placeholder: "请输入黑名单号码",
        },
        {
          type: "select",
          label: "黑名单类型",
          key: "blackType",
          placeholder: "请选择黑名单类型",
          optionData: [
            {
              key: "0",
              value: "系统级",
            },
            // {
            //   key: "1",
            //   value: "网关级",
            // },
            {
              key: "2",
              value: "用户级",
            },
            {
              key: "3",
              value: "营销级",
            },
            {
              key: "4",
              value: "BSATS级",
            },
          ],
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID",
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称",
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([0-9]{3,4}\-)?[0-9]{7,8}$|^0?1[3|4|5|7|8|9][0-9]\d{8}$/,
              message: "手机号格式不对",
              trigger: "blur",
            },
          ],
        },
        {
          type: "select",
          label: "黑名单类型",
          key: "blackType",
          defaultValue: "",
          optionData: [
            {
              key: "0",
              value: "系统级",
            },
            // {
            //   key: "1",
            //   value: "网关级"
            // },
            {
              key: "2",
              value: "用户级",
            },
            {
              key: "3",
              value: "营销级",
            },
            {
              key: "4",
              value: "BSATS级",
            },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          isShow: true,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          isShow: true,
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          disabled: true,
          isShow: true,
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "textarea",
          label: "描述",
          key: "remark",
          maxlength: 300,
          placeholder: "备注信息不能超过300字",
        },
      ],
      blackId: "",
      isChooseUser: false,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map((t) => {
        const { key } = t;
        if (key === "userId") {
          this.$set(t, "defaultValue", data.userId);
        }
        if (key === "corporateId") {
          this.$set(t, "defaultValue", data.corpId);
        }
      });
    },
    selectChange(data) {
      const { val, item } = data;
      if (item.key === "blackType") {
        item.defaultValue = val;
        // if (val === "1") {
        //   this._setDisplayShow(this.formConfig, "gateway", false);
        //   this._setDisplayShow(this.formConfig, "userId", true);
        // }
        if (val === "2") {
          this._setDisplayShow(this.formConfig, "userId", false);
          this._setDisplayShow(this.formConfig, "corporateId", false);
          this._setDisplayShow(this.formConfig, "gateway", true);
        } else {
          this._setDisplayShow(this.formConfig, "gateway", true);
          this._setDisplayShow(this.formConfig, "userId", true);
          this._setDisplayShow(this.formConfig, "corporateId", true);
        }
      }
    },

    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form,
          },
        };
        this.$http.sysBlacklist.addSysBlackList(params).then((res) => {
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
            blackId: this.blackId,
            ...form,
          },
        };
        this.$http.sysBlacklist.updateSysBlackList(params).then((res) => {
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
      this._setDisplayShow(this.formConfig, "gateway", true);
      this._setDisplayShow(this.formConfig, "userId", true);
      this._setDisplayShow(this.formConfig, "corporateId", true);
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      const { blackId, blackType } = row;
      this.blackId = blackId;
      console.log(blackType);
      if (blackType === "1") {
        this._setDisplayShow(this.formConfig, "gateway", false);
        this._setDisplayShow(this.formConfig, "userId", true);
        this._setDisplayShow(this.formConfig, "corporateId", true);
      } else if (blackType === "2") {
        this._setDisplayShow(this.formConfig, "gateway", true);
        this._setDisplayShow(this.formConfig, "userId", false);
        this._setDisplayShow(this.formConfig, "corporateId", false);
      } else {
        this._setDisplayShow(this.formConfig, "gateway", true);
        this._setDisplayShow(this.formConfig, "userId", true);
        this._setDisplayShow(this.formConfig, "corporateId", true);
      }
      this.formTit = "修改";
      this.formConfig.forEach((item) => {
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
          if (blackType === "2" && item.key === "blackType") {
            this.$set(item, "disabled", true);
          }
          if (blackType === "2" && item.key === "userId") {
            this.$set(item, "btnDisabled", true);
          }
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    },
    //修改表格数据
    _mxFormListData(data) {
      data.forEach((item) => {
        if (item.modifyTime) {
          item.modifyTime = new Date(item.modifyTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
</style>
