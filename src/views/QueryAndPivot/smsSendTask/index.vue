<template>
  <!--待发-->
  <div class="smsSendTask">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    >
      <template slot="Other">
        <el-button type="primary" size="small" @click="edit"
          >批量修改通道</el-button
        >
        <el-button type="primary" size="small" @click="ViewTheSummaryBtn"
          >查看汇总</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="loginName" label="账户名称" width="120" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" width="310" />
      <el-table-column prop="mobile" label="手机号" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.mobile.slice(0, 11) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="counter" label="手机号个数" width="90" />
      <el-table-column prop="gateway" label="通道"
        ><template slot-scope="scope">
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
      <el-table-column prop="cid" label="CID" width="155" />
      <el-table-column prop="hasSend" label="发送状态">
        <template slot-scope="scope">
          <span v-if="scope.row.hasSend === '0'">未发</span>
          <span v-if="scope.row.hasSend === '1'">已发送</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="135">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="definiteTime" label="定时时间" width="135">
        <template slot-scope="scope">{{
          scope.row.definiteTime | timeFormat
        }}</template>
      </el-table-column>
    </el-table>
    <p style="color: red;font-size: 12px;">总条数: {{ tabBottomData || 0 }}</p>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
    <el-dialog title="查看汇总" :visible.sync="ViewTheSummary" width="50%">
      <el-table :data="SummaryData" highlight-current-row>
        <el-table-column prop="gateway" label="通道" />
        <el-table-column prop="stockNum" label="积压批次数" />
        <el-table-column prop="counter" label="积压条数" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ViewTheSummary = false">取 消</el-button>
        <el-button type="primary" @click="ViewTheSummary = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="批量修改通道"
      :visible.sync="editGateway"
      :close-on-click-modal="false"
      style="margin: 0 auto"
      width="80%"
    >
      <FormItem
        :colSpan="12"
        ref="formItem"
        :formConfig="formConfig"
        btnTxt="确定"
        @choose="choose"
        @submit="submitGateway"
        @cancel="_mxCancel"
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
    return {
      notSearch: true,
      editGateway: false,
      ViewTheSummary: false,
      date: new Date().Format("yyyy-MM-dd"),
      SummaryData: [],
      //接口地址
      searchAPI: {
        namespace: "smsSendTask",
        list: "queryByPage",
        tabBottomDataUrl: "selectSendTaskAllNum"
      },
      // 列表参数
      namespace: "sendTask",

      //搜索框数据
      searchParam: {},
      //搜索框配置
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
          key: "loginName",
          placeholder: "请输入账户名称"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "input",
          label: "CID",
          key: "cId",
          placeholder: "请输入CID"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        },
        {
          type: "inputNum",
          label: "通道",
          key: "gateway",
          placeholder: "请输入通道"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "startTime", "endTime"]
        }
      ],
      formConfig: [
        {
          type: "input",
          label: "账户编号",
          key: "userId",
          btnTxt: "选择用户",
          btnDisabled: false,
          disabled: true,
          defaultValue: ""
        },
        {
          type: "input",
          label: "内容",
          key: "content"
        },
        {
          type: "input",
          label: "CID",
          key: "cid"
        },
        {
          type: "input",
          label: "原通道",
          key: "gateway",
          // optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "特服号",
          key: "code"
        },
        {
          type: "date",
          label: "日期",
          initDefaultValue: new Date(),
          defaultValue: new Date(),
          key: "submitDate",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "time",
          label: "开始时间",
          key: "startTime",
          initDefaultValue: "00:00:00",
          defaultValue: "00:00:00",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "time",
          label: "结束时间",
          key: "endTime",
          initDefaultValue: "23:59:59",
          defaultValue: "23:59:59",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "divider",
          colSpan: 24
        },
        {
          type: "select",
          label: "目标通道",
          key: "newGateway",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "处理条数",
          key: "batchCount",
          maxlength: 9,
          rules: [
            {
              required: true,
              trigger: "blur",
              validator: (rule, value, callback) => {
                if (!value) callback(new Error("请输入必填项"));
                if (!/^\d{0,9}$/.test(value))
                  callback(new Error("处理条数为正整数类型，且小于9位"));
                callback();
              }
            }
          ]
        }
        // {
        //   type: "select",
        //   label: "是否处理长短信",
        //   initDefaultValue: "1",
        //   defaultValue: "1",
        //   optionData: [
        //     {
        //       key: "1",
        //       value: "是"
        //     },
        //     {
        //       key: "0",
        //       value: "否"
        //     }
        //   ],
        //   key: "udhi",
        //   rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        // }
      ],
      isChooseUser: false,
      tabBottomData: 0
    };
  },
  activated() {
    this.queryGatewayStockNum();
    this.getGatewayListAll();
    this.gateway();
  },
  methods: {
    getGatewayListAll() {
      const params = {
        data: {
          serverStatus: 1,
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGatewayAll(params).then(res => {
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key === "gateway") {
            item.optionData = res.data.map(v => {
              return {
                key: v.gatewayId,
                value: v.gateway + "_" + v.gatewayName
              };
            });
          }
        });
      });
    },
    //选择用户选取赋值
    chooseUserData(data) {
      this.formConfig.map(t => {
        const { key } = t;
        if (key === "userId") {
          t.defaultValue = data.userId;
        }
      });
    },
    /*
     * 获取通道列表
     * */
    gateway() {
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
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key === "newGateway") {
            item.optionData = res.data.map(v => {
              return {
                key: v.gatewayId,
                value: v.gateway + "_" + v.gatewayName
              };
            });
          }
        });
      });
    },
    ViewTheSummaryBtn() {
      this.ViewTheSummary = true;
      this.queryGatewayStockNum();
    },
    // 批量修改通道
    edit() {
      this.editGateway = true;
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    queryGatewayStockNum() {
      this.$http.smsSendTask.queryGatewayStockNum().then(res => {
        this.SummaryData = res.data;
      });
    },
    /**
     * 提交表单前调整表单内数据
     * @param formData
     * @private
     */
    _mxArrangeSubmitData(formData) {
      if (formData.submitDate) {
        formData.submitDate = new Date(formData.submitDate).Format(
          "yyyy-MM-dd"
        );
      }
      // if (formData.startTime) {
      //   formData.startTime = new Date(formData.startTime).Format("hh:mm:ss");
      // }
      // if (formData.endTime) {
      //   formData.endTime = new Date(formData.endTime).Format("hh:mm:ss");
      // }
      return formData;
    },
    submitGateway(form) {
      form = this._mxArrangeSubmitData(form);
      const params = {
        data: {
          sendTask: {
            ...form
          }
        }
      };
      this.$http.smsSendTask.batchModify(params).then(res => {
        if (resOk(res)) {
          this.$message.success(res.msg || res.data);
          this._mxGetList();
          this.editGateway = false;
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    _mxCancel() {
      this.editGateway = false;
    },
    /**
     * 对表格数据进行自定义调整
     * @param listData
     * @returns {*}
     * @private
     */
    _mxFormListData(listData) {
      listData.forEach(item => {
        if (item.mobile) {
          item.mobile = item.mobile.split(",")[0];
        }
      });
      return listData;
    }
  }
};
</script>
