<template>
  <!-- 日限量 -->
  <div class="dailyLimitedConfig">
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
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="gateway" label="通道编号">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.gatewayName"
            placement="top"
          >
            <span>{{ scope.row.gateway }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="gatewayName" label="通道名称" />
      <el-table-column prop="limitCount" label="日限量(万)" />
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem(
                'id',
                scope.row.id,
                false,
                false,
                '您确定要删除该账户的日限量设置吗？'
              )
            "
            type="text"
            size="small"
            >删除
          </el-button>
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
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        :colSpan="12"
        labelWidth="auto"
        labelPosition="top"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      >
        <template slot="Other">
          <p
            style="padding-left: 60px; font-size: 13px; line-height: 1.5; color: #999"
          >
            规则：只要有相关通道的配置数据，该通道加载后则认为当前通道需要限量。配置了该设置的客户进行限量处理，超量后进入到14号通道形成超量的失败状态返回给客户。未进行配置走到当前通道的客户，则不进行限速处理。
            如果想取消当前通道的限速逻辑，需要清理掉该通道的所有限速配置数据。
          </p>
        </template>
      </FormItem>
    </el-drawer>
    <!-- <el-dialog
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItem
        ref="form"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
        @choose="choose"
      >
      </FormItem>
    </el-dialog> -->
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
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "SmsGatewayUserSendControl",
        list: "queryByPage",
        detele: "deleteSmsGatewayUserSendControl"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {
        userId: ""
      },
      //筛选不加data对象
      isParamsNotData: false,
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "用户名称",
          key: "userName"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId"
        },
        {
          type: "input",
          label: "通道名称",
          key: "gatewayName"
        },
        {
          type: "inputNum",
          label: "通道编号",
          key: "gateway"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          disabled: true,
          btnDisabled: false,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corporateId",
          isShow: true,
          disabled: true,
          defaultValue: "",
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ],
          placeholder: "选择账户后自动识别"
        },
        {
          type: "select",
          label: "通道",
          key: "gateway",
          initDefaultValue: "",
          defaultValue: "",
          optionData: [],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "input",
          label: "日限量(万)",
          key: "limitCount",
          defaultValue: "",
          maxlength: "5",
          rules: [
            {
              required: true,
              trigger: ["blur", "change"],
              validator: (rule, value, callback) => {
                if (!value) callback(new Error("请输入必填项"));
                if (isNaN(value)) callback(new Error("日限量必须为数值"));
                if ((value + "").indexOf(".") !== -1 || value <= 0)
                  callback(new Error("日限量只能输入正整数"));
                callback();
              }
            }
          ]
        }
      ],
      id: "",
      isChooseUser: false
    };
  },
  mounted() {
    this.getGatewayList();
  },
  activated() {
    //重新获取数据
    this._mxGetList();
    this.getGatewayList();
  },
  methods: {
    getGatewayList() {
      const params = {
        data: {
          serverStatus: 1,
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        for (let i = 0, len = this.formConfig.length; i < len; i++) {
          const { key } = this.formConfig[i];
          if (key === "gateway") {
            this.formConfig[i].optionData = res.data.map(v => {
              return { key: v.gatewayId, value: v.gateway };
            });
            break;
          }
        }
      });
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
        if (key === "corporateId") {
          t.defaultValue = data.corpId;
        }
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = { ...form };
        this.$http.SmsGatewayUserSendControl.addSmsGatewayUserSendControl(
          params
        ).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      } else {
        params = {
          id: this.id,
          ...form
        };
        this.$http.SmsGatewayUserSendControl.updateSmsGatewayUserSendControl(
          params
        ).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.msg || res.data);
          }
        });
      }
    },
    create() {
      // this.$router.push({
      //   name: "dailyLimitedConfigType",
      //   query: { type: "create" }
      // });
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "userId") {
          this.$set(item, "btnDisabled", false);
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row, ID) {
      // this.$router.push({
      //   name: "dailyLimitedConfigType",
      //   query: { type: "update", row: JSON.stringify(row), ID }
      // });
      this.id = row.id;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
          if (item.key === "userId") {
            this.$set(item, "btnDisabled", true);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
      });
      this.addChannel = true;
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
    },
    cancel() {
      this.addChannel = false;
    }
  }
};
</script>
