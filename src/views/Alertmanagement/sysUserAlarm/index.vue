<template>
  <!--用户报警-->
  <div class="sysUserAlarm">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="notSubmitMin" label="未提交报警时间间隔(分)" />
      <el-table-column prop="sucCrate" label="低于设定成功率报警" />
      <el-table-column prop="returnRate" label="低于设定返回率报警" />
      <el-table-column prop="mobile" label="手机号码" width="115" />
      <el-table-column prop="adminUser" label="预警用户" />
      <el-table-column prop="cmppDisCount" label="cmpp断链次数" />
      <el-table-column prop="isSubmit" label="有提交短信报警">
        <template slot-scope="scope">
          <span>{{ scope.row.disconnectFail === 0 ? "否" : "是" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="modifyUser" label="修改人" />
      <el-table-column prop="modifyTime" label="修改时间" width="135">
        <template slot-scope="scope">{{
          scope.row.modifyTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('alarmId', scope.row.alarmId)"
            type="text"
            size="small"
            >删除</el-button
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
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysUserAlarm",
        list: "listUserAlarmByPage",
        detele: "deleteUserAlarm"
      },
      // 列表参数
      namespace: "userAlarm",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "未提交报警时间间隔(分)",
          key: "notSubmitMin",
          optionData: [
            {
              key: 0,
              value: "否"
            },
            {
              key: 1,
              value: "是"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "低于设定成功率报警",
          key: "sucCrate",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "低于设定返回率报警",
          key: "returnRate",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "cmpp断链次数",
          key: "cmppDisCount",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "有提交短信报警",
          key: "isSubmit",
          optionData: [
            {
              key: 0,
              value: "否"
            },
            {
              key: 1,
              value: "是"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "预警用户",
          key: "adminUser",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },

        {
          type: "select",
          label: "省份成功率低报警",
          key: "isProvinceSucc",
          optionData: [
            {
              key: 0,
              value: "否"
            },
            {
              key: 1,
              value: "是"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      alarmId: ""
    };
  },
  mounted() {},
  computed: {},
  methods: {
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysUserAlarm.addUserAlarm(params).then(res => {
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
          data: {
            alarmId: this.alarmId,
            ...form
          }
        };
        this.$http.sysUserAlarm.updateUserAlarm(params).then(res => {
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
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.alarmId = row.alarmId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
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
    cancel() {
      this.addChannel = false;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysUserAlarm {
}
</style>
