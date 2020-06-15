<template>
  <!--网关错误-->
  <div class="sysSendError">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false">
      <template slot="Btn">
        <el-button type="primary" @click="_mxHandleSubmit()" style="margin-left: 15px">查询</el-button>
        <!-- <el-button type="primary">修改内容</el-button> -->
        <!-- <el-button type="primary">修改网关</el-button> -->
      </template>
    </Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="loginName" label="用户名" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="gateway" label="网关" />
      <el-table-column prop="errCode" label="错误码" />
      <el-table-column prop="cid" label="CID" />
      <el-table-column prop="err" label="错误描述" />
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
        namespace: "sysSendError",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "sendError",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "用户ID"
        },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "内容"
        },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "手机号"
        },
        {
          type: "input",
          label: "网关编号",
          key: "gateway",
          placeholder: "网关编号"
        },
        {
          type: "input",
          label: "错误码",
          key: "errCode",
          placeholder: "错误码"
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "CID"
        },
        {
          type: "input",
          label: "错误描述",
          key: "err",
          placeholder: "错误描述"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "特服号"
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "startTime", "endTime"],
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
      bId: "",
      GatewayList: [], // 通道列表
      ProvinceList: [] // 通道列表
    };
  },
  mounted() {
    this.gateway();
    this.listSysProvince();
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
     * 获取省份列表
     * */
    listSysProvince() {
      const params = {
        data: {
          provinceName: ""
        }
      };
      this.$http.listSysProvince(params).then(res => {
        this.ProvinceList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            res.data.forEach(t => {
              let obj = {
                key: t.provinceId,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
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
    _mxFormListData(rows) {
      rows.forEach(item => {
        if (item.submitTime) {
          item.submitTime = new Date(item.submitTime).Format(
            "yyyy-MM-dd hh:mm:ss"
          );
        }
      });
      return rows;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSendError {
}
</style>
