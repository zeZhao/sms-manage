<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px">
      <el-form :inline="true">
        <el-form-item>
          <el-input
            v-model="search.corpId"
            type="number"
            clearable
            placeholder="商户编号"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="search.corpName"
            clearable
            placeholder="商户名称"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="search.contact"
            clearable
            placeholder="联系人姓名"
          />
        </el-form-item>
        <!--1.预付提交计费，2.预付成功计费，3.后付提交计费，4.后付成功计费-->
        <!-- <el-form-item>
          <el-select
            v-model="search.reductModel"
            placeholder="计费模式"
            clearable
          >
            <el-option value="1" label="预付提交计费" />
            <el-option value="2" label="预付成功计费" />
            <el-option value="3" label="后付提交计费" />
            <el-option value="4" label="后付成功计费" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-select v-model="search.status" placeholder="状态" clearable>
            <el-option value="2" label="正常" />
            <el-option value="3" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="queryOrderList">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-button type="primary" @click="newEnterprise">新增商户</el-button>
    <el-table
      :data="dataList"
      border
      highlight-current-row
      style="width: 100%;margin-top:20px"
    >
      <!--商户编号 特服号 用户商户名称 客户联系人姓名 客户联系人电话 扩展位数 计费方式 短信余额 状态 操作 -->
      <el-table-column prop="corpId" label="商户编号" />
      <!-- <el-table-column prop="code" label="特服号" /> -->
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="contact" label="联系人姓名" />
      <el-table-column prop="mobile" label="联系人电话" />
      <!-- <el-table-column prop="sublong" label="扩展位数" /> -->
      <!-- <el-table-column prop="reductModel" label="计费方式">
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
      </el-table-column> -->
      <!-- <el-table-column prop="smsBalance" label="短信余额" /> -->
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">删除</span>
          <span v-if="scope.row.status == 1">初始</span>
          <span v-if="scope.row.status == 2">正常</span>
          <span v-if="scope.row.status == 3">禁用</span>
          <!-- <span>{{
            scope.row.status == 0
              ? "删除"
              : scope.row.status == 1
              ? "初始"
              : scope.row.status == 2
              ? "正常"
              : "禁用"
          }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <!--修改 初始 禁用 启用-->
          <el-button @click="infoShow(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <!-- <el-button
            v-if="scope.row.status == 1"
            @click="setType(scope.row, 'init', '2')"
            type="text"
            size="small"
            >初始</el-button
          > -->
          <el-button
            v-if="scope.row.status == 2"
            @click="setType(scope.row, 'disable', '3')"
            style="color: #ec5858"
            type="text"
            size="small"
            >禁用</el-button
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
    <!--分页-->
    <el-col :span="24" class="toolbar page">
      <el-pagination
        class="pull-right clearfix"
        :current-page="cur_page"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pageNum"
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-col>
    <el-dialog
      :title="formTit"
      :visible.sync="customerAddInfo"
      :close-on-click-modal="false"
      top="45px"
    >
      <el-form
        ref="addForm"
        label-width="120px"
        :model="addInfo"
        :rules="updateFormRules"
        class="demo-ruleForm"
      >
        <el-form-item label="商户名称" prop="corpName">
          <el-input
            maxlength="30"
            show-word-limit
            v-model="addInfo.corpName"
            clearable
            placeholder="请输入商户名称"
          />
        </el-form-item>
        <!-- <el-form-item label="密码" prop="pwd">
          <el-input v-model="addInfo.pwd" type="password" clearable placeholder="请输入8-16位密码" />
        </el-form-item>-->
        <!-- <el-form-item label="特服号" prop="code">
          <el-input v-model="addInfo.code" placeholder="请输入特服号" />
        </el-form-item>
        <el-form-item label="可扩展位数" prop="sublong">
          <el-input
            maxlength="10"
            show-word-limit
            v-model="addInfo.sublong"
            clearable
            placeholder="请输入可扩展位数"
          />
        </el-form-item>
        <el-form-item label="计费方式" prop="reductModel">
          <el-select
            style="width: 100%"
            v-model="addInfo.reductModel"
            placeholder="请选择计费方式"
            popper-class="select-option"
          >
            <el-option value="1" label="预付提交计费" />
            <el-option value="2" label="预付成功计费" />
            <el-option value="3" label="后付提交计费" />
            <el-option value="4" label="后付成功计费" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为直客" prop="isDirectUser">
          <el-select
            style="width: 100%"
            v-model="addInfo.isDirectUser"
            placeholder="请选择"
            popper-class="select-option"
          >
            <el-option value="1" label="直客" />
            <el-option value="2" label="同行" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为商用" prop="isBusiness">
          <el-select
            style="width: 100%"
            v-model="addInfo.isBusiness"
            placeholder="请选择"
            popper-class="select-option"
          >
            <el-option :value="0" label="商用" />
            <el-option :value="1" label="非商用" />
          </el-select>
        </el-form-item>
        <el-form-item label="短信的单价" prop="cardUnit">
          <el-input
            maxlength="5"
            show-word-limit
            v-model="addInfo.cardUnit"
            clearable
            placeholder="以分为单位"
          />
        </el-form-item> -->
        <el-form-item label="客户联系人" prop="contact">
          <el-input
            maxlength="10"
            show-word-limit
            v-model="addInfo.contact"
            type="phone"
            clearable
            placeholder="请输入客户联系人"
          />
        </el-form-item>
        <el-form-item label="客户联系人电话" prop="mobile">
          <el-input
            v-model="addInfo.mobile"
            type="phone"
            clearable
            maxlength="11"
            placeholder="请输入客户联系人电话"
          />
        </el-form-item>
        <el-form-item label="开户行信息" prop="bankAccount">
          <el-input
            maxlength="300"
            show-word-limit
            v-model="addInfo.bankAccount"
            type="textarea"
            clearable
            placeholder="请输入备注开户行信息"
          />
        </el-form-item>
        <!-- <el-form-item label="父商户编号" prop="root">
          <el-button v-if="!addInfo.root" @click="selectCompany"
            >请选择父商户</el-button
          >
          <span v-else>{{ addInfo.root }}</span>
          <span>
            <el-button v-if="addInfo.root" @click="selectCompany"
              >修改</el-button
            >
          </span>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addCustomerInfo('addForm')">{{
          formBtn
        }}</el-button>
        <el-button @click.native="customerAddInfo = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="dialogTit"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="30%"
    >
      <span>{{ information }}</span>
      <p v-show="dialogTit === '禁用'" style="color: #ec5858">
        禁用后所关联的下属账户不可用，请谨慎操作
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStatus">确 定</el-button>
      </span>
    </el-dialog>
    <ChooseEnterprise
      :isEnterprise="isEnterprise"
      @cancel="cancel"
      @getCorpId="getCorpId"
    ></ChooseEnterprise>
  </section>
