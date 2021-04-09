<template>
  <!--充值-->
  <div class="sysRecharge">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    >
      <template slot="Other">
        <el-button type="primary" @click="transfers" size="small"
          >账号互转</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="chargeType" label="产品">
        <template slot-scope="scope">
          <span v-if="scope.row.chargeType == 1">短信</span>
          <span v-if="scope.row.chargeType == 2">彩信</span>
        </template>
      </el-table-column>
      <el-table-column prop="beforeBalance" label="操作前的条数" />
      <el-table-column prop="cardCount" label="当前操作条数" />
      <el-table-column prop="afterBalance" label="操作后的条数" />
      <el-table-column prop="cardUnit" label="当前操作单价(分)" />
      <el-table-column prop="cardMoney" label="金额(元)" />
      <el-table-column prop="paidWay" label="操作类型">
        <template slot-scope="scope">
          <span v-if="scope.row.paidWay == 0">充值</span>
          <span v-if="scope.row.paidWay == 1">授信</span>
          <span v-if="scope.row.paidWay == 2">余额-</span>
          <span v-if="scope.row.paidWay == 3">还款</span>
          <span v-if="scope.row.paidWay == 4">清授信</span>
          <span v-if="scope.row.paidWay == 5">账号互转</span>
          <span v-if="scope.row.paidWay == 6">余额+</span>
        </template>
      </el-table-column>
      <el-table-column prop="reductModel" label="计费类型" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.reductType === 1">账户计费</span>
          <span v-if="scope.row.reductType === 2">商户id计费</span>
          <!-- <span>；
            {{
              scope.row.reductModel == 1
                ? "预付提交计费"
                : scope.row.reductModel == 2
                ? "预付成功计费"
                : scope.row.reductModel == 3
                ? "后付提交计费"
                : "后付成功计费"
            }}
            {
          type: "select",
          label: "账单类型",
          key: "isBill",
          optionData: [
            { key: "0", value: "充值记录" },
            { key: "1", value: "月度账单" },
            { key: "2", value: "退款记录" },
            { key: "3", value: "借款记录" },
            { key: "4", value: "还款记录" },
            { key: "5", value: "互转记录" }
          ]
        },
          </span> -->
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="到款方式" />
      <el-table-column prop="isBill" label="账单类型">
        <template slot-scope="scope">
          <span v-if="scope.row.isBill == 0">充值记录</span>
          <span v-if="scope.row.isBill == 1">月度账单</span>
          <span v-if="scope.row.isBill == 2">余额-记录</span>
          <span v-if="scope.row.isBill == 3">授信记录</span>
          <span v-if="scope.row.isBill == 4">还款记录</span>
          <span v-if="scope.row.isBill == 5">互转记录</span>
          <span v-if="scope.row.isBill == 6">清授信记录</span>
          <span v-if="scope.row.isBill == 7">余额+记录</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="creater" label="操作账号" />
      <el-table-column prop="createTime" label="创建时间" width="150">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="modifier" label="审核人" />
      <el-table-column prop="modifyTime" label="审核时间" width="150">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="cardStatus" label="财务审核">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.cardStatus == 0
                ? "未操作"
                : scope.row.cardStatus == 1
                ? "审核通过"
                : "审核驳回"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="70">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.cardStatus === 1"
            @click="_mxEdit(scope.row, 'cardId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <!-- <el-button @click="_mxDeleteItem('signId', scope.row.signId)" type="text" size="small">删除</el-button> -->
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
      width="80%"
    >
      <FormItemTitle
        :colSpan="12"
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
        @selectChange="selectChange"
        @inpChange="inpChange"
        @handleSuccess="handleSuccess"
        @handleRemove="handleRemove"
        @handleExceed="handleExceed"
      ></FormItemTitle>
    </el-dialog>
    <el-dialog
      title="账号互转"
      :visible.sync="transfersDialog"
      :close-on-click-modal="false"
      style="margin: 0 auto"
      top="45px"
      width="80%"
    >
      <FormItemTitle
        ref="formItems"
        :colSpan="12"
        :formConfig="formConfigTransfers"
        btnTxt="确认转移"
        @submit="transfersSubmit"
        @cancel="transfersCancel"
        @choose="choose"
        @selectChange="selectChangeShift"
        @inpChange="inpChangeShift"
      ></FormItemTitle>
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
import FormItemTitle from "@/components/formItemTitle";

