<template>
  <!--短信通道-->
  <div class="gatewayDetail">
    <h2>
      {{ formTit }}短信通道
      <span v-if="formTit === '新增'">(上一通道编号为：{{ lastGateway }})</span>
    </h2>
    <FormItemTitle
      ref="formItem"
      :colSpan="12"
      :labelWidth="170"
      :formConfig="formConfig"
      :btnTxt="formTit"
      @submit="_mxHandleSubmit"
      @decode="_mxHandleDecode"
      @cancel="_mxCancel"
      @selectChange="selectChange"
      @handleClick="handleClick"
    >
      <template v-slot:isChooseProviceOrCity>
        <el-button
          style="float: right; margin-top: 5px"
          type="primary"
          size="small"
          @click="chooseCitys"
          >请选择
        </el-button>
      </template>
    </FormItemTitle>
    <el-dialog
      title="登录"
      :visible.sync="loginState"
      :close-on-click-modal="false"
      width="30%"
      custom-class="loginDialog"
    >
      <!-- <div style="margin-bottom:20px">
        <span>手机号：</span>
        <el-input
          v-model="login.account"
          placeholder="请输入手机号"
          style="width:85%"
        ></el-input>
      </div>
      <div>
        <span style="margin-right: 13px">口令：</span>
        <el-input
          v-model="login.password"
          style="width:85%"
          placeholder="请输入口令"
          maxlength="6"
        ></el-input>
      </div> -->
      <el-form
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        label-width="70px"
        style="width: 80%; margin: auto"
      >
        <el-form-item label="手机号:" prop="account">
          <el-input v-model="formData.account" clearable></el-input>
        </el-form-item>
        <el-form-item label="口令:" prop="pwd">
          <el-input v-model="formData.pwd" clearable maxlength="6"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
        <el-button @click="loginState = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择省份或城市"
      :visible.sync="isChoose"
      :close-on-click-modal="false"
      width="30%"
      custom-class="loginDialog"
    >
      <el-tree
        ref="tree"
        style="max-height: 400px; overflow-y: auto"
        :default-checked-keys="navListId"
        :data="navList"
        show-checkbox
        node-key="city"
        :props="{ label: 'city', children: 'children' }"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isChoose = false">取 消</el-button>
        <el-button type="primary" @click="handleChooseConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import FormItemTitle from "@/components/formItemTitle";

