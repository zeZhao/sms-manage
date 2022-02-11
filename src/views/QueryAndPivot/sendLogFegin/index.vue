<template>
  <!--提交记录-->
  <div class="sendLogFegin">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    ></Search>
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
      <el-table-column prop="submitType" label="产品类型">
        <template slot-scope="scope">
          <span v-if="scope.row.submitType == 1">web端</span>
          <span v-if="scope.row.submitType == 2">http接口</span>
          <span v-if="scope.row.submitType == 3">cmpp接口</span>
        </template>
      </el-table-column>
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
      >
        <template slot-scope="{ row }">
          <span>{{ row.mobile.slice(0, 11) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="count" label="条数" />
      <el-table-column prop="cid" label="CID" width="155" />
      <el-table-column prop="definiteTime" label="定时时间" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.definiteTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="submitTime" label="提交时间" width="155">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pkTotal" label="PK TOTAL" width="100" />
      <el-table-column prop="pkNumber" label="PK NUMBER" width="110" />
      <el-table-column prop="pid" label="PID" />
    </el-table>
    <p style="color: red;font-size:12px">总条数：{{ total || 0 }}</p>
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
        namespace: "sendLogFegin",
        list: "selectSendLogByPage"
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
          label: "显示内容",
          key: "showDecrypt",
          defaultValue: 1,
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
          type: "timerange",
          label: "提交时间",
          key: ["", "startTime", "endTime"],
          defaultValue: [
            "",
            new Date(2021, 12, 16, 0, 0, 0),
            new Date(2021, 12, 16, 23, 59, 59)
          ]
        },
        {
          type: "date",
          label: "提交日期",
          key: "submitDate",
          placeholder: "提交日期",
          defaultValue: new Date()
        }
      ],
      total: 0
    };
  },
  mounted() {},
  computed: {},
  methods: {
    selectSendLogAllNum(data) {
      let params = {
        data: {
          ...data
        }
      };
      this.$http.sendLogFegin.selectSendLogAllNum(params).then(res => {
        if (res.code === 200) {
          this.total = res.data;
        }
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
      if (data.submitDate) {
        data.submitDate = new Date(data.submitDate).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      this.selectSendLogAllNum(data);
      return data;
    },
    /**
     * 对表格数据进行自定义调整
     * @param listData
     * @returns {*}
     * @private
     */
    _mxFormListData(listData) {
      listData.forEach(item => {
        if (item.mobile) {
          item.mobile = item.mobile.split(",")[0];
        }
      });
      return listData;
    }
  }
  // watch: {
  //   searchParam(val) {
  //     this.selectSendLogAllNum();
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.sendLogFegin {
}
</style>