export default {
  mixins: [listMixin],
  components: { FormItemTitle },
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      transfersDialog: false,
      //接口地址
      searchAPI: {
        namespace: "sysRecharge",
        list: "listPrepaidCardByPage",
        detele: "",
        add: "addPrepaidCard",
        edit: "updatePrepaidCard"
      },
      // 列表参数
      namespace: "prepaidCard",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        // {
        //   type: "inputNum",
        //   label: "充值卡号",
        //   key: "cardNum",
        //   placeholder: "请输入充值卡号",
        // },
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId"
        },
        {
          type: "inputNum",
          label: "商户名称",
          key: "corpName"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "inputNum",
          label: "账户名称",
          key: "userName"
        },
        {
          type: "select",
          label: "产品",
          key: "chargeType",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "彩信" }
          ]
        },
        {
          type: "select",
          label: "操作类型",
          key: "paidWay",
          optionData: [
            { key: "0", value: "充值" },
            // { key: 2, value: "扣款" },
            // { key: 1, value: "借款" },
            { key: 3, value: "还款" },
            { key: 1, value: "授信" },
            { key: 4, value: "清授信" },
            { key: 6, value: "余额+" },
            { key: 2, value: "余额-" },

            { key: 5, value: "账号互转" }
          ]
        },

        {
          type: "select",
          label: "账单类型",
          key: "isBill",
          optionData: [
            { key: "0", value: "充值记录" },
            { key: "1", value: "月度账单" },
            { key: "2", value: "余额-记录" },
            { key: "3", value: "授信记录" },
            { key: "4", value: "还款记录" },
            { key: "5", value: "互转记录" },
            { key: "6", value: "清授信记录" },
            { key: "7", value: "余额+记录" }
          ]
        },
        {
          type: "select",
          label: "操作类型",
          key: "direction",
          optionData: [
            { key: "对公付款", value: "对公付款" },
            { key: "对私付款", value: "对私付款" },
            { key: "无", value: "无" }
          ]
        },
        {
          type: "daterange",
          label: "按时间查询",
          key: ["", "startTime", "endTime"],
          placeholder: "按时间查询"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "操作类型",
          key: "paidWay",
          initDefaultValue: "0",
          defaultValue: "0",
          colSpan: 12,
          optionData: [
            { key: "0", value: "充值" },
            // { key: 2, value: "扣款" },
            // { key: 1, value: "授信" },
            { key: 3, value: "还款" },
            { key: 1, value: "授信" },
            { key: 4, value: "清授信" },
            { key: 6, value: "余额+" },
            { key: 2, value: "余额-" },
            { key: 5, value: "账号互转" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "产品",
          colSpan: 12,
          initDefaultValue: 1,
          defaultValue: 1,
          key: "chargeType",
          optionData: [
            { key: 1, value: "短信" },
            { key: 2, value: "彩信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          colSpan: 12,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          disabled: true,
          colSpan: 12,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          disabled: true,
          colSpan: 12,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "计费类型",
          key: "reductType",
          colSpan: 12,
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            { key: 1, value: "账户计费" }
            // { key: 2, value: "商户id计费" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "select",
          label: "销售员签名",
          colSpan: 12,
          key: "saleMan",
          optionData: []
        },
        {
          type: "textarea",
          label: "备注",
          maxlength: 300,
          key: "remark",
          colSpan: 24
        },
        {
          isTitle: true,
          title: "短信",
          colSpan: 24
        },

        {
          type: "input",
          label: "单价(分)",
          key: "cardUnit",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/,
              message: "请输入大于0的数字",
              trigger: "blur"
            }
          ]
        },
        {
          type: "input",
          label: "充值金额(元)",
          key: "cardMoney",
          isShow: false,
          tag: "skype",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/,
              message: "请输入大于0的数字",
              trigger: "change"
            }
          ]
        },

        {
          type: "input",
          label: "条数",
          key: "cardCount",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^\+?[1-9]\d*$/,
              message: "请输入大于0的正整数",
              trigger: "blur"
            }
          ]
        },
        {
          type: "select",
          label: "到款方式",
          key: "direction",
          tag: "recharge",
          isShow: false,
          optionData: [
            { key: "对公付款", value: "对公付款" },
            { key: "对私付款", value: "对私付款" },
            { key: "无", value: "无" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "实际收款额度",
          key: "factcardMoney",
          tag: "recharge",
          isShow: false,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/,
              message: "请输入大于0的数字",
              trigger: "blur"
            }
          ]
        },

        {
          type: "upload",
          label: "余额变动凭证",
          btnTxt: "上传凭证",
          key: "fileUrl",
          limit: 1,
          defaultValue: "",
          tip: "支持jpg/jpeg/png,大小在1M之内",
          defaultFileList: [],
          tag: "recharge",
          isShow: false,
          accept: ["png", "jpg", "jpeg"],
          rules: [
            { required: true, message: "请上传余额变动凭证", trigger: "blur" }
          ]
        }
      ],
      formConfigTransfers: [
        {
          type: "select",
          label: "转移产品",
          key: "chargeType",
          colSpan: 12,
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            { key: 1, value: "短信" },
            { key: 2, value: "彩信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "接收账户编号",
          key: "userIdTo",
          btnTxt: "选择用户",
          disabled: true,
          colSpan: 12,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "转移账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          colSpan: 12,
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "当前接收账户名称",
          key: "userNameTo",
          colSpan: 12,
          // disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "当前转移账户名称",
          key: "userName",
          colSpan: 12,
          // disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "select",
          label: "销售员签名",
          key: "saleMan",
          colSpan: 12,
          optionData: []
        },
        {
          type: "textarea",
          label: "备注",
          maxlength: 300,
          colSpan: 12,
          key: "remark"
        },
        {
          isTitle: true,
          title: "短信",
          colSpan: 24
        },
        {
          type: "input",
          label: "转移条数",
          key: "cardCount",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "转移方单价(分)",
          disabled: true,
          key: "cardUnit",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "转移金额(元)",
          key: "cardMoney",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "input",
          label: "接收方单价(分)",
          disabled: true,
          key: "cardUnitTo",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "接收条数",
          key: "cardCountTo",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      isChooseUser: false,
      chooseKey: ""
    };
  },
  mounted() {
    this.getSaleman();
  },
  computed: {},
  methods: {
    //文件上传成功
    handleSuccess({ response, file, fileList, item }) {
      if (response.code == 200) {
        const { accept, size } = item;
        let fileType = file.raw.name.split(".")[1];
        let fileSize = file.size;
        let isLt1M = size ? size * 1024 * 1024 : 1 * 1024 * 1024;
        if (accept && accept.lenght != 0) {
          if (!accept.includes(fileType) || fileSize > isLt1M) {
            this.$message.error("支持jpg/jpeg/png,大小在1M之内");
            this.formConfig.forEach(item => {
              if (item.key === "fileUrl") {
                item.defaultValue = "";
                item.defaultFileList = [];
              }
            });
            return false;
          }
        }
        this.formConfig.forEach(item => {
          if (item.key === "fileUrl") {
            item.defaultValue = response.data;
            item.defaultFileList = response.data;
          }
        });
      } else {
        this.$message.error(response.data);
      }
    },
    handleRemove({ file, fileList }) {
      this.formConfig.forEach(item => {
        if (item.key === "fileUrl") {
          item.defaultValue = "";
          item.defaultFileList = "";
        }
      });
    },
    handleExceed({ file, fileList }) {
      console.log(file);
      console.log(fileList);
      this.$message.error("仅允许上传一张！");
    },

    //选择控制
    selectChange({ val, item }) {
      // console.log(val);
      if (item.key === "chargeType") {
        // this._deleteDefaultValue(this.formConfig, "userId");
        // this._deleteDefaultValue(this.formConfig, "userName");
        // this._deleteDefaultValue(this.formConfig, "corporateId");
        // this._deleteDefaultValue(this.formConfig, "cardUnit");
        if (val === 1) {
          this.formConfig.forEach(item => {
            if (item.isTitle) {
              item.title = "短信";
            }
          });
        } else {
          this.formConfig.forEach(item => {
            if (item.isTitle) {
              item.title = "彩信";
            }
          });
        }
      }
      // 0、充值 1、授信 2、余额- 3、还款 4、清授信 6、余额+
      if (item.key === "paidWay") {
        this._deleteDefaultValue(this.formConfig, "cardMoney");
        this.formConfig.forEach(item => {
          if (val !== 6 && val !== 2) {
            if (val === "0" || val === 3) {
              if (val === "0") {
                if (item.key === "cardMoney") {
                  item.label = "充值金额(元)";
                }
              } else if (val === 3) {
                if (item.key === "cardMoney") {
                  item.label = "还款金额(元)";
                }
              }
              this._setDisplayShow(this.formConfig, "cardMoney", false);
              this._setDisplayShow(this.formConfig, "direction", false);
              this._setDisplayShow(this.formConfig, "factcardMoney", false);
              this._setDisplayShow(this.formConfig, "fileUrl", false);
            } else {
              if (val === 1) {
                if (item.key === "cardMoney") {
                  item.label = "授信金额(元)";
                }
              } else if (val === 4) {
                if (item.key === "cardMoney") {
                  item.label = "清授信金额(元)";
                }
              }
              this._setDisplayShow(this.formConfig, "cardMoney", false);
              this._setDisplayShow(this.formConfig, "direction", true);
              this._setDisplayShow(this.formConfig, "factcardMoney", true);
              this._setDisplayShow(this.formConfig, "fileUrl", true);
            }
          } else {
            this._setDisplayShow(this.formConfig, "cardMoney", true);
            this._setDisplayShow(this.formConfig, "direction", true);
            this._setDisplayShow(this.formConfig, "factcardMoney", true);
            this._setDisplayShow(this.formConfig, "fileUrl", true);
          }
        });
      }
      // if (item.key === "reductType") {
      //   if (val === 2) {
      //     this._setDisplayShow(this.formConfig, "corporateId", false);
      //   } else {
      //     this._setDisplayShow(this.formConfig, "corporateId", true);
      //   }
      // }
    },
    selectChangeShift({ val, item }) {
      if (item.key === "chargeType") {
        if (val === 1) {
          this.formConfigTransfers.forEach(item => {
            if (item.isTitle) {
              item.title = "短信";
            }
          });
        } else {
          this.formConfigTransfers.forEach(item => {
            if (item.isTitle) {
              item.title = "彩信";
            }
          });
        }
      }
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
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
            if (key === "fileUrl" && row[key]) {
              let file = [
                {
                  name: "凭证",
                  url: row[key]
                }
              ];
              this.$set(item, "defaultFileList", file);
            }
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "reductType") {
          if (item.defaultValue === 2) {
            this._setDisplayShow(this.formConfig, "corporateId", false);
          } else {
            this._setDisplayShow(this.formConfig, "corporateId", true);
          }
        }
        if (item.key !== "remark" && item.key !== "saleMan") {
          this.$set(item, "disabled", true);
          if (item.key === "userId") {
            this.$set(item, "btnDisabled", true);
          }
        }
        // if(item.key === "reductType")
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
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
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      //设置商户显示
      this._setDisplayShow(this.formConfig, "corporateId", true);
      this._setDisplayShow(this.formConfig, "cardMoney", false);
      this._setDisplayShow(this.formConfig, "direction", false);
      this._setDisplayShow(this.formConfig, "factcardMoney", false);
      this._setDisplayShow(this.formConfig, "fileUrl", false);
      // 初始上传文件为空
      this.formConfig.forEach(item => {
        if (item.key === "fileUrl") {
          item.defaultFileList = [];
        }
        if (item.key === "cardMoney") {
          item.label = "充值金额(元)";
        }
      });
    },

    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      if (formData.reductType == 2) {
        formData.userId = formData.corporateId;
      }
      return formData;
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
            this.formConfigTransfers,
            res.data,
            "saleMan",
            "userName",
            "actualName"
          );
        }
      });
    },
    /**
     * 编辑表单前调整表单内数据
     * @param row
     * @private
     */
    _mxArrangeEditData(row) {
      for (let key in row) {
        if (row[key] === 0) {
          row[key] = "0";
        }
      }
      return row;
    },
    // input输入事件
    inpChange(data) {
      const { val, item } = data;
      // 单价 金额 条数 相互计算
      // 权重为 单价>条数>金额
      let cardMoney = ""; //金额
      let cardUnit = ""; //单价
      let cardCount = ""; //条数
      if (
        item.key === "cardMoney" ||
        item.key === "cardUnit" ||
        item.key === "cardCount"
      ) {
        this.formConfig.forEach(el => {
          // 获取默认值
          if (el.key === "cardUnit") {
            cardUnit = el.defaultValue;
          } else if (el.key === "cardMoney") {
            cardMoney = el.defaultValue;
          } else if (el.key === "cardCount") {
            cardCount = el.defaultValue;
          }
        });
      }

      if (item.key === "cardMoney") {
        if (cardUnit) {
          let num = Math.round((cardMoney * 100) / cardUnit);
          this._setDefaultValue(this.formConfig, [], "cardCount", num);
        } else if (cardCount) {
          let num = Math.round((cardMoney * 100) / cardCount);
          this._setDefaultValue(this.formConfig, [], "cardUnit", num);
        }
      }
      if (item.key === "cardUnit") {
        if (cardCount) {
          let num = Math.round((cardUnit * cardCount) / 100);
          this._setDefaultValue(this.formConfig, [], "cardMoney", num);
        } else if (cardMoney) {
          let num = Math.round((cardMoney * 100) / cardUnit);
          this._setDefaultValue(this.formConfig, [], "cardCount", num);
        }
      }
      if (item.key === "cardCount") {
        if (cardUnit) {
          let num = Math.round((cardUnit * cardCount) / 100);
          this._setDefaultValue(this.formConfig, [], "cardMoney", num);
        } else if (cardMoney) {
          let num = Math.round((cardMoney * 100) / cardCount);
          this._setDefaultValue(this.formConfig, [], "cardUnit", num);
        }
      }
    },
    // input输入事件
    inpChangeShift(data) {
      const { val, item } = data;
      // 单价 金额 条数 相互计算
      // 权重为 单价>条数>金额
      let cardMoney = ""; //金额
      let cardUnit = ""; //单价
      let cardUnitTo = ""; //接收方单价
      let cardCount = ""; //条数
      if (item.key === "cardMoney" || item.key === "cardCount") {
        this.formConfigTransfers.forEach(el => {
          // 获取默认值
          if (el.key === "cardUnit") {
            cardUnit = el.defaultValue;
          } else if (el.key === "cardMoney") {
            cardMoney = el.defaultValue;
          } else if (el.key === "cardCount") {
            cardCount = el.defaultValue;
          } else if (el.key === "cardUnitTo") {
            cardUnitTo = el.defaultValue;
          }
        });
      }

      if (item.key === "cardMoney") {
        if (cardUnit && cardUnitTo) {
          let num = Math.round((cardMoney * 100) / cardUnit);
          this._setDefaultValue(this.formConfigTransfers, [], "cardCount", num);
          let count = parseInt((cardMoney * 100) / cardUnitTo);
          this._setDefaultValue(
            this.formConfigTransfers,
            [],
            "cardCountTo",
            count
          );
        }
      }
      if (item.key === "cardCount") {
        if (cardUnit && cardUnitTo) {
          let num = parseFloat((cardUnit * cardCount) / 100).toFixed(4);
          this._setDefaultValue(this.formConfigTransfers, [], "cardMoney", num);
          let count = parseInt((num * 100) / cardUnitTo);
          this._setDefaultValue(
            this.formConfigTransfers,
            [],
            "cardCountTo",
            count
          );
        }
      }
    },
    //显示选择用户弹窗
    choose(item) {
      this.chooseKey = item.key;
      this.isChooseUser = true;
    },
    //选择用户选取赋值
    chooseUserData(data) {
      let chargeType = "";
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "userName") {
          t.defaultValue = data.userName;
        }
        if (key === "corporateId") {
          t.defaultValue = data.corpId;
        }
        if (key === "chargeType") {
          chargeType = t.defaultValue;
        }
        if (key === "cardUnit") {
          if (chargeType == 2) {
            t.defaultValue =
              data.mmsCardUnit && data.mmsCardUnit !== "-"
                ? data.mmsCardUnit
                : "";
          } else {
            t.defaultValue =
              data.cardUnit && data.cardUnit !== "-" ? data.cardUnit : "";
          }
          // t.defaultValue =
          //   chargeType == 2
          //     ? data.mmsCardUnit || data.mmsCardUnit !== "-"
          //       ? data.mmsCardUnit
          //       : ""
          //     : data.cardUnit || data.cardUnit !== "-"
          //     ? data.cardUnit
          //     : "";
        }
      });
      this.formConfigTransfers.map(t => {
        const { key } = t;
        let chargeType = "";
        if (key === "chargeType") {
          chargeType = t.defaultValue;
        }
        if (this.chooseKey === "userId") {
          if (key === "userId") {
            t.defaultValue = data.userId;
          }
          if (key === "userName") {
            t.defaultValue = data.userName;
          }
          if (key === "cardUnit") {
            if (chargeType == 2) {
              t.defaultValue =
                data.mmsCardUnit && data.mmsCardUnit !== "-"
                  ? data.mmsCardUnit
                  : "";
            } else {
              t.defaultValue =
                data.cardUnit && data.cardUnit !== "-" ? data.cardUnit : "";
            }
          }
        } else if (this.chooseKey === "userIdTo") {
          if (key === "userIdTo") {
            t.defaultValue = data.userId;
          }
          if (key === "userNameTo") {
            t.defaultValue = data.userName;
          }
          if (key === "cardUnitTo") {
            if (chargeType == 2) {
              t.defaultValue =
                data.mmsCardUnit && data.mmsCardUnit !== "-"
                  ? data.mmsCardUnit
                  : "";
            } else {
              t.defaultValue =
                data.cardUnit && data.cardUnit !== "-" ? data.cardUnit : "";
            }
          }
        }
      });
    },
    transfers() {
      this.transfersDialog = true;
      setTimeout(() => {
        this.$refs.formItems.resetForm();
      }, 0);
    },
    transfersSubmit(form) {
      const params = {
        data: {
          ...form
        }
      };
      this.$http.sysRecharge.refundPrepaidCard(params).then(res => {
        if (resOk(res)) {
          this.$message.success(res.msg);
          this.transfersDialog = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    transfersCancel() {
      this.transfersDialog = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.mmsUserGateway {
}
</style>
