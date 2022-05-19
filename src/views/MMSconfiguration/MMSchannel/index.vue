<template>
  <div>
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
      :height="tableHeight"
    >
      <el-table-column prop="gatewayId" label="通道编号" />
      <el-table-column prop="name" label="通道名称" />
      <el-table-column prop="price" label="通道单价(分)" />
      <el-table-column prop="operator" label="支持运营商">
        <template slot-scope="scope">
          {{ renderOperator(scope.row.operator) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否可用">
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? "可用" : "不可用" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="createOrEdit(scope.row, 'gatewayId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status === 0"
            @click="handleIsDisable(1, scope.row.gatewayId)"
            type="text"
            size="small"
            >启用</el-button
          >
          <el-button
            v-if="scope.row.status === 1"
            @click="handleIsDisable(0, scope.row.gatewayId)"
            type="text"
            size="small"
            style="color: #f56c6c"
            >禁用</el-button
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
        :footerIsCenter="true"
        @submit="submit"
        @cancel="cancel"
      >
        <div v-if="formTit !== '新增'" slot="Other">
          <i
            class="el-icon-lock"
            @click="isOpenDialog"
            style="
              font-size: 22px;
              vertical-align: sub;
              color: #909399;
              margin-left: 5px;
            "
          ></i>
          <el-dialog
            title="登录"
            :visible.sync="loginVisible"
            :close-on-click-modal="false"
            width="30%"
            :append-to-body="true"
          >
            <el-form
              ref="ruleForm"
              :model="formData"
              :rules="rules"
              label-position="top"
              label-width="70px"
              style="width: 100%"
            >
              <el-form-item label="手机号:" prop="account">
                <el-input v-model="formData.account" clearable></el-input>
              </el-form-item>
              <el-form-item label="口令:" prop="pwd">
                <el-input
                  v-model="formData.pwd"
                  clearable
                  maxlength="6"
                ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="notDisabled">确 定</el-button>
              <el-button @click="loginVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
      </FormItem>
    </el-drawer>
  </div>
</template>

<script>
import { deepClone } from "@/utils";
import listMixin from "@/mixin/listMixin";
//operator字段所有可能出现情况
const models = [
  { value: 0, arr: [1, 2, 3] },
  { value: 1, arr: [1] },
  { value: 2, arr: [2] },
  { value: 3, arr: [3] },
  { value: 4, arr: [1, 2] },
  { value: 5, arr: [1, 3] },
  { value: 6, arr: [2, 3] }
];
export default {
  mixins: [listMixin],
  data() {
    return {
      // 接口地址
      searchAPI: {
        namespace: "mmsGateway",
        list: "listMmsGatewayByPage"
      },
      // 列表参数
      namespace: "mmsGateway",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道编号",
          key: "gatewayId"
        },
        {
          type: "input",
          label: "通道名称",
          key: "name"
        },
        {
          type: "select",
          label: "通道状态",
          key: "status",
          optionData: [
            {
              key: 1,
              value: "可用"
            },
            {
              key: 0,
              value: "不可用"
            }
          ]
        },
        {
          type: "select",
          label: "运营商",
          key: "operator",
          optionData: [
            {
              key: 1,
              value: "移动"
            },
            {
              key: 2,
              value: "联通"
            },
            {
              key: 3,
              value: "电信"
            },
            {
              key: 4,
              value: "国际"
            }
          ]
        }
      ],
      formTit: "新增",
      addChannel: false,
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "通道名称",
          key: "name",
          defaultValue: "",
          maxlength: 30,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              min: 2,
              max: 30,
              message: "长度在 2 到 30 个字符",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "通道公司名称",
          key: "corpName",
          defaultValue: "",
          maxlength: 30,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            },
            {
              min: 2,
              max: 30,
              message: "长度在 2 到 30 个字符",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "通道单价(分)",
          key: "price",
          defaultValue: "",
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: (rule, value, callback) => {
                if (value === "" || value === undefined || value === null) {
                  callback(new Error("请输入必填项"));
                } else {
                  if (isNaN(value)) {
                    callback(new Error("通道单价必须为数值"));
                  } else if (value <= 0) {
                    callback(new Error("通道单价必须大于0"));
                  } else if (!/^\d{1,4}(\.\d{1,2})?$/.test(value)) {
                    callback(
                      new Error("通道单价可输入1~4位数值，最多可保留两位小数")
                    );
                  } else {
                    callback();
                  }
                }
              }
            }
          ]
        },
        {
          type: "checkbox",
          label: "支持运营商",
          key: "operator",
          defaultValue: [],
          optionData: [
            {
              key: 1,
              value: "移动"
            },
            {
              key: 2,
              value: "联通"
            },
            {
              key: 3,
              value: "电信"
            },
            {
              key: 4,
              value: "国际"
            }
          ],
          rules: [
            {
              required: true,
              message: "请选择必选项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "映射路由",
          key: "routeMap",
          defaultValue: "",
          disabled: false,
          maxlength: 30,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "radio",
          label: "是否可用",
          key: "status",
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "可用"
            },
            {
              key: 0,
              value: "不可用"
            }
          ],
          rules: [
            {
              required: true,
              message: "请选择必选项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          defaultValue: "",
          maxlength: 300,
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
          label: "对接参数",
          key: "parameter",
          defaultValue: "",
          disabled: false,
          lock: true,
          rules: [
            // {
            //   required: true,
            //   message: "请输入必填项",
            //   trigger: ["blur", "change"]
            // }
          ]
        }
      ],

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
      gatewayId: ""
    };
  },
  activated() {
    this._mxGetList();
  },
  methods: {
    isOpenDialog() {
      this.loginVisible = true;
    },
    notDisabled() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const gatewayId = this.gatewayId;
          this.formData.type = 2;
          this.formData.soleId = Number(gatewayId);

          this.$http.mmsGateway.viewLogin(this.formData).then(res => {
            if (res.code === 200) {
              this.formConfig[4].disabled = false;
              this.formConfig[7].disabled = false;
              this.formConfig[7].defaultValue = res.data;
              this.loginVisible = false;
              this.formData.account = "";
              this.formData.pwd = "";
              this.$message.success("验证成功");
            } else {
              this.$message.error(res.data);
            }
          });
        }
      });
    },
    submit(form) {
      form.operator = this.returnOperator(form.operator);
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.mmsGateway.addMmsGateway(params).then(res => {
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
            gatewayId: this.gatewayId,
            ...form
          }
        };
        this.$http.mmsGateway.updateMmsGateway(params).then(res => {
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
    //格式化operator字段
    returnOperator(arg) {
      //数组排序然后进行比较找到返回相对应的value
      const data = arg.sort((a, b) => a - b);
      const idx = models.findIndex(
        v => JSON.stringify(data) === JSON.stringify(v.arr)
      );
      return models[idx].value;
    },
    cancel() {
      this.addChannel = false;
    },
    create() {
      // this.$router.push({ name: "sysRedListType", query: { type: "create" } });
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "routeMap" || item.key === "parameter") {
          item.disabled = false;
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    //创建或修改的页面跳转
    createOrEdit(row, ID) {
      this.gatewayId = row.gatewayId;
      this.formTit = "修改";
      const idx = models.findIndex(v => row.operator === v.value);
      let str = models[idx].arr;
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key] !== "-" ? row[key] : "");
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "routeMap" || item.key === "parameter") {
          item.disabled = true;
        }
        if (item.key === "operator") {
          item.defaultValue = str;
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
    },
    //启用/禁用通道
    handleIsDisable(status, gatewayId) {
      if (status === 1) {
        this.setStatus(status, gatewayId);
        return;
      }
      this.$confirm("禁用后所有通过此通道模板全部不可发送彩信", "禁用通道", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.setStatus(status, gatewayId);
        })
        .catch(() => {});
    },
    setStatus(status, gatewayId) {
      const params = { data: { status, gatewayId } };
      this.$http.mmsGateway.setMmsGatewayStatus(params).then(res => {
        if (res.code === 200) {
          this._mxGetList();
          this.$message.success(status === 1 ? "启用成功" : "禁用成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    renderOperator(v) {
      if (v === 0) {
        return "三网";
      } else if (v === 1) {
        return "移动";
      } else if (v === 2) {
        return "联通";
      } else if (v === 3) {
        return "电信";
      } else if (v === 4) {
        return "移动、联通";
      } else if (v === 5) {
        return "移动、电信";
      } else if (v === 6) {
        return "联通、电信";
      }
    }
  }
};
</script>
