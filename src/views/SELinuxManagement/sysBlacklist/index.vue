<template>
  <!--黑名单管理-->
  <div class="sysBlacklist">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
      :notSearch="notSearch"
    >
      <template slot="Other">
        <el-button type="primary" @click="bulkAdding">批量添加</el-button>
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号">
        <template slot-scope="{ row }">{{
          row.userId ? row.userId : ""
        }}</template>
      </el-table-column>
      <el-table-column prop="userName" label="账户名称" />

      <el-table-column prop="blackGroupName" label="黑名单类型">
        <!-- <template slot-scope="scope">
          <span>
            {{
              scope.row.blackType === "0"
                ? "系统级"
                : scope.row.blackType === "1"
                ? "通道级"
                : scope.row.blackType === "2"
                ? "用户级"
                : scope.row.blackType === "3"
                ? "营销级"
                : "BSATS级"
            }}
          </span>
        </template> -->
      </el-table-column>
      <el-table-column prop="mobile" label="手机号码" />
      <!-- <el-table-column prop="gateway" label="通道"  /> -->

      <el-table-column prop="modifyTime" label="添加日期">
        <template slot-scope="{row}">
          <span>{{ row.modifyTime ? row.modifyTime : row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="描述" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">{{
          scope.row.status === "1" ? "正常" : "正常"
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('blackId', scope.row.blackId)"
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
        @selectChange="selectChange"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
    <!-- 批量添加 -->
    <el-dialog
      title="批量添加"
      :visible.sync="bulkEditingVisible"
      :close-on-click-modal="false"
      top="45px"
    >
      <div
        v-loading="visibleLoading"
        element-loading-text="提交成功，正在分析文件~"
      >
        <FormItem
          ref="editFormItem"
          :formConfig="editFormConfig"
          btnTxt="确定"
          @submit="submitBulkEdit"
          @cancel="cancel"
          @selectChange="selectChangeAdd"
          @choose="choose"
          @handleSuccess="handleSuccess"
          @handleRemove="handleRemove"
          @handleExceed="handleExceed"
        ></FormItem>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorRemark = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_\d0-9a-zA-Z!@#$%^&*~]{0,300}$/;
      if (value == "") {
        callback();
        // callback(new Error("备注信息不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("支持汉字/数字/字母/标点符号"));
        } else {
          callback();
        }
      }
    };
    return {
      notSearch: true,
      formTit: "新增",
      addChannel: false,
      bulkEditingVisible: false,
      //接口地址
      searchAPI: {
        namespace: "sysBlacklist",
        list: "listBlacklistByPage",
        detele: "deleteSysBlackList"
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
          placeholder: "请输入黑名单号码"
        },
        {
          type: "select",
          label: "黑名单类型",
          key: "blackType",
          placeholder: "请选择黑名单类型",
          optionData: [
            // {
            //   key: "0",
            //   value: "系统级"
            // },
            // // {
            // //   key: "1",
            // //   value: "通道级",
            // // },
            // {
            //   key: "2",
            //   value: "用户级"
            // },
            // {
            //   key: "3",
            //   value: "营销级"
            // },
            // {
            //   key: "4",
            //   value: "BSATS级"
            // }
          ]
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          disabled: false,
          defaultValue: "",
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: this.$isPhone
            }
          ]
        },
        {
          type: "select",
          label: "黑名单类型",
          key: "blackType",
          disabled: false,
          defaultValue: "",
          optionData: [
            // {
            //   key: "0",
            //   value: "系统级"
            // },
            // // {
            // //   key: "1",
            // //   value: "通道级"
            // // },
            // {
            //   key: "2",
            //   value: "用户级"
            // },
            // {
            //   key: "3",
            //   value: "营销级"
            // },
            // {
            //   key: "4",
            //   value: "BSATS级"
            // }
          ],
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
          label: "通道编号",
          key: "gateway",
          isShow: true,
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
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          isShow: true,
          optionData: [],
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
          disabled: true,
          isShow: true,
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "描述",
          key: "remark",
          maxlength: 300,
          placeholder: "备注信息不能超过300字"
          // rules: [{ trigger: ['blur', 'change'], validator: validatorRemark }]
        }
      ],
      blackId: "",
      isChooseUser: false,
      //批量添加表单配置
      //批量修改
      editFormConfig: [
        {
          type: "uploadXlsx",
          label: "导入文件",
          key: "filePath",
          accept: ["xls", "xlsx", "txt"],
          defaultValue: "",
          size: 20,
          tip: "文件大小<200M，支持xls/xlsx/txt文档，每行一个手机号码",
          defaultFileList: [],
          rules: [
            {
              required: true,
              message: "请上传文件",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "所属组",
          key: "blackType",
          disabled: false,
          defaultValue: 1,
          initDefaultValue: 1,
          optionData: [],
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
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          isShow: true,
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          maxlength: 300,
          placeholder: "备注信息不能超过300字"
          // rules: [{ trigger: ['blur', 'change'], validator: validatorRemark }]
        }
      ],
      origin: window.location.origin,
      visibleLoading: false
    };
  },
  mounted() {
    this.getBlackFroup();
  },
  activated() {
    this.getBlackFroup();
  },
  methods: {
    //文件上传成功
    handleSuccess({ response, file, fileList, item }) {
      if (response.code == 200) {
        const { accept, size, key } = item;
        let fileType = file.raw.name.split(".")[1];
        let fileSize = file.size;
        let isLt1M = size ? size * 1024 * 1024 : 1 * 1024 * 1024;
        if (accept && accept.lenght != 0) {
          if (!accept.includes(fileType) || fileSize > isLt1M) {
            this.$message.error(
              "文件大小<200M，支持xls/xlsx/txt文档，每行一个手机号码"
            );
            this.editFormConfig.forEach(item => {
              if (item.key === key) {
                item.defaultValue = "";
                item.defaultFileList = [];
              }
            });
            return false;
          }
        }
        this.editFormConfig.forEach(item => {
          if (item.key === key) {
            item.defaultValue = response.data;
            item.defaultFileList = [response.data];
          }
        });
      } else {
        this.$message.error(response.data);
      }
    },
    handleRemove({ file, fileList, item }) {
      const { key } = item;
      this.editFormConfig.forEach(item => {
        if (item.key === key) {
          this.$nextTick(() => {
            item.defaultValue = "";
            item.defaultFileList = [];
          });
        }
      });
    },
    handleExceed({ file, fileList }) {
      this.$message.error("仅允许上传一个文件！");
    },

    //批量添加根据select显示不同表单项
    selectChangeAdd({ val, item }) {
      const { key } = item;
      if (key === "blackType") {
        if (val == "2") {
          this._setDisplayShow(this.editFormConfig, "userId", false);
        } else {
          this._setDisplayShow(this.editFormConfig, "userId", true);
        }
      }
    },
    //点击批量添加
    bulkAdding() {
      this.bulkEditingVisible = true;
      this._setDisplayShow(this.editFormConfig, "userId", true);
      setTimeout(() => {
        this.editFormConfig.forEach(item => {
          if (item.key === "filePath") {
            item.defaultValue = "";
            item.defaultFileList = [];
          }
        });
        this.$refs.editFormItem.resetForm();
      }, 0);
    },
    //批量添加提交
    submitBulkEdit(form) {
      this.visibleLoading = true;
      this.$http.sysBlacklist
        .importBatchAddBlacklist({ data: { ...form } })
        .then(res => {
          this.visibleLoading = false;
          if (resOk(res)) {
            this.$confirm(`${res.msg}`, "添加记录", {
              confirmButtonText: "确定",
              center: true,
              showCancelButton: false,
              customClass: "confirm",
              top: "30px"
            }).then(() => {
              this._mxGetList();
            });
            // this.$message.success(res.msg || res.data);

            this.bulkEditingVisible = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
    },
    //获取黑名单
    getBlackFroup() {
      this.$http.smsBlackGroup.listBlackGroup().then(res => {
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "blackType",
          "groupId",
          "blackGroupName"
        );
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "blackType",
          "groupId",
          "blackGroupName"
        );
        this._setDefaultValue(
          this.editFormConfig,
          res.data,
          "blackType",
          "groupId",
          "blackGroupName"
        );
      });
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          this.$set(t, "defaultValue", data.userId);
        }
        if (key === "corporateId") {
          this.$set(t, "defaultValue", data.corpId);
        }
      });
      this.editFormConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          this.$set(t, "defaultValue", data.userId);
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
        if (val == 2) {
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
      form = this._mxArrangeSubmitData(form);
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysBlacklist.addSysBlackList(params).then(res => {
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
            ...form
          }
        };
        this.$http.sysBlacklist.updateSysBlackList(params).then(res => {
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
      this.formConfig.forEach(item => {
        if (item.key === "blackType") {
          this.$set(item, "disabled", false);
        }
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
        if (item.key === "mobile") {
          this.$set(item, "disabled", false);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      row.blackType = row.groupId;
      const { blackId, blackType } = row;
      this.blackId = blackId;
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
      this.formConfig.forEach(item => {
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "mobile") {
          this.$set(item, "disabled", true);
        }
        if (item.key === "blackType") {
          this.$set(item, "disabled", true);
        }
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
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
      this.bulkEditingVisible = false;
    },
    //修改表格数据
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.modifyTime) {
          item.modifyTime = new Date(item.modifyTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
        if (item.createTime) {
          item.createTime = new Date(item.createTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      if (formData.blackType != 2) {
        formData.userId = "";
        formData.corporateId = "";
      }
      return formData;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
