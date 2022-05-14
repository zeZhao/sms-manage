<template>
  <!--发送记录-->
  <div class="sendRecord">
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
      <el-table-column prop="corpId" label="商户编号" />
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
      >
        <template slot-scope="{ row }">
          <span>{{ row.mobile.slice(0, 11) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operaId" label="运营商">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.operaId === 1
                ? "移动"
                : scope.row.operaId === 2
                ? "联通"
                : scope.row.operaId === 3
                ? "电信"
                : scope.row.operaId === 4
                ? "国际"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="counter" label="条数" />
      <el-table-column prop="gateway" label="通道">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            :content="scope.row.gatewayName"
            placement="top"
          >
            <span>{{ scope.row.gateway }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="cid" label="CID" width="155" />
      <el-table-column prop="hasSend" label="发送状态">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.hasSend === "0"
                ? "未发"
                : scope.row.hasSend === "1"
                ? "已发送"
                : ""
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="createIime" label="创建时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.createIime | timeFormat }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="proType" label="产品类型">
        <template slot-scope="scope">
          <span>
            {{
              scope.row.proType === 1
                ? "web端"
                : scope.row.proType === 2
                ? "http接口"
                : scope.row.proType === 3
                ? "cmpp接口"
                : scope.row.proType === 7
                ? "音频接口"
                : ""
            }}
          </span>
        </template>
      </el-table-column> -->
    </el-table>
    <p style="color: red;font-size: 12px;">总条数：{{ total || 0 }}</p>
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
        namespace: "sendRecord",
        list: "selectSendBackByPage"
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
          key: "corpId",
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
          type: "inputNum",
          label: "通道",
          key: "gateway"
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
          type: "date",
          label: "创建日期",
          key: "createTime",
          defaultValue: new Date()
        },
        {
          type: "timerange",
          label: "创建时间",
          key: ["", "startTime", "endTime"],
          defaultValue: [
            "",
            new Date(2021, 12, 16, 0, 0, 0),
            new Date(2021, 12, 16, 23, 59, 59)
          ]
        }
        // gridList: [
        //   { type: "xs", grid: 6 },
        //   { type: "sm", grid: 6 },
        //   { type: "md", grid: 6 },
        //   { type: "lg", grid: 4 },
        //   { type: "xl", grid: 3 }
        // ],
      ],
      total: 0
    };
  },
  mounted() {
    // this.selectSendBackAllNum(this.searchParam);
  },
  computed: {},
  methods: {
    selectSendBackAllNum(data) {
      let params = {
        data: {
          ...data
        }
      };
      this.$http.sendRecord.selectSendBackAllNum(params).then(res => {
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
      if (data.createTime) {
        data.createTime = new Date(data.createTime).Format("yyyy-MM-dd");
      }
      if (data.startTime) {
        data.startTime = new Date(data.startTime).Format("hh:mm:ss");
      }
      if (data.endTime) {
        data.endTime = new Date(data.endTime).Format("hh:mm:ss");
      }
      this.selectSendBackAllNum(data);
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
  },
  watch: {}
};
</script>

<style lang="scss" scoped></style>
