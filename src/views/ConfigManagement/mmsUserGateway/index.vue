<template>
  <!--彩信用户通道配置-->
  <div class="mmsUserGateway">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="cmGatewayId" label="移动通道" />
      <el-table-column prop="cuGatewayId" label="联通通道" />
      <el-table-column prop="ctGatewayId" label="电信通道" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('ugId',scope.row.ugId)" type="text" size="small">删除</el-button>
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
      style="margin: 0 auto"
    >
      <FormItem
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="submit"
        @cancel="cancel"
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
      //接口地址
      searchAPI: {
        namespace: "mmsUserGateway",
        list: "listMmsUserGatewayByPage",
        detele: "deleteMmsUserGateway"
      },
      // 列表参数
      namespace: "mmsUserGateway",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "input",
          label: "用户名称",
          key: "userName",
          placeholder: "请输入用户名称"
        },
        {
          type: "input",
          label: "用户特服号",
          key: "code",
          placeholder: "请输入用户特服号"
        },
        {
          type: "input",
          label: "电信网关通道",
          key: "ctGatewayId",
          placeholder: "请输入电信网关通道"
        },
        {
          type: "input",
          label: "联通网关通道",
          key: "cuGatewayId",
          placeholder: "请输入联通网关通道"
        },
        {
          type: "input",
          label: "移动网关通道",
          key: "cmGatewayId",
          placeholder: "请输入移动网关通道"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "用户ID",
          key: "userId",
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "企业ID",
          key: "corporateId",
          disabled: true,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "特服号",
          disabled: true,
          key: "code",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cmGatewayId",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "联通通道",
          key: "cuGatewayId",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ctGatewayId",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "备注信息",
          key: "remark"
        }
      ],
      ugId: "",
      GatewayList: [] //通道列表
    };
  },
  mounted() {
    this.gateway();
    this.queryMainInfo();
  },
  computed: {},
  methods: {
    selectChange(data) {
      const { val, item } = data;
      let obj = {};
      if (item.key === "userId") {
        item.optionData.map(t => {
          if (t.userId == val) {
            obj = t;
          }
        });
        this.formConfig.map(t => {
          const { key } = t;
          if (key === "userId") {
            t.defaultValue = obj.userId;
          }
          if (key === "corporateId") {
            t.defaultValue = obj.corpId;
          }
          if (key === "code") {
            t.defaultValue = obj.code;
          }
        });
      }
    },
    /*
     * 获取用户企业列表
     * */
    queryMainInfo() {
      this.$http.queryMainInfo().then(res => {
        res.data.map(item => {
          this.$set(item, "key", item.userId);
          this.$set(item, "value", item.userName);
        });
        this.formConfig.map(t => {
          const { key } = t;
          if (key === "userId") {
            t.optionData = res.data;
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
          if (
            key === "cmGatewayId" ||
            key === "cuGatewayId" ||
            key === "ctGatewayId"
          ) {
            res.data.forEach(t => {
              let obj = {
                key: t.gatewayId,
                value: t.gatewayName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.mmsUserGateway.addMmsUserGateway(params).then(res => {
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
          data: {
            ugId: this.ugId,
            ...form
          }
        };
        this.$http.mmsUserGateway.updateMmsUserGateway(params).then(res => {
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
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    edit(row) {
      this.ugId = row.ugId;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key) {
            this.$set(item, "defaultValue", row[key]);
          }
        }
      });
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
.mmsUserGateway {
}
</style>
