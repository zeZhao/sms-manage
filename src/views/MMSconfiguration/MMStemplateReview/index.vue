<template>
<!-- 彩信模板审核 -->
  <div>
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
      :height="tableHeight"
    >
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" />
      <el-table-column prop="mmsId" label="模板编号"  width="135"/>
      <el-table-column prop="title" label="彩信标题" />
      <el-table-column prop="sign" label="签名" />
      <el-table-column prop="submitTime" label="提交时间" width="135">
        <template slot-scope="scope">{{
          scope.row.submitTime | timeFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="submitType" label="提交类型" >
        <template slot-scope="scope">{{ renderSubmitType(scope.row.submitType) }}</template>
      </el-table-column>
      <!-- <el-table-column prop="cmTemplateId" label="移动上游模板编号"  width="135"/>
      <el-table-column prop="cmGatewayId" label="移动通道编号" /> -->
      <el-table-column prop="status" label="模板状态">
        <template slot-scope="{ row }">{{
          renderAllTypes(row.status)
        }}</template>
      </el-table-column>
      <!-- <el-table-column prop="cuTemplateId" label="联通上游模板编号"  width="135"/>
      <el-table-column prop="cuGatewayId" label="联通通道编号" />
      <el-table-column prop="cuStatus" label="联通通道状态">
        <template slot-scope="{ row }">{{
          renderAllTypes(row.cuStatus)
        }}</template>
      </el-table-column>
      <el-table-column prop="ctTemplateId" label="电信上游模板编号" width="135" />
      <el-table-column prop="ctGatewayId" label="电信通道编号" />
      <el-table-column prop="ctStatus" label="电信通道状态">
        <template slot-scope="{ row }">{{
          renderAllTypes(row.ctStatus)
        }}</template>
      </el-table-column> -->
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button
            @click="
              viewsRow(
                'views',
                scope.row.arraignId,
                scope.row.mmsId,
                scope.row.auditStatus,
                scope.row.cmGatewayId,
                scope.row.cuGatewayId,
                scope.row.ctGatewayId
              )
            "
            type="text"
            size="small"
            >预览
          </el-button>
          <!-- <el-button
            v-if="scope.row.auditStatus === 1"
            @click="
              bringToTrial(
                scope.row.arraignId,
                scope.row.cmGatewayId,
                scope.row.cuGatewayId,
                scope.row.ctGatewayId
              )
            "
            type="text"
            size="small"
            >提审</el-button
          > -->
          <el-button
            v-if="scope.row.status === 2"
            @click="reject(scope.row.mmsId)"
            type="text"
            size="small"
            >驳回
          </el-button>
          <el-button
            v-if="scope.row.status === 2"
            @click="partiallyPassed(scope.row.mmsId)"
            type="text"
            size="small"
            >通过</el-button
          >
          <el-button
            v-if="[2,4].includes(scope.row.status)"
            @click="channelConfig('channelConfig', scope.row)"
            type="text"
            size="small"
            >通道配置</el-button
          >
          <el-button
            v-if="[2,4].includes(scope.row.status)"
            @click="channelConfig('templateAudit', scope.row)"
            type="text"
            size="small"
            >通道审核</el-button
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
/**
 * 商户端审核状态
 * 0,待提审 1,审核中(运营未提审) 2,审核中(运营已提审) 3,审核中(提审未全过)
 * 4,审核驳回(运营未提审) 5,审核驳回(提审全驳回) 6,审核通过(提审全通过) 7,部分通过
 */
// const allReviewType = [
//   { key: 0, value: "待提审" },
//   { key: 1, value: "审核中" },
//   { key: 2, value: "审核中" },
//   { key: 3, value: "审核中" },
//   { key: 4, value: "审核驳回" },
//   { key: 5, value: "审核驳回" },
//   { key: 6, value: "审核通过" },
//   { key: 7, value: "部分通过" }
// ];
const reviewType = [
  { key: 2, value: "待提审" },
  // { key: 2, value: "审核中" },
  { key: 3, value: "审核驳回" },
  { key: 4, value: "审核通过" },
  
  // { key: 5, value: "异常" }
];
export default {
  mixins: [listMixin],
  data() {
    return {
      // 接口地址
      searchAPI: {
        namespace: "mmsTemplateCheck",
        list: "listByPage"
      },
      // 列表参数
      namespace: "",
      // 列表请求是否需要data包起来
      isParamsNotData: false,
      // 搜索框数据
      searchParam: {},
      // 搜索框配置
      searchFormConfig: [
        { type: "inputNum", label: "商户编号", key: "corpId" },
        { type: "input", label: "商户名称", key: "corpName" },
        { type: "inputNum", label: "账户编号", key: "userId" },
        { type: "input", label: "账户名称", key: "userName" },
        { type: "input", label: "模板编号", key: "mmsId" },
        { type: "input", label: "彩信标题", key: "title" },
        { type: "input", label: "签名", key: "sign" },
        {
          type: "select",
          label: "移动通道状态",
          key: "cmStatus",
          optionData: reviewType
        },
        {
          type: "select",
          label: "联通通道状态",
          key: "cuStatus",
          optionData: reviewType
        },
        {
          type: "select",
          label: "电信通道状态",
          key: "ctStatus",
          optionData: reviewType
        },
        {
          type: "daterange",
          label: "提交时间",
          key: ["", "submitStartTime", "submitEndTime"]
        }
      ]
    };
  },
  //返回该页面刷新数据
  activated() {
    this._mxGetList();
  },
  methods: {
    //预览
    viewsRow(type, arraignId, mmsId, auditStatus, cm, cu, ct) {
      this.$router.push({
        name: "MMStemplateReviewType",
        query: { type, arraignId, mmsId, auditStatus, cm, cu, ct }
      });
    },
    //提审
    bringToTrial(arraignId, cm, cu, ct) {
      const flag = [cm, cu, ct].every(v => !v || v === "-");
      if (flag) {
        this.$alert("该账户暂未配置通道，请先配置通道", "提示", {
          confirmButtonText: "确定",
          callback: action => {}
        });
        return;
      }
      this.$http.mmsTemplateCheck
        .pushGatewayArraign({ arraignId })
        .then(res => {
          if (res.code === 200) {
            this._mxGetList();
            this.$message.success("提审成功");
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //部分通过
    partiallyPassed(mmsId) {
      this.$confirm(
        "您确定要通过模板吗？通过后账户只能发送成功审核通过的通道",
        "模板通过",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.mmsTemplateCheck.updateStatus({ mmsId,status:4 }).then(res => {
            if (res.code === 200) {
              this._mxGetList();
              this.$message.success("通过成功");
            } else {
              this.$message.error(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    //驳回
    reject(mmsId) {
      this.$confirm('此操作将驳回此模板, 是否继续?', '模板驳回', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.mmsTemplateCheck
            .updateStatus({ mmsId,status:3 })
            .then(res => {
              if (res.code === 200) {
                this._mxGetList();
                this.$message.success("驳回成功");
              } else {
                this.$message.error(res.msg);
              }
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      // this.$prompt("请输入驳回理由", "驳回理由", {
      //   confirmButtonText: "驳回",
      //   cancelButtonText: "取消",
      //   inputType: "textarea",
      //   closeOnClickModal: false,
      //   inputValidator: value => {
      //     if (!value) return "驳回理由不得为空";
      //     if (value.length > 200) return "驳回理由的长度不得超过200";
      //   }
      // })
      //   .then(({ value }) => {
      //     this.$http.mmsTemplateCheck
      //       .refuseBasicArragin({ arraignId, refuseReason: value })
      //       .then(res => {
      //         if (res.code === 200) {
      //           this._mxGetList();
      //           this.$message.success("驳回成功");
      //         } else {
      //           this.$message.error(res.msg);
      //         }
      //       });
      //   })
      //   .catch(() => {});
    },
    //通道配置
    channelConfig(type, row) {
      this.$router.push({
        name: "MMStemplateReviewType",
        query: { type, row: JSON.stringify(row) }
      });
    },
    renderSubmitType (v) {
      if (v === 1) {
        return 'web提交';
      } else if (v === 2) {
        return 'http提交';
      } else {
        return '-';
      }
    },
    //返回各个运营商的不同状态
    renderAllTypes(item) {
      if (typeof item !== "number") return "-";
      const idx = reviewType.findIndex(v => v.key === item);
      return reviewType[idx].value;
    }
  }
};
</script>
