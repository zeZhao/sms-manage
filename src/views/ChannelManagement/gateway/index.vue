<template>
  <!--短信通道-->
  <div class="gateway">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="_mxCreate"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="gateway" label="编号" />
      <el-table-column prop="gatewayName" label="网关名称" />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="longCode" label="网关长号码" />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="sendTo" label="发送对象" />
      <el-table-column prop="unitPrice" label="通道价格(分)" />
      <el-table-column prop="conRequirements" label="发送内容" />
      <el-table-column prop="sendSpeed" label="速度" />
      <el-table-column prop="isSub" label="扩展" />
      <el-table-column prop="operateStatus" label="运营状态">
        <template slot-scope="scope">
          <span>{{ scope.row.operateStatus === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isDerect" label="直连" />
      <el-table-column prop="status" label="可用" />
      <el-table-column prop="otherGateway" label="备用网关" />
      <el-table-column prop="charger" label="通道负责人" />
      <el-table-column prop="priority" label="优先级" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'gatewayId')" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('gatewayId', scope.row.gatewayId)"
            type="text"
            size="small"
          >删除</el-button>
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
        :colSpan="12"
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
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
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "网关编号",
          key: "gateway",
          placeholder: "请输入网关编号"
        },
        {
          type: "input",
          label: "网关名称",
          key: "gatewayName",
          placeholder: "请输入网关名称"
        },
        {
          type: "input",
          label: "网关长号码",
          key: "longCode",
          placeholder: "请输入网关长号码"
        },
        {
          type: "select",
          label: "落地省份",
          key: "province",
          optionData: [],
          placeholder: "请选择落地省份"
        },
        {
          type: "select",
          label: "运营商",
          key: "gatewayType",
          optionData: [
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" }
          ],
          placeholder: "请选择落地省份"
        },
        {
          type: "select",
          label: "是否可用",
          key: "status",
          optionData: [
            { key: "0", value: "可用" },
            { key: 1, value: "不可用" }
          ],
          placeholder: "请选择落地省份"
        },
        {
          type: "select",
          label: "运营状态",
          key: "operateStatus",
          optionData: [
            { key: "1", value: "使用中" },
            { key: "2", value: "测试中" },
            { key: "3", value: "暂停使用" },
            { key: "4", value: "关停" },
            { key: "5", value: "弃用" },
            { key: "6", value: "全部" }
          ],
          placeholder: "请选择落地省份"
        },
        {
          type: "input",
          label: "通道负责人",
          key: "charger",
          placeholder: "请输入通道负责人"
        },
        {
          type: "input",
          label: "优先级",
          key: "priority",
          placeholder: "请输入优先级"
        },
        {
          type: "input",
          label: "发送内容",
          key: "conRequirements",
          placeholder: "请输入发送内容"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "网关编号",
          key: "gateway",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "网关名称",
          key: "gatewayName",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "网关公司名称",
          key: "companyName",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "网关IP",
          key: "ip",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "网关端口",
          key: "port",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "发送对象",
          key: "sendTo",
          optionData: [
            { key: "三网", value: "三网" },
            { key: "移动", value: "移动" },
            { key: "联通", value: "联通" },
            { key: "电信", value: "电信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "网关单价(分)",
          key: "unitPrice",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "网关长号码",
          key: "longCode",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否直连",
          key: "isDerect",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "非直连"
            },
            {
              key: 2,
              value: "直连"
            }
          ],
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "落地市",
          key: "city",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "运营状态",
          key: "operateStatus",
          optionData: [
            { key: 1, value: "使用中" },
            { key: 2, value: "测试中" },
            { key: 3, value: "暂停使用" },
            { key: 4, value: "关停" },
            { key: 5, value: "弃用" },
            { key: 6, value: "全部" }
          ],
          placeholder: "请选择运营状态"
        },
        {
          type: "input",
          label: "发送内容",
          key: "conRequirements"
        },
        {
          type: "input",
          label: "发送速度",
          key: "sendSpeed"
        },
        {
          type: "input",
          label: "联系人",
          key: "linkman"
        },
        {
          type: "input",
          label: "联系方式",
          key: "linkmanMobile"
        },
        {
          type: "input",
          label: "投诉率指标",
          key: "complaintRate"
        },
        {
          type: "input",
          label: "套餐",
          key: "packages"
        },
        {
          type: "input",
          label: "结算公司",
          key: "clearIngcorp"
        },
        {
          type: "select",
          label: "是否可用",
          key: "status",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道负责人",
          key: "charger"
        },
        {
          type: "input",
          label: "优先级",
          key: "priority"
        },
        {
          type: "input",
          label: "网关余额",
          key: "balance"
        },
        {
          type: "input",
          label: "单条字数",
          key: "singleLength"
        },
        {
          type: "select",
          label: "是否报备",
          key: "isReportRemarks",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否专用",
          key: "isExclusive",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否带签名",
          key: "hasSign",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否需要白名单",
          key: "isWhite",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否支持长短信",
          key: "isLong",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否支持上行",
          key: "isMo",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否支持报告",
          key: "isReport",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否支持扩展",
          key: "is_sub",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "input",
          label: "可扩展位数",
          key: "isSub"
        },
        {
          type: "select",
          label: "连不上网关自动转",
          key: "disconnectFailTurn",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "连续提交失败自动转",
          key: "submitFailTurn",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "低于成功率自动转",
          key: "succRate",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "失败状态自动转",
          key: "fsAutoChange",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "是否取路由",
          key: "isTwoRoute",
          defaultValue: "",
          optionData: [
            { key: "0", value: "不取" },
            { key: "1", value: "取" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "二次路由编号",
          key: "twoRouteNo"
        },
        {
          type: "textarea",
          label: "屏蔽省份",
          key: "shieldProvince"
        },
        {
          type: "input",
          label: "目标通道",
          key: "targetGateway"
        },
        {
          type: "input",
          label: "接口协议",
          key: "protocol"
        },
        {
          type: "textarea",
          label: "网关参数",
          key: "parameter"
        },
        {
          type: "input",
          label: "绑定主IP",
          key: "zyIpMaster"
        },
        {
          type: "input",
          label: "绑定从IP",
          key: "zyIvIce"
        },
        {
          type: "textarea",
          label: "特殊设置",
          key: "collocation"
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark"
        }
      ],
      ProvinceList: [] // 省份列表
    };
  },
  mounted() {
    this.listSysProvince();
  },
  computed: {},
  methods: {
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
            res.data.forEach(t => {
              let obj = {
                key: t.provinceId,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            res.data.forEach(t => {
              let obj = {
                key: t.provinceId,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },
    _mxArrangeEditData(row) {
      for (let key in row) {
        if (row[key] === true) {
          row[key] = "1";
        } 
        if(row[key] === false) {
          row[key] = "0";
        }
      }
      return row;
    },

    //countMonth
    _mxArrangeSubmitData(formData) {
      if (formData.countMonth) {
        formData.countMonth = new Date(formData.countMonth).Format("yyyy-MM");
      }
      return formData;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.gateway {
}
</style>
