<template>
  <!--代理商信息管理-->
  <div class="smsCheckTemplate">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      :add="true"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="agentId" label="代理商编号" width="100" />
      <el-table-column prop="loginName" label="登录账号" />
      <el-table-column prop="agentName" label="代理商名称" width="100" />
      <el-table-column prop="contact" label="联系人" />
      <el-table-column prop="mobile" label="联系电话" width="100" />
      <el-table-column prop="saleName" label="销售" width="100" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1">正常</span>
          <span v-if="scope.row.status == 2">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime">{{
            scope.row.createTime | timeFormat
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作人" width="130" />
      <el-table-column prop="logo" label="logo" width="60">
        <template slot-scope="scope">
          <!-- <img :src="scope.row.logo" alt="" style="width: 50px; height: 50px" /> -->
          <el-image
            v-if="scope.row.logo && scope.row.logo !== '-'"
            style="width: 50px; height: 50px"
            :src="`${href}/${scope.row.logo}`"
            :preview-src-list="[scope.row.logo]"
          >
          </el-image>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status == 1"
            @click="handleStatus(2, scope.row.agentId)"
            type="text"
            size="small"
            >禁用</el-button
          >
          <el-button
            v-if="scope.row.status == 2"
            @click="handleStatus(1, scope.row.agentId)"
            type="text"
            size="small"
            >启用</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'agentId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('agentId', scope.row.agentId, false)"
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
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <span slot="title">
        {{formTit}}
        <i
          v-if="formTit === '修改' && !isCheck"
          class="el-icon-lock"
          style="font-size: 20px; color: #909399; margin-left: 5px"
          @click="isOpenDialog"
        ></i>
      </span>
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="
          form => {
            _mxHandleSubmit(form, '', false);
          }
        "
        @cancel="_mxCancel"
        @handleSuccess="handleSuccess"
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <el-dialog
      width="500px"
      :title="status == 1 ? '启用' : '禁用'"
      :close-on-click-modal="false"
      :visible.sync="statusVisible"
    >
      <div class="center">
        <i class="el-icon-warning-outline" style="font-size:40px"></i>
        <span v-if="status == 1"
          >您确定要启用代理商吗？启用后在创建用户的时候可以正常关联。</span
        >
        <span v-else
          >您确定要禁用代理商吗？禁用后在创建用户的时候将无法关联。</span
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus(1)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="登录"
      :visible.sync="loginVisible"
      :close-on-click-modal="false"
      width="30%"
      custom-class="loginDialog"
    >
      <el-form
        ref="loginForm"
        :model="formData"
        :rules="rules"
        label-width="70px"
        style="width: 80%; margin: auto"
      >
        <el-form-item label="手机号:" prop="account">
          <el-input
            v-model="formData.account"
            clearable
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="口令:" prop="pwd">
          <el-input
            v-model="formData.pwd"
            type="password"
            maxlength="6"
            clearable
            placeholder="请输入口令"
            @keyup.enter.native="notDisabled"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="notDisabled">确 定</el-button>
        <el-button @click="loginVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import {
  checkFixedPhoneOrPhone,
  password,
  character,
  character1
} from "@/utils/validator";
import { isPassword } from "@/utils";

