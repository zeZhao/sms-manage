<template>
  <!--短信通道-->
  <div class="gateway">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="gateway" label="通道编号" show-overflow-tooltip />
      <el-table-column
        prop="gatewayName"
        label="通道名称"
        show-overflow-tooltip
      />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        prop="longCode"
        label="接入号"
        width="90"
        show-overflow-tooltip
      />
      <el-table-column prop="provinceName" label="省份" show-overflow-tooltip />
      <el-table-column prop="sendTo" label="运营商" show-overflow-tooltip />
      <el-table-column
        prop="unitPrice"
        label="价格(分)"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="type"
        label="通道类型"
        width="100"
        show-overflow-tooltip
      />
      <!-- <el-table-column prop="conRequirements" label="发送内容" show-overflow-tooltip /> -->
      <el-table-column
        prop="sendSpeed"
        label="发送速率"
        show-overflow-tooltip
      />
      <!-- <el-table-column prop="isSub" label="扩展" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.isSub ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operateStatus" label="运营状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.operateStatus === 1 ? "短信" : "-" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isDerect" label="直连" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.isDerect === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否可用" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.status ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="otherGateway"
        label="备用通道"
        show-overflow-tooltip
      />
      <!-- <el-table-column prop="charger" label="通道负责人" width="90" show-overflow-tooltip /> -->
      <!-- <el-table-column prop="priority" label="优先级" show-overflow-tooltip /> -->
      <el-table-column prop="clientId" label="账号" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="remark" label="通道状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.serverStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="
              val => {
                switchChange(val, scope.row.gateway);
              }
            "
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="smsTags"
        label="标签"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.smsTags.length">
            <span v-for="(item, index) in scope.row.smsTags" :key="index">
              {{ item ? item.name : "-" }}
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.smsTags.length"
            @click="addTag(scope.row.gatewayId)"
            type="text"
            size="small"
            >添加标签</el-button
          >
          <el-button
            v-if="scope.row.smsTags.length"
            @click="editTag(scope.row.gatewayId, scope.row.smsTags)"
            type="text"
            size="small"
            >修改标签</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'gatewayId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('gatewayId', scope.row.gatewayId)"
            type="text"
            size="small"
            >删除</el-button
          >
          <el-button
            @click="config(scope.row.gatewayId)"
            type="text"
            size="small"
            >配置</el-button
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
      width="80%"
    >
      <FormItemTitle
        :colSpan="12"
        :labelWidth="170"
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @selectChange="selectChange"
        @handleClick="handleClick"
      ></FormItemTitle>
    </el-dialog>

    <el-dialog
      title="配置"
      :visible.sync="configDialog"
      :close-on-click-modal="false"
      top="45px"
      width="50%"
    >
      <FormItem
        :colSpan="24"
        :labelWidth="120"
        ref="formItem"
        :formConfig="configData"
        btnTxt="确定"
        @submit="submitConfig"
        @cancel="cancelConfig"
      ></FormItem>
    </el-dialog>

    <el-dialog
      :title="tagStatusTitle"
      :visible.sync="tagStatus"
      :close-on-click-modal="false"
      top="45px"
      width="30%"
    >
      <FormItem
        :colSpan="24"
        :labelWidth="50"
        ref="formItem"
        :formConfig="tagsData"
        btnTxt="确定"
        @submit="submitTags"
        @cancel="tagStatus = false"
      ></FormItem>
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
      formTit: "新增",
      addChannel: false,
      configDialog: false,
      tagStatusTitle: undefined,
      tagStatus: false,
      id: undefined,
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
          type: "inputNum",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName",
          placeholder: "请输入通道名称"
        },
        {
          type: "input",
          label: "接入号",
          key: "longCode"
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          optionData: []
        },
        {
          type: "select",
          label: "运营商",
          key: "sendTo",
          optionData: [
            // { key: "1", value: "移动" },
            // { key: "2", value: "联通" },
            // { key: "3", value: "电信" }
            { key: "移动", value: "移动" },
            { key: "联通", value: "联通" },
            { key: "电信", value: "电信" },
            { key: "三网", value: "三网" },
            { key: "移动,联通", value: "移动,联通" },
            { key: "电信,联通", value: "电信,联通" },
            { key: "移动,电信", value: "移动,电信" }
          ]
        },
        {
          type: "select",
          label: "是否可用",
          key: "status",
          optionData: [
            { key: 1, value: "可用" },
            { key: "0", value: "不可用" }
          ]
        },
        {
          type: "select",
          label: "通道类型",
          key: "type",
          optionData: [
            { key: 1, value: "可用" },
            { key: "0", value: "不可用" }
          ]
        },
        {
          type: "select",
          label: "是否直连",
          key: "isDerect",
          optionData: [
            { key: 1, value: "是" },
            { key: "0", value: "否" }
          ]
        },
        // {
        //   type: "select",
        //   label: "运营状态",
        //   key: "operateStatus",
        //   optionData: [
        //     { key: "1", value: "使用中" },
        //     { key: "2", value: "测试中" },
        //     { key: "3", value: "暂停使用" },
        //     { key: "4", value: "关停" },
        //     { key: "5", value: "弃用" },
        //     { key: "6", value: "全部" }
        //   ]
        // },
        // {
        //   type: "input",
        //   label: "通道负责人",
        //   key: "charger",
        //   placeholder: "请输入通道负责人"
        // },
        // {
        //   type: "input",
        //   label: "优先级",
        //   key: "priority",
        //   placeholder: "请输入优先级"
        // },
        // {
        //   type: "input",
        //   label: "发送内容",
        //   key: "conRequirements",
        //   placeholder: "请输入发送内容"
        // },
        {
          type: "input",
          label: "标签",
          key: "labelName",
          placeholder: "请输入标签"
        },
        {
          type: "input",
          label: "账号",
          key: "clientId"
        },
        {
          type: "selectInp",
          label: "通道价格",
          key: ["priceCompare", "unitPrice"],
          optionData: [
            { key: ">=", value: "≥" },
            { key: "<=", value: "≤" },
            { key: ">", value: ">" },
            { key: "<", value: "<" },
            { key: "=", value: "=" }
          ]
        }
      ],
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
          maxlength: "4",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-8]\d{3}$/,
              message: "1-8开头4位数",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName",
          maxlength: "50",
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
          label: "通道公司名称",
          key: "companyName",
          maxlength: "50",
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
          label: "通道IP",
          key: "ip",
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
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "发送对象",
        //   key: "sendTo",
        //   multiple: true,
        //   optionData: [
        //     { key: "三网", value: "三网" },
        //     { key: "移动", value: "移动" },
        //     { key: "联通", value: "联通" },
        //     { key: "电信", value: "电信" },
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        // },
        {
          type: "input",
          label: "通道单价(分)",
          key: "unitPrice",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "运营状态",
          key: "operateStatus",
          defaultValue: "",
          optionData: [
            { key: 1, value: "使用中" },
            { key: 2, value: "测试中" },
            { key: 3, value: "暂停使用" },
            { key: 4, value: "关停" },
            { key: 5, value: "弃用" },
            { key: 6, value: "全部" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
            { key: "0", value: "不取" },
            { key: "1", value: "强制取" },
            { key: "2", value: "非强制取" }
          ]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "二次路由编号",
          key: "twoRouteNo"
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
          type: "input",
          label: "目标通道",
          key: "targetGateway"
        },
        {
          type: "select",
          label: "连不上通道自动转",
          key: "disconnectFailTurn",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "连续提交失败自动转",
          key: "submitFailTurn",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "低于成功率自动转",
          key: "succRate"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "失败状态自动转",
          key: "fsAutoChange"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
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
          ]
          // change: this.selectUser,
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "落地省份",
          key: "province",
          optionData: []
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "落地市",
          key: "city"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "通道参数",
          key: "parameter"
        },
        {
          type: "textarea",
          label: "屏蔽省份",
          key: "shieldProvince"
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          maxlength: "300"
        },
        {
          isBtn: true,
          btnTxt: "附加信息",
          colSpan: 24,
          show: true
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
          key: "conRequirements"
        },
        {
          type: "select",
          label: "是否支持长短信",
          key: "isLong",
          defaultValue: "",
          tag: "addition",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "input",
          label: "联系人",
          key: "linkman",
          tag: "addition",
          maxlength: "10",
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
          label: "联系方式",
          maxlength: "11",
          tag: "addition",
          key: "linkmanMobile",
          rules: [
            {
              pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
              message: "号码格式不对",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "单条字数",
          tag: "addition",
          key: "singleLength"
        },

        {
          type: "select",
          label: "是否专用",
          key: "isExclusive",
          tag: "addition",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "select",
          label: "是否带签名",
          tag: "addition",
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
          tag: "addition",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "input",
          label: "发送速度",
          tag: "addition",
          key: "sendSpeed"
        },

        {
          type: "input",
          label: "投诉率指标",
          tag: "addition",
          key: "complaintRate"
        },
        {
          type: "input",
          label: "套餐",
          tag: "addition",
          key: "packages"
        },
        {
          type: "input",
          label: "结算公司",
          key: "clearIngcorp",
          tag: "addition",
          maxlength: "50",
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
          label: "通道负责人",
          tag: "addition",
          key: "charger"
        },
        {
          type: "input",
          label: "优先级",
          tag: "addition",
          key: "priority"
        },
        {
          type: "input",
          label: "通道余额",
          tag: "addition",
          key: "balance"
        },

        {
          type: "input",
          label: "通道端口",
          tag: "addition",
          key: "port"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道长号码",
          tag: "addition",
          key: "longCode"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "input",
          label: "服务端ip",
          tag: "addition",
          key: "serverIp"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "服务端端口",
          tag: "addition",
          key: "serverPort"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "滑动窗口",
          tag: "addition",
          key: "slideWindow"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "账号",
          tag: "addition",
          key: "clientId"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "密码",
          tag: "addition",
          key: "sharedSecret"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道端口号",
          tag: "addition",
          key: "srcId"
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "select",
          label: "是否支持上行",
          tag: "addition",
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
          tag: "addition",
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
          tag: "addition",
          key: "isSub",
          defaultValue: "",
          optionData: [
            { key: "0", value: "否" },
            { key: "1", value: "是" }
          ]
        },
        {
          type: "input",
          label: "可扩展位数",
          tag: "addition",
          key: "isSub"
        },

        {
          type: "input",
          label: "业务代码",
          tag: "addition",
          key: "serviceId"
        },
        {
          type: "input",
          label: "商户代码",
          tag: "addition",
          key: "msgSrc"
        },

        {
          type: "input",
          label: "接口协议",
          tag: "addition",
          key: "protocol"
        },

        {
          type: "input",
          label: "绑定主IP",
          tag: "addition",
          key: "zyIpMaster"
        },
        {
          type: "input",
          label: "绑定从IP",
          tag: "addition",
          key: "zyIvIce"
        },
        {
          type: "input",
          label: "通道环境",
          key: "profile",
          tag: "addition",
          maxlength: "30",
          rules: [
            {
              pattern: /^([a-zA-Z0-9_]){1,30}$/,
              message: "只支持字母",
              trigger: "change"
            }
          ]
        },
        {
          type: "textarea",
          label: "特殊设置",
          tag: "addition",
          key: "collocation",
          maxlength: "300"
        }
      ],
      //选择配置
      configData: [
        {
          type: "input",
          label: "服务端ip",
          key: "serverIp",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "服务端端口",
          key: "serverPort",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "滑动窗口",
          key: "slideWindow",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "账号",
          key: "clientId",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "密码",
          key: "sharedSecret",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道端口号",
          key: "srcId",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "业务代码",
          key: "serviceId"
        },
        {
          type: "input",
          label: "商户代码",
          key: "msgSrc"
        }
      ],
      //添加/修改标签数据
      tagsData: [
        {
          type: "checkbox",
          key: "smsTags",
          defaultValue: [],
          optionData: []
        }
      ],
      ProvinceList: [], // 省份列表
      gatewayId: ""
    };
  },
  activated() {
    //重新获取数据
    this._mxGetList();
  },
  mounted() {
    this.listSysProvince();
    this.listTag();
  },
  computed: {},
  methods: {
    _mxCreate() {
      this.$router.push({
        path: "/geteway/getewayDetail",
        query: {
          type: "add"
        }
      });
    },
    _mxEdit(row, gatewayId) {
      this.$router.push({
        path: "/geteway/getewayDetail",
        query: {
          type: "edit",
          row: JSON.stringify(row),
          gatewayId
        }
      });
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
    //获取所有标签
    listTag() {
      this.$http.smsTagController
        .listTag({ pageNumber: 1, pageSize: 9999 })
        .then(res => {
          if (resOk(res) && res.data.list.length) {
            this.tagsData[0].optionData = res.data.list.map(v => {
              return { key: v.id, value: v.name };
            });
          }
        });
    },
    //添加标签
    addTag(id) {
      this.id = id;
      this.tagsData[0].defaultValue = [];
      this.tagStatusTitle = "添加标签";
      this.tagStatus = true;
    },
    //修改标签
    editTag(id, arr) {
      this.id = id;
      this.tagsData[0].defaultValue = arr.map(v => v.id);
      this.tagStatusTitle = "修改标签";
      this.tagStatus = true;
    },
    //配置
    config(gatewayId) {
      this.gatewayId = gatewayId;
      this.configData.forEach(item => {
        const { defaultValue, key, type } = item;
        if (defaultValue || this.configData[key]) {
          item.defaultValue = null;
          this.configData[key] = null;
        }
      });
      this.configDialog = true;
    },
    //配置提交
    submitConfig(form) {
      const params = {
        data: {
          gatewayId: this.gatewayId,
          ...form
        }
      };
      this.$http.gateway.updateGatewayByConfigure(params).then(res => {
        if (resOk(res)) {
          this.$message.success("配置成功！");
          this._mxGetList();
          this.configDialog = false;
        }
      });
    },
    //配置关闭
    cancelConfig() {
      this.configDialog = false;
    },
    //提交选择标签
    submitTags(data) {
      this.$http.smsChannelTagController
        .batchSave({ channelId: this.id, tagIds: data.smsTags })
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
    //开启关闭通道
    switchChange(val, gateway) {
      if (val) {
        this.$http.gateway
          .startGateway({
            data: {
              gatewayId: gateway
            }
          })
          .then(res => {
            if (resOk(res)) {
              this.$message.success("通道启用成功！");
            } else {
              this.$message.error("通道启用失败！");
              this.listData.forEach(item => {
                if (item.gateway == gateway) {
                  item.serverStatus = 0;
                }
              });
            }
          });
      } else {
        this.$http.gateway
          .stopGateway({
            data: {
              gatewayId: gateway
            }
          })
          .then(res => {
            if (resOk(res)) {
              this.$message.success("通道停止成功！");
            } else {
              this.$message.error("通道停止失败！");
              this.listData.forEach(item => {
                if (item.gateway == gateway) {
                  item.serverStatus = 1;
                }
              });
            }
          });
      }
    },
    selectChange({ val, item }) {
      // if (item.key === "sendTo") {
      //   [].includes;
      //   if (val.includes("三网")) {
      //     item.optionData.forEach((item) => {
      //       if (item.key != "三网") {
      //         this.$nextTick(() => {
      //           this.$set(item, "disabled", true);
      //         });
      //       }
      //     });
      //     console.log(val, "----三网----val");
      //     console.log(item, "-----三网---item");
      //   } else {
      //     item.optionData.forEach((item) => {
      //       this.$nextTick(() => {
      //         this.$set(item, "disabled", false);
      //       });
      //     });
      //   }
      // }
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
        if (row[key] === false) {
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
    },
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(list) {
      list.forEach(item => {
        item.province &&
          this.ProvinceList.forEach(t => {
            if (item.province == t.provinceId) {
              this.$set(item, "provinceName", t.provinceName);
              // item.province = t.provinceName;
            }
          });
      });
      return list;
    }
  }
};
</script>
