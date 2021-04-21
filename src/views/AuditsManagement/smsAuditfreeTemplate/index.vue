<template>
  <!--免审核模板-->
  <div class="smsAuditfreeTemplate">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column
        prop="content"
        label="模板内容"
        width="300"
        show-overflow-tooltip
      />
      <el-table-column prop="effectiveTime" label="生效日期" />
      <el-table-column prop="invalidTime" label="失效日期" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'templateId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem(
                'id',
                scope.row.templateId,
                false,
                false,
                '您确定要删除标签吗？删除后标签将不可用'
              )
            "
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
      width="650px"
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
    >
      <FormItemTitle
        ref="formItem"
        :formConfig="formConfig"
        :btnTxt="formTit"
        @submit="_mxHandleSubmit"
        @cancel="_mxCancel"
        @selectChange="selectChange"
        @handleClick="handleClick"
      ></FormItemTitle>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import FormItemTitle from "@/components/formItemTitle";

export default {
  mixins: [listMixin],
  components: { FormItemTitle },
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      //接口地址
      searchAPI: {
        namespace: "smsAuditfreeTemplate",
        list: "list",
        detele: "delete",
        edit: "addOrUpdate",
        add: "addOrUpdate"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "商户编号",
          key: "corpId"
        },
        {
          type: "input",
          label: "商户名称",
          key: "corpName"
        },
        {
          type: "input",
          label: "模板内容",
          key: "content"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "select",
          label: "商户名称",
          key: "corpName",
          optionData: [],

          colSpan: 24,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "商户编号",
          key: "corpId",
          disabled: true,
          colSpan: 24,
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          isBtn: true,
          btnTxt: "生成变量",
          colSpan: 24,
          offset: 6
        },
        {
          type: "textarea",
          label: "模板内容",
          key: "content",
          colSpan: 24,
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "date",
          label: "生效日期",
          colSpan: 24,
          key: "effectiveTime",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "date",
          label: "失效日期",
          colSpan: 24,
          key: "invalidTime",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      templateId: "",
      isParamsNotData: false,
      submitParamsIsData: false
    };
  },
  mounted() {
    this.getAllCorp();
  },
  computed: {},
  methods: {
    handleClick(item) {
      this.formConfig.forEach(item => {
        if (item.key === "content") {
          let variable = 1;
          let x = `$(${variable++})`;
          if (item.defaultValue) {
            variable = item.defaultValue.split(")").length;
            x = `$(${variable++})`;
            item.defaultValue = `${item.defaultValue}${x}`;
          } else {
            item.defaultValue = `${x}`;
          }
        }
      });
    },
    selectChange(data) {
      const { val, item } = data;
      console.log(val);
      // this._setDefaultValueKeys("directPort", "无");
      if (item.key === "corpName") {
        this._setDefaultValueKeys("corpId", val);
      }
    },
    //获取所有商户
    getAllCorp() {
      this.$http.corp.queryAllCorp().then(res => {
        if (resOk(res)) {
          let arr = [];
          this.formConfig.forEach(item => {
            if (item.key === "corpName") {
              res.data.forEach(t => {
                let obj = {
                  key: t.corpId,
                  value: t.corpName
                };
                arr.push(obj);
              });
              item.optionData = arr;
            }
          });
        }
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsAuditfreeTemplate {
}
</style>
