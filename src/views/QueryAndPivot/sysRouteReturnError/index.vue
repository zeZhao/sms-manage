<template>
  <!--失败原因-->
  <div class="sysRouteReturnError">
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      @exportData="exportData"
    >
      <template slot="Other">
        <el-button type="primary" size="small" @click="batchAddition"
          >批量添加</el-button
        >
        <el-button type="primary" size="small" @click="exportExe"
          >导出</el-button
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
      <el-table-column prop="routeId" label="通道编号"
        ><template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.gatewayName"
            placement="top"
          >
            <span>{{ scope.row.routeId }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="通道返回值" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ renderType(scope.row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notes" label="返回错误说明" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.operaId == 0
                ? "非法"
                : scope.row.operaId == 1
                ? "移动"
                : scope.row.operaId == 2
                ? "联通"
                : scope.row.operaId == 3
                ? "电信"
                : "国际"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'id')" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('id', scope.row.id)"
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
      :title="formTit"
      :visible.sync="addChannel"
      :close-on-click-modal="false"
      top="45px"
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
    <BatchAddition
      :isOpen="isOpen"
      :title="title"
      downloadTemplateUrl="/template/SysRouteReturnErrorDataTem.xlsx"
      action="/sysRouteReturnError/uploadRouteReturnError"
      @submit="batchSubmit"
      @cancel="cancelBatch"
    ></BatchAddition>
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
        namespace: "sysRouteReturnError",
        list: "listRouteReturnErrorByPage",
        detele: "deleteRouteReturnError",
        add: "addRouteReturnError",
        edit: "updateRouteReturnError"
      },
      // 列表参数
      namespace: "routeReturnError",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道编号",
          key: "routeId",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: "通道返回值",
          key: "result",
          placeholder: "请输入通道返回值"
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          placeholder: "请选择运营商",
          optionData: [
            // {
            //   key: "0",
            //   value: "非法"
            // },
            {
              key: "1",
              value: "移动"
            },
            {
              key: "2",
              value: "联通"
            },
            {
              key: "3",
              value: "电信"
            },
            {
              key: "4",
              value: "国际"
            }
          ]
        },
        {
          type: "select",
          label: "报告类型",
          key: "type",
          optionData: [
            {
              key: "1",
              value: "返回报告"
            },
            {
              key: "2",
              value: "提交报告"
            }
          ],
          placeholder: "请选择类型"
        }
      ],
      // 表单配置
      formConfig: [
        // {
        //   type: "select",
        //   label: "通道名称",
        //   key: "gatewayName",
        //   defaultValue: "",
        //   optionData: [],
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        // {
        //   type: "input",
        //   label: "通道编号",
        //   key: "gateway",
        //   disabled: true,
        //   defaultValue: "",
        //   rules: [{ required: true, message: "请输入必填项", trigger: ['blur', 'change'] }]
        // },
        {
          type: "select",
          label: "通道编号",
          key: "routeIds",
          optionData: [],
          multiple: true,
          isShow: false,
          // defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "通道编号",
          key: "routeId",
          optionData: [],
          isShow: true,
          // multiple: true,
          // defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "change" }
          ]
        },

        {
          type: "select",
          label: "运营商",
          key: "operaId",
          optionData: [
            // {
            //   key: "0",
            //   value: "不限"
            // },
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
            },
            {
              key: 4,
              value: "国际"
            }
          ],
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "返回类型",
          key: "type",
          defaultValue: "1",
          initDefaultValue: "1",
          optionData: [
            {
              key: "1",
              value: "返回报告"
            },
            {
              key: "2",
              value: "提交报告"
            }
          ],
          // change: this.selectUser,
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
          label: "通道返回值",
          key: "result",
          defaultValue: "",
          maxlength: 50,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        },

        {
          type: "textarea",
          label: "返回错误说明",
          key: "notes",
          defaultValue: "",
          maxlength: 100,
          rules: [
            {
              required: true,
              message: "请输入必填项",
              trigger: ["blur", "change"]
            }
          ]
        }
      ],
      bId: "",
      GatewayList: [], // 通道列表
      ProvinceList: [], // 通道列表
      isOpen: false,
      title: "批量添加失败原因"
    };
  },
  mounted() {
    this.gateway();
  },
  computed: {},
  methods: {
    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "routeIds") {
          item.isShow = false;
        }
        if (item.key === "routeId") {
          item.isShow = true;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
    },
    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "routeIds") {
          item.isShow = true;
        }
        if (item.key === "routeId") {
          item.isShow = false;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    renderType(v) {
      if (v === "1") {
        return "返回报告";
      } else if (v === "2") {
        return "提交报告";
      } else {
        return "-";
      }
    },
    //关闭弹窗
    cancelBatch() {
      this.isOpen = false;
    },
    //提交批量添加
    batchSubmit() {
      this.isOpen = false;
      this._mxGetList();
    },
    //导出
    exportData(form) {
      const data = { data: { routeReturnError: form } };
      this.$axios
        .post("/sysRouteReturnError/exportRouteReturnError", data)
        .then(res => {
          if (res.data.code === 200) this.$exportToast();
        });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    //批量添加
    batchAddition() {
      this.isOpen = true;
    },
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
          serverStatus: 1,
          serverStatus: 1,
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
          if (key === "routeIds" || key === "routeId") {
            res.data.forEach(t => {
              this.$set(t, "key", t.gatewayId);
              this.$set(t, "value", t.gateway);
              item.optionData.push(t);
            });
          }
        });
      });
    },
    //countMonth
    _mxArrangeSubmitData(formData) {
      if (formData.countMonth) {
        formData.countMonth = new Date(formData.countMonth).Format("yyyy-MM");
      }
      return formData;
    },
    _mxArrangeEditData(row) {
      for (let key in row) {
        if (key === "type") {
          //   if (row[key]) {
          //     row[key] = "1";
          //   } else {
          //     row[key] = "0";
          //   }
        } else if (key === "operaId") {
          if (row[key] === 0) {
            row[key] = "0";
          }
        }
      }
      row = Object.assign(row, { routeIds: [row.routeId] });
      return row;
    },
    _mxArrangeSubmitData(form) {
      form = Object.assign(form);
      if (form.routeIds) {
        form.routeIds = form.routeIds.join(",");
      }
      if (this.formTit == "新增") {
        delete form.routeId;
      }
      return form;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysRouteReturnError {
}
</style>
