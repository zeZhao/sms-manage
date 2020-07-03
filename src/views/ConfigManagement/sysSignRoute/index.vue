<template>
  <!--签名路由管理-->
  <div class="mmsUserGateway">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="corporateId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名称" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? '特服号':(scope.row.type === 2 ? '用户ID':'企业ID') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sign" label="签名" show-overflow-tooltip />
      <el-table-column prop="cm" label="移动通道" />
      <el-table-column prop="cu" label="联通通道" />
      <el-table-column prop="ct" label="电信通道" />
      <el-table-column prop="updateTime" label="修改时间" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button @click="_mxDeleteItem('routeId',scope.row.routeId)" type="text" size="small">删除</el-button>
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
        namespace: "sysSignRoute",
        list: "listSignRouteByPage",
        detele: "deleteSignRoute"
      },
      // 列表参数
      namespace: "signRoute",
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
          label: "签名",
          key: "sign",
          placeholder: "请输入签名"
        },
        {
          type: "input",
          label: "用户特服号",
          key: "code",
          placeholder: "请输入用户特服号"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          optionData: [
            {
              key: 1,
              value: "特服号"
            },
            {
              key: 2,
              value: "用户ID"
            },
            {
              key: 3,
              value: "企业ID"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "input",
          label: "电信网关通道",
          key: "ct",
          placeholder: "请输入电信网关通道"
        },
        {
          type: "input",
          label: "联通网关通道",
          key: "cu",
          placeholder: "请输入联通网关通道"
        },
        {
          type: "input",
          label: "移动网关通道",
          key: "cm",
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
          type: "textarea",
          label: "商户签名",
          key: "sign"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          initDefaultValue: 2,
          defaultValue: 2,
          optionData: [
            {
              key: 1,
              value: "特服号"
            },
            {
              key: 2,
              value: "用户ID"
            },
            {
              key: 3,
              value: "企业ID"
            }
          ]
        },
        {
          type: "select",
          label: "移动通道",
          key: "cm",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "联通通道",
          key: "cu",
          optionData: [],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "电信通道",
          optionData: [],
          key: "ct",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      routeId: "",
      GatewayList: [] //通道列表
    };
  },
  mounted() {
    this.gateway("cu", "1", "", "");
    this.gateway("ct", "", "1", "");
    this.gateway("cm", "", "", "1");
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
    gateway(keys, isCu, isCt, isCm) {
      const params = {
        data: {
          gatewayName: "",
          isCu: isCu,
          isCt: isCt,
          isCm: isCm
        }
      };
      this.$http.gateway.listGateway(params).then(res => {
        this.GatewayList = res.data;
        this.formConfig.forEach(item => {
          const { key } = item;
          if (key == keys) {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", `${t.gateway}_${t.gatewayName}`);
              item.optionData.push(t);
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
        this.$http.sysSignRoute.addSignRoute(params).then(res => {
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
            routeId: this.routeId,
            ...form
          }
        };
        this.$http.sysSignRoute.updateSignRoute(params).then(res => {
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
      this.routeId = row.routeId;
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