export default {
  mixins: [listMixin],
  components: { FormItemTitle },
  data() {
    return {
      // 接口地址
      searchAPI: {
        namespace: "gateway",
        list: "listGatewayByPage",
        detele: "deleteGateway",
        add: "addGateway",
        edit: "updateGateway"
      },
      // 列表参数
      namespace: "gateway",
      // 表单配置
      formConfig: [
        {
          isTitle: true,
          title: "基本信息",
          colSpan: 24
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          maxlength: "8",
          disabled: this.$route.query.type === "add" ? false : true,
          colSpan: 12,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^\d{1,8}$/,
              message: "通道编号只允许为正整数，长度限制为1~8位",
              trigger: "blur"
            }
          ]
        },
        {
          type: "input",
          label: "通道公司名称",
          key: "companyName",
          maxlength: "30",
          colSpan: 12,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,30}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "通道名称",
          colSpan: 12,
          key: "gatewayName",
          maxlength: "30",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,30}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "公司服务器ip",
          key: "ip",
          initDefaultValue: "10.3.0.23",
          defaultValue: "10.3.0.23",
          colSpan: 12,
          optionData: [
            { key: "10.3.0.23", value: "10.3.0.23" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "发送对象",
          key: "sendTo",
          optionData: [
            { key: "移动", value: "移动" },
            { key: "联通", value: "联通" },
            { key: "电信", value: "电信" },
            { key: "三网", value: "三网" },
            { key: "移动,联通", value: "移动,联通" },
            { key: "电信,联通", value: "电信,联通" },
            { key: "移动,电信", value: "移动,电信" }
          ],
          colSpan: 12,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道单价(分)",
          key: "unitPrice",
          maxlength: "5",
          colSpan: 12,
          rules: [
            {
              required: true,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (!value) callback(new Error("请输入必填项"));
                if (isNaN(value)) callback(new Error("通道单价只能输入数值"));
                callback();
              }
            }
          ]
        },
        {
          type: "select",
          label: "运营状态",
          key: "operateStatus",
          defaultValue: "",
          optionData: [
            { key: 1, value: "测试中" },
            { key: 2, value: "使用中" },
            { key: 3, value: "暂停使用" },
            { key: 4, value: "关停" },
            { key: 5, value: "弃用" }
            // { key: 6, value: "全部" }
          ],
          colSpan: 12,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否可用",
          key: "status",
          defaultValue: "",
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }],
          colSpan: 12,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          isTitle: true,
          title: "加密信息",
          colSpan: 24
        },
        {
          type: "select",
          label: "通道类型",
          key: "type",
          //   tag:"encrypt",
          optionData: [
            { key: 1, value: "Cmpp" },
            { key: 2, value: "Sgip" },
            { key: 3, value: "Smgp" },
            { key: 4, value: "http" }
          ],
          colSpan: 12
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "接入号",
          //   tag: "encrypt",
          key: "srcId",
          colSpan: 12
        },
        {
          type: "input",
          label: "服务端ip",
          tag: "encrypt",
          key: "serverIp",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "端口长短信限制",
          tag: "encrypt",
          key: "srcIdLength",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "服务器端口",
          tag: "encrypt",
          key: "serverPort",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "业务代码",
          tag: "encrypt",
          key: "serviceId",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "发送速率",
          tag: "encrypt",
          key: "sendSpeed",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "企业代码",
          tag: "encrypt",
          key: "msgSrc",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "账号",
          tag: "encrypt",
          key: "clientId",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "通道主链接编号",
          tag: "encrypt",
          key: "gatewayRecordId",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "密码",
          tag: "encrypt",
          key: "sharedSecret",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "cmpp版本",
          tag: "encrypt",
          key: "version",
          colSpan: 12,
          lock: true
        },

        {
          isTitle: true,
          title: "业务信息",
          colSpan: 24
        },
        {
          type: "select",
          label: "是否取路由",
          key: "isTwoRoute",
          defaultValue: "",
          optionData: [
            { key: 0, value: "不取" },
            { key: 1, value: "强制取" },
            { key: 2, value: "非强制取" }
          ],
          colSpan: 12,
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "路由方式",
          key: "twoRouteType",
          colSpan: 12,
          optionData: [
            { key: 0, value: "普通方式" },
            { key: 1, value: "一客一签" }
          ]
        },
        {
          type: "input",
          label: "备用通道",
          key: "otherGateway",
          maxlength: "8",
          colSpan: 12,
          rules: [
            { required: false, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^\d{1,8}$/,
              message: "备用通道编号只允许为正整数，长度限制为1~8位",
              trigger: "blur"
            }
          ]
        },
        {
          type: "input",
          label: "二次路由编号",
          key: "twoRouteNo",
          colSpan: 12
        },
        {
          type: "select",
          label: "发送限制",
          key: "isLimit",
          colSpan: 12,
          optionData: [{ key: 0, value: "无" }, { key: 1, value: "有" }]
        },
        {
          type: "select",
          label: "是否报备",
          key: "isReportRemarks",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "限制条数",
          key: "limitCount",
          colSpan: 12,
          rules: [
            {
              required: false,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (!value) callback();
                isNaN(value)
                  ? callback(new Error("只能输入数字"))
                  : value > 0
                  ? callback()
                  : callback(new Error("必须大于0"));
              }
            }
          ]
        },
        {
          type: "select",
          label: "连不上通道自动转",
          key: "disconnectFailTurn",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "限制天数",
          key: "limitDays",
          colSpan: 12,
          rules: [
            {
              required: false,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (!value) callback();
                isNaN(value)
                  ? callback(new Error("只能输入数字"))
                  : value > 0
                  ? callback()
                  : callback(new Error("必须大于0"));
              }
            }
          ]
        },
        {
          type: "select",
          label: "连续提交失败自动转",
          key: "submitFailTurn",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否直连",
          key: "isDerect",
          defaultValue: "",
          colSpan: 12,
          optionData: [
            {
              key: 1,
              value: "直连"
            },
            {
              key: 2,
              value: "非直连"
            }
          ],
          // change: this.selectUser,
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "低于成功率自动转",
          key: "succRate",
          colSpan: 12
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "落地省份",
          key: "province",
          colSpan: 12,
          optionData: []
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "失败状态自动转",
          key: "fsAutoChange",
          colSpan: 12
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "落地市",
          key: "city",
          colSpan: 12
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "目标通道",
          key: "targetGateway",
          colSpan: 12
        },
        {
          type: "textarea",
          label: "通道参数",
          key: "parameter",
          colSpan: 12
        },
        {
          type: "textarea",
          label: "屏蔽省份",
          key: "shieldProvince",
          colSpan: 12,
          placeholder: "请选择屏蔽省份",
          disabled: true,
          // 可选择省份和城市进行赋值
          isChooseProviceOrCity: true
        },
        // {
        //   type: "input",
        //   label: "通道端口",
        //   // tag: "addition",
        //   key: "port",
        //   colSpan: 12,
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          colSpan: 12,
          maxlength: "300"
        },

        {
          isBtn: true,
          btnTxt: "附加信息",
          colSpan: 24,
          show: false
        },
        {
          isTitle: true,
          title: "附加信息",
          colSpan: 24,
          tag: "addition"
        },

        {
          type: "input",
          label: "发送内容",
          tag: "addition",
          key: "conRequirements",
          colSpan: 12
        },
        {
          type: "select",
          label: "是否支持长短信",
          key: "isLong",
          defaultValue: "",
          tag: "addition",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "联系人",
          key: "linkman",
          tag: "addition",
          maxlength: "10",
          colSpan: 12,
          rules: [
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,10}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "单条字数",
          tag: "addition",
          key: "singleLength",
          colSpan: 12
        },
        {
          type: "input",
          label: "联系方式",
          maxlength: "11",
          tag: "addition",
          key: "linkmanMobile",
          colSpan: 12,
          rules: [
            {
              pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
              message: "号码格式不对",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "是否专用",
          key: "isExclusive",
          tag: "addition",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "投诉率指标",
          tag: "addition",
          key: "complaintRate",
          colSpan: 12
        },
        {
          type: "select",
          label: "是否带签名",
          tag: "addition",
          key: "hasSign",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "套餐",
          tag: "addition",
          key: "packages",
          colSpan: 12
        },
        {
          type: "select",
          label: "是否需要白名单",
          key: "isWhite",
          tag: "addition",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "结算公司",
          key: "clearingCorp",
          tag: "addition",
          maxlength: "30",
          colSpan: 12,
          rules: [
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,30}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "绑定从IP",
          tag: "addition",
          key: "zyIvIce",
          colSpan: 12
        },
        {
          type: "select",
          label: "是否支持上行",
          tag: "addition",
          key: "isMo",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "通道负责人",
          tag: "addition",
          key: "charger",
          colSpan: 12
        },
        {
          type: "select",
          label: "是否支持报告",
          tag: "addition",
          key: "isReport",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "优先级",
          tag: "addition",
          key: "priority",
          colSpan: 12
        },
        {
          type: "select",
          label: "是否支持扩展",
          tag: "addition",
          key: "isSub",
          defaultValue: "",
          colSpan: 12,
          optionData: [{ key: "0", value: "否" }, { key: "1", value: "是" }]
        },
        {
          type: "input",
          label: "通道余额",
          tag: "addition",
          key: "balance",
          colSpan: 12
        },
        {
          type: "input",
          label: "绑定主IP",
          tag: "addition",
          key: "zyIpMaster",
          colSpan: 12
        },
        {
          type: "input",
          label: "通道长号码",
          tag: "addition",
          key: "longCode",
          colSpan: 12
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "input",
        //   label: "滑动窗口",
        //   tag: "addition",
        //   key: "slideWindow",
        //   colSpan: 12
        //   // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        // {
        //   type: "input",
        //   label: "接口协议",
        //   tag: "addition",
        //   key: "protocol",
        //   colSpan: 12
        // },
        // {
        //   type: "input",
        //   label: "通道环境",
        //   key: "profile",
        //   tag: "addition",
        //   maxlength: "30",
        //   colSpan: 12,
        //   rules: [
        //     {
        //       pattern: /^([a-zA-Z0-9_]){1,30}$/,
        //       message: "只支持字母",
        //       trigger: "change"
        //     }
        //   ]
        // },
        {
          type: "textarea",
          label: "特殊设置",
          tag: "addition",
          key: "collocation",
          maxlength: "300",
          colSpan: 12
        }
      ],
      loginState: false,
      login: {
        account: "",
        password: ""
      },
      temporaryItem: {},
      isPage: true,
      formTit: "新增",
      lastGateway: "",

      isChoose: false,
      navListId: [],
      navList: [],
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
      }
    };
  },
  watch: {
    // 目标通道--关联屏蔽省份 (校验)
    targetGatewayVal(newVal) {
      const idx = this.formConfig.findIndex(v => v.key === "shieldProvince");
      this.$set(this.formConfig[idx], "rules", [
        {
          required: newVal ? true : false,
          message: "请选择必选项",
          trigger: "blur"
        }
      ]);
    },
    shieldProvinceVal(newVal) {
      const idx = this.formConfig.findIndex(v => v.key === "targetGateway");
      this.$set(this.formConfig[idx], "rules", [
        {
          required: newVal ? true : false,
          message: "请输入必填项",
          trigger: "blur"
        }
      ]);
    }
  },
  computed: {
    // 目标通道--关联屏蔽省份 (校验)
    targetGatewayVal() {
      const idx = this.formConfig.findIndex(v => v.key === "targetGateway");
      return this.formConfig[idx].defaultValue;
    },
    shieldProvinceVal() {
      const idx = this.formConfig.findIndex(v => v.key === "shieldProvince");
      return this.formConfig[idx].defaultValue;
    }
  },
  created() {
    this.formTit = this.$route.query.type === "add" ? "新增" : "修改";
  },
  mounted() {
    this.listSysProvince();
    this.getLastGateway();
    this.getProvinceTree();
    this._setTagDisplayShow(this.formConfig, "addition", true);
    let parameter = this.$route.query;
    if (parameter.type === "edit") {
      this._mxEdit(JSON.parse(parameter.row), "gatewayId");
      this.formConfig.forEach(item => {
        if (item.tag === "encrypt") {
          item.lock = true;
        }
      });
    } else {
      this.formConfig.forEach(item => {
        if (item.tag === "encrypt") {
          item.lock = false;
        }
      });
    }
  },
  methods: {
    chooseCitys() {
      const idx = this.formConfig.findIndex(v => v.key === "shieldProvince");
      const val = this.formConfig[idx].defaultValue;
      this.navListId = val ? val.split(",") : [];
      this.isChoose = true;
    },
    handleChooseConfirm() {
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const idx = this.formConfig.findIndex(v => v.key === "shieldProvince");
      this.$set(this.formConfig[idx], "defaultValue", checkedKeys.join(","));
      this.isChoose = false;
    },
    getProvinceTree() {
      this.$http.gateway.getProvinceTree().then(res => {
        this.navList = res.data.map(v => {
          return { city: v.provinceName, children: v.children };
        });
      });
    },
    getLastGateway() {
      this.$http.gateway.getLasttGatewayId().then(res => {
        this.lastGateway = res.data;
      });
    },
    submit() {
      const { account, pwd } = this.formData;
      const { gatewayId } = this.$route.query;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.$http.sysLogin
            .viewLogin({
              account,
              pwd,
              type: 1,
              soleId: Number(gatewayId)
            })
            .then(res => {
              if (res.code == 200) {
                this.$message.success(res.msg);
                this.loginState = false;
                this.formData.account = "";
                this.formData.pwd = "";
                const { key } = this.temporaryItem;
                this.formConfig.forEach(item => {
                  if (key === "sharedSecret") {
                    if (item.key === key) {
                      item.defaultValue = res.data;
                    }
                  }
                  if (item.key === key) {
                    item.lock = false;
                  }
                });
              } else {
                this.$message.error(res.data);
              }
            });
        }
      });
    },
    _mxHandleDecode(item) {
      this.loginState = true;
      this.temporaryItem = item;
    },
    //隐藏附加信息
    handleClick(item) {
      if (item.show) {
        this._setTagDisplayShow(this.formConfig, "addition", true);
        this.formConfig.forEach(items => {
          if (items.isBtn) {
            items.show = false;
          }
        });
      } else {
        this._setTagDisplayShow(this.formConfig, "addition", false);
        this.formConfig.forEach(items => {
          if (items.isBtn) {
            items.show = true;
          }
        });
      }
    },
    selectChange({ val, item }) {},
    /*
     * 获取省份列表
     * */
    listSysProvince() {
      const params = {
        data: {
          provinceName: ""
        }
      };
      this.$http.listSysProvince(params).then(res => {
        this.ProvinceList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            item.optionData = res.data.map(t => {
              return {
                key: t.provinceId,
                value: t.provinceName
              };
            });
            item.optionData.shift();
          }
        });
      });
    },
    _mxArrangeEditData(row) {
      for (let key in row) {
        if (row[key] === true) {
          row[key] = "1";
        }
        if (row[key] === false) {
          row[key] = "0";
        }
      }
      return row;
    },
    _mxArrangeSubmitData(formData) {
      if (formData.countMonth) {
        formData.countMonth = new Date(formData.countMonth).Format("yyyy-MM");
      }
      return formData;
    }
  }
};
</script>

<style scoped lang="scss">
.el-dialog,
.loginDialog {
  .el-dialog__footer {
    padding: 0 20px !important;
  }
}
</style>
