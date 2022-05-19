<template>
  <!--标签管理-->
  <div class="sysSensitiveWordGroup">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
      :add="false"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      :height="tableHeight"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="type" label="导出类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type == 1">.excel</span>
          <span v-else-if="scope.row.type == 2">.txt</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="downloadNum" label="导出条数" />
      <el-table-column prop="downloadContent" label="导出内容" />
      <el-table-column prop="submitTime" label="提交任务时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="generationTime" label="生成成功时间" width="135"
        ><template slot-scope="scope">
          <span>{{ scope.row.generationTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="导出文件大小">
        <template slot-scope="scope">
          <span>{{
            scope.row.fileSize && scope.row.fileSize !== "-"
              ? scope.row.fileSize + "KB"
              : "-"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="处理状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 1">生成中</span>
          <span v-if="row.status == 2">成功</span>
          <span v-if="row.status == 3">失败</span>
          <span v-if="row.status == 4">完结</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="install(scope.row)"
            type="text"
            size="small"
            :disabled="scope.row.status == 1 || scope.row.status == 3"
            >下载</el-button
          >
          <el-button @click="tautology(scope.row)" type="text" size="small"
            >重试</el-button
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
      isParamsNotData: false,
      //接口地址
      searchAPI: {
        namespace: "sysDownLoadLog",
        list: "queryByPage",
        detele: "",
        edit: "",
        add: ""
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "导出内容",
          key: "downloadContent"
        },
        {
          type: "daterange",
          label: "提交日期",
          key: ["", "submitStartDate", "submitEndDate"]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "标签名称",
          maxlength: 50,
          key: "name",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      id: "",
      submitParamsIsData: false
    };
  },
  activated() {
    this._mxGetList();
  },
  methods: {
    install({ filePath, downloadContent }) {
      this.$http.sysDownLoadLog.download({ path: filePath }).then(res => {
        let blob = new Blob([res]);
        let url = window.URL.createObjectURL(blob);
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", `${downloadContent}.xlsx`);
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
        window.URL.revokeObjectURL(url);
      });
    },
    tautology({ downloadId }) {
      this.$http.sysDownLoadLog.retry({ downLoadId: downloadId }).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this._mxGetList();
        }
        // console.log(res, "----");
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSensitiveWordGroup {
}
</style>
