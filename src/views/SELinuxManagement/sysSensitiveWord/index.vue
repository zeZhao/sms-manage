<template>
  <!--敏感词管理-->
  <div class="sysSensitiveWord">
    <section class="left-menu">
      <el-menu
        class="el-menu-group"
        :default-active="defaultActive"
        background-color="#F2F2F2"
        text-color="#000"
        active-text-color="#000"
        @select="handleSelectGroup"
      >
        <el-menu-item
          v-for="(item, index) in groupList"
          :key="item.groupId"
          :index="item.groupId + ''"
          :class="activeIndex === index ? 'hover' : ''"
          @click="activeIndex = index"
        >
          <el-tooltip placement="top" :content="item.groupName">
            <div>
              <span slot="title" class="title">{{ item.groupName }}</span>
              <span slot class="action-bar">
                <el-popover placement="bottom" trigger="hover">
                  <div style="text-align: center">
                    <i
                      class="el-icon-edit"
                      style="margin: 10px; cursor: pointer"
                      @click="handleEditGroup(item)"
                      >&nbsp;&nbsp;编辑</i
                    >
                  </div>
                  <div style="text-align: center">
                    <i
                      class="el-icon-delete"
                      style="margin: 10px; cursor: pointer"
                      @click="handleDeleteGroup(item.groupId)"
                      >&nbsp;&nbsp;删除</i
                    >
                  </div>
                  <i slot="reference" class="el-icon-more" />
                </el-popover>
              </span>
            </div>
          </el-tooltip>
        </el-menu-item>
      </el-menu>

      <el-button
        type="primary"
        size="medium"
        style="display: block; width: 50%; margin: 30px auto"
        @click="addGroup"
      >
        添加分组
      </el-button>
    </section>

    <section class="right-content">
      <Search
        ref="Search"
        :notSearch="notSearch"
        :searchFormConfig="searchFormConfig"
        @search="handleSearch"
        @create="create"
        @exportData="exportData"
      >
        <template slot="Other">
          <el-button type="primary" size="small" @click="exportExe"
            >导出</el-button
          >
        </template>
      </Search>

      <el-table
        :data="listData"
        border
        highlight-current-row
        style="width: 100%;"
        :height="tableHeight"
        v-loading="loading"
      >
        <el-table-column prop="wordName" label="敏感词" />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" width="135">
          <template slot-scope="scope">{{
            scope.row.createTime | timeFormat
          }}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">{{
            scope.row.remark ? scope.row.remark : "-"
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text" size="small"
              >修改</el-button
            >
            <el-button
              @click="_mxDeleteItem(scope.row.wordId)"
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
        :title="createOrUpdate"
        :visible.sync="isAddGroup"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        top="45px"
        width="30%"
      >
        <el-form ref="addGroupObj" :model="addGroupObj" label-width="100px">
          <el-form-item
            label="敏感词组"
            prop="groupName"
            :rules="[
              { required: true, message: '敏感词组不能为空', trigger: 'blur' }
            ]"
          >
            <el-input
              v-model.trim="addGroupObj.groupName"
              clearable
              maxlength="15"
              show-word-limit
              placeholder="请输入敏感词组"
            />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="small" @click="isAddGroup = false">取消</el-button>
          <el-button
            size="small"
            type="primary"
            v-throttle
            @click="handleConfirm"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <el-drawer
        :title="formTit"
        :visible.sync="addChannel"
        :close-on-press-escape="false"
        :wrapperClosable="false"
      >
        <FormItem
          ref="formItem"
          :formConfig="formConfig"
          :btnTxt="formTit"
          :colSpan="12"
          labelWidth="auto"
          labelPosition="top"
          @submit="submit"
          @cancel="cancel"
          @choose="choose"
          @inpChange="inpChange"
          @handleSuccess="handleSuccess"
          @handleRemove="handleRemove"
        >
        </FormItem>
      </el-drawer>
    </section>
  </div>
</template>

