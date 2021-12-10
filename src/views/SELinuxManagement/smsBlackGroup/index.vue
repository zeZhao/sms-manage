<template>
  <!--黑名单组-->
  <div class="networkChange">
    <Search
      :searchFormConfig="searchFormConfig"
      @search="_mxDoSearch"
      @create="_mxCreate"
    ></Search>
    <el-table
      :data="listData"
      border
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="blackGroupName" label="黑名单组" />
      <el-table-column prop="createTime" label="创建时间" width="135">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | timeFormat }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人" />
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="_mxEdit(scope.row, 'groupId')"
            :disabled="
              scope.row.blackGroupName == 'BSATS级' ||
                scope.row.blackGroupName == '营销级' ||
                scope.row.blackGroupName == '账户级' ||
                scope.row.blackGroupName == '系统级'
            "
            type="text"
            size="small"
            >修改</el-button
          >
          <el-button
            :disabled="
              scope.row.blackGroupName == 'BSATS级' ||
                scope.row.blackGroupName == '营销级' ||
                scope.row.blackGroupName == '账户级' ||
                scope.row.blackGroupName == '系统级'
            "
            @click="
              _mxDeleteItem(
                'id',
                scope.row.groupId,
                false,
                false,
                '您确定要删除黑名单组吗？删除后该组下的黑名单将被删除'
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
        namespace: "smsBlackGroup",
        list: "listBlackGroupByPage",
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
          label: "黑名单组",
          key: "blackGroupName"
        }
      ],
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "黑名单组",
          maxlength: 50,
          key: "blackGroupName",
          defaultValue: "",
          rules: [{ required: true, message: "请输入必填项", trigger: "blur" }]
        }
      ],
      id: "",
      isParamsNotData: false,
      submitParamsIsData: false
    };
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.networkChange {
}
</style>
