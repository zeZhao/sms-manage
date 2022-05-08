<template>
  <!--商户用户-->
  <div class="corpUser">
    <Search
      ref="search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>

    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" width="120" />
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
      <el-table-column prop="reductModel" label="短信计费方式" width="100">
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
      <el-table-column prop="mmsReductModel" label="彩信计费方式" width="100">
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
      <el-table-column prop="smsTags" label="标签" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.smsTags.length">
            <span v-for="(item, index) in scope.row.smsTags" :key="index">
              {{ item ? item.name : "-" }}
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色"
        width="110"
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
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" width="135">
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

    <!-- 新增修改用户 -->
    <el-drawer
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-press-escape="false"
      :wrapperClosable="false"
    >
      <!-- <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
        @selectChange="selectChange"
        @onChange="onChange"
        @handleSuccess="handleSuccess"
        @handleRemove="handleRemove"
      ></FormItem> -->
      <h3>{{ titleTips }}</h3>
      <FormItemTitle
        class="userManagementType"
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
        ref="formItemTit"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @choose="choose"
        @selectChange="selectChange"
        @removeTag="removeTag"
      >
      </FormItemTitle>
    </el-drawer>

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
      :visible.sync="infoVisible"
      :close-on-click-modal="false"
      width="30%"
      :before-close="handleClose"
    >
      <span slot="title">
        信息
        <i
          v-if="renderLock && !editUserPassword"
          class="el-icon-lock"
          style="font-size: 20px; color: #909399; margin-left: 5px"
          @click="isOpenDialog"
        ></i>
      </span>

      <el-tabs
        type="border-card"
        tabPosition="bottom"
        v-model="activeName"
        v-if="Array.isArray(infoData.productTypes)"
      >
        <el-tab-pane
          label="短信"
          name="1"
          v-if="infoData.productTypes.includes(1)"
        >
          <div v-if="infoData.proType === 1">
            <p>产品类型: WEB</p>
            <p>企业名称: {{ infoData.corpName }}</p>
            <p>账户名称: {{ infoData.userName }}</p>
            <p>账户编号: {{ infoData.userId }}</p>
            <p>web登录账号: {{ infoData.loginName }}</p>
            <p>
              web密码:
              <span v-if="!editUserPassword">{{
                infoData.webPassword || "-"
              }}</span>
              <span v-else
                ><el-input
                  v-model="infoData.webPassword"
                  clearable
                  placeholder="请输入web密码"
                  class="pwd"
              /></span>
              <span
                v-if="!renderLock && !editUserPassword"
                class="edit-user-password"
                @click="editUserPassword = true"
                >修改</span
              >
              <span
                v-if="!renderLock && editUserPassword"
                class="edit-user-password"
                @click="handleEditUserPassword"
                >确定</span
              >
            </p>
            <p>web端登录地址: https://sms.jvtd.cn/#/login</p>
            <!-- <p>
              秘钥: {{ infoData.secretKey }}
              <i
                class="el-icon-lock"
                v-show="!infoData.secretKey || infoData.secretKey === '-'"
                @click="isOpenDialog('secretKey')"
                style="font-size: 20px;color: #909399;margin-left:5px"
              ></i>
            </p> -->
          </div>

          <div v-if="infoData.proType === 2">
            <p>产品类型: HTTP</p>
            <p>企业名称: {{ infoData.corpName }}</p>
            <p>账户名称: {{ infoData.userName }}</p>
            <p>账户编号: {{ infoData.userId }}</p>
            <p>http密码: {{ infoData.password || "-" }}</p>
            <p>客户端IP: {{ infoData.userIp }}</p>
            <p>接口地址: https://sms3api.jvtd.cn/jtdsms/smsSend</p>
            <p>接口文档: https://jvtd.cn/duanxinApi/</p>
            <el-divider></el-divider>
            <p>产品类型: WEB端</p>
            <p>web登录账号: {{ infoData.loginName }}</p>
            <p>
              web密码:
              <span v-if="!editUserPassword">{{
                infoData.webPassword || "-"
              }}</span>
              <span v-else
                ><el-input
                  v-model="infoData.webPassword"
                  clearable
                  placeholder="请输入web密码"
                  class="pwd"
              /></span>
              <span
                v-if="!renderLock && !editUserPassword"
                class="edit-user-password"
                @click="editUserPassword = true"
                >修改</span
              >
              <span
                v-if="!renderLock && editUserPassword"
                class="edit-user-password"
                @click="handleEditUserPassword"
                >确定</span
              >
            </p>
            <p>web端登录地址: https://sms.jvtd.cn/#/login</p>
            <p>
              加密接口地址: https://sms3api.jvtd.cn/jtdsms/smsSendEncryption
            </p>
            <p>秘钥: {{ infoData.secretKey || "-" }}</p>
          </div>

          <div v-if="infoData.proType === 4">
            <p>产品类型: CMPP2.0</p>
            <p>企业名称: {{ infoData.corpName }}</p>
            <p>账户名称: {{ infoData.userName }}</p>
            <p>账户编号: {{ infoData.userId }}</p>
            <p>cmpp密码: {{ infoData.password || "-" }}</p>
            <p>端口: 7893</p>
            <p>IP地址: 39.107.120.170</p>
            <p>
              接入码:
              {{
                infoData.longCode && infoData.longCode !== "-"
                  ? infoData.longCode
                  : "置空"
              }}
            </p>
            <p>链接路数: {{ infoData.maxSession }}</p>
            <p>
              速率:
              {{
                infoData.submitSpeed == 0
                  ? "不限"
                  : infoData.submitSpeed + "条/秒"
              }}
            </p>
            <p>客户端IP: {{ infoData.userIp }}</p>
            <el-divider></el-divider>
            <p>产品类型: WEB端</p>
            <p>web登录账号: {{ infoData.loginName }}</p>
            <p>
              web密码:
              <span v-if="!editUserPassword">{{
                infoData.webPassword || "-"
              }}</span>
              <span v-else
                ><el-input
                  v-model="infoData.webPassword"
                  clearable
                  placeholder="请输入web密码"
                  class="pwd"
              /></span>
              <span
                v-if="!renderLock && !editUserPassword"
                class="edit-user-password"
                @click="editUserPassword = true"
                >修改</span
              >
              <span
                v-if="!renderLock && editUserPassword"
                class="edit-user-password"
                @click="handleEditUserPassword"
                >确定</span
              >
            </p>
            <p>web端登录地址: https://sms.jvtd.cn/#/login</p>
          </div>
          <div v-if="infoData.proType === 8">
            <p>产品类型: SMPP</p>
            <p>企业名称: {{ infoData.corpName }}</p>
            <p>账户名称: {{ infoData.userName }}</p>
            <p>账户编号: {{ infoData.userId }}</p>
            <p>smpp密码: {{ infoData.password || "-" }}</p>
            <p>端口: 7893</p>
            <p>IP地址: 39.107.120.170</p>
            <p>
              接入码:
              {{
                infoData.longCode && infoData.longCode !== "-"
                  ? infoData.longCode
                  : "置空"
              }}
            </p>
            <p>链接路数: {{ infoData.maxSession }}</p>
            <p>
              速率:
              {{
                infoData.submitSpeed == 0
                  ? "不限"
                  : infoData.submitSpeed + "条/秒"
              }}
            </p>
            <p>客户端IP: {{ infoData.userIp }}</p>
            <el-divider></el-divider>
            <p>产品类型: WEB端</p>
            <p>web登录账号: {{ infoData.loginName }}</p>
            <p>
              web密码:
              <span v-if="!editUserPassword">{{
                infoData.webPassword || "-"
              }}</span>
              <span v-else
                ><el-input
                  v-model="infoData.webPassword"
                  clearable
                  placeholder="请输入web密码"
                  class="pwd"
              /></span>
              <span
                v-if="!renderLock && !editUserPassword"
                class="edit-user-password"
                @click="editUserPassword = true"
                >修改</span
              >
              <span
                v-if="!renderLock && editUserPassword"
                class="edit-user-password"
                @click="handleEditUserPassword"
                >确定</span
              >
            </p>
            <p>web端登录地址: https://sms.jvtd.cn/#/login</p>
          </div>
        </el-tab-pane>

        <el-tab-pane
          label="彩信"
          name="2"
          v-if="infoData.productTypes.includes(2)"
        >
          <div>
            <p>产品类型: HTTP</p>
            <p>企业名称: {{ infoData.corpName }}</p>
            <p>账户名称: {{ infoData.userName }}</p>
            <p>账户编号: {{ infoData.userId }}</p>
            <p>http密码: {{ infoData.password || "-" }}</p>
            <p>客户端IP: {{ infoData.userIp }}</p>
            <p>接口地址: https://sms3api.jvtd.cn/jtdsms/smsSend</p>
            <p>接口文档: https://jvtd.cn/duanxinApi/</p>
            <el-divider></el-divider>
            <p>产品类型: WEB端</p>
            <p>web登录账号: {{ infoData.loginName }}</p>
            <p>
              web密码:
              <span v-if="!editUserPassword">{{
                infoData.webPassword || "-"
              }}</span>
              <span v-else
                ><el-input
                  v-model="infoData.webPassword"
                  clearable
                  placeholder="请输入web密码"
                  class="pwd"
              /></span>
              <span
                v-if="!renderLock && !editUserPassword"
                class="edit-user-password"
                @click="editUserPassword = true"
                >修改</span
              >
              <span
                v-if="!renderLock && editUserPassword"
                class="edit-user-password"
                @click="handleEditUserPassword"
                >确定</span
              >
            </p>
            <p>web端登录地址: https://sms.jvtd.cn/#/login</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
      title="登录"
      :visible.sync="loginVisible"
      :close-on-click-modal="false"
      width="30%"
      custom-class="loginDialog"
    >
      <el-form
        ref="loginForm"
        :model="formData"
        :rules="rules"
        label-width="70px"
        style="width: 80%; margin: auto"
      >
        <el-form-item label="手机号:" prop="account">
          <el-input
            v-model="formData.account"
            clearable
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="口令:" prop="pwd">
          <el-input
            v-model="formData.pwd"
            type="password"
            maxlength="6"
            clearable
            placeholder="请输入口令"
            @keyup.enter.native="notDisabled"
          ></el-input>
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
import { isPassword } from "@/utils";
export default {
  mixins: [listMixin],
  components: { FormItemTitle },
  data() {
    const validatorPrice = (rule, value, callback) => {
      if (!value) {
        value !== 0 ? callback(new Error("请输入必填项")) : callback();
      } else {
        if (isNaN(value)) callback(new Error("单价只能为数字"));
        if (value < 0) callback(new Error("单价不能小于0"));
        callback();
      }
    };
    const validCode = (rule, value, callback) => {
      if (value && !/^\d{1,12}$/.test(value)) {
        callback(new Error("特服号只能为正整数且最大长度为12位"));
      } else {
        callback();
      }
    };
    const validMobile = (rule, value, callback) => {
      console.log(this.type, "------------type");
      if (this.type === "create") {
        if (value && !/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
          callback(new Error("手机号码格式错误"));
        } else {
          callback();
        }
      } else {
        if (value.indexOf("*") === -1) {
          if (value && !/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
            callback(new Error("手机号码格式错误"));
          } else {
            callback();
          }
        } else {
          callback();
        }
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
      // 查看信息选中项
      activeName: "1",
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
      },
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
          maxlength: "30",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" }
            // {
            //   pattern: /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/,
            //   message: "不支持特殊字符",
            //   trigger: "change"
            // }
          ]
        },
        {
          type: "input",
          label: "登录账号",
          key: "loginName",
          maxlength: "30",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              min: 6,
              max: 30,
              message: "长度在 6 到 30 个字符",
              trigger: "blur"
            },
            {
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (/\p{Unified_Ideograph}/u.test(value)) {
                  callback(new Error("不支持汉字"));
                }
                // if (
                //   !/^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,20}$/.test(
                //     value
                //   )
                // ) {
                //   callback(new Error("不支持特殊字符"));
                // }
                callback();
              }
            }
          ]
        },
        {
          type: "password",
          label: "密码",
          key: "password",
          maxlength: "18",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (value) {
                  if (!isPassword(value)) {
                    callback(
                      new Error(
                        "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                      )
                    );
                  } else {
                    callback();
                  }
                } else {
                  callback(new Error("请输入必填项"));
                }
              }
            }
          ]
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          maxlength: "12",
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
          initDefaultValue: 1,
          defaultValue: 1,
          optionData: [
            { key: 1, value: "账户计费" }
            // { key: 2, value: "商户id计费" }
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
          maxlength: 11,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              validator: this.$isPhone,
              trigger: "change"
            }
          ]
          //   {
          //     ///^[\d0-9a-zA-Z!@#$%^&*~]{8,16}$/
          //     pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
          //     message: "手机号码格式错误",
          //     trigger: "change"
          //   }
          // ]
        },
        {
          type: "select",
          label: "客户类型",
          key: "isDirectUser",
          optionData: [{ key: 1, value: "直客" }, { key: 2, value: "渠道" }],
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
          clearable: true,
          defaultValue: [],
          initDefaultValue: [],
          optionData: [{ key: 1, value: "短信" }, { key: 2, value: "彩信" }],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "销售员",
          key: "saleMan",
          optionData: [],
          rules: [{ required: true, message: "请选择必填项", trigger: "blur" }]
        },
        {
          type: "times",
          label: "发送时间",
          key: "times",
          defaultValue: "",
          optionData: []
        },
        {
          type: "select",
          label: "发送设置",
          key: "sendSettings",
          defaultValue: "",
          optionData: [
            { key: 1, value: "进入缓存列队" },
            { key: 2, value: "返回失败" }
          ]
        },
        {
          isTitle: true,
          title: "短信业务信息",
          colSpan: 24,
          tag: "sms"
        },
        {
          type: "select",
          label: "运营商",
          key: "sendType",
          initDefaultValue: 4,
          defaultValue: 4,
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
          // multiple: true,
          // disabled: this.formTit === "修改",
          // clearable: true,
          defaultValue: null,
          initDefaultValue: null,
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
          label: "计费方式",
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
          maxlength: 6,
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: validatorPrice
            }
          ]
        },
        {
          type: "input",
          label: "扩展长度",
          key: "sublong",
          initDefaultValue: "0",
          defaultValue: "0",
          tag: "sms",
          maxlength: 2,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[0-9]\d*$/,
              message: "只能输入正整数",
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
          disabled: true,
          placeholder: "无"
        },
        {
          type: "select",
          label: "推送方式",
          key: "alertMobile",
          initDefaultValue: "2",
          defaultValue: "2",
          optionData: [
            { key: "2", value: "字符串" },
            { key: "1", value: "JSON" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "上行类型",
          key: "moType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: 1, value: "推送" }
            // { key: 2, value: "自取(批量)" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "推送上行地址",
          key: "moUrl",
          maxlength: "250",
          tag: "sms",
          defaultValue: ""
          // btnTxt: "拉取地址"
        },
        {
          type: "select",
          label: "状态报告类型",
          key: "reportType",
          optionData: [
            { key: "0", value: "无权限" },
            { key: 1, value: "推送" }
            // { key: 2, value: "自取(批量)" },
            // { key: 3, value: "自取(单条)" }
          ],
          tag: "sms",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "推送报告地址",
          key: "reportUrl",
          maxlength: "250",
          tag: "sms",
          defaultValue: ""
          // btnTxt: "拉取地址"
        },
        {
          type: "select",
          label: "强加签名",
          key: "httpSign",
          optionData: [{ key: "0", value: "否" }, { key: 1, value: "是" }],
          defaultValue: 1,
          tag: "sms",
          rules: [{ required: true, message: "请选择必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "失败比例",
          key: "faToSu",
          tag: "sms",
          maxlength: "7"
          // specialSymbols: "%",
          // rules: [
          //   {
          //     required: false,
          //     trigger: "blur",
          //     validator: (rule, value, callback) => {
          //       if (!value) callback();
          //       if (isNaN(value)) callback(new Error('只能输入数值'));
          //       if (value && (value + '').indexOf('.') !== -1) callback(new Error('只能输入正整数'));
          //       if (value < 1 || value > 99) callback(new Error('只能在1 ~ 99以内'));
          //       callback();
          //     }
          //   }
          // ]
        },
        {
          type: "input",
          label: "长号码",
          key: "longCode",
          tag: "sms",
          maxlength: 12,
          rules: [
            {
              pattern: /^[1-9]\d*$/,
              message: "只能输入大于0的正整数",
              trigger: "change"
            }
          ]
        },
        {
          type: "select",
          label: "外部黑名单",
          key: "isPostApi",
          initDefaultValue: "0",
          defaultValue: "0",
          tag: "sms",
          optionData: [
            { key: "0", value: "无" },
            { key: 1, value: "冬云" },
            { key: 2, value: "棱镜" }
          ]
        },
        {
          type: "input",
          label: "链接路数",
          key: "maxSession",
          isShow: true,
          maxlength: 2,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^[1-9]\d*$/,
              message: "只能输入大于0的正整数",
              trigger: "blur"
            }
          ]
        },
        {
          type: "checkbox",
          label: "黑名单",
          key: "blackLevel",
          initDefaultValue: [2],
          defaultValue: [2],
          optionData: [
            // { key: 0, value: "系统级" },
            // { key: 2, value: "用户级" },
            // { key: 3, value: "营销级" },
            // { key: 4, value: "BSATS级" }
          ],
          tag: "sms"
        },
        {
          isTitle: true,
          title: "彩信业务信息",
          colSpan: 24,
          tag: "mms"
        },
        {
          type: "select",
          label: "运营商",
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
        // {
        //   type: "select",
        //   label: "产品类型",
        //   key: "mmsProType",
        //   multiple: true,
        //   clearable: true,
        //   disabled: false,
        //   optionData: [
        //     { key: 1, value: "web端" }
        //     // { key: 2, value: "http接口" },
        //     // { key: 4, value: "cmpp接口" }
        //     // { key: 7, value: "音频接口" }
        //   ],
        //   tag: "mms",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "select",
          label: "计费方式",
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
          maxlength: 6,
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: validatorPrice
            }
          ]
        },
        {
          type: "select",
          label: "报告类型",
          key: "mmsReportType",
          tag: "mms",
          optionData: [
            { key: "0", value: "无权限" },
            { key: 1, value: "推送" }
            // { key: 2, value: "自取(批量)" },
            // { key: 3, value: "自取(单条)" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "报告推送地址",
          key: "mmsReportUrl",
          tag: "mms",
          defaultValue: ""
        },
        {
          type: "input",
          label: "模板推送地址",
          key: "mmsAuditCallBack",
          tag: "mms",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "select",
        //   label: "彩信上行类型",
        //   key: "mmsMoType",
        //   tag: "mms",
        //   optionData: [
        //     { key: "0", value: "无权限" },
        //     { key: 1, value: "推送" },
        //     { key: 2, value: "自取(批量)" }
        //   ],
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // },
        {
          type: "checkbox",
          label: "黑名单",
          initDefaultValue: [],
          defaultValue: [],
          key: "mmsBlackLevel",
          tag: "mms",
          optionData: [
            { key: 1, value: "系统级" },
            { key: 2, value: "账户级" }
            // { key: 3, value: "营销级" },
            // { key: 4, value: "BSATS级" }
          ]
          // rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
        // {
        //   isTitle: true,
        //   title: "服务信息",
        //   colSpan: 24
        // },
        // {
        //   type: "textarea",
        //   label: "备注",
        //   key: "remark"
        // }

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
      // 新增展示上一账户编号和修改展示当前账户编号
      titleTips: "",
      // 新建时用于给登录账号赋值
      prevUserId: "",

      agentListData: [],
      salemanListData: [],
      listTagData: [],
      // 修改商户端用户账号密码
      editUserPassword: false
    };
  },
  created() {},
  mounted() {
    this.getAllCorp();
    this.getRole();
    this.getUserId();
    this.getBlackFroup();
    this._mxGetList();
    this.$http.agent.queryAgent({ status: 1 }).then(res => {
      if (resOk(res)) {
        this.agentListData = res.data;
        this.searchFormConfig.forEach(item => {
          if (item.key === "agentId") {
            item.optionData = [];
            this.agentListData.forEach(t => {
              let obj = {
                key: t.agentId,
                value: t.agentName
              };
              item.optionData.push(obj);
            });
          }
        });
      }
    });
    this.$http.sysSales.queryAvailableSaleman().then(res => {
      if (resOk(res)) {
        this.salemanListData = res.data;
        this.saleList = res.data;
        this.searchFormConfig.forEach(item => {
          if (item.key === "saleMan") {
            item.optionData = [];
            this.salemanListData.forEach(t => {
              let obj = {
                key: t.userName,
                value: t.actualName
              };
              item.optionData.push(obj);
            });
          }
        });
      }
    });
    this.$http.smsTagController
      .listTag({ pageNumber: 1, pageSize: 9999 })
      .then(res => {
        if (resOk(res)) {
          this.listTagData = res.data.list;
          this.tagsData[0].optionData = res.data.list.map(v => {
            return { key: v.id, value: v.name };
          });
          this.searchFormConfig.forEach(item => {
            if (item.key === "tag") {
              item.optionData = [];
              this.listTagData.forEach(t => {
                let obj = {
                  key: t.id,
                  value: t.name
                };
                item.optionData.push(obj);
              });
            }
          });
        }
      });
    this.searchFormConfig.forEach(item => {
      if (item.key === "agentId") {
        item.optionData = [];
        this.agentListData.forEach(t => {
          let obj = {
            key: t.agentId,
            value: t.agentName
          };
          item.optionData.push(obj);
        });
      }
      if (item.key === "saleMan") {
        item.optionData = [];
        this.salemanListData.forEach(t => {
          let obj = {
            key: t.userName,
            value: t.actualName
          };
          item.optionData.push(obj);
        });
      }
      if (item.key === "tag") {
        item.optionData = [];
        this.listTagData.forEach(t => {
          let obj = {
            key: t.id,
            value: t.name
          };
          item.optionData.push(obj);
        });
      }
    });
  },
  activated() {
    //重新获取数据
    this.getAllCorp();
    this.getSaleman();
    this.getAgent();
    this.getRole();
    this.listTag();
    this.getUserId();
    this.getBlackFroup();
  },
  computed: {
    renderTitle() {
      return `${this.formTit}账户`;
    },
    renderLock() {
      const { proType, password, webPassword, secretKey } = this.infoData;
      switch (proType) {
        case 1:
          return !!(!webPassword || webPassword === "-");
        case 2:
          const http = [password, webPassword, secretKey].some(
            v => !v || v === "-"
          );
          return http;
        case 4:
          const cmpp = [password, webPassword].some(v => !v || v === "-");
          return cmpp;
      }
    }
  },
  methods: {
    choose(item) {
      const { key } = item;
      const idx = this.formConfig.findIndex(v => v.key === key);
      this.$set(
        this.formConfig[idx],
        "defaultValue",
        "https://smsmanage.jvtd.cn/#/"
      );
    },
    // 关闭信息弹窗后重置web密码为不可修改状态
    handleClose(done) {
      done();
      this.editUserPassword = false;
    },
    // 确认修改商户端用户密码
    handleEditUserPassword() {
      const { userId, webPassword } = this.infoData;
      if (!isPassword(webPassword)) {
        this.$message.error(
          "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
        );
        return;
      }
      this.$http.corpUser
        .updateWebPassword({ userId, webPassword })
        .then(res => {
          if (res.code === 200) {
            this.editUserPassword = false;
            this.$message.success(res.data || res.msg);
          } else {
            this.$message.error(res.data || res.msg);
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
      });
    },
    // 获取账户编号
    async getUserId(data) {
      this.titleTips = ""; // 重置
      if (this.formTit === "新增") {
        const res = await this.$http.corpUser.getLasttUserId();
        this.titleTips = `（上一个账户编号为：${res.data}）`;
        this.prevUserId = res.data;
      } else {
        this.titleTips = `（账户编号为：${data.userId}）`;
      }
    },
    disabledProType() {
      const idx = this.formConfig.findIndex(v => v.key === "proType");
      this.formConfig[idx].disabled = true;
    },
    //多选移除操作
    removeTag({ val, item }) {
      if (this.formTit == "修改") {
        this.formConfig.forEach(el => {
          if (item.key === "productType" && el.key === item.key) {
            if (this.currentEditFormData.productType.includes(val)) {
              el.defaultValue = this.currentEditFormData.productType;
              this.$message.error("不可修改！");
              this.selectChange({ val: [val], item });
              this.editFormConfigHandle(this.currentEditFormData);
            }
          }
          if (item.key === "mmsProType" && el.key === item.key) {
            if (this.currentEditFormData.mmsProType.includes(val)) {
              el.defaultValue = this.currentEditFormData.mmsProType;
              this.$message.error("不可修改！");
            }
          }
          if (item.key === "proType" && el.key === item.key) {
            if (this.currentEditFormData.proType.includes(val)) {
              el.defaultValue = this.currentEditFormData.proType;
              this.$message.error("不可修改！");
            }
          }
        });
      }
    },
    //根据下拉选择对表单项进行展示
    selectChange(data) {
      const { val, item } = data;
      if (item.key === "productType") {
        if (val && val.length != 0) {
          //根据产品的选择动态显示表单及数据处理
          if (val.includes(1) && val.includes(2)) {
            this._setTagDisplayShow(this.formConfig, "sms", false);
            this._setTagDisplayShow(this.formConfig, "mms", false);
          } else if (val.includes(1)) {
            this._setTagDisplayShow(this.formConfig, "sms", false);
            this._setTagDisplayShow(this.formConfig, "mms", true);
            this._setDisplayShow(this.formConfig, "mmsReturnBalance", true);
            this._deleteDefaultValue(this.formConfig, "mms");
          } else if (val.includes(2)) {
            this._setTagDisplayShow(this.formConfig, "mms", false);
            this._setTagDisplayShow(this.formConfig, "sms", true);
            this._setDisplayShow(this.formConfig, "returnBalance", true);
            this._deleteDefaultValue(this.formConfig, "sms");
          }
        } else {
          this._setTagDisplayShow(this.formConfig, "sms", true);
          this._setTagDisplayShow(this.formConfig, "mms", true);
          this._deleteDefaultValue(this.formConfig, "mms");
          this._deleteDefaultValue(this.formConfig, "sms");
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
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", true);
        } else if (val === 2) {
          this._setDefaultValueKeys("directPort", "8090");
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", true);
        } else if (val === 3) {
          this._setDefaultValueKeys("directPort", "7890");
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", true);
        } else {
          this._setDefaultValueKeys("directPort", "");
          //cmpp设置
          this._setDisplayShow(this.formConfig, "maxSession", false);
          this._setDefaultValueKeys("maxSession", "1");
        }
      }
      // if (item.key === "moType") {
      //   if (val == "0") {
      //     this.formConfig.forEach(el => {
      //       if (el.key === "moUrl" || el.key === "reportUrl") {
      //         this.$nextTick(() => {
      //           this.$set(el, "rules", [
      //             { required: false, message: "请输入必填项", trigger: "blur" }
      //           ]);
      //         });
      //       }
      //     });
      //   } else {
      //     this.formConfig.forEach(el => {
      //       if (el.key === "moUrl" || el.key === "reportUrl") {
      //         let rules = [
      //           { required: true, message: "请输入必填项", trigger: "blur" }
      //         ];
      //         this.$nextTick(() => {
      //           this.$set(el, "rules", rules);
      //         });
      //       }
      //     });
      //   }
      // }
    },
    /**
     * 关闭弹窗
     */
    _mxCancel() {
      this.addChannel = false;
      setTimeout(() => {
        this.$refs.formItemTit.resetForm();
      }, 0);
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
      params.startTime = params.times ? params.times[0] : "";
      params.endTime = params.times ? params.times[1] : "";

      if (this.formTit == "新增") {
        this.$http[namespace][add](params).then(res => {
          this._mxSuccess(res, params);
          // 添加完成后去除再次点击新建页面保留上次新建的页面数据
          this.createEnd = true;
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

    //提交表单前调整表单内数据
    _mxArrangeSubmitData(formData) {
      let form = Object.assign({}, formData);
      for (let key in form) {
        if (key === "blackLevel" || key === "mmsBlackLevel") {
          form[key] = form[key].join(",");
        }
        if (
          key === "productType" ||
          key === "mmsProType"
          // key === "proType"
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
            form[key] = null;
          }
        }
      }
      return form;
    },
    isOpenDialog() {
      this.loginVisible = true;
      this.$nextTick(() => {
        this.$refs["loginForm"].clearValidate();
      });
    },
    // 二次登录验证
    notDisabled() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          const { userId } = this.infoData;
          this.formData.type = 4;
          this.formData.soleId = Number(userId);

          this.$http.mmsGateway.viewLogin(this.formData).then(res => {
            if (res.code === 200) {
              if (this.infoData.proType === 2) {
                // HTTP类型 ------ 查秘钥
                this.$http.corpUser.getSecretKeyById(userId).then(response => {
                  this.$nextTick(() => {
                    this.$set(
                      this.infoData,
                      "secretKey",
                      response.data.publicKey
                    );
                  });
                });
              }
              this.$nextTick(() => {
                this.infoData.password = res.data.password;
                this.infoData.webPassword = res.data.webPassword;
              });

              this.loginVisible = false;
              this.$message.success("验证成功");
            } else {
              this.$message.error(res.data || res.msg);
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
    async _mxCreate() {
      // this.$router.push({
      //   name: "userManagementType",
      //   query: { type: "create" }
      // });
      this.formTit = "新增";
      let arr = [
        { required: true, message: "请输入必填项", trigger: "blur" },
        {
          trigger: "blur",
          validator: (rule, value, callback) => {
            if (value) {
              if (!isPassword(value)) {
                callback(
                  new Error(
                    "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                  )
                );
              } else {
                callback();
              }
            } else {
              callback(new Error("请输入必填项"));
            }
          }
        }
      ];
      await this.getAllCorp();
      await this.getRole();
      await this.getUserId();
      this.formConfig.forEach(item => {
        if (item.key === "password") {
          item.rules = arr;
        }
        if (
          item.key === "productType" ||
          item.key === "mmsProType" ||
          item.key === "proType"
        ) {
          item.optionData.forEach(el => {
            this.$set(el, "disabled", false);
          });
        }
        if (item.key == "proType") {
          this.$set(item, "disabled", false);
        }
        if (item.key == "corpId") {
          this.$set(item, "disabled", false);
        }
        if (item.key == "reductModel") {
          this.$set(item, "disabled", false);
        }
        if (item.key == "mmsReductModel") {
          this.$set(item, "disabled", false);
        }
        if (item.tag === "sms" || item.tag === "mms") {
          item.isShow = true;
        }
        if (item.key === "loginName") {
          // item.disabled = false;
          const val = `u${this.prevUserId + 1}`;
          this.$set(item, "defaultValue", val);
          this.$set(item, "initDefaultValue", val);
        }
        // if (item.key === "moUrl" || item.key === "reportUrl") {
        //   this.$set(item, "rules", [
        //     { required: false, message: "请输入必填项", trigger: "blur" }
        //   ]);
        // }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItemTit.resetForm();
      }, 0);
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
        // if (key === "proType") {
        //   row["proType"] = row["proTypes"];
        // }
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
      // this.$router.push({
      //   name: "userManagementType",
      //   query: { type: "update", row: JSON.stringify(row), ID }
      // });
      this.currentEditFormData = {};
      let lineData = this.$deepClone(row);
      lineData = this._mxArrangeEditData(lineData);
      this.id = lineData[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.editFormConfigHandle(lineData);
      setTimeout(() => {
        this.$refs.formItemTit.clearValidate();
      }, 0);
      // this.disabledProType();
      this.getUserId(lineData);
      this.formConfig.forEach(item => {
        // if (item.key === "loginName") {
        //   item.disabled = true;
        // }
        if (item.key === "password") {
          let arr = [
            {
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (value) {
                  if (!isPassword(value)) {
                    callback(
                      new Error(
                        "密码至少包含数字、大小写字母、符号中的三种，且长度在8~18位"
                      )
                    );
                  } else {
                    callback();
                  }
                } else {
                  callback();
                }
              }
            }
          ];
          item.rules = arr;
        }
      });
      this.addChannel = true;
    },
    //根据调整的数据 修改表单配置
    editFormConfigHandle(lineData) {
      let productTypeVal = [1];
      this.formConfig.forEach(item => {
        for (let keys in lineData) {
          if (item.key === keys && lineData[keys] !== "-") {
            if (lineData[keys] === 0) {
              this.$set(item, "defaultValue", "0");
            } else {
              this.$set(item, "defaultValue", lineData[keys]);
            }
          } else if (item.key === keys && lineData[keys] === "-") {
            this.$set(item, "defaultValue", "");
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
          productTypeVal = item.defaultValue;
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
        if (
          item.key === "productType" ||
          item.key === "mmsProType"
          // item.key === "proType"
        ) {
          let val = item.defaultValue;
          if (val && val.length !== 0) {
            item.optionData.forEach(el => {
              if (val.includes(el.key)) {
                this.$set(el, "disabled", true);
              } else {
                this.$set(el, "disabled", false);
              }
            });
          }
        }

        if (item.key === "proType") {
          //产品类型如果是cmpp就展示链接路数
          this.$nextTick(() => {
            if (item.defaultValue === 4) {
              this._setDisplayShow(this.formConfig, "maxSession", false);
            } else {
              this._setDisplayShow(this.formConfig, "maxSession", true);
            }
          });
        }
        // if (item.key == "proType") {
        //   this.$set(item, "disabled", true);
        // }
        // if (item.key == "mmsProType") {
        //   this.$set(item, "disabled", true);
        // }
        // if (item.key == "corpId") {
        //   this.$set(item, "disabled", true);
        // }
        // if (item.key == "reductModel") {
        //   if (productTypeVal.includes(1)) {
        //     this.$set(item, "disabled", true);
        //   } else {
        //     this.$set(item, "disabled", false);
        //   }
        // }
        if (item.key == "mmsReductModel") {
          if (productTypeVal.includes(2)) {
            this.$set(item, "disabled", true);
          } else {
            this.$set(item, "disabled", false);
          }
        }

        if (!Object.keys(lineData).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "times") {
          if (
            lineData.startTime !== "-" &&
            lineData.startTime &&
            lineData.endTime !== "-" &&
            lineData.endTime
          ) {
            this.$set(item, "defaultValue", [
              lineData.startTime,
              lineData.endTime
            ]);
          } else {
            this.$set(item, "defaultValue", "");
          }
        }
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
    //提交速率
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
            this.listTagData = res.data.list;
            this.tagsData[0].optionData = res.data.list.map(v => {
              return { key: v.id, value: v.name };
            });
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
      this.infoData = this.$deepClone(row);
      // 默认选中第一种产品类型
      this.activeName = this.infoData.productTypes[0] + "";
      this.infoVisible = true;
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
        }
      });
    },
    //获取销售员
    getSaleman() {
      this.$http.sysSales.queryAvailableSaleman().then(res => {
        if (resOk(res)) {
          this.salemanListData = res.data;
          this.saleList = res.data;
          this._setDefaultValue(
            this.formConfig,
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
          this.agentListData = res.data;
          this._setDefaultValue(
            this.formConfig,
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
    }
  },
  watch: {
    formConfig: {
      handler(newVal) {
        const idx = newVal.findIndex(v => v.key === "times");
        const idx1 = newVal.findIndex(v => v.key === "sendSettings");
        newVal[idx].rules = [
          {
            required: !!newVal[idx1].defaultValue,
            message: "请选择必选项",
            trigger: "change"
          }
        ];
        newVal[idx1].rules = [
          {
            required: !!newVal[idx].defaultValue,
            message: "请选择必选项",
            trigger: "change"
          }
        ];
      },
      deep: true
    }
  }
};
</script>

<style lang="scss" scoped>
.corpUser {
  .list_table {
    width: 100%;
  }
  .pwd {
    width: 40%;
  }
  .edit-user-password {
    color: #0964ff;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
