<template>
  <!--商户用户-->
  <div class="corpUser">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table :data="listData" border highlight-current-row style="width: 100%">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <!-- <el-table-column
        prop="loginName"
        label="登录账号"
        width="100"
        
      /> -->
      <el-table-column prop="agentName" label="代理商" />
      <el-table-column prop="saleName" label="销售员" />
      <!-- <el-table-column
        prop="password"
        label="密码"
        width="100"
        
      /> -->
      <el-table-column prop="code" label="特服号" />
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
      <!-- <el-table-column
        prop="reductType"
        label="计费类型"
        
      >
        <template slot-scope="scope">
          <span>{{
            scope.row.reductType == "1" ? "账户计费" : "商户计费"
          }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="sublong" label="扩展长度">
        <template slot-scope="{ row }">{{
          row.sublong !== 0 ? row.sublong : "不扩展"
        }}</template>
      </el-table-column>
      <el-table-column prop="longCode" label="长号码" />
      <el-table-column prop="productType" label="产品">
        <template slot-scope="scope">
          <span>{{
            scope.row.productType == "1"
              ? "短信"
              : scope.row.productType == "2"
              ? "彩信"
              : scope.row.productType == "3"
              ? "短信、彩信"
              : "语音"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sendType" label="短信运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.sendType === 1">移动</span>
          <span v-else-if="scope.row.sendType === 2">联通</span>
          <span v-else-if="scope.row.sendType === 3">电信</span>
          <span v-else-if="scope.row.sendType === 4">三网</span>
          <span v-else-if="scope.row.sendType === 5">移动 联通</span>
          <span v-else-if="scope.row.sendType === 6">移动 电信</span>
          <span v-else-if="scope.row.sendType === 7">联通 电信</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="proTypes" label="短信产品类型">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.proTypes" :key="index">
            {{
              item === 1
                ? "web端"
                : item === 2
                ? "http接口"
                : item === 4
                ? "cmpp接口"
                : "-"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="reductModel" label="短信计费方式">
        <template slot-scope="scope">
          <span>{{
            scope.row.reductModel == "1"
              ? "预付提交计费"
              : scope.row.reductModel == "2"
              ? "预付成功计费"
              : scope.row.reductModel == "3"
              ? "后付提交计费"
              : scope.row.reductModel == "4"
              ? "后付成功计费"
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="smsBalance"
        label="短信余额"
        
      /> -->
      <!-- <el-table-column prop="debt" label="借款"  /> -->
      <el-table-column prop="cardUnit" label="单价（分）"></el-table-column>
      <el-table-column prop="mmsSendType" label="彩信运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.mmsSendType === 1">移动</span>
          <span v-else-if="scope.row.mmsSendType === 2">联通</span>
          <span v-else-if="scope.row.mmsSendType === 3">电信</span>
          <span v-else-if="scope.row.mmsSendType === 4">三网</span>
          <span v-else-if="scope.row.mmsSendType === 5">移动 联通</span>
          <span v-else-if="scope.row.mmsSendType === 6">移动 电信</span>
          <span v-else-if="scope.row.mmsSendType === 7">联通 电信</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="mmsProType"
        label="彩信产品类型"
        
      >
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.mmsProTypes" :key="index">
            {{
              item === 1
                ? "web端"
                : item === 2
                ? "http接口"
                : item === 4
                ? "cmpp接口"
                : "-"
            }}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column prop="mmsReductModel" label="彩信计费方式">
        <template slot-scope="scope">
          <span v-if="scope.row.mmsReductModel == 1">预付提交计费</span>
          <span v-else-if="scope.row.mmsReductModel == 2">预付成功计费</span>
          <span v-else-if="scope.row.mmsReductModel == 3">后付提交计费</span>
          <span v-else-if="scope.row.mmsReductModel == 4">后付成功计费</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- <el-table-column
        prop="mmsBalance"
        label="彩信余额"
        
      />
      <el-table-column prop="mmsDebt" label="借款"  /> -->
      <el-table-column prop="mmsCardUnit" label="单价（分）"></el-table-column>
      <el-table-column prop="submitSpeed" label="提交速率">
        <template slot-scope="{ row }">{{
          row.submitSpeed ? row.submitSpeed : "不限"
        }}</template>
      </el-table-column>
      <el-table-column prop="smsTags" label="标签">
        <template slot-scope="scope">
          <span v-if="scope.row.smsTags.length">
            <span v-for="(item, index) in scope.row.smsTags" :key="index">
              {{ item ? item.name : "-" }}
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色"></el-table-column>
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
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <!-- <el-table-column
        prop="modifyTime"
        label="修改时间"
        
      >
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column> -->
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
      <div style="margin-bottom: 20px; padding-left: 20px">
        <label>是否限制</label>
        <el-select
          v-model="isRestricted"
          style="margin-left: 18px"
          @change="changeIsRestricted"
        >
          <el-option label="否" :value="0" />
          <el-option label="是" :value="1" />
        </el-select>
      </div>
      <el-input
        v-model="speedVal"
        :disabled="isRestricted === 0"
        maxlength="100"
        placeholder="请输入提交速率"
      >
        <template slot="prepend"
          >提交速率</template
        >
        <template slot="append"
          >每秒</template
        >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="speedVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSpeeds">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="信息"
      :visible.sync="infoVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <!-- <p>{{ infoData.createUser }}</p> -->
      <div v-if="infoData.proType == 1">
        <p>产品类型: web</p>
        <p>企业名称: {{ infoData.corpName }}</p>
        <p>账户编号: {{ infoData.userId }}</p>
        <p>账户名称: {{ infoData.userName }}</p>
        <p>web账号: {{ infoData.loginName }}</p>
        <p>
          web密码: {{ infoData.webPassword }}
          <i
            class="el-icon-lock"
            @click="isOpenDialog"
            style="font-size: 20px;color: #909399;margin-left:5px"
          ></i>
        </p>
        <p>网址: sms.jvtd.cn</p>
      </div>
      <div v-if="infoData.proType == 2">
        <p>产品类型: HTTP/WEB</p>
        <p>企业名称: {{ infoData.corpName }}</p>
        <p>web账号: {{ infoData.loginName }}</p>
        <p>账户编号: {{ infoData.userId }}</p>
        <p>账户名称: {{ infoData.userName }}</p>
        <p>
          密码: {{ infoData.password }}
          <i
            class="el-icon-lock"
            @click="isOpenDialog"
            style="font-size: 20px;color: #909399;margin-left:5px"
          ></i>
        </p>
        <p>客户端IP: {{ infoData.userIp || "" }}</p>
        <p>接口地址: http://sms3api.jvtd.cn/jtdsms/smsSend</p>
        <p>接口文档: https://jvtd.cn/duanxinApi/</p>
      </div>
      <div v-if="infoData.proType == 4">
        <p>产品类型: CMPP2.0/WEB</p>
        <p>企业名称: {{ infoData.corpName }}</p>
        <p>接口地址: 39.107.120.170</p>
        <p>端口: 7893</p>
        <p>web账号: {{ infoData.loginName }}</p>
        <p>账户编号: {{ infoData.userId }}</p>
        <p>账户名称: {{ infoData.userName }}</p>
        <p>
          密码: {{ infoData.password }}
          <i
            class="el-icon-lock"
            @click="isOpenDialog"
            style="font-size: 20px;color: #909399;margin-left:5px"
          ></i>
        </p>
        <p>协议: CMPP</p>
        <p>通道接入码: {{ infoData.longCode }}</p>
        <p>客户端IP: {{ infoData.userIp }}</p>
        <p>链接路数: {{ infoData.maxSession }}</p>
        <p>
          通道速率: <span v-if="infoData.submitSpeed == 0">不限</span
          ><span v-else>{{ infoData.submitSpeed }}条/秒</span>
        </p>
      </div>
    </el-dialog>
    <el-dialog
      title="登录"
      :visible.sync="loginVisible"
      :close-on-click-modal="false"
      width="30%"
      custom-class="loginDialog"
    >
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
        <el-button type="primary" @click="notDisabled">确 定</el-button>
        <el-button @click="loginVisible = false">取 消</el-button>
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
        {
          type: "select",
          label: "产品类型",
          key: "proType",
          optionData: [
            { key: "1", value: "web端" },
            { key: "2", value: "http接口" },
            { key: "4", value: "cmpp接口" }
            // { key: "7", value: "音频接口" }
          ],
          placeholder: "请选择产品类型"
        },
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
      isRestricted: 0,
      speedVal: null,
      saleList: [],
      //临时存储修改数据
      currentEditFormData: {},

      //信息弹窗数据
      infoVisible: false,
      proType: 1,
      infoData: {},
      //二次登录数据
      loginVisible: false,
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
    this.getAllCorp();
    this.getSaleman();
    this.getAgent();
    this.getRole();
    this.listTag();
  },
  activated() {
    //重新获取数据
    this.getAllCorp();
    this.getSaleman();
    this.getAgent();
    this.getRole();
    this.listTag();
    this._mxGetList();
  },
  computed: {},
  methods: {
    isOpenDialog() {
      this.loginVisible = true;
    },
    notDisabled() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          const { userId } = this.infoData;
          this.formData.type = 4;
          this.formData.soleId = Number(userId);

          this.$http.mmsGateway.viewLogin(this.formData).then(res => {
            if (res.code === 200) {
              this.$nextTick(() => {
                this.infoData.password = res.data.password;
                this.infoData.webPassword = res.data.webPassword;
              });

              this.loginVisible = false;
              this.$message.success("验证成功");
              this.formData.account = "";
              this.formData.pwd = "";
            } else {
              this.$message.error(res.data);
            }
          });
        }
      });
    },
    //修改提交速率是否限制 选否把提交速率置空
    changeIsRestricted(val) {
      if (val === 0) {
        this.speedVal = null;
      }
    },
    _mxCreate() {
      this.$router.push({
        name: "userManagementType",
        query: { type: "create" }
      });
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
        if (key === "proType") {
          row["proType"] = row["proTypes"];
        }
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

    //修改
    _mxEdit(row, ID) {
      this.$router.push({
        name: "userManagementType",
        query: { type: "update", row: JSON.stringify(row), ID }
      });
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

    beforeClose() {
      this.addChannel = false;
    },
    handleSubmitSpeed(userId, submitSpeed) {
      this.submitSpeedTit = submitSpeed ? "修改提交速率" : "配置提交速率";
      this.userId = userId;
      this.speedVal = submitSpeed ? submitSpeed : null;
      this.isRestricted = submitSpeed ? 1 : 0;
      this.speedVisible = true;
    },
    submitSpeeds() {
      let params;
      if (this.isRestricted === 0) {
        params = {
          userId: this.userId,
          submitSpeed: this.isRestricted
        };
      } else {
        if (this.speedVal < 1) {
          this.$message.error("提交速率最小为1");
          return;
        }
        if (!Number(this.speedVal)) {
          this.$message.error("提交速率只允许输入数字");
          return;
        }
        if (Number(this.speedVal) > 1000) {
          this.$message.error("提交速率最大不能超过1000");
          return;
        }
        const str =
          typeof this.speedVal === "string"
            ? this.speedVal
            : this.speedVal + "";
        if (str.indexOf(".") !== -1) {
          this.$message.error("提交速率不允许有小数");
          return;
        }
        params = {
          userId: this.userId,
          submitSpeed: this.speedVal
        };
      }

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
      this.$nextTick(() => {
        this.infoData = Object.assign(row);
        console.log(this.infoData, "-------this.infoData");
      });

      this.infoVisible = true;
      // const h = this.$createElement;
      // this.$msgbox({
      //   title: "信息",
      //   message: this.createElement(h, row),
      //   showConfirmButton: false
      // }).catch(() => {});
    },
    //获取所有商户
    getAllCorp() {
      this.$http.corp.queryAllCorp().then(res => {
        if (resOk(res)) {
          let arr = [];
        }
      });
    },
    //获取销售员
    getSaleman() {
      this.$http.sysSales.queryAvailableSaleman().then(res => {
        if (resOk(res)) {
          this.saleList = res.data;
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
          // this._setDefaultValue(
          //   this.formConfig,
          //   res.data,
          //   "agentId",
          //   "agentId",
          //   "agentName"
          // );
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
          // this._setDefaultValue(
          //   this.formConfig,
          //   res.data,
          //   "roleId",
          //   "roleId",
          //   "roleName"
          // );
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
          str.information = "您确定要停用账户吗？";
          break;
        case "init":
          str.title = "审核";
          str.information = "审核后，账户将正常使用，您确认要审核吗？";
          break;
        case "enabled":
          str.title = "启用";
          str.information = "启用后账户将正常使用，您确定要启用账户吗？";
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
      switch (row.proType) {
        case 1:
          return h("div", null, [
            h("p", null, [
              h("span", null, "产品类型: "),
              h("span", null, "web")
            ]),
            h("p", null, [
              h("span", null, "企业名称: "),
              h("span", null, `${row.corpName}`)
            ]),
            h("p", null, [
              h("span", null, "web账号: "),
              h("span", null, `${row.loginName}`)
            ]),
            h("p", null, [
              h("span", null, "web密码: "),
              h("span", null, `${row.webPassword}`)
            ]),
            h("p", null, [
              h("span", null, "网址: "),
              h("span", null, "sms.jvtd.cn")
            ])
          ]);

        case 2:
          return h("div", null, [
            h("p", null, [
              h("span", null, "产品类型: "),
              h("span", null, "HTTP/WEB")
            ]),
            h("p", null, [
              h("span", null, "企业名称: "),
              h("span", null, `${row.corpName}`)
            ]),
            h("p", null, [
              h("span", null, "web账号: "),
              h("span", null, `${row.loginName}`)
            ]),
            h("p", null, [
              h("span", null, "账号: "),
              h("span", null, `${row.userId}`)
            ]),
            h("p", null, [
              h("span", null, "密码: "),
              h("span", null, `${row.password}`)
            ]),
            h("p", null, [
              h("span", null, "客户端IP: "),
              h("span", null, `${row.userIp || ""}`)
            ]),
            h("p", null, [
              h("span", null, "接口地址: "),
              h("span", null, "http://sms3api.jvtd.cn/jtdsms/smsSend")
            ]),
            h("p", null, [
              h("span", null, "接口文档: "),
              h("span", null, "https://jvtd.cn/duanxinApi/")
            ])
          ]);

        case 4:
          return h("div", null, [
            h("p", null, [
              h("span", null, "产品类型: "),
              h("span", null, "CMPP2.0/WEB")
            ]),
            h("p", null, [
              h("span", null, "企业名称: "),
              h("span", null, `${row.corpName}`)
            ]),
            h("p", null, [
              h("span", null, "接口地址: "),
              h("span", null, "39.107.120.170")
            ]),
            h("p", null, [h("span", null, "端口: "), h("span", null, "7893")]),
            h("p", null, [
              h("span", null, "web账号: "),
              h("span", null, `${row.loginName}`)
            ]),
            h("p", null, [
              h("span", null, "账号: "),
              h("span", null, `${row.userId}`)
            ]),
            h("p", null, [
              h("span", null, "密码: "),
              h("span", null, `${row.password}`)
            ]),
            h("p", null, [h("span", null, "协议: "), h("span", null, "CMPP")]),
            h("p", null, [
              h("span", null, "通道接入码: "),
              h("span", null, `${row.longCode}`)
            ]),
            h("p", null, [
              h("span", null, "客户端IP: "),
              h("span", null, `${row.userIp || ""}`)
            ]),
            h("p", null, [
              h("span", null, "链接路数: "),
              h("span", null, `${row.maxSession || ""}`)
            ]),
            h("p", null, [
              h("span", null, "通道速率: "),
              h("span", null, `${row.submitSpeed || ""}条/秒`)
            ])
          ]);

        default:
          break;
      }
      // let arr = [];
      // if (row.proTypes && row.proTypes !== "-" && row.proTypes.length != 0) {
      //   arr = row.proTypes;
      // } else {
      //   arr = row.mmsProTypes;
      // }
      // let proType = [];
      // arr.forEach(item => {
      //   if (item == 1) {
      //     proType.push("web端");
      //   } else if (item == 2) {
      //     proType.push("http接口");
      //   } else if (item == 4) {
      //     proType.push("cmpp接口");
      //   }
      // });
      // let strType = proType.join("、");
      // return h("div", null, [
      //   h("p", null, [
      //     h("span", null, "产品类型: "),
      //     h("span", null, `${strType || ""}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "商户名称: "),
      //     h("span", null, `${row.corpName}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "登录账号: "),
      //     h("span", null, `${row.loginName}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "密码: "),
      //     h("span", null, `${row.password}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "网址: "),
      //     h("span", null, "http://user.sms.jvtdtest.top")
      //   ]),
      //   h("p", null, [
      //     h("span", null, "客户端IP: "),
      //     h("span", null, `${row.userIp || ""}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "接口地址: "),
      //     h("span", null, `${row.mmsAuditCallBack || ""}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "协议端口: "),
      //     h("span", null, `${row.directPort || ""}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "协议: "),
      //     h("span", null, `${row.directPort}`)
      //   ]),
      //   h("p", null, [h("span", null, "通道接入码: "), h("span", null, ``)]),
      //   h("p", null, [
      //     h("span", null, "链接路数: "),
      //     h("span", null, `${row.maxSession || ""}`)
      //   ]),
      //   h("p", null, [
      //     h("span", null, "通道速率: "),
      //     h("span", null, `${row.submitSpeed || ""}`)
      //   ])
      // ]);
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.corpUser {
}
</style>
