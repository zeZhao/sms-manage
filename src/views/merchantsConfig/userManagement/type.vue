<template>
  <div>
    <h2>{{ renderTitle }}</h2>
    <FormItemTitle
      class="userManagementType"
      :colSpan="8"
      :labelWidth="150"
      ref="formItemTit"
      :formConfig="formConfig"
      :btnTxt="renderBtnTxt"
      @submit="_mxHandleSubmit"
      @cancel="_mxCancel"
      @selectChange="selectChange"
      @removeTag="removeTag"
    >
    </FormItemTitle>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import FormItemTitle from "@/components/formItemTitle";
import { isPassword } from "@/utils";

export default {
  mixins: [listMixin],
  components: { FormItemTitle },
  data() {
    const validatorPrice = (rule, value, callback) => {
      if (value && value < 1000) {
        callback();
      } else {
        callback("正整数不能超过3位数");
      }
    };
    const validCode = (rule, value, callback) => {
      if (value && (!/^\d+$/.test(value) || value.length !== 4)) {
        callback(new Error("请输入4位特服号"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogTit: "",
      information: "",
      dialogType: "disable",
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "corpUser",
        list: "queryByPage",
        detele: "",
        add: "addOrUpdate",
        edit: "addOrUpdate",
        check: "check"
      },
      // 列表参数
      namespace: "corpUser",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
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
        // {
        //   type: "input",
        //   label: "登录账号",
        //   key: "loginName"
        // },
        {
          type: "input",
          label: "特服号",
          key: "code"
        },
        {
          type: "select",
          label: "业务类型",
          key: "accountType",
          optionData: [
            { key: "1", value: "行业" },
            { key: "2", value: "营销" },
            { key: "3", value: "VIP" }
          ]
        },
        // {
        //   type: "select",
        //   label: "计费类型",
        //   key: "isDirectUser",
        //   optionData: [
        //     { key: "1", value: "直客" },
        //     { key: "2", value: "同行" }
        //   ]
        // },
        // {
        //   type: "select",
        //   label: "计费类型",
        //   key: "reductType",
        //   optionData: [
        //     { key: "1", value: "账户计费" }
        //     // { key: "2", value: "商户计费" }
        //   ]
        // },
        // {
        //   type: "select",
        //   label: "产品",
        //   key: "productType",
        //   optionData: [
        //     { key: "1", value: "短信" },
        //     // { key: "2", value: "彩信" },
        //     { key: "3", value: "屏信" },
        //     { key: "4", value: "语音" }
        //   ],
        //   placeholder: "请选择产品"
        // },
        // {
        //   type: "select",
        //   label: "产品类型",
        //   key: "proType",
        //   optionData: [
        //     { key: "1", value: "web端" },
        //     { key: "2", value: "http接口" },
        //     { key: "3", value: "cmpp接口" },
        //     { key: "7", value: "音频接口" }
        //   ],
        //   placeholder: "请选择产品类型"
        // },
        {
          type: "select",
          label: "短信计费方式",
          key: "reductModel",
          optionData: [
            { key: "1", value: "预付提交计费" },
            { key: "2", value: "预付成功计费" },
            { key: "3", value: "后付提交计费" },
            { key: "4", value: "后付成功计费" }
          ]
        },
        {
          type: "select",
          label: "彩信计费方式",
          key: "mmsReductModel",
          optionData: [
            { key: "1", value: "预付提交计费" },
            { key: "2", value: "预付成功计费" },
            { key: "3", value: "后付提交计费" },
            { key: "4", value: "后付成功计费" }
          ]
        },
        {
          type: "select",
          label: "销售员",
          key: "saleMan",
          optionData: []
        },
        // {
        //   type: "select",
        //   label: "状态",
        //   key: "status",
        //   optionData: [
        //     { key: "1", value: "待审核" },
        //     { key: "2", value: "正常" },
        //     { key: "3", value: "禁用" }
        //   ],
        //   placeholder: "请选择状态类型"
        // },
        {
          type: "select",
          label: "代理商",
          key: "agentId",
          optionData: []
        },
        {
          type: "select",
          label: "标签",
          key: "tag",
          optionData: []
        },
        {
          type: "daterange",
          label: "创建时间",
          key: ["", "startDate", "endDate"]
        }
      ],
      // 表单配置
      formConfig: [
        {
          isTitle: true,
          title: "账户信息",
          colSpan: 24
        },
        {
          type: "select",
          label: "所在商户",
          key: "corpId",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          maxlength: "20",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "登录账号",
          key: "loginName",
          maxlength: "20",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              min: 6,
              max: 20,
              message: "长度在 6 到 20 个字符",
              trigger: "blur"
            },
            {
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (/\p{Unified_Ideograph}/u.test(value)) {
                  callback(new Error("不支持汉字"));
                }
                if (
                  !/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/.test(
                    value
                  )
                ) {
                  callback(new Error("不支持特殊字符"));
                }
                callback();
              }
            }
          ]
        },
        {
          type: "password",
          label: "密码",
          key: "password",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (value) {
                  if (!isPassword(value)) {
                    callback(
                      new Error(
                        "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                      )
                    );
                  } else {
                    callback();
                  }
                } else {
                  callback(new Error("请输入必填项"));
                }
              }
            }
          ]
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              validator: validCode,
              trigger: "change"
            }
          ]
        },

        {
          type: "select",
          label: "计费类型",
          key: "reductType",
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            { key: 1, value: "账户计费" }
            // { key: 2, value: "商户id计费" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "联系人姓名",
          key: "contact",
          defaultValue: "",
          maxlength: "20",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "联系人电话",
          key: "mobile",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              ///^[\d0-9a-zA-Z!@#$%^&*~]{8,16}$/
              pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
              message: "手机号码格式错误",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "是否直客",
          key: "isDirectUser",
          optionData: [{ key: 1, value: "直客" }, { key: 2, value: "同行" }],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "业务类型",
          key: "accountType",
          optionData: [
            { key: 1, value: "行业" },
            { key: 2, value: "营销" },
            { key: 3, value: "VIP" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "代理商",
          key: "agentId",
          optionData: []
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "客户IP地址",
          key: "userIp",
          defaultValue: ""
        },
        {
          type: "select",
          label: "角色",
          key: "roleId",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "产品",
          key: "productType",
          multiple: true,
          clearable: true,
          defaultValue: [],
          initDefaultValue: [],
          optionData: [{ key: 1, value: "短信" }, { key: 2, value: "彩信" }],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "销售员",
          key: "saleMan",
          optionData: [],
          rules: [{ required: true, message: "请选择必填项", trigger: "blur" }]
        },
        {
          type: "times",
          label: "发送时间",
          key: "times",
          defaultValue: "",
          optionData: []
        },
        {
          isTitle: true,
          title: "短信业务信息",
          colSpan: 24,
          tag: "sms"
        },
        {
          type: "select",
          label: "运营商",
          key: "sendType",
          optionData: [
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
            { key: 4, value: "三网" },
            { key: 5, value: "移动联通" },
            { key: 6, value: "移动电信" },
            { key: 7, value: "联通电信" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "产品类型",
          key: "proType",
          // multiple: true,
          disabled: this.$route.query.type === "update",
          // clearable: true,
          defaultValue: [],
          initDefaultValue: [],
          optionData: [
            { key: 1, value: "web端" },
            { key: 2, value: "http接口" },
            { key: 4, value: "cmpp接口" }
            // { key: 7, value: "音频接口" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "计费方式",
          key: "reductModel",
          optionData: [
            { key: 1, value: "预付提交计费" },
            { key: 2, value: "预付成功计费" },
            { key: 3, value: "后付提交计费" },
            { key: 4, value: "后付成功计费" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "返还类型",
          key: "returnBalance",
          isShow: true,
          optionData: [
            { key: "0", value: "不返还" },
            { key: 1, value: "返失败" },
            { key: 2, value: "返失败和未知" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "短信单价",
          key: "cardUnit",
          tag: "sms",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
              message: "输入大于0的数，小数点保留2位",
              trigger: "change"
            },
            {
              validator: validatorPrice,
              message: "正整数不能超过3位数",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "扩展长度",
          key: "sublong",
          tag: "sms",
          maxlength: 2,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-9]\d*$/,
              message: "只能输入大于0的正整数",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "协议端口",
          key: "directPort",
          defaultValue: "",
          tag: "sms",
          disabled: true,
          placeholder: "无"
        },
        {
          type: "select",
          label: "上行类型",
          key: "moType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: 1, value: "推送" },
            { key: 2, value: "自取(批量)" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "推送上行地址",
          key: "moUrl",
          maxlength: "250",
          tag: "sms",
          defaultValue: ""
        },
        {
          type: "select",
          label: "强加签名",
          key: "httpSign",
          optionData: [{ key: "0", value: "否" }, { key: 1, value: "是" }],
          defaultValue: 1,
          tag: "sms",
          rules: [{ required: true, message: "请选择必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "状态报告类型",
          key: "reportType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: 1, value: "推送" },
            { key: 2, value: "自取(批量)" },
            { key: 3, value: "自取(单条)" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "推送报告地址",
          key: "reportUrl",
          maxlength: "250",
          tag: "sms",
          defaultValue: ""
        },
        {
          type: "input",
          label: "失败比例",
          key: "faToSu",
          tag: "sms",
          maxlength: 6,
          rules: [
            {
              required: false,
              trigger: "change"
              // validator: (rule, value, callback) => {
              //   if (!value) callback();
              //   if (isNaN(value)) callback(new Error('只能输入数值'));
              //   if (value && (value + '').indexOf('.') !== -1) callback('只能输入正整数');
              //   if (value < 0 || value > 100) callback('只能在0 ~ 100以内');
              //   callback();
              // }
            }
          ]
        },
        {
          type: "input",
          label: "长号码",
          key: "longCode",
          tag: "sms",
          maxlength: 12,
          rules: [
            {
              pattern: /^[1-9]\d*$/,
              message: "只能输入大于0的正整数",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "外部黑名单",
          key: "isPostApi",
          initDefaultValue: "0",
          defaultValue: "0",
          tag: "sms",
          optionData: [
            { key: "0", value: "无" },
            { key: 1, value: "冬云" },
            { key: 2, value: "棱镜" }
          ]
        },
        {
          type: "input",
          label: "链接路数",
          key: "maxSession",
          isShow: true,
          maxlength: 2,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-9]\d*$/,
              message: "只能输入大于0的正整数",
              trigger: "blur"
            }
          ]
        },
        {
          type: "checkbox",
          label: "黑名单",
          key: "blackLevel",
          initDefaultValue: [2],
          defaultValue: [2],
          optionData: [
            // { key: 0, value: "系统级" },
            // { key: 2, value: "用户级" },
            // { key: 3, value: "营销级" },
            // { key: 4, value: "BSATS级" }
          ],
          tag: "sms"
        },
        {
          isTitle: true,
          title: "彩信业务信息",
          colSpan: 24,
          tag: "mms"
        },
        {
          type: "select",
          label: "运营商",
          key: "mmsSendType",
          optionData: [
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" },
            { key: 4, value: "三网" },
            { key: 5, value: "移动联通" },
            { key: 6, value: "移动电信" },
            { key: 7, value: "联通电信" }
          ],
          tag: "mms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "产品类型",
        //   key: "mmsProType",
        //   multiple: true,
        //   clearable: true,
        //   disabled: false,
        //   optionData: [
        //     { key: 1, value: "web端" }
        //     // { key: 2, value: "http接口" },
        //     // { key: 4, value: "cmpp接口" }
        //     // { key: 7, value: "音频接口" }
        //   ],
        //   tag: "mms",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "计费方式",
          key: "mmsReductModel",
          optionData: [
            { key: 1, value: "预付提交计费" },
            { key: 2, value: "预付成功计费" },
            { key: 3, value: "后付提交计费" },
            { key: 4, value: "后付成功计费" }
          ],
          tag: "mms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "返还类型",
          key: "mmsReturnBalance",
          isShow: true,
          optionData: [
            { key: "0", value: "不返还" },
            { key: 1, value: "返失败" },
            { key: 2, value: "返失败和未知" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "彩信单价",
          key: "mmsCardUnit",
          tag: "mms",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^0\.([1-9]|\d[1-9])$|^[1-9]\d{0,8}\.\d{0,2}$|^[1-9]\d{0,8}$/,
              message: "输入大于0的数，小数点保留2位",
              trigger: "change"
            },
            {
              validator: validatorPrice,
              message: "正整数不能超过3位数",
              trigger: "change"
            }
          ]
        },
        // {
        //   type: "select",
        //   label: "彩信上行类型",
        //   key: "mmsMoType",
        //   tag: "mms",
        //   optionData: [
        //     { key: "0", value: "无权限" },
        //     { key: 1, value: "推送" },
        //     { key: 2, value: "自取(批量)" }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        // {
        //   type: "input",
        //   label: "彩信推送上行地址",
        //   key: "mmsMoUrl",
        //   tag: "mms",
        //   defaultValue: ""
        // },
        // {
        //   type: "select",
        //   label: "彩信报告类型",
        //   key: "mmsReportType",
        //   tag: "mms",
        //   optionData: [
        //     { key: "0", value: "无权限" },
        //     { key: 1, value: "推送" },
        //     { key: 2, value: "自取(批量)" },
        //     { key: 3, value: "自取(单条)" }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        // {
        //   type: "input",
        //   label: "彩信推送报告地址",
        //   key: "mmsReportUrl",
        //   tag: "mms",
        //   defaultValue: ""
        // },
        {
          type: "checkbox",
          label: "黑名单",
          initDefaultValue: [],
          defaultValue: [],
          key: "mmsBlackLevel",
          tag: "mms",
          optionData: [
            { key: 0, value: "系统级" },
            { key: 2, value: "账户级" }
            // { key: 3, value: "营销级" },
            // { key: 4, value: "BSATS级" }
          ]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
        // {
        //   isTitle: true,
        //   title: "服务信息",
        //   colSpan: 24
        // },
        // {
        //   type: "textarea",
        //   label: "备注",
        //   key: "remark"
        // }

        // {
        //   type: "select",
        //   label: "产品",
        //   key: "productType",
        //   optionData: [
        //     { key: 1, value: "短信" },
        //     // { key: 2, value: "彩信" },
        //     { key: 3, value: "屏信" },
        //     { key: 4, value: "语音" }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },

        // {
        //   type: "input",
        //   label: "彩信单价",
        //   key: "mmsCardUnit",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },

        // {
        //   type: "input",
        //   label: "备份IP",
        //   key: "userIpBak",
        //   defaultValue: ""
        // },

        // {
        //   type: "select",
        //   label: "优化类型",
        //   key: "deductType",
        //   optionData: [
        //     { key: 1, value: "正常" },
        //     { key: 2, value: "对比库" },
        //   ],
        //   rules: [{ required: true, message: "请选择必填项", trigger: "blur" }],
        // },
      ],
      currentRowData: {},
      tagStatusTitle: "",
      tagStatus: false,
      userId: null,
      //添加/修改标签数据
      tagsData: [
        {
          type: "checkbox",
          key: "smsTags",
          defaultValue: [],
          optionData: []
        }
      ],
      submitSpeedTit: "配置提交速率",
      speedVisible: false,
      speedVal: null,
      saleList: [],
      //临时存储修改数据
      currentEditFormData: {},
      currentType: ""
    };
  },
  computed: {
    type() {
      const { type } = this.$route.query;
      return type;
    },
    renderTitle() {
      const { type } = this.$route.query;
      const str = "账户";
      return type === "create" ? `新增${str}` : `修改${str}`;
    },
    renderBtnTxt() {
      const { type } = this.$route.query;
      return type === "create" ? "新增" : "修改";
    }
  },
  mounted() {
    this.currentType = this.$route.query.type;
    this.getAllCorp();
    this.getSaleman();
    this.getAgent();
    this.getRole();
    this.listTag();
    this.getBlackFroup();
    const { type, row, ID } = this.$route.query;
    type === "create" ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
  },
  activated() {
    if (this.currentType !== this.type) {
      this.getAllCorp();
      this.getSaleman();
      this.getAgent();
      this.getRole();
      this.listTag();
      this.getBlackFroup();
      const { type, row, ID } = this.$route.query;
      type === "create" ? this._mxCreate() : this._mxEdit(JSON.parse(row), ID);
      this.currentType = this.type;
    } else {
      this.currentType = this.type;
    }
  },
  methods: {
    //多选移除操作
    removeTag({ val, item }) {
      if (this.formTit == "修改") {
        this.formConfig.forEach(el => {
          if (item.key === "productType" && el.key === item.key) {
            if (this.currentEditFormData.productType.includes(val)) {
              el.defaultValue = this.currentEditFormData.productType;
              this.$message.error("不可修改！");
              this.selectChange({ val: [val], item });
              this.editFormConfigHandle(this.currentEditFormData);
            }
          }
          if (item.key === "mmsProType" && el.key === item.key) {
            if (this.currentEditFormData.mmsProType.includes(val)) {
              el.defaultValue = this.currentEditFormData.mmsProType;
              this.$message.error("不可修改！");
            }
          }
          if (item.key === "proType" && el.key === item.key) {
            if (this.currentEditFormData.proType.includes(val)) {
              el.defaultValue = this.currentEditFormData.proType;
              this.$message.error("不可修改！");
            }
          }
        });
      }
    },

    selectChange(data) {
      const { val, item } = data;
      if (item.key === "productType") {
        if (val && val.length != 0) {
          //根据产品的选择动态显示表单及数据处理
          if (val.includes(1) && val.includes(2)) {
            this._setTagDisplayShow(this.formConfig, "sms", false);
            this._setTagDisplayShow(this.formConfig, "mms", false);
          } else if (val.includes(1)) {
            this._setTagDisplayShow(this.formConfig, "sms", false);
            this._setTagDisplayShow(this.formConfig, "mms", true);
            this._setDisplayShow(this.formConfig, "mmsReturnBalance", true);
            this._deleteDefaultValue(this.formConfig, "mms");
          } else if (val.includes(2)) {
            this._setTagDisplayShow(this.formConfig, "mms", false);
            this._setTagDisplayShow(this.formConfig, "sms", true);
            this._setDisplayShow(this.formConfig, "returnBalance", true);
            this._deleteDefaultValue(this.formConfig, "sms");
          }
        } else {
          this._setTagDisplayShow(this.formConfig, "sms", true);
          this._setTagDisplayShow(this.formConfig, "mms", true);
          this._deleteDefaultValue(this.formConfig, "mms");
          this._deleteDefaultValue(this.formConfig, "sms");
        }
      }
      if (item.key === "reductModel") {
        //计费方式切换为：预付成功计费时，返还类型显示
        if (val === 2) {
          this._setDisplayShow(this.formConfig, "returnBalance", false);
        } else {
          this._setDisplayShow(this.formConfig, "returnBalance", true);
        }
      }
      if (item.key === "mmsReductModel") {
        //计费方式切换为：预付成功计费时，返还类型显示
        this.$nextTick(() => {
          if (item.defaultValue === 2) {
            this._setDisplayShow(this.formConfig, "mmsReturnBalance", false);
          } else {
            this._setDisplayShow(this.formConfig, "mmsReturnBalance", true);
          }
        });
      }
      if (item.key === "proType") {
        if (val === 1) {
          this._setDefaultValueKeys("directPort", "无");
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", true);
        } else if (val === 2) {
          this._setDefaultValueKeys("directPort", "8090");
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", true);
        } else if (val === 3) {
          this._setDefaultValueKeys("directPort", "7890");
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", true);
        } else {
          this._setDefaultValueKeys("directPort", "");
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", false);
          this._setDefaultValueKeys("maxSession", "1");
        }
      }
    },
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (
          item.key === "productType" ||
          item.key === "mmsProType" ||
          item.key === "proType"
        ) {
          item.optionData.forEach(el => {
            this.$set(el, "disabled", false);
          });
        }
        if (item.key == "proType") {
          this.$set(item, "disabled", false);
        }
        if (item.key == "corpId") {
          this.$set(item, "disabled", false);
        }
        if (item.key == "reductModel") {
          this.$set(item, "disabled", false);
        }
        if (item.key == "mmsReductModel") {
          this.$set(item, "disabled", false);
        }
        if (item.tag === "sms" || item.tag === "mms") {
          item.isShow = true;
        }
        if (item.key === "loginName") {
          item.disabled = false;
        }
      });
      this.getAllCorp();
      this.getRole();
      this.getAgent();
      this.getSaleman();
      setTimeout(() => {
        this.$refs.formItemTit.resetForm();
      }, 0);
    },
    //编辑对返回数据进行调整
    _mxArrangeEditData(row) {
      for (let key in row) {
        //对黑名单做数据类型转换
        if (key === "blackLevel" || key === "mmsBlackLevel") {
          if (typeof row[key] === "string" && row[key] !== "-") {
            let arr = row[key].split(",");
            row[key] = arr.map(item => {
              return Number(item);
            });
          } else {
            row[key] = [];
          }
        }
        // if (key === "proType") {
        //   row["proType"] = row["proTypes"];
        // }
        if (key === "mmsProType") {
          row["mmsProType"] = row["mmsProTypes"];
        }
        if (key === "productType") {
          row["productType"] = row["productTypes"];
        }
      }
      this.currentEditFormData = this.$deepClone(row);
      return row;
    },

    //根据调整的数据 修改表单配置
    editFormConfigHandle(lineData) {
      let productTypeVal = [1];
      this.formConfig.forEach(item => {
        for (let keys in lineData) {
          if (item.key === keys && lineData[keys] !== "-") {
            if (lineData[keys] === 0) {
              this.$set(item, "defaultValue", "0");
            } else {
              this.$set(item, "defaultValue", lineData[keys]);
            }
          } else if (item.key === keys && lineData[keys] === "-") {
            this.$set(item, "defaultValue", "");
          }
        }
        if (item.key === "reductModel") {
          //计费方式切换为：预付成功计费时，返还类型显示
          this.$nextTick(() => {
            if (item.defaultValue === 2) {
              this._setDisplayShow(this.formConfig, "returnBalance", false);
            } else {
              this._setDisplayShow(this.formConfig, "returnBalance", true);
            }
          });
        }
        if (item.key === "mmsReductModel") {
          //计费方式切换为：预付成功计费时，返还类型显示
          this.$nextTick(() => {
            if (item.defaultValue === 2) {
              this._setDisplayShow(this.formConfig, "mmsReturnBalance", false);
            } else {
              this._setDisplayShow(this.formConfig, "mmsReturnBalance", true);
            }
          });
        }
        if (item.key === "productType") {
          let val = item.defaultValue;
          productTypeVal = item.defaultValue;
          if (val && val.length != 0) {
            if (val.includes(1) && val.includes(2)) {
              this._setTagDisplayShow(this.formConfig, "sms", false);
              this._setTagDisplayShow(this.formConfig, "mms", false);
            } else if (val.includes(1)) {
              this._setTagDisplayShow(this.formConfig, "sms", false);
              this._setTagDisplayShow(this.formConfig, "mms", true);
            } else if (val.includes(2)) {
              this._setTagDisplayShow(this.formConfig, "mms", false);
              this._setTagDisplayShow(this.formConfig, "sms", true);
            }
          } else {
            this._setTagDisplayShow(this.formConfig, "sms", true);
            this._setTagDisplayShow(this.formConfig, "mms", true);
          }
        }
        if (
          item.key === "productType" ||
          item.key === "mmsProType"
          // item.key === "proType"
        ) {
          let val = item.defaultValue;
          if (val && val.length !== 0) {
            item.optionData.forEach(el => {
              if (val.includes(el.key)) {
                this.$set(el, "disabled", true);
              } else {
                this.$set(el, "disabled", false);
              }
            });
          }
        }

        if (item.key === "proType") {
          //产品类型如果是cmpp就展示链接路数
          this.$nextTick(() => {
            if (item.defaultValue === 4) {
              this._setDisplayShow(this.formConfig, "maxSession", false);
            } else {
              this._setDisplayShow(this.formConfig, "maxSession", true);
            }
          });
        }
        // if (item.key == "proType") {
        //   this.$set(item, "disabled", true);
        // }
        // if (item.key == "mmsProType") {
        //   this.$set(item, "disabled", true);
        // }
        if (item.key == "corpId") {
          this.$set(item, "disabled", true);
        }
        if (item.key == "reductModel") {
          if (productTypeVal.includes(1)) {
            this.$set(item, "disabled", true);
          } else {
            this.$set(item, "disabled", false);
          }
        }
        if (item.key == "mmsReductModel") {
          if (productTypeVal.includes(2)) {
            this.$set(item, "disabled", true);
          } else {
            this.$set(item, "disabled", false);
          }
        }

        if (!Object.keys(lineData).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "times") {
          if (
            lineData.startTime !== "-" &&
            lineData.startTime &&
            lineData.endTime !== "-" &&
            lineData.endTime
          ) {
            this.$set(item, "defaultValue", [
              lineData.startTime,
              lineData.endTime
            ]);
          } else {
            this.$set(item, "defaultValue", "");
          }
        }
      });
    },
    //修改
    _mxEdit(row, ID) {
      this.currentEditFormData = {};
      let lineData = this.$deepClone(row);
      lineData = this._mxArrangeEditData(lineData);
      this.id = lineData[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.editFormConfigHandle(lineData);
      setTimeout(() => {
        this.$refs.formItemTit.clearValidate();
      }, 0);
      this.getAllCorp();
      this.getRole();
      this.getAgent();
      this.getSaleman();
      this.formConfig.forEach(item => {
        if (item.key === "loginName") {
          item.disabled = true;
        }
      });
      this.addChannel = true;
    },
    // 审核
    _mxCheck(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "审核";
      this.formConfig.forEach(item => {
        for (let keys in row) {
          if (item.key === keys) {
            if (row[keys] === 0) {
              this.$set(item, "defaultValue", "0");
            } else {
              this.$set(item, "defaultValue", row[keys]);
            }
          }
        }
      });
      this.addChannel = true;
    },
    //提交表单前调整表单内数据
    _mxArrangeSubmitData(formData) {
      let form = Object.assign({}, formData);
      for (let key in form) {
        if (key === "blackLevel" || key === "mmsBlackLevel") {
          form[key] = form[key].join(",");
        }
        if (
          key === "productType" ||
          key === "mmsProType"
          // key === "proType"
        ) {
          if (
            form[key] &&
            form[key].length != 0 &&
            typeof form[key] !== "string"
          ) {
            form[key] = form[key].reduce(function(prev, curr) {
              return prev + curr;
            });
          } else {
            form[key] = null;
          }
        }
      }
      return form;
    },
    /**
     * 提交表单操作
     * @param form    表单数据
     * @param editId        编辑修改id
     * @private
     */
    _mxHandleSubmit(form = {}, editId = this.editId) {
      form = this._mxArrangeSubmitData(form);
      const { namespace, add, edit, check } = this.searchAPI;
      let params = {
        ...form
      };
      params.startTime = params.times ? params.times[0] : "";
      params.endTime = params.times ? params.times[1] : "";

      if (this.formTit == "新增") {
        this.$http[namespace][add](params).then(res => {
          this._mxSuccess(res, params);
        });
      } else if (this.formTit == "修改") {
        params = Object.assign(params, {
          [editId]: this.id
        });
        this.$http[namespace][edit](params).then(res => {
          this._mxSuccess(res, params);
        });
      } else if (this.formTit == "审核") {
        params = Object.assign(params, {
          [editId]: this.id,
          status: "2"
        });
        // params.data[editId] = this.id
        // this.$set(params.data, editId, this.id)
        this.$http[namespace][check](params).then(res => {
          this._mxSuccess(res, params);
        });
      }
    },

    /**
     * 提交成功后执行
     * @param res
     */
    _mxSuccess(res, params) {
      if (resOk(res)) {
        // 删除操作后的页面 避免出现BUG
        this.$store.dispatch("tagsView/delView", this.$route);
        this.$message.success(res.msg || res.data);
        window.history.back();
        this.addChannel = false;
      } else {
        this.formConfig.forEach(item => {
          if (item.key === "blackLevel") {
            let arr = params.blackLevel.split(",");
            item.defaultValue = arr.map(item => Number(item));
          }
          if (item.key === "mmsBlackLevel") {
            let arr = params.mmsBlackLevel.split(",");
            item.defaultValue = arr.map(item => Number(item));
          }
        });
        this.$message.error(res.data || res.msg);
      }
    },
    /**
     * 关闭弹窗
     */
    _mxCancel() {
      // 删除操作后的页面 避免出现BUG
      this.$store.dispatch("tagsView/delView", this.$route);
      window.history.back();
      this.addChannel = false;
      setTimeout(() => {
        this.$refs.formItemTit.resetForm();
      }, 0);
    },
    beforeClose() {
      this.addChannel = false;
    },
    handleSubmitSpeed(userId, submitSpeed) {
      this.speedVisible = true;
      this.submitSpeedTit = submitSpeed ? "修改提交速率" : "配置提交速率";
      this.userId = userId;
      this.speedVal = submitSpeed;
    },
    submitSpeeds() {
      if (this.speedVal <= 0) {
        this.$message.error("提交速率必须大于0");
        return;
      }
      if (!Number(this.speedVal)) {
        this.$message.error("提交速率只允许输入数字");
        return;
      }
      if (Number(this.speedVal) > 1000) {
        this.$message.error("最大不能超过1000");
        return;
      }
      const str =
        typeof this.speedVal === "string" ? this.speedVal : this.speedVal + "";
      if (str.indexOf(".") !== -1) {
        this.$message.error("提交速率不允许有小数");
        return;
      }
      let params = {
        userId: this.userId,
        submitSpeed: this.speedVal
      };
      this.$http.corpUser.configureSubmitRate(params).then(res => {
        if (resOk(res)) {
          this.speedVisible = false;
          this.$message.success("操作成功");
          this._mxGetList();
        } else {
          this.$message.error(res.data);
        }
      });
    },
    //获取黑名单类型
    getBlackFroup() {
      this.$http.smsBlackGroup.listBlackGroup().then(res => {
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "blackLevel",
          "groupId",
          "blackGroupName"
        );
        // this._setDefaultValue(
        //   this.formConfig,
        //   res.data,
        //   "mmsBlackLevel",
        //   "groupId",
        //   "blackGroupName"
        // );
      });
    },
    //获取所有标签
    listTag() {
      this.$http.smsTagController
        .listTag({ pageNumber: 1, pageSize: 9999 })
        .then(res => {
          if (resOk(res)) {
            this.tagsData[0].optionData = res.data.list.map(v => {
              return { key: v.id, value: v.name };
            });
            this._setDefaultValue(
              this.searchFormConfig,
              res.data.list,
              "tag",
              "id",
              "name"
            );
          }
        });
    },
    //提交选择标签
    submitTags(data) {
      this.$http.userTag
        .batchSave({ userId: this.userId, tagIds: data.smsTags })
        .then(res => {
          if (resOk(res)) {
            this.tagStatus = false;
            const msg =
              this.tagStatusTitle === "添加标签" ? "添加成功" : "修改成功";
            this.$message.success(msg);
            this._mxGetList();
          }
        });
    },
    //添加标签
    addTag(id) {
      this.userId = id;
      this.tagsData[0].defaultValue = [];
      this.tagStatusTitle = "添加标签";
      this.tagStatus = true;
    },
    //修改标签
    editTag(id, arr) {
      this.userId = id;
      this.tagsData[0].defaultValue = arr.map(v => v.id);
      this.tagStatusTitle = "修改标签";
      this.tagStatus = true;
    },

    //信息弹框
    messageShow(row) {
      const h = this.$createElement;
      this.$msgbox({
        title: "信息",
        message: this.createElement(h, row),
        showConfirmButton: false
      });
      console.log(row.proType, "--------------");
    },
    //获取所有商户
    getAllCorp() {
      this.$http.corp.queryAllCorp().then(res => {
        if (resOk(res)) {
          let arr = [];
          this.formConfig.forEach(item => {
            if (item.key === "corpId") {
              res.data.forEach(t => {
                let obj = {
                  key: t.corpId,
                  value: t.corpName
                };
                arr.push(obj);
              });
              item.optionData = arr;
            }
          });

          // this._setDefaultValue(
          //   this.formConfig,
          //   res.data,
          //   "corpId",
          //   "corpId",
          //   "corpName"
          // );
        }
      });
    },
    //获取销售员
    getSaleman() {
      this.$http.sysSales.queryAvailableSaleman().then(res => {
        if (resOk(res)) {
          this.saleList = res.data;
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
    //获取代理商
    getAgent() {
      this.$http.agent.queryAgent({ status: 1 }).then(res => {
        if (resOk(res)) {
          this._setDefaultValue(
            this.formConfig,
            res.data,
            "agentId",
            "agentId",
            "agentName"
          );
          this._setDefaultValue(
            this.searchFormConfig,
            res.data,
            "agentId",
            "agentId",
            "agentName"
          );
        }
      });
    },
    //获取角色
    getRole() {
      let params = {
        roleType: 1,
        status: 1
      };
      this.$http.role.getRoleByType(params).then(res => {
        if (resOk(res)) {
          this._setDefaultValue(
            this.formConfig,
            res.data,
            "roleId",
            "roleId",
            "roleName"
          );
        }
      });
    },
    //修改状态
    setType(row, type, status) {
      this.dialogTitle(type);
      this.currentRowData = row;
      this.dialogVisible = true;
      this.status = status;
      // "corpId":"7080", "status":"3"
    },
    dialogTitle(type) {
      let str = {};
      switch (type) {
        case "disable":
          str.title = "停用";
          str.information = "您确定要停用商户吗？";
          break;
        case "init":
          str.title = "审核";
          str.information = "审核后，商户将正常使用，您确认要审核吗？";
          break;
        case "enabled":
          str.title = "启用";
          str.information = "启用后商户将正常使用，您确定要启用商户吗？";
          break;
      }
      this.dialogTit = str.title;
      this.information = str.information;
    },
    updateStatus() {
      const { userId } = this.currentRowData;
      this.$http.corpUser
        .updateStatus({ userId: userId, status: this.status })
        .then(res => {
          const { code, msg } = res;
          if (code === 200) {
            this.$message.success(msg);
            this._mxGetList();
          }
        });
      this.dialogVisible = false;
    },

    createElement(h, row) {
      let arr = [];
      if (row.proTypes && row.proTypes !== "-" && row.proTypes.length != 0) {
        arr = row.proTypes;
      } else {
        arr = row.mmsProTypes;
      }
      let proType = [];
      arr.forEach(item => {
        if (item == 1) {
          proType.push("web端");
        } else if (item == 2) {
          proType.push("http接口");
        } else if (item == 4) {
          proType.push("cmpp接口");
        }
      });
      let strType = proType.join("、");
      return h("div", null, [
        h("p", null, [
          h("span", null, "产品类型: "),
          h("span", null, `${strType || ""}`)
        ]),
        h("p", null, [
          h("span", null, "商户名称: "),
          h("span", null, `${row.corpName}`)
        ]),
        h("p", null, [
          h("span", null, "登录账号: "),
          h("span", null, `${row.loginName}`)
        ]),
        h("p", null, [
          h("span", null, "密码: "),
          h("span", null, `${row.password}`)
        ]),
        h("p", null, [
          h("span", null, "网址: "),
          h("span", null, "http://user.sms.jvtdtest.top")
        ]),
        h("p", null, [
          h("span", null, "客户端IP: "),
          h("span", null, `${row.userIp || ""}`)
        ]),
        h("p", null, [
          h("span", null, "接口地址: "),
          h("span", null, `${row.mmsAuditCallBack || ""}`)
        ]),
        h("p", null, [
          h("span", null, "协议端口: "),
          h("span", null, `${row.directPort || ""}`)
        ]),
        h("p", null, [
          h("span", null, "协议: "),
          h("span", null, `${row.directPort}`)
        ]),
        h("p", null, [h("span", null, "通道接入码: "), h("span", null, ``)]),
        h("p", null, [
          h("span", null, "链接路数: "),
          h("span", null, `${row.maxSession || ""}`)
        ]),
        h("p", null, [
          h("span", null, "通道速率: "),
          h("span", null, `${row.submitSpeed || ""}`)
        ])
      ]);
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .userManagementType .el-form-item {
  margin-bottom: 30px !important;
}
</style>
