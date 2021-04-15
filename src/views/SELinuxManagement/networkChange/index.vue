<template>
  <!--携号转网-->
  <div class="networkChange">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    >
      <template v-slot:Other="form">
        <el-button type="primary" @click="exported(form)" size="small"
          >导出</el-button
        >
        <el-button type="primary" @click="handleAdd" size="small"
          >批量添加</el-button
        >
      </template>
    </Search>
    <el-table
      :data="listData"
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="mobile" label="手机号" />
      <el-table-column prop="oriOperaId" label="原运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.oriOperaId == 0">非法</span>
          <span v-if="scope.row.oriOperaId == 1">移动</span>
          <span v-if="scope.row.oriOperaId == 2">联通</span>
          <span v-if="scope.row.oriOperaId == 3">电信</span>
          <span v-if="scope.row.oriOperaId == 4">国际</span>
        </template>
      </el-table-column>
      <el-table-column prop="operaId" label="现运营商">
        <template slot-scope="scope">
          <span v-if="scope.row.operaId == 0">非法</span>
          <span v-if="scope.row.operaId == 1">移动</span>
          <span v-if="scope.row.operaId == 2">联通</span>
          <span v-if="scope.row.operaId == 3">电信</span>
          <span v-if="scope.row.operaId == 4">国际</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="操作人" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="_mxEdit(scope.row, 'id')" type="text" size="small"
            >修改</el-button
          >
          <el-button
            @click="
              _mxDeleteItem(
                'id',
                scope.row.id,
                false,
                false,
                '您确定要删除吗？删除后该记录将不存在'
              )
            "
            type="text"
            size="small"
            >删除</el-button
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
    <el-dialog
      title="批量添加"
      :visible.sync="batchAddVisible"
      :close-on-click-modal="false"
      width="400px"
      top="45px"
    >
      <div>
        请先<el-button type="text" @click="download">下载模板</el-button>
        ，再进行
        <el-upload
          class="upload-demo"
          action="/api/sysPrepaidCard/uploadFile"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :on-success="handleSuccess"
          multiple
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :headers="header"
        >
          <el-button size="small" type="text">上传</el-button>
          <div slot="tip" class="el-upload__tip">
            <!-- 只能上传jpg/png文件，且不超过500kb -->
          </div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="importBatchAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
import { getToken } from "@/utils/auth";
import { phone } from "@/utils/validator";
import { Axis } from "echarts/lib/export";

export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      batchAddVisible: false,
      //接口地址
      searchAPI: {
        namespace: "networkChange",
        list: "queryByPage",
        detele: "delete",
        edit: "addOrUpdate",
        add: "addOrUpdate"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "手机号",
          key: "mobile"
        },
        {
          type: "select",
          label: "原运营商",
          key: "oriOperaId",
          optionData: [
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" }
          ]
        },
        {
          type: "select",
          label: "现运营商",
          key: "operaId",
          optionData: [
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" }
          ]
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "手机号",
          maxlength: 11,
          key: "mobile",
          disabled: false,
          defaultValue: "",
          rules: [
            { required: true, message: "请输入必填项", trigger: "blur" },
            { validator: phone, trigger: "change" }
          ]
        },
        {
          type: "select",
          label: "原运营商",
          key: "oriOperaId",
          defaultValue: "",
          optionData: [
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        },
        {
          type: "select",
          label: "现运营商",
          key: "operaId",
          defaultValue: "",
          optionData: [
            { key: 1, value: "移动" },
            { key: 2, value: "联通" },
            { key: 3, value: "电信" }
          ],
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      id: "",
      isParamsNotData: false,
      submitParamsIsData: false,
      fileList: [],
      file: {},
      header: {
        token: getToken()
      }
    };
  },
  mounted() {},
  computed: {},
  methods: {
    download() {
      this.$axios
        .get("/sysDownLoadLog/download", {
          responseType: "blob"
        })
        .then(res => {
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", "模板.xlsx");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        });
    },
    /**
     * 创建表单
     * @param row  当前行数据
     * @param id  当前行ID
     * @private
     */

    _mxCreate() {
      this.addChannel = true;
      this.formTit = "新增";
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.formConfig.forEach(item => {
        if (item.key === "mobile") {
          item.disabled = false;
        }
      });
    },
    /**
     * 编辑表单
     * @param row  当前行数据
     * @param ID  当前行ID
     * @private
     */

    _mxEdit(row, ID) {
      row = this._mxArrangeEditData(row);
      this.id = row[ID];
      this.editId = ID;
      this.formTit = "修改";
      this.formConfig.forEach(item => {
        for (let key in row) {
          if (item.key === key && row[key] !== "-") {
            this.$set(item, "defaultValue", row[key]);
          }
        }
        if (!Object.keys(row).includes(item.key)) {
          this.$set(item, "defaultValue", "");
        }
        if (item.key === "mobile") {
          item.disabled = true;
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.addChannel = true;
    },
    importBatchAdd() {
      if (this.file) {
        var form = new FormData();
        form.append("file", this.file);
        this.$http.networkChange.importBatchAdd(form).then(res => {
          if (res.code == 200) {
            this.$message.success("添加成功");
            this.batchAddVisible = false;
            (this.file = null), (this.fileList = []);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$message.error("请上传模板");
      }
    },
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        // var form = new FormData();
        // console.log(file.raw);
        // form.append("file", file.raw);
        this.file = file.raw;

        // console.log(this.file);
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.error(`仅能上传一个模板`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleAdd() {
      this.batchAddVisible = true;
      this.fileList = [];
      this.file = null;
    },
    exported(form) {
      this.$http.networkChange.export({ ...form.form }).then(res => {
        if (res.code === 200) {
          this.$message.success("提交下载成功，请前往下载中心下载文件。");
        }
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.networkChange {
}
</style>
