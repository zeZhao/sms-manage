<template>
  <!--短信通道-->
  <div class="gateway">
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      @exportData="_mxExportData"
    >
      <template slot="Other">
        <el-button
          type="primary"
          size="small"
          @click="$refs.Search.handleExport()"
          >导出</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="gateway" label="通道编号" />
      <el-table-column prop="gatewayName" label="通道名称" />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="longCode" label="接入号" width="90" />
      <el-table-column prop="provinceName" label="省份" />
      <el-table-column prop="sendTo" label="运营商" />
      <el-table-column prop="unitPrice" label="价格(分)" width="100" />
      <el-table-column prop="companyName" label="供应商" />
      <el-table-column prop="supplierId" label="供应商编号" width="90" />
      <el-table-column prop="type" label="通道类型" width="100">
        <template slot-scope="scope">
          <span>{{ renderType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="conRequirements" label="发送内容"  /> -->
      <el-table-column prop="sendSpeed" label="发送速率" />
      <!-- <el-table-column prop="isSub" label="扩展" >
        <template slot-scope="scope">
          <span>{{ scope.row.isSub ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operateStatus" label="运营状态" >
        <template slot-scope="scope">
          <span>{{ scope.row.operateStatus === 1 ? "短信" : "-" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="isDerect" label="直连">
        <template slot-scope="scope">
          <span>{{ scope.row.isDerect === 1 ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="是否可用">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="otherGateway" label="备用通道" />
      <!-- <el-table-column prop="charger" label="通道负责人" width="90"  /> -->
      <!-- <el-table-column prop="priority" label="优先级"  /> -->
      <el-table-column prop="clientId" label="账号" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="serverStatus" label="通道状态">
        <template slot-scope="scope">
          <!-- <el-switch
            v-if="scope.row.remark.indexOf('【手动】') === -1"
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
          ></el-switch> -->
          <span>{{ scope.row.serverStatus ? "开启" : "关闭" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="smsTags" label="标签" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.smsTags.length">
            <span v-for="(item, index) in scope.row.smsTags" :key="index">
              {{ item ? item.name : "-" }}
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="230">
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
            v-if="!scope.row.serverStatus"
            @click="switchChange(1, scope.row.gateway)"
            :disabled="!!(scope.row.remark.indexOf('【手动】') !== -1)"
            type="text"
            size="small"
            >开启</el-button
          >
          <el-button
            v-if="scope.row.serverStatus"
            @click="switchChange(0, scope.row.gateway)"
            :disabled="!!(scope.row.remark.indexOf('【手动】') !== -1)"
            type="text"
            size="small"
            >关闭</el-button
          >
          <el-button
            @click="_mxDeleteItem('gatewayId', scope.row.gatewayId)"
            type="text"
            size="small"
            >删除</el-button
          >
          <!-- <el-button
            @click="config(scope.row.gatewayId)"
            type="text"
            size="small"
            >配置</el-button
          > -->
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
      <h2>
        <span v-if="formTit === '新增'"
          >(上一通道编号为：{{ lastGateway }})</span
        >
      </h2>
      <FormItemTitle
        ref="formItem"
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
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
    </el-drawer>

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
      lastGateway: "",
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
        edit: "updateGateway",
        exportUrl: "/gateway/exportGateway",
        fileName: "短信通道"
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
          optionData: [{ key: 1, value: "可用" }, { key: "0", value: "不可用" }]
        },
        {
          type: "select",
          label: "通道类型",
          key: "type",
          optionData: [
            { key: 1, value: "Cmpp" },
            { key: 2, value: "Sgip" },
            { key: 3, value: "Smgp" },
            { key: 4, value: "http" }
          ]
        },
        {
          type: "select",
          label: "是否直连",
          key: "isDerect",
          optionData: [{ key: 1, value: "是" }, { key: 2, value: "否" }]
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
          type: "input",
          label: "供应商",
          key: "companyName"
        },
        {
          type: "inputNum",
          label: "供应商编号",
          key: "supplierId"
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
        },
        {
          type: "select",
          label: "通道状态",
          key: "serverStatus",
          optionData: [{ key: 1, value: "开启" }, { key: 0, value: "关闭" }]
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
          maxlength: "8",
          disabled: true,
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
          type: "select",
          label: "供应商",
          key: "supplierId",
          colSpan: 12,
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道名称",
          colSpan: 12,
          key: "gatewayName",
          maxlength: "30",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "公司服务器ip",
          key: "ip",
          initDefaultValue: "10.3.0.23",
          defaultValue: "10.3.0.23",
          colSpan: 12,
          optionData: [{ key: "10.3.0.23", value: "10.3.0.23" }],
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
          lock: true,
          maxlength: "4",
          defaultValue: "",
          rules: [{ required: true, trigger: "blur", validator: (rule, value, callback) => {
            if (!value) callback(new Error("请输入必填项"));
            if (isNaN(value)) {
              callback(new Error("只能输入数字"));
            } else {
              if (value > 0 && (value + "").indexOf(".") === -1) {
                callback();
              } else {
                callback(new Error("发送速率必须为大于0的正整数"));
              }
            }
          } }]
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
          initDefaultValue: "20",
          defaultValue: "20",
          colSpan: 12,
          lock: true
        },
        {
          type: "input",
          label: "费用类型",
          tag: "encrypt",
          key: "feeType",
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
          defaultValue: "",
          colSpan: 12,
          rules: [
            {
              required: false,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (value === "") callback();
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
          defaultValue: "",
          colSpan: 12,
          rules: [
            {
              required: false,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (value === "") callback();
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
          maxlength: "50"
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
      gatewayId: "",
      loginState: false,
      login: {
        account: "",
        password: ""
      },
      temporaryItem: {},
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
  mounted() {
    this._mxGetList();
    this.listSysProvince();
    this.listTag();
    this.getLastGateway();
    this.getProvinceTree();
    this.getsmsSupplierInfoQueryList();
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
  activated() {
    //重新获取数据
    this._mxGetList();
    this.listSysProvince();
    this.listTag();
    this.getLastGateway();
    this.getProvinceTree();
    this.getsmsSupplierInfoQueryList();
  },
  methods: {
    // 获取供应商下拉
    getsmsSupplierInfoQueryList() {
      this.$http.smsSupplierInfo.queryList({}).then(res => {
        const { code, data } = res;
        if (code === 200) {
          const idx = this.formConfig.findIndex(v => v.key === "supplierId");
          if (idx !== -1) {
            this.formConfig[idx].optionData = data.map(v => {
              return { key: v.supplierId, value: v.supplierName };
            });
          }
        } 
      })
    },
    renderType(v) {
      switch (v) {
        case 1:
          return "Cmpp";
        case 2:
          return "Sgip";
        case 3:
          return "Smgp";
        case 4:
          return "http";
        default:
          return "-";
      }
    },
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach(item => {
        if (item.tag === "encrypt") {
          item.lock = false;
        }
        if (item.key === "gateway") {
          item.disabled = false;
        }
      });
      // this.$router.push({
      //   path: "/geteway/getewayDetail",
      //   query: {
      //     type: "add"
      //   }
      // });
    },
    _mxEdit(row, ID) {
      // this.$router.push({
      //   path: "/geteway/getewayDetail",
      //   query: {
      //     type: "edit",
      //     row: JSON.stringify(row),
      //     gatewayId
      //   }
      // });
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key] !== "-" ? row[key] : "");
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        this.formConfig.forEach(item => {
          if (item.tag === "encrypt") {
            item.lock = true;
          }
          if (item.key === "gateway") {
            item.disabled = true;
          }
        });
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
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
        this.$confirm('开启后可利用此通道发送短信。', '确定开启？',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.loading = true;
          this.$http.gateway
          .startGateway({
            data: {
              gatewayId: gateway
            }
          })
          .then(res => {
            this.loading = false;
            if (resOk(res)) {
              this._mxGetList();
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
        }).catch(() => {});
      } else {
        this.$confirm('关闭后利用此通道发送的短信全部进入待发，请谨慎操作。', '确定关闭？',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.loading = true;
          this.$http.gateway
          .stopGateway({
            data: {
              gatewayId: gateway
            }
          })
          .then(res => {
            this.loading = false;
            if (resOk(res)) {
              this._mxGetList();
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
        }).catch(() => {});
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
      const gatewayId = this.id;
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
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            item.optionData = res.data.map(t => {
              return { key: t.provinceId, value: t.provinceName };
            });
          }
        });

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
