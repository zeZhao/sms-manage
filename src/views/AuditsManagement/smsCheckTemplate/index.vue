<template>
  <!--待审模板-->
  <div class="smsCheckTemplate">
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row height="750" style="width: 100%;">
      <el-table-column prop="corpId" label="企业ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === '1' ? "特服号" : (scope.row.type === '2' ? "客户ID" :'企业ID') }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="template" label="模板信息" />
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 1 ? "待审核" : (scope.row.status === 2 ? "审核处理中" :(scope.row.status === 4 ? "审核通过" :'审核拒绝')) }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'templateId')" type="text" size="small">修改</el-button>
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
        namespace: "smsCheckTemplate",
        list: "listCheckTemplateByPage",
        detele: "",
        add: "",
        edit: "updateCheckTemplate"
      },
      // 列表参数
      namespace: "checkTemplate",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "企业ID",
          key: "corpId",
          placeholder: "请输入企业ID"
        },
        {
          type: "input",
          label: "用户ID",
          key: "userId",
          placeholder: "请输入用户ID"
        },
        {
          type: "select",
          label: "匹配类型",
          key: "matchType",
          optionData: [
            {
              key: "1",
              value: "过关键字"
            },
            {
              key: "2",
              value: "不过关键字"
            }
          ],
          placeholder: "请选择匹配类型"
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
          key: "corpId",
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
          label: "类型",
          key: "type",
          defaultValue: "",
          optionData: [
            {
              key: "1",
              value: "特服号"
            },
            {
              key: "2",
              value: "客户ID"
            },
            {
              key: "3",
              value: "企业ID"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "审核状态",
          key: "status",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "待审核"
            },
            {
              key: 2,
              value: "审核处理中"
            },
            {
              key: 4,
              value: "审核通过"
            },
            {
              key: 5,
              value: "审核拒绝"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          label: "模板信息",
          key: "template",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      bId: "",
      GatewayList: [], // 通道列表
      ProvinceList: [] // 通道列表
    };
  },
  mounted() {
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
          if (key === "corpId") {
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
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsCheckTemplate {
}
</style>
