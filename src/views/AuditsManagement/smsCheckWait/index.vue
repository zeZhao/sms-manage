<template>
  <!--待审-->
  <div class="smsCheckWait">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false">
      <template slot="Other">
        <el-button type="primary">超审</el-button>
        <el-button type="primary" @click="_mxCreate">增加分配</el-button>
        <el-button type="primary">停止分配</el-button>
      </template>
    </Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="source" label="审核根源">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "路由信息错" : (scope.row.gatewayType === 2 ? "关键字" :(scope.row.gatewayType === 3 ? "模板不匹配" :(scope.row.gatewayType === 5 ? "数量超标" :(scope.row.gatewayType === 6 ? "组合redis出错" :'组合超时')))) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cm" label="移动通道" />
      <el-table-column prop="cu" label="联通通道" />
      <el-table-column prop="ct" label="电信通道" />
      <el-table-column prop="submitTime" label="提交时间" />
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
      style="margin: 0 auto"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @selectChange="selectChange"
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
      // 接口地址
      searchAPI: {
        namespace: "smsCheckWait",
        list: "listCheckWaitByPage",
        detele: "",
        add: "",
        edit: ""
      },
      // 列表参数
      namespace: "checkWait",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "select",
          label: "审核根源",
          key: "source",
          optionData: [
            {
              key: "1",
              value: "路由信息错"
            },
            {
              key: "2",
              value: "关键字"
            },
            {
              key: "3",
              value: "模板不匹配"
            },
            {
              key: "5",
              value: "数量超标"
            },
            {
              key: "6",
              value: "组合redis错"
            },
            {
              key: "7",
              value: "组合超时"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "date",
          label: "提交时间",
          key: "submitTime",
          placeholder: "请选择提交时间"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "通道名称",
          key: "gatewayName",
          defaultValue: "",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "类型",
          key: "gatewayType",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "短信"
            }
          ],
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          defaultValue: "",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "提交数",
          key: "submitCount",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "成功数",
          key: "succCount",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        { 
          type: "input",
          label: "成功率",
          key: "succRatio",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "month",
          label: "账单月份",
          key: "countMonth",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "付款方式",
          key: "paidWay",
          optionData: [
            {
              key: 1,
              value: "已付款"
            },
            {
              key: 2,
              value: "欠款"
            },
            {
              key: 3,
              value: "其他"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "联系人",
          key: "linkMan",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "运营商",
          key: "operaid",
          optionData: [
            {
              key: 1,
              value: "移动"
            },
            {
              key: 2,
              value: "联通"
            },
            {
              key: 3,
              value: "电信"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      GatewayList: [] // 通道列表
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
    selectChange(data) {
      const { val, item } = data;
      let obj = {};
      if (item.key === "gatewayName") {
        item.optionData.map(t => {
          if (t.key == val) {
            obj = t;
          }
        });
        this.formConfig.map(t => {
          const { key } = t;
          if (key === "gatewayName") {
            t.defaultValue = obj.gatewayName;
          }
          if (key === "gateway") {
            t.defaultValue = obj.gateway;
          }
        });
      }
    },
    /*
     * 获取通道列表
     * */
    gateway() {
      const params = {
        data: {
          gatewayName: "",
          isCu: "",
          isCt: "",
          isCm: ""
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key === "gatewayName") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gateway);
              this.$set(t, "value", t.gatewayName);
              // let obj = {
              //   key: t.gatewayId,
              //   value: t.gatewayName
              // };
              item.optionData.push(t);
            });
          }
        });
      });
    },
    //countMonth
    // _mxArrangeSubmitData(formData) {
    //   if (formData.countMonth) {
    //     formData.countMonth = new Date(formData.countMonth).Format("yyyy-MM");
    //   }
    //   return formData;
    // }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsCheckWait {
}
</style>
