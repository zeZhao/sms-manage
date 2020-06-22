<template>
  <!--白名单管理-->
  <div class="sysWhitelist">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" @create="create"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ? "用户" : "通道" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="code" label="修改人" />
      <el-table-column prop="cmGatewayId" label="修改时间" />
      <el-table-column prop="createUser" label="创建人" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">修改</el-button>
          <el-button
            @click="_mxDeleteItem('whiteId', scope.row.whiteId)"
            type="text"
            size="small"
          >删除</el-button>
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
        namespace: "sysWhitelist",
        list: "listWhitelistByPage",
        detele: "deleteSysWhiteList"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "用户id/通道id",
          key: "userId",
          placeholder: "请输入用户id/通道id"
        },
        {
          type: "input",
          label: "手机号码",
          key: "mobile",
          placeholder: "请输入手机号码"
        },
        {
          type: "select",
          label: "类型",
          key: "type",
          placeholder: "请选择类型",
          optionData: [
            {
              key: "1",
              value: "用户"
            },
            {
              key: "2",
              value: "通道"
            }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "类型",
          key: "type",
          defaultValue: 1,
          optionData: [
            {
              key: 1,
              value: "用户"
            },
            {
              key: 2,
              value: "通道"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "用户ID/通道ID",
          key: "userId",
          defaultValue: "",
          // change: this.selectUser,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "手机号码",
          key: "mobile",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      whiteId: "",
      GatewayList: [] //通道列表
    };
  },
  mounted() {
    this.queryMainInfo();
  },
  computed: {},
  methods: {
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
    submit(form) {
      let params = {};
      if (this.formTit == "新增") {
        params = {
          data: {
            ...form
          }
        };
        this.$http.sysWhitelist.addSysWhiteList(params).then(res => {
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
            whiteId: this.whiteId,
            ...form
          }
        };
        this.$http.sysWhitelist.updateSysWhiteList(params).then(res => {
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
      this.whiteId = row.whiteId;
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
    },
    //修改表格数据
    _mxFormListData(data) {
      data.forEach(item => {
        if (item.createTime) {
          item.createTime = new Date(item.createTime).Format(
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
.sysWhitelist {
}
</style>
