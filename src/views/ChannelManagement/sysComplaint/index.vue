<template>
  <!--投诉录入-->
  <div class="sysComplaint">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="code" label="通道码号" />
      <el-table-column prop="type" label="投诉类型" width="100" />
      <el-table-column prop="complaintSources" label="投诉来源" />
      <el-table-column prop="result" label="处理方式" />
      <el-table-column prop="content" label="投诉内容" />
      <el-table-column
        prop="adContent"
        label="实际下发内容"
        show-overflow-tooltip
      />
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="mobile" label="投诉手机号" width="120" />
      <el-table-column prop="complaintDate" label="投诉时间" width="100">
        <template slot-scope="scope">{{
          scope.row.complaintDate | Format
        }}</template>
      </el-table-column>
      <el-table-column prop="adTime" label="实际下发时间" width="100">
        <template slot-scope="scope">{{ scope.row.adTime | Format }}</template>
      </el-table-column>
      <!-- <template slot-scope="scope">
          <span>{{scope.row.adTime | timeFormat}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId === '0'">非法</span>
          <span v-if="scope.row.operaId === '1'">移动</span>
          <span v-if="scope.row.operaId === '2'">联通</span>
          <span v-if="scope.row.operaId === '3'">电信</span>
          <span v-if="scope.row.operaId === '4'">国际</span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="投诉次数" />
      <el-table-column prop="adNumber" label="实际下发次数" width="125" />
      <el-table-column prop="createDate" label="录入日期" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.createDate | Format }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sale" label="销售" />
      <el-table-column prop="remarks" label="备注" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'id')" type="text" size="small"
            >修改</el-button
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
        :colSpan="12"
        labelWidth="110"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="
          form => {
            _mxHandleSubmit(form, '', false);
          }
        "
        @cancel="_mxCancel"
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

