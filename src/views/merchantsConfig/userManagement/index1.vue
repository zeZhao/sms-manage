<template>
  <!--商户用户-->
  <div class="corpUser">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%" stripe>
      <!--商户编号 特服号 用户商户名称 客户联系人姓名 客户联系人电话 扩展位数 计费方式 短信余额 状态 操作 -->
      <el-table-column prop="corpId" label="商户编号" width="100" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column
        prop="userName"
        label="账户名称"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="loginName"
        label="登录账号"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="agentName"
        label="代理商"
        width="100"
        show-overflow-tooltip
      />
      <el-table-column
        prop="saleMan"
        label="销售员"
        width="100"
        show-overflow-tooltip
      />
      <!-- <el-table-column
        prop="password"
        label="密码"
        width="100"
        show-overflow-tooltip
      /> -->
      <el-table-column prop="accountType" label="业务类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.accountType == "1"
              ? "行业"
              : scope.row.accountType == "2"
              ? "营销"
              : "vip"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="reductType" label="计费类型" width="100">
        <template slot-scope="scope">
          <span>{{
            scope.row.reductType == "1" ? "账户计费" : "商户计费"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sublong" label="扩展位数" />
      <!-- <el-table-column prop="longCode" label="长号码" /> -->
      <!-- <el-table-column prop="productType" label="产品">
        <template slot-scope="scope">
          <span>{{
            scope.row.productType == "1"
              ? "短信"
              : scope.row.productType == "2"
              ? "彩信"
              : scope.row.productType == "3"
              ? "屏信"
              : "语音"
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="proTypes" label="短信产品类型">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.proTypes" :key="index">
            <span>{{
              item === 1
                ? "web端"
                : item === 2
                ? "http接口"
                : item === 4
                ? "cmpp接口"
                : ""
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sendType" label="短信运营商" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.sendType === 1">移动</span>
          <span v-if="scope.row.sendType === 2">联通</span>
          <span v-if="scope.row.sendType === 3">电信</span>
          <span v-if="scope.row.sendType === 4">三网</span>
          <span v-if="scope.row.sendType === 5">移动联通</span>
          <span v-if="scope.row.sendType === 6">移动电信</span>
          <span v-if="scope.row.sendType === 7">联通电信</span>
        </template>
      </el-table-column>
      <el-table-column prop="reductModel" label="短信计费方式" width="110">
        <template slot-scope="scope">
          <span>{{
            scope.row.reductModel == "1"
              ? "预付提交计费"
              : scope.row.reductModel == "2"
              ? "预付成功计费"
              : scope.row.reductModel == "3"
              ? "后付提交计费"
              : "后付成功计费"
          }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="smsBalance" label="短信余额" />
      <el-table-column prop="debt" label="借款" />
      <el-table-column
        prop="cardUnit"
        label="单价（分）"
        width="100"
      ></el-table-column>
      <el-table-column prop="mmsProType" label="彩信产品类型">
        <template slot-scope="scope">
          <span v-if="scope.row.mmsProType == 1">web前端</span>
          <span v-if="scope.row.mmsProType == 2">http接口</span>
        </template>
      </el-table-column>
      <el-table-column prop="mmsSendType" label="彩信运营商" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.mmsSendType === 1">移动</span>
          <span v-if="scope.row.mmsSendType === 2">联通</span>
          <span v-if="scope.row.mmsSendType === 3">电信</span>
          <span v-if="scope.row.mmsSendType === 4">三网</span>
          <span v-if="scope.row.mmsSendType === 5">移动联通</span>
          <span v-if="scope.row.mmsSendType === 6">移动电信</span>
          <span v-if="scope.row.mmsSendType === 7">联通电信</span>
        </template>
      </el-table-column>
      <el-table-column prop="mmsReductModel" label="彩信计费方式" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.mmsReductModel == 1">预付提交计费</span>
          <span v-if="scope.row.mmsReductModel == 2">预付成功计费</span>
          <span v-if="scope.row.mmsReductModel == 3">后付提交计费</span>
          <span v-if="scope.row.mmsReductModel == 4">后付成功计费</span>
        </template>
      </el-table-column>

      <el-table-column prop="mmsBalance" label="彩信余额" />
      <el-table-column prop="mmsDebt" label="借款" />
      <el-table-column
        prop="mmsCardUnit"
        label="单价（分）"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="submitSpeed"
        label="提交速率"
        width="100"
      ></el-table-column>
      <el-table-column prop="smsTags" label="标签" width="100">
        <template slot-scope="scope">
          <span
            style="padding-right:10px"
            v-for="(item, index) in scope.row.smsTags"
            :key="index"
          >
            {{ item ? item.name : "" }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色"
        width="100"
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{
            scope.row.status == "0"
              ? "删除"
              : scope.row.status == "1"
              ? "待审核"
              : scope.row.status == "2"
              ? "正常"
              : "停用"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.smsTags.length"
            @click="addTag(scope.row.userId)"
            type="text"
            size="small"
            >添加标签</el-button
          >
          <el-button
            v-if="scope.row.smsTags.length"
            @click="editTag(scope.row.userId, scope.row.smsTags)"
            type="text"
            size="small"
            >修改标签</el-button
          >
          <el-button
            @click="handleSubmitSpeed(scope.row.userId, scope.row.submitSpeed)"
            type="text"
            size="small"
            >{{
              scope.row.submitSpeed ? "修改提交速率" : "配置提交速率"
            }}</el-button
          >
          <el-button @click="messageShow(scope.row)" type="text" size="small"
            >信息</el-button
          >
          <el-button
            @click="_mxEdit(scope.row, 'userId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <!-- <el-button
            :disabled="scope.row.status == '2' || scope.row.status == '3'"
            @click="_mxCheck(scope.row, 'userId')"
            type="text"
            size="small"
            >审核</el-button
          > -->
          <el-button
            v-if="scope.row.status == 2"
            @click="setType(scope.row, 'disable', '3')"
            style="color: #ec5858"
            type="text"
            size="small"
            >停用</el-button
          >
          <el-button
            v-if="scope.row.status == 3"
            @click="setType(scope.row, 'enabled', '2')"
            type="text"
            size="small"
            >启用</el-button
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
        :colSpan="8"
        :labelWidth="150"
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @selectChange="selectChange"
      ></FormItemTitle>
    </el-dialog>
    <el-dialog
      :title="dialogTit"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>{{ information }}</span>
      <p v-show="dialogTit === '停用'" style="color: #ec5858">
        停用后将无法使用，请谨慎操作！
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
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
    <el-dialog
      :title="submitSpeedTit"
      :visible.sync="speedVisible"
      :close-on-click-modal="false"
      top="45px"
      width="30%"
    >
      <el-input v-model="speedVal" placeholder="请输入提交速率">
        <template slot="prepend">提交速率</template>
        <template slot="append">每分</template>
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="speedVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSpeeds">确 定</el-button>
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
          key: "corpId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "账户名称",
          key: "userName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "登录账号",
          key: "loginName"
        },
        {
          type: "input",
          label: "账户特服号",
          key: "code"
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
        {
          type: "select",
          label: "计费类型",
          key: "reductType",
          optionData: [
            { key: "1", value: "账户计费" },
            { key: "2", value: "商户计费" }
          ]
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
          ],
          placeholder: "请选择计费方式"
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
          ],
          placeholder: "请选择计费方式"
        },
        {
          type: "select",
          label: "销售人员",
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
              pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/,
              message: "不支持特殊字符",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "密码",
          key: "password",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[\d0-9a-zA-Z!@#$%^&*~]{8,16}$/,
              message: "请输入8-16位，数字、字母、标点符号",
              trigger: "change"
            }
          ]
        },
        {
          type: "input",
          label: "账户特服号",
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
          optionData: [
            { key: 1, value: "账户计费" },
            { key: 2, value: "商户id计费" }
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
          label: "是否是直客",
          key: "isDirectUser",
          optionData: [
            { key: 1, value: "直客" },
            { key: 2, value: "同行" }
          ],
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
          defaultValue: [],
          initDefaultValue: [],
          optionData: [
            { key: 1, value: "短信" },
            { key: 2, value: "彩信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          isTitle: true,
          title: "短信业务信息",
          colSpan: 24,
          tag: "sms"
        },
        {
          type: "select",
          label: "运营商类型",
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
          multiple: true,
          disabled: false,
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
          label: "短信计费方式",
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
          label: "扩展位数",
          key: "sublong",
          tag: "sms",
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
          disabled: true
        },
        {
          type: "select",
          label: "短信上行类型",
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
          label: "短信推送上行地址",
          key: "moUrl",
          tag: "sms",
          defaultValue: ""
        },
        {
          type: "select",
          label: "是否强加签名",
          key: "httpSign",
          optionData: [
            { key: "0", value: "否" },
            { key: 1, value: "是" }
          ],
          defaultValue: 1,
          tag: "sms",
          rules: [{ required: true, message: "请选择必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "短信报告类型",
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
          tag: "sms",
          defaultValue: ""
        },
        {
          type: "select",
          label: "请求api黑名单接口",
          key: "isPostApi",
          tag: "sms",
          optionData: [
            { key: "0", value: "否" },
            { key: 1, value: "是" }
          ],
          defaultValue: 1
        },
        {
          type: "checkbox",
          label: "黑名单类型",
          initDefaultValue: [0, 2],
          defaultValue: [0, 2],
          key: "blackLevel",
          optionData: [
            // { key: 0, value: "系统级" },
            // { key: 2, value: "用户级" },
            // { key: 3, value: "营销级" },
            // { key: 4, value: "BSATS级" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          isTitle: true,
          title: "彩信业务信息",
          colSpan: 24,
          tag: "mms"
        },
        {
          type: "select",
          label: "运营商类型",
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
        {
          type: "select",
          label: "产品类型",
          key: "mmsProType",
          multiple: true,
          disabled: false,

          optionData: [
            { key: 1, value: "web端" },
            { key: 2, value: "http接口" },
            { key: 4, value: "cmpp接口" }
            // { key: 7, value: "音频接口" }
          ],
          tag: "mms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "彩信计费方式",
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
        {
          type: "select",
          label: "彩信上行类型",
          key: "mmsMoType",
          tag: "mms",
          optionData: [
            { key: "0", value: "无权限" },
            { key: 1, value: "推送" },
            { key: 2, value: "自取(批量)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "彩信推送上行地址",
          key: "mmsMoUrl",
          tag: "mms",
          defaultValue: ""
        },
        {
          type: "select",
          label: "彩信报告类型",
          key: "mmsReportType",
          tag: "mms",
          optionData: [
            { key: "0", value: "无权限" },
            { key: 1, value: "推送" },
            { key: 2, value: "自取(批量)" },
            { key: 3, value: "自取(单条)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "彩信推送报告地址",
          key: "mmsReportUrl",
          tag: "mms",
          defaultValue: ""
        },
        {
          type: "checkbox",
          label: "彩信黑名单类型",
          initDefaultValue: [],
          defaultValue: [],
          key: "mmsBlackLevel",
          tag: "mms",
          optionData: [
            // { key: 0, value: "系统级" },
            // { key: 2, value: "用户级" },
            // { key: 3, value: "营销级" },
            // { key: 4, value: "BSATS级" }
          ]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          isTitle: true,
          title: "服务信息",
          colSpan: 24
        },
        {
          type: "select",
          label: "销售员",
          key: "saleMan",
          optionData: [],
          rules: [{ required: true, message: "请选择必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark"
        }

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
      speedVal: null
    };
  },
  mounted() {
    this.getAllCorp();
    this.getSaleman();
    this.getAgent();
    this.getRole();
    this.listTag();
    this.getBlackFroup();
  },
  computed: {},
  methods: {
    handleSubmitSpeed(userId, submitSpeed) {
      this.speedVisible = true;
      this.submitSpeedTit = submitSpeed ? "修改提交速率" : "配置提交速率";
      this.userId = userId;
      this.speedVal = submitSpeed;
    },
    submitSpeeds() {
      let params = {
        userId: this.userId,
        submitSpeed: this.speedVal
      };
      this.$http.corpUser.configureSubmitRate(params).then(res => {
        if (resOk(res)) {
          this.speedVisible = false;
          this.$message.success("操作成功");
          this._mxGetList();
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
        this._setDefaultValue(
          this.formConfig,
          res.data,
          "mmsBlackLevel",
          "groupId",
          "blackGroupName"
        );
        console.log(res, "listBlackGroup-------------");
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
    _mxArrangeEditData(row) {
      for (let key in row) {
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
        if (key === "proType") {
          row["proType"] = row["proTypes"];
          console.log(row["proType"]);
        }
        if (key === "mmsProType") {
          row["mmsProType"] = row["mmsProTypes"];
        }
        if (key === "productType") {
          row["productType"] = row["productTypes"];
        }
      }
      return row;
    },
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key == "proType") {
          this.$set(item, "disabled", false);
        }
        if (item.key == "corpId") {
          this.$set(item, "disabled", false);
        }
        if (item.tag === "sms" || item.tag === "mms") {
          item.isShow = true;
        }
      });
      this.getAllCorp();
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    //修改
    _mxEdit(row, ID) {
      let lineData = Object.assign({}, row);
      console.log(this.listData, "------------listData");
      console.log(lineData, "------------lineData");
      lineData = this._mxArrangeEditData(lineData);
      this.getAllCorp();
      this.id = lineData[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let keys in lineData) {
          if (item.key === keys && lineData[keys] !== "-") {
            if (lineData[keys] === 0) {
              this.$set(item, "defaultValue", "0");
            } else {
              this.$set(item, "defaultValue", lineData[keys]);
            }
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
        // if (item.key == "proType") {
        //   this.$set(item, "disabled", true);
        // }
        // if (item.key == "mmsProType") {
        //   this.$set(item, "disabled", true);
        // }
        if (item.key == "corpId") {
          this.$set(item, "disabled", true);
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
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
        this.$message.success(res.msg || res.data);
        this._mxGetList();
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
    //提交表单前调整表单内数据
    _mxArrangeSubmitData(formData) {
      let form = formData;
      for (let key in form) {
        if (key === "blackLevel" || key === "mmsBlackLevel") {
          form[key] = form[key].join(",");
        }
        if (
          key === "productType" ||
          key === "mmsProType" ||
          key === "proType"
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
            form[key] = "";
          }
        }
      }
      return form;
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
      this.$http.agent.queryAgent().then(res => {
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

    selectChange(data) {
      const { val, item } = data;
      let obj = {};

      if (item.key === "productType") {
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
        } else if (val === 2) {
          this._setDefaultValueKeys("directPort", "8090");
        } else if (val === 3) {
          this._setDefaultValueKeys("directPort", "7890");
        } else {
          this._setDefaultValueKeys("directPort", "");
        }
      }
    },

    //countMonth
    // _mxArrangeSubmitData(formData) {
    //   if (formData.countMonth) {
    //     formData.countMonth = new Date(formData.countMonth).Format("yyyy-MM");
    //   }
    //   return formData;
    // },
    createElement(h, row) {
      let arr = row.proTypes;
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
      // let strType = "";
      // switch (row.proType) {
      //   case 1:
      //     strType = "web端";
      //     break;
      //   case 2:
      //     strType = "http接口";
      //     break;
      //   case 4:
      //     strType = "cmpp接口";
      //     break;
      // }
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
          h("span", null, "https://user.sms.jvtd.cn")
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
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.corpUser {
}
</style>
