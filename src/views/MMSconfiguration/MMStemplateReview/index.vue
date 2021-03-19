<template>
  <div>
    <Search :searchFormConfig="searchFormConfig" @search="_mxDoSearch" :add="false"></Search>
    <el-table :data="listData" highlight-current-row style="width: 100%">
      <el-table-column prop="corpId" label="商户编号" />
      <el-table-column prop="corpName" label="商户名称" show-overflow-tooltip />
      <el-table-column prop="userId" label="账户编号" />
      <el-table-column prop="userName" label="账户名称" show-overflow-tooltip />
      <el-table-column prop="mmsId" label="模板编号" show-overflow-tooltip />
      <el-table-column prop="title" label="彩信标题" show-overflow-tooltip />
      <el-table-column prop="sign" label="签名" show-overflow-tooltip />
      <el-table-column prop="submitTime" label="提交时间" min-width="150">
        <template slot-scope="scope">{{ scope.row.submitTime | timeFormat }}</template>
      </el-table-column>
      <el-table-column prop="price" label="提交类型" />
      <el-table-column prop="cmGatewayId" label="移动上游模板编号" min-width="150" />
      <el-table-column prop="cmGatewayId" label="移动通道编号" min-width="150" />
      <el-table-column prop="cmStatus" label="移动通道状态" min-width="150" />
      <el-table-column prop="price" label="联通上游模板编号" min-width="150" />
      <el-table-column prop="cuGatewayId" label="联通通道编号" min-width="150" />
      <el-table-column prop="cuStatus" label="联通通道状态" min-width="150" />
      <el-table-column prop="price" label="电信上游模板编号" min-width="150" />
      <el-table-column prop="ctGatewayId" label="电信通道编号" min-width="150" />
      <el-table-column prop="ctStatus" label="电信通道状态" min-width="150" />
      <el-table-column label="操作" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button @click="viewsRow('views', scope.row.gatewayId)" type="text" size="small">预览</el-button>
          <el-button @click="bringToTrial(scope.row.arraignId)" type="text" size="small">提审</el-button>
          <el-button @click="partiallyPassed(scope.row.arraignId)" type="text" size="small">部分通过</el-button>
          <el-button @click="reject(scope.row.arraignId)" type="text" size="small">驳回</el-button>
          <el-button
            @click="channelConfig('channelConfig', scope.row.arraignId, scope.row.cmGatewayId,scope.row.cuGatewayId,scope.row.ctGatewayId)"
            type="text" size="small">
            通道配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Page :pageObj="pageObj" @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></Page>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
export default {
  mixins: [listMixin],
  data () {
    const reviewType = [
      { key: 1, value: "待提审" },
      { key: 2, value: "审核中" },
      { key: 3, value: "审核通过" },
      { key: 4, value: "审核驳回" },
      { key: 5, value: "异常" }
    ];
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
        { type: "inputNum", label: "模板编号", key: "mmsId" },
        { type: "input", label: "彩信标题", key: "title" },
        { type: "input", label: "签名", key: "sign" },
        { type: "select", label: "移动通道状态", key: "cmStatus", optionData: reviewType },
        { type: "select", label: "联通通道状态", key: "cuStatus", optionData: reviewType },
        { type: "select", label: "电信通道状态", key: "ctStatus", optionData: reviewType },
        { type: "daterange", label: "提交时间", key: ['', 'submitStartTime', 'submitEndTime'] }
      ]
    };
  },
  activated () {
    this._mxGetList();
  },
  methods: {
    //预览
    viewsRow (type, gatewayId) {
      const rows = {
        frameArr: [
          {
            Pic: true,
            Tex: true,
            imageUrl:
              'blob:http://localhost:3333/24aa77e6-8259-49c8-8202-042e906663a6',
            isHide: true,
            name: '1',
            textarea: '1',
          },
          {
            Audi: true,
            Pic: true,
            Tex: true,
            Vide: true,
            audioUrl:
              'blob:http://localhost:3333/7bb3e4fa-9219-49f6-a2e8-2732ef8ad0f6',
            imageUrl:
              'blob:http://localhost:3333/34935cdf-7385-4345-9ae3-c5891b9eb098',
            isHide: true,
            isHide1: true,
            isHide2: true,
            name: '2',
            textarea: '2',
            videoUrl:
              'blob:http://localhost:3333/27fb7996-9f4a-4153-acea-4bbfde37aed8',
          },
          {
            Audi: true,
            Pic: true,
            Tex: true,
            Vide: true,
            audioUrl:
              'blob:http://localhost:3333/7bb3e4fa-9219-49f6-a2e8-2732ef8ad0f6',
            imageUrl:
              'blob:http://localhost:3333/34935cdf-7385-4345-9ae3-c5891b9eb098',
            isHide: true,
            isHide1: true,
            isHide2: true,
            name: '3',
            textarea: '2',
            videoUrl:
              'blob:http://localhost:3333/27fb7996-9f4a-4153-acea-4bbfde37aed8',
          }
        ],
      }
      this.$router.push({ name: "MMStemplateReviewType", query: { type, row: JSON.stringify(rows) } });
    },
    //提审
    bringToTrial (arraignId) {
      this.$http.mmsTemplateCheck.pushGatewayArraign({ arraignId }).then(res => {
        if (res.code === 200) {
          this._mxGetList();
          this.$message.success('提审成功');
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    //部分通过
    partiallyPassed (arraignId) {
      this.$confirm('您确定要部分通过吗？通过后账户只能发送成功审核通过的通道', '部分通过', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.mmsTemplateCheck.partilyPass({ arraignId }).then(res => {
          if (res.code === 200) {
            this._mxGetList();
            this.$message.success('部分通过成功');
          } else {
            this.$message.error(res.msg);
          }
        })
      }).catch(() => { });
    },
    //驳回
    reject (arraignId) {
      this.$prompt('请输入驳回理由', '驳回理由', {
        confirmButtonText: '驳回',
        cancelButtonText: '取消',
        inputType: 'textarea',
        closeOnClickModal: false,
        inputValidator: (value) => {
          if (!value) return '驳回理由不得为空';
        }
      }).then(({ value }) => {
        this.$http.mmsTemplateCheck.refuseBasicArragin({ arraignId, refuseReason: value }).then(res => {
          if (res.code === 200) {
            this._mxGetList();
            this.$message.success('驳回成功');
          } else {
            this.$message.error(res.msg);
          }
        })
      }).catch(() => { });
    },
    //通道配置
    channelConfig (type, cmGatewayId, cuGatewayId, ctGatewayId) {
      this.$router.push({ name: "MMStemplateReviewType", query: { type, cmGatewayId, cuGatewayId, ctGatewayId } });
    }
  }
};
</script>