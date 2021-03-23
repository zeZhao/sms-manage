<template>
  <!--充值-->
  <div class="sysRecharge">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    >
      <template slot="Other">
        <el-button type="primary" @click="transfers">账号互转</el-button>
      </template>
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="chargeType" label="产品">
        <template slot-scope="scope">
          <span>
            {{ scope.row.chargeType == 1 ? "短信" : "彩信" }}
          </span>
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
          <span v-if="scope.row.paidWay == 1">借款</span>
          <span v-if="scope.row.paidWay == 2">余额-</span>
          <span v-if="scope.row.paidWay == 3">还款</span>
          <span v-if="scope.row.paidWay == 4">清授信</span>
          <span v-if="scope.row.paidWay == 5">账号转移充值</span>
          <span v-if="scope.row.paidWay == 6">余额+</span>
          <!-- <span>
            {{
              scope.row.paidWay == 0
                ? "充值"
                : scope.row.paidWay == 1
                ? "借款"
                : scope.row.paidWay == 2
                ? "扣款"
                : "还款"
            }}
          </span> -->
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
          </span> -->
        </template>
      </el-table-column>
      <el-table-column prop="direction" label="到款方式" />
      <el-table-column prop="isBill" label="账单类型">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.isBill == 0
                ? "充值记录"
                : scope.row.isBill == 1
                ? "月度帐单"
                : scope.row.isBill == 2
                ? "转移记录"
                : scope.row.isBill == 3
                ? "借款记录"
                : scope.row.isBill == 4
                ? "补款记录"
                : "转移记录"
            }}
          </span>
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
          scope.row.createTime | timeFormat
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
    >
      <FormItem
        ref="formItems"
        :formConfig="formConfigTransfers"
        btnTxt="确认转移"
        @submit="transfersSubmit"
        @cancel="transfersCancel"
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
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "select",
          label: "付款状态",
          key: "paidWay",
          optionData: [
            { key: "0", value: "充值" },
            { key: "1", value: "借款" },
            { key: "2", value: "扣款" },
            { key: "3", value: "还款" }
          ],
          placeholder: "类型"
        },
        {
          type: "select",
          label: "产品",
          key: "chargeType",
          optionData: [
            { key: "1", value: "短信" }
            // { key: "2", value: "彩信" }
          ],
          placeholder: "类型"
        },
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId",
          placeholder: "请输入商户编号"
        },

        {
          type: "select",
          label: "账单类型",
          key: "isBill",
          optionData: [
            { key: "0", value: "充值记录" },
            { key: "1", value: "月度账单" },
            { key: "2", value: "退款记录" },
            { key: "3", value: "借款记录" },
            { key: "4", value: "补款记录" },
            { key: "5", value: "转移记录" }
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
            // { key: 1, value: "借款" },
            { key: 3, value: "还款" },
            { key: 1, value: "授信" },
            { key: 4, value: "清授信" },
            { key: 6, value: "余额+" },
            { key: 2, value: "余额-" }
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
          label: "当前卡对应账户名称",
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
          // initDefaultValue: 2,
          defaultValue: "",
          optionData: [
            { key: 1, value: "账户计费" },
            { key: 2, value: "商户id计费" }
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
        // {
        //   type: "input",
        //   label: "授信金额(元)",
        //   key: "cardMoney",
        //   tag: "credit",
        //   isShow: true,
        //   rules: [
        //     { required: true, message: "请输入必填项", trigger: "blur" },
        //     {
        //       pattern: /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/,
        //       message: "请输入大于0的数字",
        //       trigger: "change"
        //     }
        //   ]
        // },
        // {
        //   type: "input",
        //   label: "清授信金额(元)",
        //   key: "cardMoney",
        //   tag: "clear",
        //   isShow: true,
        //   rules: [
        //     { required: true, message: "请输入必填项", trigger: "blur" },
        //     {
        //       pattern: /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/,
        //       message: "请输入大于0的数字",
        //       trigger: "change"
        //     }
        //   ]
        // },
        // {
        //   type: "input",
        //   label: "还款金额(元)",
        //   key: "cardMoney",
        //   tag: "refund",
        //   isShow: true,
        //   rules: [
        //     { required: true, message: "请输入必填项", trigger: "blur" },
        //     {
        //       pattern: /^[1-9]{1}[0-9]*$|^0{1}\.{1}[0-9]+$|^[1-9]{1}[0-9]*\.{1}[0-9]+$/,
        //       message: "请输入大于0的数字",
        //       trigger: "change"
        //     }
        //   ]
        // },

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
          rules: [
            { required: true, message: "请上传余额变动凭证", trigger: "blur" }
          ]
        }
      ],
      formConfigTransfers: [
        {
          type: "select",
          label: "产品类型",
          key: "chargeType",
          optionData: [
            { key: 1, value: "短信" },
            { key: 2, value: "彩信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "转移账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "当前转移的账户名称",
          key: "userName",
          // disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "接收账户编号",
          key: "userIdTo",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "当前接收的账户名称",
          key: "userNameTo",
          // disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "转移条数",
          key: "cardCount"
        },
        {
          type: "input",
          label: "转移方单价(分)",
          key: "cardUnit",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "转移金额",
          key: "cardMoney",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "接收方单价(分)",
          key: "cardUnitTo",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "接收条数",
          key: "cardCountTo",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "备注",
          key: "remark"
        },
        {
          type: "select",
          label: "销售员的名字",
          key: "saleMan",
          optionData: []
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
    handleSuccess({ response, file, fileList }) {
      if (response.code == 200) {
        this.formConfig.forEach(item => {
          if (item.key === "fileUrl") {
            item.defaultValue = response.data;
            console.log(item.defaultFileList);
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
      if (item.key === "paidWay") {
        this.formConfig.forEach(item => {
          if (val !== 6 && val !== 2) {
            if (val === "0" || val === 3) {
              if (val === "0") {
                if (item.key === "cardMoney") {
                  item.label = "充值金额(元)";
                }
              } else if (val === 3) {
                if (item.key === "cardMoney") {
                  item.label = "借款金额(元)";
                }
              }
              this._setDisplayShow(this.formConfig, "cardMoney", false);
              this._setDisplayShow(this.formConfig, "direction", false);
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
              this._setDisplayShow(this.formConfig, "fileUrl", true);
            }
          } else {
            this._setDisplayShow(this.formConfig, "cardMoney", true);
            this._setDisplayShow(this.formConfig, "direction", true);
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
      // 初始上传文件为空
      this.formConfig.forEach(item => {
        if (item.key === "fileUrl") {
          item.defaultFileList = [];
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
            "actualName",
            "actualName"
          );
          this._setDefaultValue(
            this.formConfigTransfers,
            res.data,
            "saleMan",
            "actualName",
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
      let cardMoney = ""; //金额
      let cardUnit = ""; //单价
      let cardCount = ""; //条数
      this.formConfig.forEach(item => {
        if (item.key === "cardUnit") {
          cardUnit = item.defaultValue;
        } else if (item.key === "cardMoney") {
          cardMoney = item.defaultValue;
        } else if (item.key === "cardCount") {
          cardCount = item.defaultValue;
        }
        if (cardUnit && cardMoney) {
          if (item.key === "cardCount") {
            item.defaultValue = Math.round((cardMoney * 100) / cardUnit);
          }
        }
        if (cardCount && cardMoney) {
          if (item.key === "cardUnit") {
            item.defaultValue = Math.round((cardMoney * 100) / cardCount);
          }
        }
        if (cardCount && cardUnit) {
          if (item.key === "cardMoney") {
            item.defaultValue = Math.round(cardUnit * 100 * cardCount);
          }
        }
      });
      if (item.key === "cardMoney") {
      }
      if (
        item.key === "cardMoney" ||
        item.key === "cardUnit" ||
        item.key === "cardCount"
      ) {
      }
    },
    //显示选择用户弹窗
    choose(item) {
      this.chooseKey = item.key;
      this.isChooseUser = true;
    },
    //选择用户选取赋值
    chooseUserData(data) {
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
      });
      this.formConfigTransfers.map(t => {
        const { key } = t;
        if (this.chooseKey === "userId") {
          if (key === "userId") {
            t.defaultValue = data.userId;
          }
          if (key === "userName") {
            t.defaultValue = data.userName;
          }
        } else if (this.chooseKey === "userIdTo") {
          if (key === "userIdTo") {
            t.defaultValue = data.userId;
          }
          if (key === "userNameTo") {
            t.defaultValue = data.userName;
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
