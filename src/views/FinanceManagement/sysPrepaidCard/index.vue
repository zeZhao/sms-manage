<template>
  <!--商户月账单-->
  <div class="sysPrepaidCard">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      height="50vh"
      v-loading="loading"
    >
      <el-table-column prop="corporateId" label="商户编号" />
      <el-table-column prop="corporateName" label="商户名称" />
      <el-table-column prop="cardCount" label="条数" />
      <el-table-column prop="cardMoney" label="金额(元)" />
      <el-table-column prop="directCount" label="直连条数" />
      <el-table-column prop="directPrice" label="直连金额(元)" />
      <el-table-column prop="sumCount" label="总条数" />
      <el-table-column prop="sumPrice" label="总金额(元)" />
      <el-table-column prop="chargeType" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.chargeType === 1 ? "短信" : "彩信" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="exportPlatform(scope.row)"
            >导出平台账单</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="exportDirectLink(scope.row)"
            >导出直连账单</el-button
          >
        </template>
      </el-table-column>
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
        namespace: "sysPrepaidCard",
        list: "listCorporateBillByPage"
      },
      // 列表参数
      namespace: "prepaidCard",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "商户编号",
          key: "corporateId"
        },
        {
          type: "select",
          label: "类型",
          key: "chargeType",
          defaultValue: "",
          optionData: [
            {
              key: 1,
              value: "短信"
            }
          ],
          placeholder: "请选择类型"
        },
        {
          type: "month",
          label: "月份",
          key: "remark"
        }
        // {
        //   type: "select",
        //   key: "isBill",
        //   label: "帐单类型",
        //   defaultValue: 1,
        //   optionData: [
        //     {
        //       key: 1,
        //       value: "月度帐单",
        //     },
        //   ],
        // },
      ]
    };
  },
  mounted() {},
  computed: {},
  methods: {
    /* 
      isdirect  平台 1 直连 2 
    */
    //导出平台账单
    exportPlatform(row) {
      const { chargeType, corporateId, remark } = row;
      const countDate = remark.substring(0, 7);
      this.$axios
        .post(
          "/sysPrepaidCard/exportPlatform",
          { smsType: chargeType, corporateId, countDate, direct: "1" },
          {
            responseType: "blob",
            headers: { token: window.localStorage.getItem("token") }
          }
        )
        .then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", `${countDate}月平台账单.xlsx`);
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);

          // const link = document.createElement("a");
          // let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });
          // link.style.display = "none";
          // link.href = URL.createObjectURL(blob);

          // // link.download = res.headers['content-disposition'] //下载后文件名
          // link.download = data.fileName; //下载的文件名
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
        });
    },
    //导出直连账单
    exportDirectLink(row) {
      const { chargeType, corporateId, remark } = row;
      const countDate = remark.substring(0, 7);
      this.$axios
        .post(
          "/sysPrepaidCard/exportPlatform",
          { smsType: chargeType, corporateId, countDate, direct: "2" },
          {
            responseType: "blob",
            headers: { token: window.localStorage.getItem("token") }
          }
        )
        .then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", `${countDate}月直连账单.xlsx`);
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.removeChild(url);
        });
    },
    // 修改搜索参数
    _formatRequestData(data) {
      const { remark } = data;
      if (remark) {
        data.remark = new Date(remark).Format("yyyy-MM");
      }
      data.isBill = 1;
      return data;
    },
    /**
     * 对表格数据进行自定义调整
     * @param rows
     * @returns {*}
     * @private
     */
    _mxFormListData(rows) {
      rows.forEach(item => {
        const { cardCount, cardMoney, succCount, foreignPrice } = item;
        if (!succCount) {
          item.succCount = 0;
        }
        if (!foreignPrice) {
          item.foreignPrice = 0;
        }
        this.$set(item, "sumReductType", cardCount + succCount);
        this.$set(item, "sumCardMoney", cardMoney + foreignPrice);
      });

      // if()
      return rows;
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysPrepaidCard {
}
</style>
