<template>
  <!--企业用户-->
  <div class="corpUser">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="_mxCreate"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="gateway" label="企业/代理ID" />
      <el-table-column prop="gatewayName" label="用户ID" />
      <el-table-column prop="gatewayName" label="用户名" />
      <el-table-column prop="gatewayName" label="用户登录名" />
      <el-table-column prop="gatewayName" label="密码" />
      <el-table-column prop="gatewayName" label="业务类型" />
      <el-table-column prop="gatewayName" label="特服号" />
      <el-table-column prop="gatewayName" label="扩展长度" />
      <el-table-column prop="gatewayName" label="长号码" />
      <el-table-column prop="gatewayName" label="产品" />
      <el-table-column prop="gatewayName" label="产品类型" />
      <el-table-column prop="gatewayName" label="发送运营商" />
      <el-table-column prop="gatewayName" label="计费方式" />
      <el-table-column prop="gatewayName" label="计费类型" />
      <el-table-column prop="gatewayName" label="短信余额" />
      <el-table-column prop="gatewayName" label="借款" />
      <el-table-column prop="gatewayName" label="单价（分）" />
      <el-table-column prop="gatewayName" label="状态" />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'bid')" type="text" size="small">信息</el-button>
          <el-button @click="_mxEdit(scope.row, 'bid')" type="text" size="small">修改</el-button>
          <el-button
            :disabled="scope.row.status == '2'||scope.row.status == '3'"
            @click="setType(scope.row,'init','2')"
            type="text"
            size="small"
          >审核</el-button>
          <el-button
            v-if="scope.row.status == 2"
            @click="setType(scope.row,'disable','3')"
            style="color: #ec5858"
            type="text"
            size="small"
          >停用</el-button>
          <el-button
            v-if="scope.row.status == 3"
            @click="setType(scope.row,'enabled','2')"
            type="text"
            size="small"
          >启用</el-button>
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
      style="margin: 0 auto"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @selectChange="selectChange"
      ></FormItem>
    </el-dialog>
    <el-dialog
      :title="dialogTit"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>{{information}}</span>
      <p v-show=" dialogTit === '停用' " style="color: #EC5858">停用后将无法使用，请谨慎操作！</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
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
        edit: "updateStatus"
      },
      // 列表参数
      namespace: "gatewayBill",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户id",
          key: "userId",
          placeholder: "请输入用户id"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        },
        {
          type: "input",
          label: "用户特服号",
          key: "code",
          placeholder: "请输入用户特服号"
        },
        {
          type: "select",
          label: "是否是直客",
          key: "isDirectUser",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "代理商" }
          ],
          placeholder: "请选择"
        },
        {
          type: "select",
          label: "业务类型",
          key: "accountType",
          optionData: [
            { key: "1", value: "行业" },
            { key: "2", value: "营销" },
            { key: "3", value: "VIP" }
          ],
          placeholder: "请选择业务类型"
        },
        {
          type: "select",
          label: "产品",
          key: "productType",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "彩信" },
            { key: "3", value: "屏信" },
            { key: "4", value: "语音" }
          ],
          placeholder: "请选择产品"
        },
        {
          type: "select",
          label: "产品类型",
          key: "proType",
          optionData: [
            { key: "1", value: "web端" },
            { key: "2", value: "http接口" },
            { key: "3", value: "cmpp接口" },
            { key: "7", value: "音频接口" }
          ],
          placeholder: "请选择产品类型"
        },
        {
          type: "select",
          label: "计费方式",
          key: "reductModel",
          optionData: [
            { key: "1", value: "预付提交计费" },
            { key: "2", value: "预付成功计费" },
            { key: "3", value: "后付提交计费" },
            { key: "4", value: "后付成功计费" }
          ],
          placeholder: "请选择计费方式"
        },
        {
          type: "select",
          label: "计费类型",
          key: "reductType",
          optionData: [
            { key: "1", value: "为用户id计费" },
            { key: "2", value: "为企业id计费" }
          ],
          placeholder: "请选择计费类型"
        },
        {
          type: "select",
          label: "销售人员",
          key: "saleMan",
          optionData: [],
          placeholder: "请选择销售人员"
        },
        {
          type: "month",
          label: "创建时间",
          key: ["", "startDate", "endDate"],
          placeholder: "请选择创建时间"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户名",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "用户登录名",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "密码",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "用户特服号",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "计费类型",
          key: "reductType",
          optionData: [
            { key: "1", value: "为用户id计费" },
            { key: "2", value: "为企业id计费" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "计费方式",
          key: "reductModel",
          optionData: [
            { key: "1", value: "预付提交计费" },
            { key: "2", value: "预付成功计费" },
            { key: "3", value: "后付提交计费" },
            { key: "4", value: "后付成功计费" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "产品",
          key: "productType",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "彩信" },
            { key: "3", value: "屏信" },
            { key: "4", value: "语音" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "单价",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "产品类型",
          key: "proType",
          optionData: [
            { key: "1", value: "web端" },
            { key: "2", value: "http接口" },
            { key: "3", value: "cmpp接口" },
            { key: "7", value: "音频接口" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "协议端口",
          key: "proType"
        },
        {
          type: "select",
          label: "状态报告类型",
          key: "proType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: "1", value: "推送" },
            { key: "2", value: "自取(批量)" },
            { key: "3", value: "自取(单条)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "上行类型",
          key: "proType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: "1", value: "推送" },
            { key: "2", value: "自取(批量)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "推动报告地址",
          key: "gateway",
          defaultValue: ""
        },
        {
          type: "input",
          label: "推送上行地址",
          key: "gateway",
          defaultValue: ""
        },
        {
          type: "input",
          label: "客户IP地址",
          key: "gateway",
          defaultValue: ""
        },
        {
          type: "input",
          label: "备份IP",
          key: "gateway",
          defaultValue: ""
        },
        {
          type: "input",
          label: "客户联系人",
          key: "gateway",
          defaultValue: ""
        },
        {
          type: "input",
          label: "客户联系人电话",
          key: "gateway",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
        {
          type: "select",
          label: "是否是直客",
          key: "isDirectUser",
          optionData: [
            { key: "1", value: "短信" },
            { key: "2", value: "代理商" }
          ]
        },
        {
          type: "checkbox",
          label: "黑名单类型",
          key: "isDirectUser",
          optionData: [
            { key: "系统级", value: "系统级" },
            { key: "营销级", value: "营销级" }
          ]
        },

        {
          type: "select",
          label: "上行类型",
          key: "proType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: "1", value: "推送" },
            { key: "2", value: "自取(批量)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "上行类型",
          key: "proType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: "1", value: "推送" },
            { key: "2", value: "自取(批量)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "上行类型",
          key: "proType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: "1", value: "推送" },
            { key: "2", value: "自取(批量)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "上行类型",
          key: "proType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: "1", value: "推送" },
            { key: "2", value: "自取(批量)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "上行类型",
          key: "proType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: "1", value: "推送" },
            { key: "2", value: "自取(批量)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      currentRowData: {}
    };
  },
  mounted() {
    this.gateway();
    this.listSysProvince();
  },
  computed: {},
  methods: {
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
          str.information = "您确定要停用企业吗？";
          break;
        case "init":
          str.title = "审核";
          str.information = "审核后，企业将正常使用，您确认要审核吗？";
          break;
        case "enabled":
          str.title = "启用";
          str.information = "启用后企业将正常使用，您确定要启用企业吗？";
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
    selectChange(data) {
      const { val, item } = data;
      let obj = {};
      if (item.key === "gatewayName") {
        item.optionData.map(t => {
          if (t.key == val) {
            obj = t;
          }
        });
        this.formConfig.map(t => {
          const { key } = t;
          if (key === "gatewayName") {
            t.defaultValue = obj.gatewayName;
          }
          if (key === "gateway") {
            t.defaultValue = obj.gateway;
          }
        });
      }
    },
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
      });
    },
    /*
     * 获取通道列表
     * */
    gateway() {
      const params = {
        data: {
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
          if (key === "gatewayName") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gateway);
              this.$set(t, "value", t.gatewayName);
              // let obj = {
              //   key: t.gatewayId,
              //   value: t.gatewayName
              // };
              item.optionData.push(t);
            });
          }
        });
      });
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
.corpUser {
}
</style>
