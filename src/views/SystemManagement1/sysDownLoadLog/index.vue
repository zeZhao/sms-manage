<template>
  <!--标签管理-->
  <div class="sysSensitiveWordGroup">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
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
      <el-table-column
        prop="downloadContent"
        label="导出内容"
        show-overflow-tooltip
      />
      <el-table-column prop="submitTime" label="提交任务时间">
        <template slot-scope="scope">
          <span>{{ scope.row.submitTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="generationTime" label="生成成功时间"
        ><template slot-scope="scope">
          <span>{{ scope.row.generationTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileSize" label="导出文件大小" />
      <el-table-column prop="status" label="处理状态">
        <template slot-scope="{ row }">
          <span v-if="row.status == 1">生成中</span>
          <span v-if="row.status == 2">成功</span>
          <span v-if="row.status == 3">失败</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="install(scope.row)"
            type="text"
            size="small"
            :disabled="scope.row.status == 1 || scope.row.status == 3"
            >下载</el-button
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
  mounted() {},
  computed: {},
  methods: {
    install({ filePath, downloadContent }) {
      this.$http.sysDownLoadLog.download({ path: filePath }).then(res => {
        let blob = new Blob([res], {
          type: "application/vnd.ms-excel;charset=utf-8"
        });
        let url = window.URL.createObjectURL(blob);
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", `${downloadContent}`);
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
        window.URL.revokeObjectURL(url);
        // if (res.data.type == "application/octet-stream") {

        // } else {
        //   this.$message.error("下载失败");
        // }
        // this.downloadFileByFile("get", "/sysDownLoadLog/download", {}, "123");
        // location.href = res;
        // console.log(res);
      });
      // this.downloadFileByUrl(`${this.configFilePath}/${filePath}`);
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.sysSensitiveWordGroup {
}
</style>
