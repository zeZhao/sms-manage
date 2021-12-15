<template>
  <!--白名单管理-->
  <div class="sysWhitelist">
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
      height="50vh"
      v-loading="loading"
    >
      <!-- <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? "用户" : "通道" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <!-- <el-table-column prop="modifyUser" label="修改人" />
      <el-table-column prop="modifyTime" label="修改时间">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column> -->
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('whiteId', scope.row.whiteId)"
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
        @choose="choose"
        @selectChange="selectChange"
        @onChange="onChange"
        @handleSuccess="handleSuccess"
        @handleRemove="handleRemove"
      ></FormItem>
    </el-drawer>

    <!-- <el-dialog
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
        @selectChange="selectChange"
        @onChange="onChange"
        @handleSuccess="handleSuccess"
        @handleRemove="handleRemove"
      ></FormItem>
    </el-dialog> -->
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import { isPhone } from "@/utils/validator";
export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysWhitelist",
        list: "listWhitelistByPage",
        detele: "deleteSysWhiteList"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
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
          type: "inputNum",
          label: "手机号",
          key: "mobile"
        }
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "type",
        //   placeholder: "请选择类型",
        //   optionData: [
        //     {
        //       key: "1",
        //       value: "用户"
        //     }
        //     // {
        //     //   key: "2",
        //     //   value: "通道"
        //     // }
        //   ]
        // }
      ],
      // 表单配置
      formConfig: [
        // {
        //   type: "select",
        //   label: "类型",
        //   key: "type",
        //   initDefaultValue: 1,
        //   defaultValue: 1,
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "用户"
        //     }
        //     // {
        //     //   key: 2,
        //     //   value: "通道",
        //     // },
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        // {
        //   type: "select",
        //   label: "通道编号",
        //   key: "userId",
        //   isShow: true,
        //   defaultValue: "",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        {
          type: "textarea",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          maxlength: "100",
          placeholder: "可输入多个手机号，用英文“,”隔开",
          rules: [
            {
              required: true,
              message: "请添加手机号或者上传手机号文件",
              trigger: "blur"
            },
            {
              validator: this.$publicValidators.phone[0]["validator"],
              trigger: "change"
            }
          ]
        },
        {
          type: "uploadXlsx",
          key: "mobileFileUrl",
          label: "上传手机号文件",
          btnTxt: "批量添加",
          limit: 1,
          defaultValue: "",
          defaultFileList: [],
          tip: "支持txt、xls、xlsx文件，每行一个手机号",
          isShow: false,
          accept: [
            "text/plain",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ],
          rules: [
            {
              required: true,
              message: "请上传手机号文件或者添加手机号",
              trigger: ["blur", "change"]
            }
          ]
        }
      ],
      whiteId: "",
      GatewayList: [], //通道列表
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway();
  },
  activated() {
    //重新获取数据
    this._mxGetList();
  },
  methods: {
    onChange({ val, item }) {
      if (item.key === "mobile") {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === "mobileFileUrl");
        arr[i].rules = val
          ? null
          : [
              {
                required: true,
                message: "请上传手机号文件或者添加手机号",
                trigger: ["blur", "change"]
              }
            ];
        !arr[i].rules &&
          this.$refs.formItem.clearValidateMore(["mobileFileUrl"]);
      }
    },
    handleSuccess({ response, file, fileList, item }) {
      if (response.code !== 200) {
        this.$message.error(response.data || response.msg);
        return;
      }
      const { accept, tip, key } = item;
      const { type } = file.raw;
      if (Array.isArray(accept) && accept.length) {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === key);
        if (accept.indexOf(type) === -1) {
          this.$message.error(tip);
          arr[i].defaultValue = "";
          arr[i].defaultFileList = [];
          return;
        }
        arr[i].defaultValue = response.data;

        const delRuleIdx = arr.findIndex(v => v.key === "mobile");
        arr[delRuleIdx].rules = null;
        this.$refs.formItem.clearValidateMore(["mobile", "mobileFileUrl"]);
      }
    },
    handleRemove({ file, fileList }) {
      const arr = this.formConfig;
      const i = arr.findIndex(v => v.key === "mobileFileUrl");
      arr[i].defaultValue = "";
      arr[i].defaultFileList = [];

      const addRuleIdx = arr.findIndex(v => v.key === "mobile");
      arr[addRuleIdx].rules = [
        {
          required: true,
          message: "请添加手机号或者上传手机号文件",
          trigger: "blur"
        },
        {
          validator: this.$publicValidators.phone[0]["validator"],
          trigger: "change"
        }
      ];
    },
    //选择控制
    selectChange({ val, item }) {
      if (item.key === "type") {
        if (val === 2) {
          this._setLabelDisplayShow(this.formConfig, "通道编号", false);
          this._setLabelDisplayShow(this.formConfig, "账户编号", true);
        } else {
          this._setLabelDisplayShow(this.formConfig, "通道编号", true);
          this._setLabelDisplayShow(this.formConfig, "账户编号", false);
        }
      }
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
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysWhitelist.addSysWhiteList(params).then(res => {
          if (resOk(res)) {
            this.$alert(res.msg, "导入记录", {
              confirmButtonText: "确定",
              callback: action => {}
            }).catch(() => {});
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          data: {
            whiteId: this.whiteId,
            ...form
          }
        };
        this.$http.sysWhitelist.updateSysWhiteList(params).then(res => {
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
      // this.$router.push({
      //   name: "sysWhitelistType",
      //   query: { type: "create" }
      // });
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          item.btnDisabled = false;
        }
        if (item.key === "mobile") {
          item.rules = [
            {
              required: true,
              message: "请添加手机号或者上传手机号文件",
              trigger: "blur"
            },
            {
              validator: this.$publicValidators.phone[0]["validator"],
              trigger: "change"
            }
          ];
        }
        if (item.key === "mobileFileUrl") {
          item.defaultValue = "";
          item.defaultFileList = [];
          item.isShow = false;
          item.rules = [
            {
              required: true,
              message: "请上传手机号文件或者添加手机号",
              trigger: ["blur", "change"]
            }
          ];
        }
      });
      this._setLabelDisplayShow(this.formConfig, "通道编号", true);
      this._setLabelDisplayShow(this.formConfig, "账户编号", false);
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row, ID) {
      // this.$router.push({
      //   name: "sysWhitelistType",
      //   query: { type: "update", row: JSON.stringify(row), ID }
      // });
      this.whiteId = row.whiteId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "type") {
          if (item.defaultValue === 2) {
            this._setLabelDisplayShow(this.formConfig, "通道编号", false);
            this._setLabelDisplayShow(this.formConfig, "账户编号", true);
          } else {
            this._setLabelDisplayShow(this.formConfig, "通道编号", true);
            this._setLabelDisplayShow(this.formConfig, "账户编号", false);
          }
        }
        if (item.key === "userId") {
          item.btnDisabled = true;
        }
        if (item.key === "mobile") {
          item.rules = [
            { required: true, validator: isPhone, trigger: "change" }
          ];
        }
        if (item.key === "mobileFileUrl") {
          item.isShow = true;
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
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
        if (item.modifyTime) {
          item.modifyTime = new Date(item.modifyTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    },
    //获取通道
    gateway() {
      const params = {
        data: {
          serverStatus: 1,
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { label } = item;

          if (label === "通道编号") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              item.optionData.push(t);
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.sysWhitelist {
}
</style>
