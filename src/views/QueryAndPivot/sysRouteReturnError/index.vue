<template>
  <!--失败原因-->
  <div class="sysRouteReturnError">
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
      <el-table-column prop="routeId" label="通道编号" />
      <el-table-column prop="result" label="通道返回值" />
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type === "0" ? "提交报告" : "返回报告" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notes" label="返回错误说明" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.operaId === 0
                ? "不限"
                : scope.row.operaId === 1
                ? "移动"
                : scope.row.operaId === 2
                ? "联通"
                : "电信"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
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
          type: "input",
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
            {
              key: "0",
              value: "不限"
            },
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
              key: "0",
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
              key: "0",
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
      ProvinceList: [] // 通道列表
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
          if (key === "routeIds") {
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
      row = Object.assign(row, { routeIds: row.routeId });
      console.log(row, "row");
      return row;
    },
    _mxArrangeSubmitData(form) {
      form = Object.assign(form, { routeId: form.routeIds });
      console.log(form, "-----form");
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
