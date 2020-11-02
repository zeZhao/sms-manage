<template>
  <!--余额调整记录-->
  <div class="mmsUserGateway">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="create"
    ></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="beforeBalance" label="操作前的余额" />
      <el-table-column prop="afterBalance" label="操作后的余额" />
      <el-table-column prop="optType" label="操作类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.optType === "1"
              ? "充值"
              : scope.row.optType === "2"
              ? "还款"
              : scope.row.optType === "3"
              ? "扣款"
              : "借款"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="optBalance" label="当前操作条数" />
      <el-table-column prop="operatorName" label="操作人名称" />
      <el-table-column prop="reductType" label="计费类型">
        <template slot-scope="scope">
          <span>{{
            scope.row.reductType === 1 ? "用户id计费" : "企业id计费"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="chargeType" label="信息类型">
        <template slot-scope="scope">
          <span>{{ scope.row.chargeType === 1 ? "短信" : "彩信" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="debt" label="借款" show-overflow-tooltip />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip />
      <el-table-column prop="createTime" label="操作时间" width="150">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
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
        @choose="choose"
      ></FormItem>
    </el-dialog>
    <ChooseUser
      :isChooseUser="isChooseUser"
      @chooseUserData="chooseUserData"
      @cancel="cancelUser"
    ></ChooseUser>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    const validatorRemark = (rule, value, callback) => {
      let regex = /^[\u4e00-\u9fa5_\d0-9a-zA-Z!@#$%^&*~]{0,300}$/;
      if (value == "") {
        callback(new Error("备注信息不能为空"));
      } else {
        if (!regex.test(value)) {
          callback(new Error("支持汉字/数字/字母/标点符号"));
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
        namespace: "smsBalanceopt",
        list: "queryByPage",
      },
      // 列表参数
      namespace: "balanceopt",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "企业/用户ID",
          key: "userId",
          placeholder: "请输入企业/用户ID",
        },
        {
          type: "input",
          label: "企业/用户名称",
          key: "userName",
          placeholder: "请输入企业/用户名称",
        },
        {
          type: "select",
          label: "操作类型",
          key: "optType",
          placeholder: "请选择操作类型",
          optionData: [
            { key: 1, value: "充值" },
            { key: 5, value: "借款" },
            { key: 3, value: "扣款" },
            { key: 2, value: "还款" },
          ],
        },
        {
          type: "select",
          label: "查询类型",
          key: "selectType",
          defaultValue: "",
          placeholder: "请选择查询类型",
          optionData: [
            {
              key: "",
              value: "请选择",
            },
            {
              key: 0,
              value: "用户",
            },
            {
              key: 1,
              value: "企业",
            },
          ],
        },
        {
          type: "select",
          label: "信息类型",
          key: "chargeType",
          placeholder: "请选择信息类型",
          optionData: [
            {
              key: 1,
              value: "短信",
            },
            // {
            //   key: 2,
            //   value: "彩信"
            // }
          ],
        },
        {
          type: "daterange",
          label: "按时间查询",
          key: ["", "startTime", "endTime"],
        },
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "select",
          label: "计费类型",
          key: "reductType",
          optionData: [
            {
              key: 1,
              value: "用户id计费",
            },
            {
              key: 2,
              value: "企业id计费",
            },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "select",
          label: "信息类型",
          key: "chargeType",
          optionData: [
            {
              key: "1",
              value: "短信",
            },
            // {
            //   key: "2",
            //   value: "彩信"
            // }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "select",
          label: "操作类型",
          key: "optType",
          optionData: [
            // { key: 1, value: "充值" },
            { key: 5, value: "借款" },
            { key: 3, value: "扣款" },
            // { key: 2, value: "还款" },
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        },
        {
          type: "input",
          label: "当前操作条数",
          key: "optBalance",
          maxlength: 10,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            {
              pattern: /^\+?[1-9]\d*$/,
              message: "请输入大于0的正整数",
              trigger: "change",
            },
            {
              trigger: "change",
              validator: (rule, value, callback) => {
                if (value > 1000000000) {
                  callback(new Error("不能超过1000000000"));
                } else {
                  callback();
                }
              },
            },
          ],
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark",
          maxlength: 300,
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            // { trigger: "blur", validator: validatorRemark },
          ],
        },
      ],
      ugId: "",
      GatewayList: [], // 通道列表
      isChooseUser: false,
    };
  },
  mounted() {},
  computed: {},
  methods: {
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map((t) => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corpId") {
          t.defaultValue = data.corpId;
        }
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          ...form,
          // userId:"5826",
          // corpId:"3",
        };
        this.$http.smsBalanceopt.add(params).then((res) => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            console.log(res.msg);
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
      this.ugId = row.ugId;
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

      // setTimeout(() => {
      //   this.$refs.formItem.clearValidate();
      // }, 0);
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
.mmsUserGateway {
}
</style>
