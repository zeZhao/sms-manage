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
      <el-table-column prop="name" label="标签名称" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="userName" label="创建人" />
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
                true,
                '您确定要删除标签吗？删除后标签将不可用'
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
      //接口地址
      searchAPI: {
        namespace: "tags",
        list: "tagList",
        detele: "delTag",
        edit: "editTag",
        add: "submitTag"
      },
      // 列表参数
      namespace: "",
      //搜索框数据
      searchParam: {},
      isParamsNotData: false,
      submitParamsIsData: false,
      //搜索框配置
      searchFormConfig: [
        {
          type: "input",
          label: "标签名称",
          key: "name"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "标签名称",
          maxlength: 15,
          key: "name",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      id: ""
    };
  }
};
</script>
