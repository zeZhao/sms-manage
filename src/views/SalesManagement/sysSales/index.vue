<template>
  <!--销售员-->
  <div class="sysSales">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="userName" label="登录名" />
      <el-table-column prop="actualName" label="真实姓名" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="groupName" label="所属组" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.type === 1
              ? "主管"
              : scope.row.type === 2
              ? "组长"
              : scope.row.type === 3
              ? "组员"
              : "介绍人"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="modifyTime" label="修改时间" width="150">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="sysName" label="修改人" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? "正常" : "停用" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="updateStatus(scope.row, '2')"
            type="text"
            size="small"
            v-if="scope.row.status === 1"
            style="color: red"
            >停用</el-button
          >
          <el-button
            @click="updateStatus(scope.row, '1')"
            type="text"
            size="small"
            v-else
            style="color: #3a835d"
            >启动</el-button
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
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
      ></FormItem>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorUserName = (rule, value, callback) => {
      let regex = /^[a-zA-Z0-9]{2,15}$/;
      if (value == "") {
        callback(new Error("登录名称不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入1-15位字符，支持数字、英文"));
        } else {
          callback();
        }
      }
    };
    const validatorPassword = (rule, value, callback) => {
      let regex = /^[\d0-9a-zA-Z!@#$%^&*~]{8,16}$/;
      if (value) {
        if (!regex.test(value)) {
          callback(new Error("输入8-16位字符，支持数字、英文、标点符号"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validatorActualName = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_a-zA-Z]{1,15}$/;
      if (value == "") {
        callback(new Error("真实姓名不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("输入1-15位字符，支持汉字、英文"));
        } else {
          callback();
        }
      }
    };
    const validatorMobile = (rule, value, callback) => {
      let regex = /^([0-9]{3,4}\-)?[0-9]{7,8}$|^0?1[3|4|5|7|8|9][0-9]\d{8}$/;
      if (value == "") {
        callback(new Error("手机号不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("手机号格式不正确"));
        } else {
          callback();
        }
      }
    };
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysSales",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "saleMan",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "登录名",
          key: "userName",
          placeholder: "请输入登录名"
        },
        {
          type: "input",
          label: "真实姓名",
          key: "actualName",
          placeholder: "请输入真实姓名"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          optionData: [
            {
              key: 1,
              value: "主管"
            },
            {
              key: 2,
              value: "组长"
            },
            {
              key: 3,
              value: "组员"
            },
            {
              key: 4,
              value: "介绍人"
            }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "登录名称",
          key: "userName",
          disabled: false,
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "blur", validator: validatorUserName }
          ]
        },
        {
          type: "input",
          label: "登录密码",
          key: "password",
          defaultValue: "",
          rules: [{ trigger: "blur", validator: validatorPassword }]
        },
        {
          type: "input",
          label: "真实姓名",
          key: "actualName",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "blur", validator: validatorActualName }
          ]
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { trigger: "blur", validator: validatorMobile }
          ]
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "主管"
            },
            {
              key: 2,
              value: "组长"
            },
            {
              key: 3,
              value: "组员"
            },
            {
              key: 4,
              value: "介绍人"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "销售组",
          key: "groupId",
          defaultValue: "",
          optionData: []
        }
      ],
      id: "",
      salesData: []
    };
  },
  mounted() {
    this.getEditData();
  },
  computed: {},
  methods: {
    // 获取 组
    getEditData() {
      this.$http.sysSales.getEditData({}).then(res => {
        if (res.code === 200) {
          this.salesData = res.data;
          this.formConfig.forEach(item => {
            const { key } = item;
            if (key === "groupId") {
              res.data.forEach(t => {
                let obj = {
                  key: t.sid,
                  value: t.groupName
                };
                item.optionData.push(obj);
              });
            }
          });
        }

        console.log(res, "----res");
      });
    },
    //修改状态
    updateStatus(row, status) {
      const { id, userName } = row;
      this.$http.sysSales.updateStatus({ id, status, userName }).then(res => {
        if (res.code == 200) {
          this.$message.success("修改成功");
          this._mxGetList();
        }
      });
    },
    submit(form) {
      console.log(form, "--------form");
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form
        };
        this.$http.sysSales.addOrUpdate(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      } else {
        params = {
          id: this.id,
          ...form
        };
        this.$http.sysSales.addOrUpdate(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    create() {
      this.addChannel = true;
      this.formTit = "新增";
      let rule = { required: true, message: "请输入必填项", trigger: "blur" };
      this.formConfig.forEach(item => {
        if (item.key === "userName") {
          item.disabled = false;
        }
        if (item.key === "password") {
          this.$set(item.rules, 1, rule);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.id = row.id;
      this.formTit = "修改";

      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "password") {
          this.$set(item, "defaultValue", "");
          this.$set(item.rules, 1, {});
        }
        if (item.key === "userName") {
          item.disabled = true;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    cancel() {
      this.addChannel = false;
    },
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.modifyTime) {
          item.modifyTime = new Date(item.modifyTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSales {
}
</style>
