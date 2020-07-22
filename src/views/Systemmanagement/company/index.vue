<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="searchForm.roleName" clearable placeholder="登录账号" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.userId" clearable placeholder="用户ID" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="searchForm.corpId" clearable placeholder="企业ID" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryOrderList">查询</el-button>
        </el-form-item>
        <!--<el-form-item style="float: right">-->
        <!--<el-button type="primary"   @click="customerAddInfo = true;">新增商户账号</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </el-col>
    <el-table :data="dataList" highlight-current-row height="680" style="width: 100%;">
      <!--登录账户	姓名	手机号	状态	操作-->
      <el-table-column prop="userName" label="企业名" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="loginName" label="登录账号" />
      <el-table-column prop="password" label="密码" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="infoShow(scope.row)" type="text" size="small">绑定权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-col :span="24" class="toolbar">
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
      title="绑定权限"
      :visible.sync="setRoleMenu"
      :close-on-click-modal="false"
      style="margin: 0 auto"
    >
      <el-form
        ref="updateCustomForm"
        label-width="120px"
        :model="setInfo"
        :rules="updateFormRules"
        class="demo-ruleForm"
      >
        <el-form-item label="选择角色">
          <el-select v-model="addRoleId" placeholder="选择角色" popper-class="select-option">
            <el-option
              v-for="item in navList"
              :key="item.roleName"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setNavuserList('updateCustomForm')">保存</el-button>
        <el-button @click.native="setRoleMenu = false">取消</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import checkPermission from "@/utils/permission";
import Util from "@/utils/reg";
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      if (
        value &&
        (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value) || value.length !== 11)
      ) {
        callback(new Error("手机号码不符合规范"));
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
      orderMoney: "0",
      count: "",
      totalAmount: "",
      allOrderStatusInfo: false, // 推送界面是否显示
      orderStatusInfo: false, // 推送界面是否显示
      shopInfo: false, // 状态界面是否显示
      cityList: [],
      dataList: [],
      searchForm: {
        roleName: "",
        userId: "",
        corpId: ""
      },
      productId: "",
      contactMobile: "",
      contactName: "",
      supplierId: "",
      supplierName: "",
      roleId: "",
      userId: "",
      addRoleId: "",
      roleName: "",
      roleType: "",
      customerAddInfo: false,
      customerInfo: false,
      setRoleMenu: false,
      defaultProps: {
        children: "childMenu",
        label: "name"
      },
      navList: [],
      navListId: [],
      setInfo: {},
      addInfo: {
        pwd: "",
        account: "",
        number: "",
        name: "",
        mobile: "",
        state: ""
      },
      updateFormRules: {
        contactMobile: [{ validator: validatePhone, trigger: "blur" }]
      },
      companyOptions: [], // 企业全称下拉项
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.orderList();
  },
  filters: {
    formatDate: function(value) {
      // var val = JSON.parse(value)
      var date = new Date(value); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h =
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }
  },
  methods: {
    checkPermission,
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
      const { roleName, userId, corpId } = this.searchForm;
      const params = {
        data: {
          webUser: {
            roleName: roleName,
            userId: userId,
            corpId: corpId
          },
          pageNumber: this.cur_page,
          pageSize: this.pageNum
        }
      };
      this.$http.company.queryWebUserByPage(params).then(res => {
        if (res.code == "200") {
          this.dataList = res.data.list;
          this.totalCount = Number(res.data.total);
        } else {
          this.$message.error(res.data);
        }
      });
    },
    infoShow(row) {
      console.log(row);
      this.userId = row.userId;
      this.addRoleId = row.roleId;
      this.setRoleMenu = true;
      this.deleteCustomer();
    },
    deleteCustomer(id) {
      this.setRoleMenu = true;
      this.roleId = id;
      let params = {
        roleType: 1
      };
      this.$http.role.getRoleByType(params).then(res => {
        if (res.code == "200") {
          this.navList = res.data;
        } else {
          this.$message.error(res.data);
        }
      });
    },
    setNavuserList() {
      this.setRoleMenu = true;
      let params = {
        userId: this.userId,
        roleId: this.addRoleId
      };
      this.$http.company.addOrUpdate(params).then(res => {
        if (res.code == "200") {
          this.$message({
            showClose: true,
            message: "绑定成功",
            type: "success"
          });
          this.setRoleMenu = false;
          this.orderList();
        } else {
          console.log(res);
          this.$message.error(res.data);
        }
      });
    },
    treeDataTranslate(res) {
      res.forEach((item, index) => {
        if (item.ifChecked == 1) {
          this.navListId.push(item.menuId);
        }
        if (item.childMenu) {
          this.treeDataTranslate(item.childMenu);
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
