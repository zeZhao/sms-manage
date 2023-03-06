<template>
  <!--短连接查询-->
  <div class="smsShortUrl">
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
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="activityName" label="活动名称" />
      <el-table-column prop="content" label="短信内容" width="310" />
      <el-table-column prop="activityUrl" label="活动链接" />
      <el-table-column prop="messageNum" label="短信条数" />
      <el-table-column prop="clickTimes" label="活动访问次数" >
        <template slot-scope="{row}">
          <p v-if="!row.clickInp" @dblclick="editNums(row)">{{row.clickTimes}}</p>
          <el-input v-else v-model="row.clickTimes" @blur="numChange(row)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间" width="150">
        <template slot-scope="scope">{{
          scope.row.createTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="defineTime" label="定时时间" width="150">
        <template slot-scope="scope">{{
          scope.row.defineTime | timeFormat
        }}</template>
      </el-table-column>
      <!-- <el-table-column label="操作" /> -->
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
import { getDateToString } from "@/utils";
import Cookies from 'js-cookie'

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: "smsShortUrl",
        list: "queryByPage"
      },
      // 列表参数
      namespace: "shortUrl",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "inputNum",
          label: "账户编号",
          key: "userId",
          placeholder: "请输入账户编号"
        },
        // {
        //   type: "inputNum",
        //   label: "任务编号",
        //   key: "taskId",
        //   placeholder: "请输入任务编号"
        // },
        {
          type: "input",
          label: "内容",
          key: "content",
          placeholder: "请输入内容"
        },
        {
          type: "daterange",
          label: "时间",
          key: ["", "startTime", "endTime"],
          defaultValue: ["", getDateToString(), getDateToString()]
        }
      ],
      clickTimesInp:false
    };
  },
  mounted() {},
  computed: {},
  methods: {
    /**
     * 对表格数据进行自定义调整
     * @param listData
     * @returns {*}
     * @private
     */
    _mxFormListData(listData) {
      listData.forEach(item=>{
        item.clickInp = false 
      })
      return listData;
    },
    editNums(row){
      row.clickInp = true
    },
    numChange(row){
      let info = JSON.parse(Cookies.get('info'))
      const {shortId,clickTimes} = row
      this.$http.smsShortUrl.saveShortUrlNum({data:{addNum:clickTimes,suId:info.suId,shortId}}).then(res=>{
        if(resOk(res)){
          row.clickInp = false
          this.$message.success('修改成功！')
          this._mxGetList();
        }else{
          this.$message.error(res.data)
        }
      })
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.smsShortUrl {
}
</style>