export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      // 接口地址
      searchAPI: {
        namespace: "sysComplaints",
        list: "queryByPage",
        add: "addOrUpdate",
        edit: "addOrUpdate"
      },
      // 列表参数
      namespace: "sysComplaint",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "用户ID",
          key: "userId"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        },
        {
          type: "input",
          label: "通道码号",
          key: "code"
        },
        {
          type: "select",
          label: "投诉类型",
          key: "type",
          optionData: [
            { key: "验证码", value: "验证码" },
            { key: "有效验证码", value: "有效验证码" },
            { key: "会员营销", value: "会员营销" },
            { key: "非会员营销", value: "非会员营销" },
            { key: "行业通知", value: "行业通知" },
            { key: "黄赌毒", value: "黄赌毒" },
            { key: "短信欺诈", value: "短信欺诈" },
            { key: "钓鱼", value: "钓鱼" },
            { key: "金融", value: "金融" },
            { key: "其他", value: "其他" }
          ]
        },

        {
          type: "select",
          label: "处理方式",
          key: "result",
          optionData: [
            { key: "有效投诉", value: "有效投诉" },
            { key: "全量投诉", value: "全量投诉" },
            { key: "已核减", value: "已核减" },
            { key: "未下发", value: "未下发" }
          ]
        },

        {
          type: "input",
          label: "投诉内容",
          key: "content"
        },
        {
          type: "input",
          label: "投诉手机号",
          key: "mobile"
        },
        {
          type: "input",
          label: "实际下发内容",
          key: "adContent"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName"
        },
        {
          type: "input",
          label: "备注",
          key: "remarks"
        },
        {
          type: "daterange",
          label: "投诉时间",
          key: ["", "complaintDateStart", "complaintDateEnd"]
        },
        {
          type: "daterange",
          label: "录入日期",
          key: ["", "createDateStart", "createDateEnd"]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "用户类型",
          key: "userType",
          optionData: [
            { key: "1", value: "用户" },
            { key: "2", value: "企业" }
          ]
        },
        {
          type: "input",
          label: "用户ID",
          btnTxt: "选择用户",
          disabled: true,
          key: "userId",
          defaultValue: ""
        },
        {
          type: "input",
          label: "用户名称",
          disabled: true,
          defaultValue: "",
          key: "userName"
        },
        {
          type: "select",
          label: "通道编号",
          key: "gateway",
          optionData: [],
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "input",
          label: "通道码号",
          key: "code"
        },
        {
          type: "select",
          label: "投诉类型",
          key: "type",
          optionData: [
            { key: "验证码", value: "验证码" },
            { key: "有效验证码", value: "有效验证码" },
            { key: "会员营销", value: "会员营销" },
            { key: "非会员营销", value: "非会员营销" },
            { key: "行业通知", value: "行业通知" },
            { key: "黄赌毒", value: "黄赌毒" },
            { key: "短信欺诈", value: "短信欺诈" },
            { key: "钓鱼", value: "钓鱼" },
            { key: "金融", value: "金融" },
            { key: "其他", value: "其他" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "处理方式",
          key: "result",
          optionData: [
            { key: "有效投诉", value: "有效投诉" },
            { key: "全量投诉", value: "全量投诉" },
            { key: "已核减 ", value: "已核减 " },
            { key: "未下发", value: "未下发" }
          ]
        },
        {
          type: "date",
          label: "投诉时间",
          key: "complaintDate",
          disabledDate: {
            disabledDate(time) {
              return time.getTime() >= Date.now() - 8.64e6;
            }
          },
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "date",
          label: "实际下发时间",
          key: "adTime",
          disabledDate: {
            disabledDate(time) {
              return time > Date.now();
            }
          },
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "date",
          label: "录入时间",
          key: "createDate",
          disabledDate: {
            disabledDate(time) {
              return time > Date.now();
            }
          },
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "投诉来源",
          key: "complaintSources",
          optionData: [
            { key: "10089", value: "10089" },
            { key: "10086999", value: "10086999" },
            { key: "12321 ", value: "12321" },
            { key: "公信助手 ", value: "公信助手" },
            { key: "360助手 ", value: "360助手 " },
            { key: "10000 ", value: "10000 " },
            { key: "100010 ", value: "100010 " },
            { key: "其他", value: "其他" }
          ]
        },
        {
          type: "input",
          label: "投诉手机号",
          key: "mobile",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^([0-9]{3,4}\-)?[0-9]{7,8}$|^0?1[3|4|5|7|8|9][0-9]\d{8}$/,
              message: "手机号格式不对",
              trigger: "change"
            }
          ]
        },
        {
          type: "inputNum",
          label: "投诉次数",
          key: "count",
          minlength: 1,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "inputNum",
          label: "实际下发次数",
          key: "adNumber",
          minlength: 1,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "投诉内容",
          key: "content",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "实际下发内容",
          key: "adContent"
        },
        {
          type: "input",
          label: "签名",
          key: "sign"
        },
        {
          type: "input",
          label: "销售",
          key: "sale"
        },
        {
          type: "input",
          label: "备注",
          key: "remarks"
        },

        {
          type: "select",
          label: "是否加入黑名单",
          key: "ifAddBlack",
          optionData: [
            { key: "1", value: "是" },
            { key: "2", value: "否" }
          ]
        },
        {
          type: "select",
          label: "黑名单级别",
          key: "blackLevel",
          optionData: [
            { key: "0", value: "系统级" },
            // { key: "1", value: "网关级" },
            { key: "2 ", value: "客户级" },
            { key: "3 ", value: "营销级" }
            // { key: "4 ", value: "BSATS级 " }
          ]
        }
      ],
      isChooseUser: false
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
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
      });
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
      const { complaintDateEnd, complaintDateStart } = data;
      if (complaintDateStart) {
        data.complaintDateStart = new Date(complaintDateStart).Format(
          "yyyy-MM-dd 00:00:01"
        );
      }
      if (complaintDateEnd) {
        data.complaintDateEnd = new Date(complaintDateEnd).Format(
          "yyyy-MM-dd 23:59:59"
        );
      }
      return data;
    },
    _mxArrangeSubmitData(data) {
      const { complaintDate, adTime, createDate } = data;
      if (complaintDate) {
        data.complaintDate = new Date(complaintDate).Format("yyyy-MM-dd");
      }
      if (adTime) {
        data.adTime = new Date(adTime).Format("yyyy-MM-dd");
      }
      if (createDate) {
        data.createDate = new Date(createDate).Format("yyyy-MM-dd");
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