<script>
import listMixin from "@/mixin/listMixin";
const checkwordName = [
  {
    required: true,
    trigger: ["blur", "change"],
    validator: (rule, value, callback) => {
      if (!value) callback(new Error(`请输入必填项`));
      const arr = value.split(",");
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === "") {
          callback(new Error(`第${i + 1}个敏感词不能为空`));
          break;
        }
        if (arr[i].length < 2 || arr[i].length > 8) {
          callback(new Error(`第${i + 1}个敏感词长度应在2~8个字符之间`));
          break;
        }
      }
      callback();
    }
  }
];
export default {
  mixins: [listMixin],
  data() {
    return {
      formTit: "新增",
      addChannel: false,
      // 表单配置
      formConfig: [
        {
          type: "input",
          label: "敏感词",
          key: "wordName",
          maxlength: 100,
          defaultValue: "",
          rules: checkwordName,
          placeholder: "2-8个字符，添加多个敏感词，用英文“,”隔开"
        },
        {
          type: "uploadXlsx",
          key: "keywordFile",
          label: "上传敏感词文件",
          btnTxt: "批量添加",
          limit: 1,
          defaultValue: "",
          defaultFileList: [],
          tip: "支持txt、xls、xlsx文件，每行一个敏感词",
          isShow: false,
          accept: [
            "text/plain",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ],
          rules: [
            {
              required: true,
              message: "请上传敏感词文件或者添加敏感词",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "select",
          label: "敏感词组",
          key: "groupIds",
          optionData: [],
          defaultValue: "",
          multiple: true,
          collapseTags: true,
          isShow: false,
          colSpan: 24,
          rules: [
            {
              required: true,
              message: "请选择必选项",
              trigger: ["blur", "change"]
            }
          ]
        },
        {
          type: "textarea",
          label: "备注",
          key: "remark",
          defaultValue: "",
          maxlength: "100"
        }
      ],
      //默认不查所有的，而是单独查groupList[0]的数据
      notSearch: true,
      listData: [],
      //接口地址
      searchAPI: {
        namespace: "sysSensitiveWord",
        list: "listSensitiveWordByPage"
      },

      // 列表参数
      namespace: "sensitiveWord",
      //搜索框数据
      searchParam: {},
      //搜索框配置
      searchFormConfig: [
        { type: "input", label: "敏感词", key: "wordName", isLonger: true }
      ],
      defaultActive: "",
      groupList: [],
      createOrUpdate: "添加敏感词组",
      isAddGroup: false,
      addGroupObj: {},
      editId: "",
      activeIndex: 0
    };
  },
  mounted() {
    //获取敏感词分组
    this.getGroupList();
    this.listSensitiveWordGroup();
  },
  activated() {
    this.$nextTick(() => {
      this.getGroupList(); //获取敏感词分组
      this._mxGetList(); //获取列表敏感词
      this.listSensitiveWordGroup();
      this.activeIndex = this.$route.query.activeIndex || 0;
    });
  },
  methods: {
    inpChange({ val, item }) {
      if (item.key === "wordName") {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === "keywordFile");
        arr[i].rules = val
          ? null
          : [
              {
                required: true,
                message: "请上传敏感词文件或者添加敏感词",
                trigger: ["blur", "change"]
              }
            ];
        !arr[i].rules && this.$refs.formItem.clearValidateMore(["keywordFile"]);
      }
    },
    handleSuccess({ response, file, fileList, item }) {
      if (response.code !== 200) {
        this.$message.error(response.data || response.msg);
        return;
      }
      const { accept, tip, key } = item;
      const { type } = file.raw;
      if (Array.isArray(accept) && accept.length) {
        const arr = this.formConfig;
        const i = arr.findIndex(v => v.key === key);
        if (accept.indexOf(type) === -1) {
          this.$message.error(tip);
          arr[i].defaultValue = "";
          arr[i].defaultFileList = [];
          return;
        }
        arr[i].defaultValue = file.raw;

        const delRuleIdx = arr.findIndex(v => v.key === "wordName");
        arr[delRuleIdx].rules = null;
        this.$refs.formItem.clearValidateMore(["wordName", "keywordFile"]);
      }
    },
    handleRemove({ file, fileList }) {
      const arr = this.formConfig;
      const i = arr.findIndex(v => v.key === "keywordFile");
      arr[i].defaultValue = "";
      arr[i].defaultFileList = [];

      const addRuleIdx = arr.findIndex(v => v.key === "wordName");
      arr[addRuleIdx].rules = checkwordName;
    },
    submit(form) {
      let params = {};
      // const { wordName, groupIds } = form;
      if (this.formTit == "新增") {
        // this.$http.sysSensitiveWord.checkSensitiveWord({ data: { wordName, groupIds } }).then(res => {
        // 判断敏感词是否存在
        // if (res.data === 1) {
        //   this.$message.error("敏感词已存在！");
        // } else {
        // params = { data: { ...form } };
        params = new FormData();
        for (let i in form) {
          params.append(i, form[i]);
        }
        this.$http.sysSensitiveWord.importKeywordModel(params).then(res => {
          if (resOk(res)) {
            this.$alert(res.data, "添加记录", {
              showClose: false,
              confirmButtonText: "确定",
              callback: action => {
                this.$message.success("添加成功");
                this._mxGetList();
                this.addChannel = false;
              }
            });
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
        // }
        // });
      } else {
        params = { data: { wordId: this.wordId, ...form } };
        this.$http.sysSensitiveWord.updateSensitiveWord(params).then(res => {
          if (resOk(res)) {
            this.$message.success(res.msg || res.data);
            this._mxGetList();
            this.addChannel = false;
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
      }
    },
    cancel() {
      this.addChannel = false;
    },
    //点击搜索查询数据
    handleSearch(searchParam) {
      const groupId =
        (this.groupList[this.activeIndex] &&
          this.groupList[this.activeIndex].groupId) ||
        "";
      const params = {
        groupId,
        ...searchParam
      };
      this._mxDoSearch(params);
    },
    //获取敏感词分组
    getGroupList() {
      this.$http.sysSensitiveWordGroup.listSensitiveWordGroup().then(res => {
        if (res.code === 200) {
          this.groupList = res.data;
          this.defaultActive = this.groupList.length
            ? this.groupList[0].groupId + ""
            : "";
          //获取敏感词分组的同时去请求默认第一项的敏感词列表数据
          const groupId = this.groupList.length
            ? this.groupList[0].groupId
            : "";
          this.handleSelectGroup(groupId);
        } else {
          this.$message.error(res.data || res.msg);
        }
      });
    },
    //添加敏感词分组
    addGroup() {
      this.createOrUpdate = "添加敏感词组";
      this.addGroupObj = {};
      this.isAddGroup = true;
      this.$nextTick(() => {
        this.$refs.addGroupObj.clearValidate();
        this.activeIndex = 0;
      });
    },
    //确认添加/修改敏感词分组
    handleConfirm() {
      this.$refs.addGroupObj.validate(valid => {
        if (valid) {
          const postUrl =
            this.createOrUpdate === "添加敏感词组"
              ? this.$http.sysSensitiveWordGroup.addSensitiveWordGroup
              : this.$http.sysSensitiveWordGroup.updateSensitiveWordGroup;
          const data =
            this.createOrUpdate === "添加敏感词组"
              ? this.addGroupObj
              : { groupId: this.editId, ...this.addGroupObj };
          postUrl({ data }).then(res => {
            if (res.code === 200) {
              this.getGroupList();
              this.isAddGroup = false;
              this.activeIndex = 0;
              this.$message.success(res.data || res.msg);
            } else {
              this.$message.error(res.data || res.msg);
            }
          });
        }
      });
    },
    //导出
    exportData(data) {
      const groupId =
        (this.groupList[this.activeIndex] &&
          this.groupList[this.activeIndex].groupId) ||
        "";
      const params = {
        groupId,
        ...data
      };
      this.$http.sysSensitiveWord.exportKeyword(params).then(res => {
        if (res.code === 200) this.$exportToast();
      });
    },
    exportExe() {
      this.$refs.Search.handleExport();
    },
    //修改敏感词分组
    handleEditGroup({ groupId, groupName }) {
      this.editId = groupId;
      this.createOrUpdate = "修改敏感词组";
      this.addGroupObj = { groupName };
      this.isAddGroup = true;
      this.$nextTick(() => {
        this.activeIndex = 0;
        this.$refs.addGroupObj.clearValidate();
      });
    },
    //删除敏感词分组
    handleDeleteGroup(groupId) {
      this.$confirm(
        "删除后组内的敏感词同步删除，请谨慎操作",
        "您确定要删除敏感词组吗？",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http.sysSensitiveWordGroup
            .deleteSensitiveWordGroup({ data: { groupId } })
            .then(res => {
              if (res.code === 200) {
                this.getGroupList();
                this.activeIndex = 0;
                this.$message.success(res.data || res.msg);
              } else {
                this.$message.error(res.data || res.msg);
              }
            });
        })
        .catch(() => {});
    },
    //选中敏感词分组-切换数据
    handleSelectGroup(groupId) {
      this.$http.sysSensitiveWord
        .listSensitiveWordByPage({ data: { sensitiveWord: { groupId } } })
        .then(res => {
          if (res.code === 200) {
            this.listData = res.data.list;
            this.$refs.Search._mxHandleSubmit(); //目的是更新分页页脚总数数据
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
    },
    create() {
      if (!this.groupList.length) {
        this.$message.warning("请先添加敏感词组");
        return;
      }
      this.addChannel = true;
      this.formTit = "新增";
      this.formConfig.forEach(item => {
        if (item.key === "keywordFile") {
          let arr = [
            {
              required: true,
              message: "请上传敏感词文件或者添加敏感词",
              trigger: ["blur", "change"]
            }
          ];
          this.$set(item, "isShow", false);
          this.$set(item, "rules", arr);
          item.defaultFileList = [];
        }
        if (item.key === "groupIds") {
          this.$set(item, "isShow", false);
        }
        if (item.key === "wordName") {
          this.$set(item, "rules", checkwordName);
        }
        // if (item.key === "keywordFile") {
        //   item.defaultFileList = [];
        // }
      });
      setTimeout(() => {
        this.$refs.formItem.resetForm();
      }, 0);
      this.listSensitiveWordGroup();
    },
    edit(row, ID) {
      this.wordId = row.wordId;
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
        if (item.key === "keywordFile") {
          this.$set(item, "isShow", true);
        }
        if (item.key === "groupIds") {
          this.$set(item, "isShow", true);
        }
        if (item.key === "wordName") {
          this.$set(item, "rules", checkwordName);
        }
      });
      setTimeout(() => {
        this.$refs.formItem.clearValidate();
      }, 0);
      this.listSensitiveWordGroup();
      this.addChannel = true;
    },
    //敏感词组
    async listSensitiveWordGroup() {
      await this.$http.sysSensitiveWordGroup
        .listSensitiveWordGroup()
        .then(res => {
          if (res.code === 200) {
            this._setDefaultValue(
              this.formConfig,
              res.data,
              "groupIds",
              "groupId",
              "groupName"
            );
          } else {
            this.$message.error(res.data || res.msg);
          }
        });
    },
    _mxDeleteItem(wordId) {
      this.$confirm("删除后将不可找回，请谨慎操作", "您确定要删除敏感词吗？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http.sysSensitiveWord
            .deleteSensitiveWord({ data: { wordId } })
            .then(res => {
              if (res.code === 200) {
                this._mxGetList();
                this.$message.success(res.data || res.msg);
              } else {
                this.$message.error(res.data || res.msg);
              }
            });
        })
        .catch(() => {});
    }
  }
  // computed: {
  //   atActiveIndex() {
  //     return this.$route.query.activeIndex;
  //   }
  // }
};
</script>

<style lang="scss" scoped>
.sysSensitiveWord {
  display: flex;
  justify-content: space-between;

  .left-menu {
    width: 18%;

    .el-menu-group {
      width: 100%;
      height: 65vh;
      overflow-y: auto;

      .hover {
        background-color: #ccc !important;
      }

      .title {
        display: inline-block;
        width: 130px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .action-bar {
        position: absolute;
        right: 20px;
      }
    }
  }

  .right-content {
    width: 80%;
  }
}
</style>
