<template>
  <!--发送返回报告-->
  <div class="smsTxReturnReport">
    <Search
      ref="Search"
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :isOther="true"
      :notSearch="notSearch"
      @exportData="_mxExportData"
    >
      <template v-slot:Other="form">
        <el-button type="primary" size="small" @click="exported(form)"
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
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" width="120" />
      <el-table-column prop="code" label="特服号" />
      <el-table-column
        prop="content"
        label="内容"
        width="310"
        v-if="searchParam.showDecrypt === 1"
      />
      <el-table-column
        prop="mobile"
        label="手机号"
        width="100"
        v-if="searchParam.showDecrypt === 1"
      />
      <el-table-column prop="province" label="省份" />
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.operaId === 0
                ? "非法"
                : scope.row.operaId === 1
                ? "移动"
                : scope.row.operaId === 2
                ? "联通"
                : scope.row.operaId === 3
                ? "电信"
                : "国际"
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" />
      <el-table-column prop="gateway" label="通道" />
      <el-table-column prop="submitTime" label="提交时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="发送时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.sendTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="returnTime" label="返回报告时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.returnTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveTime" label="手机接收时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.receiveTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="statusj" label="通道状态" />
      <el-table-column prop="cid" label="CID" width="155" />
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";

export default {
  mixins: [listMixin],
  data() {
    return {
      //接口地址
      searchAPI: {
        namespace: "smsTxReturnReport",
        list: "searchSendReturnReport",
        exportUrl: "/sendLogFegin/exportSendReturn",
        fileName: "发送返回报告"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //默认进入该页面不查询
      notSearch: true,
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId",
          placeholder: "请输入商户编号"
        },
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        {
          type: "input",
          label: "特服号",
          key: "code",
          placeholder: "请输入特服号"
        },
        // {
        //   type: "input",
        //   label: "内容",
        //   key: "content",
        //   placeholder: "请输入内容"
        // },
        {
          type: "input",
          label: "手机号",
          key: "mobile",
          placeholder: "请输入手机号"
        },
        {
          type: "input",
          label: "通道编号",
          key: "gateway",
          placeholder: "请输入通道编号"
        },
        // {
        //   type: "input",
        //   label: "SEQID",
        //   key: "seqid",
        //   placeholder: "请输入SEQID"
        // },
        {
          type: "input",
          label: "状态",
          key: "status",
          placeholder: "请输入状态"
        },
        {
          type: "input",
          label: "CID",
          key: "cid",
          placeholder: "请输入CID"
        },
        {
          type: "input",
          label: "签名",
          key: "sign",
          placeholder: "请输入签名"
        },

        {
          type: "select",
          label: "是否有状态",
          key: "statusType",
          placeholder: "请选择状态",
          optionData: [
            { key: "2", value: "成功" },
            { key: "3", value: "失败" },
            { key: "4", value: "未知" }
          ]
        },
        {
          type: "select",
          label: "省份",
          key: "province",
          placeholder: "请选择省份",
          optionData: []
        },
        {
          type: "select",
          label: "运营商",
          key: "operaId",
          placeholder: "请选择运营商",
          optionData: [
            { key: "1", value: "移动" },
            { key: "2", value: "联通" },
            { key: "3", value: "电信" }
          ]
        },
        {
          type: "select",
          label: "显示内容",
          key: "showDecrypt",
          defaultValue: -1,
          optionData: [
            {
              key: 1,
              value: "显示"
            },
            {
              key: -1,
              value: "不显示"
            }
          ]
        },
        {
          type: "date",
          label: "发送日期",
          key: "sendTime",
          placeholder: "发送日期",
          defaultValue: new Date()
        },
        {
          type: "timerange",
          label: "发送时间",
          key: ["", "startTime", "endTime"],
          defaultValue: [
            "",
            new Date(2021, 12, 16, 0, 0, 0),
            new Date(2021, 12, 16, 23, 59, 59)
          ]
        }
      ]
    };
  },
  mounted() {
    this.listSysProvince();
  },
  computed: {},
  methods: {
    exported(form) {
      let formData = Object.assign({}, form.form);
      let data = this._formatRequestData(formData);
      this.$http.smsTxReturnReport
        .exportSendReturn({ data: { ...data } })
        .then(res => {
          if (res.code === 200) {
            this.$message.success("提交下载成功，请前往下载中心下载文件。");
          } else {
            this.$message.error(res.data);
          }
        });
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
        this.searchFormConfig.forEach(item => {
          const { key } = item;
          if (key === "province") {
            res.data.forEach(t => {
              let obj = {
                key: t.provinceName,
                value: t.provinceName
              };
              item.optionData.push(obj);
            });
          }
        });
      });
    },
    /**
     * 调整提交的参数
     *
     * @param data
     * @returns {*}
     * @private
     */
    _formatRequestData(data) {
      if (data.sendTime) {
        data.sendTime = new Date(data.sendTime).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      return data;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsTxReturnReport {
}
</style>
