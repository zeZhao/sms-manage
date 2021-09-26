<template>
  <!--彩信通道-->
  <div class="mmsGateway">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table max-height="500" :data="listData" highlight-current-row style="width: 100%;">
      <el-table-column prop="gatewayId" label="通道编号" />
      <el-table-column prop="name" label="通道名称" />
      <!-- <el-table-column prop="gatewayType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.gatewayType === 1 ? "短信" : "" }}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="type" label="运营商">
        <template slot-scope="scope">
          <span>{{
            scope.row.type === 0
              ? "三网"
              : scope.row.type === 1
              ? "移动"
              : scope.row.type === 2
              ? "联通"
              : "电信"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="通道价格(分)" />
      <el-table-column prop="status" label="是否可用">
        <template slot-scope="scope">
          <span>{{ scope.row.status === 0 ? "不可用" : "可用" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'gatewayId')"
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            @click="_mxDeleteItem('gatewayId', scope.row.gatewayId)"
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
        namespace: "mmsGateway",
        list: "listMmsGatewayByPage",
        detele: "deleteMmsGateway",
        add: "addMmsGateway",
        edit: "updateMmsGateway"
      },
      // 列表参数
      namespace: "mmsGateway",
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "通道编号",
          key: "gatewayId",
          placeholder: "请输入通道编号"
        },
        {
          type: "input",
          label: "通道名称",
          key: "name",
          placeholder: "请输入通道名称"
        },
        {
          type: "select",
          label: "是否可用",
          key: "status",
          optionData: [
            {
              key: "0",
              value: "可用"
            },
            {
              key: "1",
              value: "不可用"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "select",
          label: "运营商",
          key: "type",
          optionData: [
            {
              key: "0",
              value: "三网"
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
          ],
          placeholder: "请选择运营商"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "通道名称",
          key: "name",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "input",
          label: "通道公司名称",
          key: "corpName"
        },
        {
          type: "select",
          label: "运营商",
          key: "type",
          defaultValue: "",
          optionData: [
            {
              key: "0",
              value: "三网"
            },
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
          placeholder: "请选择运营商"
        },
        {
          type: "input",
          label: "通道单价(分)",
          key: "price",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        // {
        //   type: "input",
        //   label: "彩信发送url",
        //   key: "url"
        // },
        {
          type: "input",
          label: "通道账户名称",
          key: "urlUserName"
        },
        {
          type: "input",
          label: "通道密码",
          key: "urlPwd"
        },
        {
          type: "input",
          label: "提审URL",
          key: "arraignUrl"
        },
        {
          type: "input",
          label: "主动查询提审结果URL",
          key: "arraignSearchUrl"
        },
        {
          type: "input",
          label: "主动查询返回报告URL",
          key: "returnReportUrl"
        },
        {
          type: "input",
          label: "余额查询URL",
          key: "balanceUrl"
        },
        {
          type: "select",
          label: "是否可用",
          key: "status",
          defaultValue: "",
          optionData: [
            {
              key: "0",
              value: "不可用"
            },
            {
              key: 1,
              value: "可用"
            }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "textarea",
          key: "remark",
          label: "备注"
        }
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    _mxArrangeEditData(row) {
      for (let key in row) {
        if (key === "status" || key === "type") {
          if (row[key] === 0) {
            row[key] = "0";
          }
        }
      }
      return row;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.mmsGateway {
}
</style>