export default {
  mixins: [listMixin],
  data() {
    // 固定电话座机或者手机号的正则
    const checkFixedPhoneOrPhone = (rule, value, callback) => {
      console.log(this.formTit, "-----this.formTit");
      const regFixedPhone = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
      const regPhone = /^1[3-9]\d{9}$/;
      if (this.formTit === "新增") {
        if (value == "") {
          callback(new Error("号码不能为空"));
        } else {
          if (regFixedPhone.test(value) || regPhone.test(value)) {
            callback();
          } else {
            callback(new Error("请输入正确的手机号码或座机号码"));
          }
        }
      } else {
        if (value.indexOf("*") === -1) {
          if (value) {
            if (regFixedPhone.test(value) || regPhone.test(value)) {
              callback();
            } else {
              callback(new Error("请输入正确的手机号码或座机号码"));
            }
          } else {
            callback(new Error("号码不能为空"));
          }
        } else {
          callback();
        }
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "agent",
        list: "queryByPage",
        detele: "delete",
        add: "addOrUpdate",
        edit: "addOrUpdate"
      },
      // 列表参数
      namespace: "agent",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "代理商编号",
          key: "agentId"
        },
        {
          type: "input",
          label: "代理商名称",
          key: "agentName"
        },
        {
          type: "input",
          label: "登录账号",
          key: "loginName"
        },
        {
          type: "input",
          label: "联系人",
          key: "contact"
        },
        {
          type: "input",
          label: "联系电话",
          key: "mobile"
        },
        {
          type: "select",
          label: "销售",
          key: "saleMan",
          optionData: []
        },
        {
          type: "select",
          label: "状态",
          key: "status",
          optionData: [
            {
              key: "1",
              value: "正常"
            },
            {
              key: "2",
              value: "禁用"
            }
          ],
          placeholder: "请选择匹配类型"
        }
      ],
      // 表单配置
      formConfig: [
        // {
        //   type: "input",
        //   label: "代理商编号",
        //   key: "agentId",
        //   //   btnTxt: "选择用户",
        //   // disabled: true,
        //   defaultValue: "",
        //   // change: this.selectUser,
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "input",
          label: "代理商名称",
          key: "agentName",
          // disabled: true,
          defaultValue: "",
          maxlength: 40,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: character, trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "登录账号",
          // disabled: true,
          key: "loginName",
          defaultValue: "",
          maxlength: 15,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: character1, trigger: "change" }
          ]
        },
        {
          type: "password",
          label: "密码",
          key: "password",
          maxlength: 18,
          rules: [
            {
              required: true,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (this.renderFormTit === "新增") {
                  if (!value) {
                    callback(new Error("请输入必填项"));
                  } else {
                    if (!isPassword(value)) {
                      callback(
                        new Error(
                          "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                        )
                      );
                    } else {
                      callback();
                    }
                  }
                } else {
                  if (!value) {
                    callback();
                  } else {
                    if (!isPassword(value)) {
                      callback(
                        new Error(
                          "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                        )
                      );
                    } else {
                      callback();
                    }
                  }
                }
              }
            }
          ]
        },
        {
          type: "input",
          label: "联系人",
          key: "contact",
          maxlength: 10,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: character, trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "联系电话",
          key: "mobile",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: checkFixedPhoneOrPhone, trigger: "blur" }
          ]
        },
        {
          type: "select",
          label: "销售",
          key: "saleMan",
          defaultValue: "",
          optionData: [],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "switch",
          label: "状态",
          key: "status",
          defaultValue: "1",
          initDefaultValue: "1",
          activeValue: "1",
          inactiveValue: "2"
        },
        {
          type: "upload",
          label: "logo",
          btnTxt: "上传LOGO",
          key: "logo",
          limit: 1,
          defaultValue: "",
          tip: "支持jpg/jpeg/png,大小在1M之内",
          defaultFileList: [],
          isShow: false,
          accept: ["png", "jpg", "jpeg"]
        }
      ],
      bId: "",
      GatewayList: [], // 通道列表
      ProvinceList: [], // 通道列表
      isChooseUser: false,
      statusVisible: false,
      status: 1,
      agentId: "",
      href: window.location.origin,
      loginVisible: false,
      formData: {},
      rules: {
        account: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: ["blur", "change"]
          }
        ],
        pwd: [
          {
            required: true,
            message: "口令不能为空",
            trigger: ["blur", "change"]
          }
        ]
      },
      isCheck: false // 是否已经验证登录
    };
  },
  computed: {
    renderFormTit() {
      return this.formTit;
    }
  },
  mounted() {
    this.getSaleman();
  },
  activated() {
    this.getSaleman();
  },
  methods: {
    isOpenDialog() {
      this.loginVisible = true;
      this.$nextTick(() => {
        this.$refs["loginForm"].clearValidate();
      });
    },
    // 二次登录验证
    notDisabled() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          this.formData.type = 5;
          this.formData.soleId = Number(this.id);

          this.$http.mmsGateway.viewLogin(this.formData).then(res => {
            if (res.code === 200) {
              const idx = this.formConfig.findIndex(v => v.key === "password");
              if (idx === -1) return;
              this.$set(this.formConfig[idx], "type", "input");
              this.$set(this.formConfig[idx], "defaultValue", res.data);
              this.isCheck = true;

              this.loginVisible = false;
              this.$message.success("验证成功");
            } else {
              this.$message.error(res.data || res.msg);
            }
          });
        }
      });
    },
    /**
     * 创建表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "password") {
          item.type = "password";
        }
        if (item.key === "loginName") {
          item.disabled = false;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.isCheck = false;
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
            if (item.key === "status") {
              this.$set(item, "defaultValue", row[key].toString());
            }
          }
        }
        if (item.key === "password") {
          item.type = "password";
          item.defaultValue = "";
        }

        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "loginName") {
          item.disabled = true;
        }
      });

      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    handleSuccess({ response, file, fileList, item }) {
      if (response.code == 200) {
        const { accept, size } = item;
        let fileType = file.raw.name.split(".")[1];
        let fileSize = file.size;
        let isLt1M = size ? size * 1024 * 1024 : 1 * 1024 * 1024;
        if (accept && accept.lenght != 0) {
          if (!accept.includes(fileType) || fileSize > isLt1M) {
            this.$message.error("支持jpg/jpeg/png,大小在1M之内");
            this.formConfig.forEach(el => {
              if (el.key === "logo") {
                el.defaultValue = "";
                el.defaultFileList = [];
              }
            });
            return false;
          }
        }
        this.formConfig.forEach(el => {
          if (el.key === "logo") {
            el.defaultValue = response.data;
            el.defaultFileList = response.data;
          }
        });
      } else {
        this.$message.error(response.data);
      }

      // console.log({ response, file, fileList });
      // this.formConfig.forEach(item => {
      //   if (item.key === "logo") {
      //     item.defaultValue = response.data;
      //   }
      // });
    },
    handleStatus(statu, agentId) {
      this.statusVisible = true;
      this.status = statu;
      this.agentId = agentId;
    },
    updateStatus(statu) {
      this.$http.agent
        .updateStatus({ agentId: this.agentId, status: this.status })
        .then(res => {
          if (res.code === 200) {
            this._mxGetList();
            this.statusVisible = false;
            this.$message.success("操作成功");
          }
          console.log(res);
        });
    },
    //获取销售员
    getSaleman() {
      this.$http.sysSales.queryAvailableSaleman().then(res => {
        if (resOk(res)) {
          this._setDefaultValue(
            this.formConfig,
            res.data,
            "saleMan",
            "userName",
            "actualName"
          );
          this._setDefaultValue(
            this.searchFormConfig,
            res.data,
            "saleMan",
            "userName",
            "actualName"
          );
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
      // data.status = 1;
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
