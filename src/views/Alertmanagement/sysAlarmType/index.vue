<template>
  <!--报警类别-->
  <div class="sysAlarmType">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="errNum" label="错误码" />
      <el-table-column prop="useModule" label="应用模块" />
      <el-table-column prop="alerType" label="报警类型" width="120" />
      <el-table-column
        prop="mobile"
        label="手机号码"
        width="115"
        show-overflow-tooltip
      />
      <el-table-column prop="adminUser" label="预警用户" />
      <el-table-column prop="alarmLevel" label="报警级别">
        <template slot-scope="scope">
          <span>{{
            scope.row.alarmLevel === 0
              ? "提醒"
              : scope.row.alarmLevel === 1
              ? "一般"
              : scope.row.alarmLevel === 2
              ? "重要"
              : "严重"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="alarmMode" label="报警方式">
        <template slot-scope="scope">
          <span>{{
            scope.row.alarmMode === "1"
              ? "短信"
              : scope.row.alarmMode === "2"
              ? "微信"
              : "弹窗"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="wetContentTemp"
        label="微信报警模板"
        show-overflow-tooltip
      />
      <el-table-column
        prop="smsContentTemp"
        label="短信报警模板"
        show-overflow-tooltip
      />
      <el-table-column
        prop="wetTempId"
        label="微信模板ID"
        show-overflow-tooltip
      />
      <el-table-column prop="des" label="描述" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('typeId', scope.row.typeId)"
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
import { number } from "echarts/lib/export";

export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "sysAlarmType",
        list: "listAlarmTypeByPage",
        detele: "deleteAlarmType",
      },
      // 列表参数
      namespace: "alarmType",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "错误码",
          key: "errNum",
          placeholder: "错误码",
        },
        {
          type: "input",
          label: "应用模块",
          key: "useModule",
          placeholder: "请输入应用模块",
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号",
        },
        {
          type: "input",
          label: "报警类型",
          key: "alerType",
          placeholder: "请输入报警类型",
        },
        {
          type: "select",
          label: "预警级别",
          key: "alarmLevel",
          placeholder: "请选择预警级别",
          optionData: [
            {
              key: 0,
              value: "提醒",
            },
            {
              key: 1,
              value: "一般",
            },
            {
              key: 2,
              value: "重要",
            },
            {
              key: 3,
              value: "严重",
            },
          ],
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "错误码",
          key: "errNum",
          defaultValue: "",
        },
        {
          type: "input",
          label: "应用模块",
          key: "useModule",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "报警类型",
          key: "alerType",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          defaultValue: "",
          placeholder: "填写多个手机号请用逗号填写",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "预警用户",
          key: "adminUser",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "select",
          label: "报警级别",
          key: "alarmLevel",
          optionData: [
            {
              key: 0,
              value: "提醒",
            },
            {
              key: 1,
              value: "一般",
            },
            {
              key: 2,
              value: "重要",
            },
            {
              key: 3,
              value: "严重",
            },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "select",
          label: "报警方式",
          key: "alarmMode",
          multiple: true,
          defaultValue: [],
          optionData: [
            {
              key: "1",
              value: "短信",
            },
            {
              key: "2",
              value: "微信",
            },
            {
              key: "3",
              value: "弹窗",
            },
          ],
        },
        {
          type: "textarea",
          label: "短信报警模版",
          key: "smsContentTemp",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "textarea",
          label: "微信报警模版",
          key: "wetContentTemp",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "textarea",
          label: "微信模板ID",
          key: "wetTempId",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "textarea",
          label: "描述",
          key: "des",
        },
      ],
      typeId: "",
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
            ...form,
          },
        };
        this.$http.sysAlarmType.addAlarmType(params).then((res) => {
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
            typeId: this.typeId,
            ...form,
          },
        };
        this.$http.sysAlarmType.updateAlarmType(params).then((res) => {
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

    /**
     * 编辑表单前调整表单内数据
     * @param row
     * @private
     */
    _mxArrangeEditData(row) {
      if (row.alarmMode) {
        // "".substring;
        let length = row.alarmMode.length;
        row.alarmMode = row.alarmMode.substring(1, length - 1).split(",");
        row.alarmMode = row.alarmMode.map((item) => {
          return item.substring(1, 2);
        });
      }
      return row;
    },
    edit(row) {
      row = this._mxArrangeEditData(row);
      this.typeId = row.typeId;
      this.formTit = "修改";

      this.formConfig.forEach((item) => {
        for (let key in row) {
          if (item.key === key) {
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
    },
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.sysAlarmType {
}
</style>
