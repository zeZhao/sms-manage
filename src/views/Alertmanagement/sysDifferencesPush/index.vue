<template>
  <!--短信状态推送差异-->
  <div class="sysDifferencesPush">
    <!-- <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      :add="false"
      :notSearch="notSearch"
    ></Search> -->
    <div id="searchPanel" class="searchPanel">
      <el-form :model="searchFormPush" inline>
        <el-form-item label="账户编号">
          <el-input placeholder="请输入账户编号" v-model="searchFormPush.userId"></el-input>
        </el-form-item>
        <el-form-item label="推送状态">
          <!-- <el-input placeholder="请输入推送状态" v-model="searchFormPush.stateDes"></el-input> -->
          <el-select v-model="searchFormPush.stateDes" clearable>
            <el-option label="已推送" :value="0"></el-option>
            <el-option label="未推送" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否实时统计">
          <el-select v-model="searchFormPush.realTimeStatistics">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送时间">
          <div v-show="searchFormPush.realTimeStatistics">
            <el-date-picker
            v-model="searchFormPush.sendTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          </div>
          <div v-show="!searchFormPush.realTimeStatistics">
            <el-date-picker
            v-model="searchFormPush.startSendTimes"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          </div>
        </el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="exportDiff">导出</el-button>
      </el-form>
    </div>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
    >
      <el-table-column type="index" width="50" label="序号" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="retCount" label="返回报告数" />
      <el-table-column prop="pushCount" label="状态已推送数" />
      <el-table-column prop="diff" label="差异" />
      <el-table-column prop="sendTime" label="发送时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column prop="pushState" label="推送状态" />
      <!-- <el-table-column prop="serverNum" label="服务器编号	" /> -->
      <!-- <el-table-column prop="count" label="	错误次数" />fa
      <el-table-column
        prop="remark"
        label="备注"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column prop="useModule" label="应用模块" />
      <el-table-column prop="alarmLevel" label="报警级别">
        <template slot-scope="scope">
          <span>{{
            scope.row.alarmLevel === 0
              ? '提醒'
              : scope.row.alarmLevel === 1
              ? '一般'
              : scope.row.alarmLevel === 2
              ? '重要'
              : '严重'
          }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="occurTime" label="发生时间" width="135">
        <template slot-scope="scope">{{
          scope.row.occurTime | timeFormat
        }}</template>
      </el-table-column> -->
    </el-table>
    <Page
      :pageObj="pageObj"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></Page>
  </div>
</template>

<script>
import listMixin from '@/mixin/listMixin';
import { getDateToString } from '@/utils';

export default {
  mixins: [listMixin],
  data() {
    return {
      notSearch: true,
      //接口地址
      searchAPI: {
        namespace: 'sysDifferencesPush',
        list: 'pushDiffList'
      },
      // 列表参数
      namespace: 'alarmMessage',
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: 'input',
          label: '账户编号',
          key: 'userId',
          placeholder: '请输入账户编号'
        },
        {
          type: 'date',
          label: '发生时间',
          key: 'occurTime',
          defaultValue: getDateToString()
        }
      ],
      searchFormPush:{
        userId:'',
        realTimeStatistics:false,
        sendTime:'',
        startSendTimes:[]
      }
    };
  },
  methods:{
    search(){
      const {startSendTimes} = this.searchFormPush
      let data = {
        startSendTime:startSendTimes? startSendTimes[0]:'',
        endSendTime: startSendTimes?startSendTimes[1]:'',
        ...this.searchFormPush,
        pageNumber:this.pageObj.currentPage,
        pageSize:this.pageObj.pageSize

      }
      console.log(data)
      this.$http.sysDifferencesPush.pushDiffList(data).then(res=>{
        if(res.code === 200){
          this.listData = res.data.list
          this.pageObj.total = res.data.total
        }
      })
    },
    //导出
    exportDiff(){
      const {startSendTimes} = this.searchFormPush
      let data = {
        startSendTime:startSendTimes? startSendTimes[0]:'',
        endSendTime: startSendTimes?startSendTimes[1]:'',
        ...this.searchFormPush,
        pageNumber:this.pageObj.currentPage,
        pageSize:this.pageObj.pageSize

      }
      this.$axios
        .post(
          '/retreport/push/diff/export',
          { ...data },
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
            aLink.setAttribute(
              "download",
              `状态差异.xlsx`
            );
            document.body.appendChild(aLink);
            aLink.click();
            document.body.removeChild(aLink);
            window.URL.revokeObjectURL(url);
        });
      
    },
    /***
     * 页码改变触发
     * @private
     */
    handleCurrentChange(currentPage) {
      this.pageObj.currentPage = currentPage;
      this.search();
    },

    /***
     * 每页数据条数改变触发
     * @private
     */
    handleSizeChange(pageSize) {
      this.pageObj.pageSize = pageSize;
      this.search();
    },
  }
};
</script>
<style lang="scss" scoped>
>>> .el-input__suffix {
  height: 90% !important;
}
</style>
