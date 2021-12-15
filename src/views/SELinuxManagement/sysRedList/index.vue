<template>
  <!--红名单管理-->
  <div class="sysRedList">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    >
      <template slot="Other">
        <el-button type="primary" size="small" @click="batchUpdate"
          >批量修改</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <!-- <el-table-column prop="codeType" label="账号类型">
        <template slot-scope="scope">
          <span>{{ scope.row.codeType === 1 ? "用户" : "特服号" }}</span>
        </template>
      </el-table-column> -->
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
        @onChange="onChange"
        @handleSuccess="handleSuccess"
        @handleRemove="handleRemove"
      ></FormItem>
    </el-dialog> -->
    <ChooseUser
      ref="ChooseUser"
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
      :isMultiple="batchUpdateFlag"
      @selectArr="selectArr"
    >
      <template>
        <div slot="btnOther" style="float: right; margin-bottom: 10px">
          <el-button
            style="border-color: #0964FF"
            @click="chooseSomeUser"
            size="small"
            >选择</el-button
          >
        </div>
      </template>
    </ChooseUser>

    <!-- 批量修改通道弹窗 -->
    <el-dialog
      title="批量修改通道"
      :visible.sync="batchUpdateFlag"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="50%"
      top="120px"
    >
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        label-width="90px"
        style="width: 60%; margin: auto"
      >
        <el-form-item label="账户编号：">
          <el-input
            v-model="ruleForm.userIdStr"
            placeholder="请选择账户编号"
            disabled
            style="width: 70%"
          ></el-input>
          <el-button style="border-color: #0964FF" @click="choose" size="small"
            >选择用户</el-button
          >
        </el-form-item>
        <p
          style="font-size: 12px; color: #999; line-height: 1.5; margin-left: 90px"
        >
          账户编号选填，未选择时改变所有账户的原通道，请确认后再修改
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="原通道：">
              <el-select
                v-model="ruleForm.gateway"
                placeholder="原通道"
                clearable
              >
                <el-option
                  v-for="item in GatewayList"
                  :key="item.gateway"
                  :label="item.gateway"
                  :value="item.gateway"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="改为">
              <el-select
                v-model="ruleForm.afterGateway"
                placeholder="请修改"
                clearable
              >
                <el-option
                  v-for="item in GatewayList"
                  :key="item.gateway"
                  :label="item.gateway"
                  :value="item.gateway"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div v-if="errorTips" class="errTpis">{{ errorTips }}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="batchUpdateFlag = false"
          >取消</el-button
        >
        <el-button
          size="small"
          type="primary"
          v-throttle
          @click="handleBatchUpdate"
          >确定</el-button
        >
      </div>
    </el-dialog>
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
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        }
      ],
      // 表单配置
      formConfig: [
        // {
        //   type: "select",
        //   label: "账号类型",
        //   initDefaultValue: 1,
        //   defaultValue: 1,
        //   key: "codeType",
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "用户"
        //     },
        //     {
        //       key: 2,
        //       value: "特服号"
        //     }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
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
        {
          type: "input",
          label: "特服号",
          key: "code",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
          placeholder: "选择账户后自动识别"
        },
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
          action: "/api/sysPrepaidCard/uploadFileUnify",
          isShow: false,
          btnTxt: "导入",
          limit: 1,
          defaultValue: "",
          defaultFileList: [],
          tip: "支持txt、xls、xlsx文件，每行一个手机号",
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
        },
        // {
        //   type: "select",
        //   label: "优化类型",
        //   initDefaultValue: 2,
        //   defaultValue: 2,
        //   key: "type",
        //   optionData: [
        //     // {
        //     //   key: 1,
        //     //   value: "不优化"
        //     // },
        //     {
        //       key: 2,
        //       value: "特定通道"
        //     }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
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
      isChooseUser: false,
      GatewayList: [],
      batchUpdateFlag: false,
      ruleForm: {},
      errorTips: "" //错误提示
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
    handleBatchUpdate() {
      const { gateway, afterGateway } = this.ruleForm;
      if (!gateway && !afterGateway) {
        this.errorTips = "请至少选择一组通道改变";
        return;
      }
      if (gateway && !afterGateway) {
        this.errorTips = "请选择 “改后通道编号”";
        return;
      }
      if (!gateway && afterGateway) {
        this.errorTips = "请选择 “改前通道编号”";
        return;
      }
      this.errorTips = "";
      this.$http.sysRedList.updateBatchSysRedList(this.ruleForm).then(res => {
        if (res.code === 200) {
          this.batchUpdateFlag = false;
          this._mxGetList();
          this.$message.success("批量修改成功");
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    selectArr(arr) {
      const str = arr.reduce((pre, cur) => pre + cur.userId + ",", "");
      this.ruleForm.userIdStr = str.substring(0, str.length - 1);
    },
    chooseSomeUser() {
      this.$refs.ChooseUser.renderSelectArr();
    },
    //批量修改通道
    batchUpdate() {
      this.ruleForm = {};
      this.errorTips = "";
      this.batchUpdateFlag = true;
    },
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
          const { key } = item;
          if (key === "gateway") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              item.optionData.push(t);
            });
          }
        });
        // this.searchFormConfig.forEach(item => {
        //   const { key } = item;
        //   if (key === "gateway") {
        //     res.data.forEach(t => {
        //       this.$set(t, "key", t.gatewayId);
        //       this.$set(t, "value", t.gateway);
        //       item.optionData.push(t);
        //     });
        //   }
        // });
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
    edit(row, ID) {
      // this.$router.push({
      //   name: "sysRedListType",
      //   query: { type: "update", row: JSON.stringify(row), ID }
      // });
      this.redId = row.redId;
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
        if (item.key === "userId") {
          item.btnDisabled = true;
        }
        if (item.key === "mobile") {
          item.rules = [
            { required: true, validator: isPhone, trigger: "blur" }
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
      // this.$router.push({ name: "sysRedListType", query: { type: "create" } });
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
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
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
      });
      return data;
    }
  }
};
</script>

<style lang="scss" scoped>
.sysRedList {
}
.errTpis {
  color: red;
  position: relative;
  left: 10%;
}
</style>
