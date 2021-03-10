<template>
  <!--免审管理-->
  <div class="sysExemptReviewManage">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="企业计费" />
      <el-table-column prop="userId" label="用户计费" />
      <el-table-column prop="userName" label="用户名" show-overflow-tooltip />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="exemptReviewType" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.exemptReviewType === 1
              ? "特服号"
              : scope.row.exemptReviewType === 2
              ? "客户编号"
              : "企业计费"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cmPassageway" label="移动通道" />
      <el-table-column prop="cuPassageway" label="联通通道" />
      <el-table-column prop="ctPassageway" label="电信通道" />
      <el-table-column prop="exemptReviewNum" label="免审数量" />
      <el-table-column prop="isTemplate" label="模板匹配">
        <template slot-scope="scope">
          <span v-if="scope.row.isTemplate === false">不需要</span>
          <span v-if="scope.row.isTemplate === true">需要</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="isParallelDetection"
        label="是否并行检测"
        width="110"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.isParallelDetection ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isLoss" label="是否亏损">
        <template slot-scope="scope">
          <span>{{ scope.row.isLoss === "1" ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="update_by" label="修改人" />
      <el-table-column prop="update_time" label="修改时间" width="150">
        <template slot-scope="scope">{{
          scope.row.update_time | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'exemptId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('exemptId', scope.row.exemptId)"
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
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
        @selectChange="selectChange"
        @onChange="onChange"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancel"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import { string } from "jszip/lib/support";

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
    const validatorNum = (rule, value, callback) => {
      console.log(Number(value));
      if (Number(value) > 5000) {
        callback(new Error("免审数量不能超出5000"));
      } else {
        callback();
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "sysExemptReviewManage",
        list: "listExemptReviewManageByPage",
        detele: "deleteExemptReviewManage",
        add: "addExemptReviewManage",
        edit: "updateExemptReviewManage"
      },
      // 列表参数
      namespace: "",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业计费",
          key: "corpId",
          placeholder: "请输入企业计费"
        },
        {
          type: "inputNum",
          label: "用户计费",
          key: "userId",
          placeholder: "请输入用户计费"
        },
        {
          type: "input",
          label: "用户名",
          key: "userName",
          placeholder: "请输入用户名"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "select",
          label: "类型",
          key: "exemptReviewType",
          optionData: [
            {
              key: "1",
              value: "特服号"
            },
            {
              key: "2",
              value: "客户编号"
            },
            {
              key: "3",
              value: "企业计费"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "select",
          label: "免审类型",
          key: "type",
          optionData: [
            {
              key: "1",
              value: "短信"
            }
          ],
          placeholder: "请选择免审类型"
        },
        {
          type: "select",
          label: "移动通道编号",
          key: "ctPassageway",
          optionData: []
        },
        {
          type: "select",
          label: "联通通道编号",
          key: "cuPassageway",
          optionData: []
        },
        {
          type: "select",
          label: "电信通道编号",
          key: "cmPassageway",
          optionData: []
        },
        {
          type: "select",
          label: "是否并行检测",
          key: "isSarallelDetection",
          optionData: [
            {
              key: "0",
              value: "否"
            },
            {
              key: "1",
              value: "是"
            }
          ],
          placeholder: "请选择是否并行检测"
        },
        {
          type: "select",
          label: "是否亏损",
          key: "isLoss",
          optionData: [
            {
              key: "",
              value: "全部"
            },
            {
              key: "0",
              value: "否"
            },
            {
              key: "1",
              value: "是"
            }
          ]
        },
        {
          type: "select",
          label: "敏感词类别",
          key: "sensitiveWord",
          optionData: [],
          placeholder: "请选择敏感词类别"
        },
        {
          type: "select",
          label: "特殊需求",
          key: "specialNeeds",
          optionData: [
            {
              key: "扩展位数",
              value: "扩展位数"
            },
            {
              key: "显示号码",
              value: "显示号码"
            },
            {
              key: "特殊内容",
              value: "特殊内容"
            }
          ],
          placeholder: "请选择特殊需求"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户计费",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "企业计费",
          key: "corpId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "input",
          label: "特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "单价",
          disabled: true,
          key: "cardUnit",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "类型",
          key: "exemptReviewType",
          initDefaultValue: 2,
          defaultValue: 2,
          optionData: [
            {
              key: 1,
              value: "特服号"
            },
            {
              key: 2,
              value: "客户编号"
            },
            {
              key: 3,
              value: "企业计费"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "radio",
          label: "通道排序",
          key: "",
          initDefaultValue: "1",
          defaultValue: "1",
          optionData: [
            { key: "1", value: "按价格排序" },
            { key: "2", value: "按通道号排序" },
            { key: "3", value: "按通道名称排序" }
          ]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cmPassageway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "备选移动通道",
        //   multiple: true,
        //   key: "spareCmPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "联通通道",
          key: "cuPassageway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "备选联通通道",
        //   multiple: true,
        //   key: "spareCuPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ctPassageway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "备选电信通道",
        //   multiple: true,
        //   key: "spareCtPassagewayId",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "是否包含通道组",
          key: "isGatewayGroup",
          disabled: true,
          optionData: [
            {
              key: "0",
              value: "否"
            },
            {
              key: "1",
              value: "是"
            }
          ]
          // isShow: true
        },
        {
          type: "checkbox",
          label: "关键字类别",
          initDefaultValue: [],
          defaultValue: [],
          optionData: [],
          key: "sensitiveWord"
        },
        {
          type: "input",
          label: "免审数量",
          key: "exemptReviewNum",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^\+?[1-9]\d*$/,
              message: "请输入大于0的正整数",
              trigger: "blur"
            },
            {
              validator: validatorNum,
              trigger: "blur"
            }
          ]
        },
        {
          type: "select",
          label: "是否需要模板",
          optionData: [
            {
              key: "1",
              value: "需要"
            },
            {
              key: "0",
              value: "不需要"
            }
          ],
          key: "isTemplate",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否检测并行",
          initDefaultValue: "0",
          defaultValue: "0",
          optionData: [
            {
              key: "1",
              value: "是"
            },
            {
              key: "0",
              value: "否"
            }
          ],
          key: "isParallelDetection",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否组合长信息",
          initDefaultValue: "0",
          defaultValue: "0",
          optionData: [
            {
              key: "1",
              value: "是"
            },
            {
              key: "0",
              value: "否"
            }
          ],
          key: "isCombination",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "特殊需求",
          key: "specialNeeds",
          optionData: [
            {
              key: "扩展位数",
              value: "扩展位数"
            },
            {
              key: "显示号码",
              value: "显示号码"
            },
            {
              key: "特殊内容",
              value: "特殊内容"
            }
          ],
          placeholder: "请选择特殊需求"
        },
        {
          type: "textarea",
          label: "备注信息",
          maxlength: 300,
          key: "remarks",
          placeholder: "备注信息不能超过300字",
          rules: [{ trigger: "blur", validator: validatorRemark }]
        }
      ],
      GatewayList: [], // 通道列表
      isChooseUser: false, //选择用户
      isGatewayGroup: "0" // 是否包含通道组
    };
  },
  mounted() {
    this.gateway("cuPassageway", "2", "1");
    this.gateway("ctPassageway", "3", "1");
    this.gateway("cmPassageway", "1", "1");
    this.getSensitiveWordGroup();
  },
  computed: {},
  methods: {
    // 单选通道排序操作
    onChange({ val, item }) {
      console.log(val, item);
      if (item.label === "通道排序") {
        this.gateway("cuPassageway", "2", val);
        this.gateway("ctPassageway", "3", val);
        this.gateway("cmPassageway", "1", val);
      }
    },
    selectChange({ val, item }) {
      const { key, optionData } = item;
      if (
        key === "cuPassageway" ||
        key === "ctPassageway" ||
        key === "cmPassageway"
      ) {
        optionData.forEach(t => {
          if (t.key === val) {
            if (t.status === "1") {
              this.formConfig.forEach(item => {
                if (item.key === "isGatewayGroup") {
                  item.defaultValue = "0";
                }
              });
              this.isGatewayGroup = "0";
            } else {
              this.formConfig.forEach(item => {
                if (item.key === "isGatewayGroup") {
                  item.defaultValue = "1";
                }
              });
              this.isGatewayGroup = "1";
            }
          }
        });
      }
    },
    //显示选择用户弹窗
    choose() {
      this.isChooseUser = true;
    },
    //关闭选择用户弹窗
    cancel(val) {
      this.isChooseUser = val;
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
        if (key === "code") {
          t.defaultValue = data.code;
        }
        if (key === "cardUnit") {
          t.defaultValue = data.cardUnit;
        }
      });
    },
    //获取敏感词组
    getSensitiveWordGroup() {
      this.$http.sysSensitiveWordGroup.listSensitiveWordGroup().then(res => {
        this._setDefaultValue(
          this.searchFormConfig,
          res.data,
          "sensitiveWord",
          "groupId",
          "groupName"
        );
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "sensitiveWord",
          "groupId",
          "groupName"
        );
        this.$nextTick(() => {
          this.formConfig.forEach(item => {
            if (item.key === "sensitiveWord") {
              res.data.forEach(t => {
                item.initDefaultValue.push(t.groupId);
                // item.defaultValue.push(t.groupId);
              });
              //initDefaultValue
            }
          });
        });

        // this.formConfig.map(item => {
        //   if (item.key === "sensitiveWord") {
        //     res.data.forEach(t => {
        //       item.defaultValue.push(t.groupName);
        //     });
        //   }
        // });
      });
      // console.log(this.formConfig, "111111111111");
    },
    /*
     * 获取通道列表
     * */
    gateway(keys, status, orderStatus) {
      const params = {
        data: {
          status: status,
          orderStatus: orderStatus
        }
      };
      this.$http.sysGatewayGroup.listGatewayAndGroup(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            item.optionData = [];
            res.data.forEach(t => {
              this.$set(t, "key", t.id);
              this.$set(t, "value", t.name);
              item.optionData.push(t);
            });
          }
        });
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            item.optionData = [];
            res.data.forEach(t => {
              this.$set(t, "key", t.id);
              this.$set(t, "value", t.id);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    /**
     * 编辑表单前调整表单内数据
     * @param row
     * @private
     */
    _mxArrangeEditData(row) {
      let obj = Object.assign({}, row);
      for (let key in obj) {
        if (
          key === "isParallelDetection" ||
          key === "isTemplate" ||
          key === "isCombination" ||
          key === "isGatewayGroup"
        ) {
          if (obj[key]) {
            obj[key] = "1";
          } else {
            obj[key] = "0";
          }
        }
        if (key === "sensitiveWord") {
          if (typeof obj[key] === "string") {
            let arr = obj[key].split(",");
            obj[key] = arr.map(item => {
              return Number(item);
            });
          }
        }
      }
      return obj;
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
      this.formConfig[0].btnDisabled = false;
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
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      for (let key in formData) {
        if (key === "sensitiveWord") {
          formData[key] = formData[key].join(",");
        }
      }
      this.$set(formData, "isGatewayGroup", this.isGatewayGroup);
      return formData;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysExemptReviewManage {
  overflow-y: auto;
}
</style>