</template>
<script>
import Util from "@/utils/reg";
import listMixin from "@/mixin/listMixin";
import ChooseEnterprise from "@/components/ChooseEnterprise";

export default {
  mixins: [listMixin],
  components: { ChooseEnterprise },
  data() {
    var validCode = (rule, value, callback) => {
      if (value && (!/^\d+$/.test(value) || value.length !== 4)) {
        callback(new Error("请输入4位特服号"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (this.formBtn === "新增") {
        if (value === "") {
          callback();
        } else {
          if (
            !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value) ||
            value.length !== 11
          ) {
            callback(new Error("手机号码格式错误"));
          } else {
            callback();
          }
        }
      } else {
        if (value.indexOf("*") === -1) {
          if (value === "") {
            callback();
          } else {
            if (
              !/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value) ||
              value.length !== 11
            ) {
              callback(new Error("手机号码格式错误"));
            } else {
              callback();
            }
          }
        } else {
          callback();
        }
      }
    };
    var validate = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入短信单价"));
      } else if (value <= 0) {
        callback(new Error("短信单价必须大于0"));
      } else {
        callback();
      }
    };
    return {
      // -------------------我-------------是------------的----------分------------界----------线----------------☺-------------------//
      cur_page: 1, // 默认在第一页
      pageNum: 10, // 默认每页显示1条数据
      totalCount: 1, // 默认总条数为一条
      show: true,
      count: "",
      dataList: [],
      customerAddInfo: false,
      customerInfo: false,
      search: {
        corpId: "",
        corpName: "",
        reductModel: "",
        status: "",
        contact: ""
      },
      navList: [],
      navListId: [],
      // 新增商户
      addInfo: {
        corpName: "",
        // pwd: "",
        code: "",
        sublong: "",
        reductModel: "",
        isDirectUser: "",
        isBusiness: "",
        cardUnit: "",
        contact: "",
        mobile: "",
        bankAccount: "",
        root: ""
      },
      //新增商户验证
      updateFormRules: {
        corpName: [
          { required: true, message: "请输入商户名称", trigger: "blur" }
        ],
        // pwd: [{ required: true, message: "请输入8-16位密码", trigger: "blur" }],
        code: [
          // { required: true, message: "请输入特服号", trigger: "blur" },
          {
            validator: validCode,
            trigger: "change"
          }
        ],
        reductModel: [
          {
            required: true,
            message: "请至少选择一个计费方式",
            trigger: "change"
          }
        ],
        isDirectUser: [
          { required: true, message: "请选择是否为商用", trigger: "change" }
        ],
        cardUnit: [
          { required: true, message: "请输入短信单价", trigger: "blur" },
          { validator: validate, trigger: "blur" }
        ],
        // contact: [{ required: true, message: "请输入联系人", trigger: "blur" }],
        mobile: [
          // { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: validatePhone, trigger: ["blur", "change"] }
        ]
      },
      formTit: "新增商户",
      formBtn: "新增",
      // 初始/禁用/启用 公共弹窗
      dialogVisible: false,
      dialogTit: "",
      information: "",
      dialogType: "disable",
      currentRowData: {},
      //选择商户
      isEnterprise: false,
      status: ""
    };
  },
  mounted() {
    this.orderList();
  },
  methods: {
    getCorpId(id) {
      this.addInfo.root = id;
    },
    cancel(val) {
      this.isEnterprise = val;
    },
    selectCompany() {
      this.isEnterprise = true;
    },
    queryOrderList() {
      this.cur_page = 1;
      this.orderList();
    },
    // 分页
    handleSizeChange(val) {
      this.page = val;
      this.orderList();
    },
    // 分页
    handleCurrentChange(val) {
      this.cur_page = val;
      this.orderList(); // 确定当前页面后刷新页面
    },
    // 列表
    orderList: function() {
      const params = {
        data: {
          corp: {
            corpId: this.search.corpId,
            corpName: this.search.corpName,
            reductModel: this.search.reductModel,
            status: this.search.status,
            contact: this.search.contact
          },
          pageNumber: this.cur_page,
          pageSize: this.pageNum
        }
      };
      this.$http.corp.queryByPage(params).then(res => {
        if (res.code == "200") {
          this.dataList = res.data.list;
          this.dataList.forEach(item => {
            for (let key in item) {
              if (!item[key]) {
                item[key] = "-";
              }
            }
          });
          this.totalCount = Number(res.data.total);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    newEnterprise() {
      this.customerAddInfo = true;
      this.addInfo = {
        corpName: "",
        // pwd: "",
        code: "",
        sublong: "",
        reductModel: "",
        isDirectUser: "",
        isBusiness: "",
        cardUnit: "",
        contact: "",
        mobile: "",
        bankAccount: "",
        root: ""
      };
      this.$nextTick(() => {
        this.$refs["addForm"].clearValidate();
      });
      this.formBtn = "新增";
      this.formTit = "新增商户";
      //   setTimeout(() => {
      //     this.$refs.addForm.resetFields();
      //   }, 0);
    },
    //新增商户
    addCustomerInfo(formName) {
      // debugger;
      this.$refs[formName].validate(valid => {
        if (valid) {
          // debugger;
          this.$http.corp.addOrUpdate({ ...this.addInfo }).then(res => {
            const { code, data, msg } = res;
            if (code == 200) {
              // debugger;
              this.customerAddInfo = false;
              this.$message.success(msg);
              this.orderList();
              this.addInfo = {
                corpName: "",
                // pwd: "",
                code: "",
                sublong: "",
                reductModel: "",
                isDirectUser: "",
                isBusiness: "",
                cardUnit: "",
                contact: "",
                mobile: "",
                bankAccount: "",
                root: ""
              };
              this.$refs[formName].clearValidate();
            } else {
              this.$message.error(data);
            }
          });
        }
      });
    },
    infoShow(row) {
      let obj = Object.assign(row);
      this.formBtn = "修改";
      this.formTit = "修改商户";
      this.customerAddInfo = true;
      if (obj.isDirectUser) {
        obj.isDirectUser = obj.isDirectUser.toString();
      }
      if (obj.reductModel) {
        obj.reductModel = obj.reductModel.toString();
      }
      for (let key in obj) {
        if (obj[key] && obj[key] !== "-") {
          this.addInfo[key] = obj[key];
        } else if (obj[key] === "-") {
          this.addInfo[key] = "";
        }
      }
      // this.addInfo = Object.assign(this.addInfo, row);
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
          str.title = "禁用";
          str.information = "您确定要禁用商户吗？";
          break;
        case "init":
          str.title = "初始";
          str.information = "初始后，商户将正常使用，您确认要初始吗？";
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
      const { corpId } = this.currentRowData;
      this.$http.corp
        .updateStatus({ corpId, status: this.status })
        .then(res => {
          const { code, msg } = res;
          if (code === 200) {
            this.$message.success(msg);
            this.orderList();
          }
        });
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
